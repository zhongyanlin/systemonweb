 
package telaman;
import java.util.concurrent.ThreadPoolExecutor;
import javax.servlet.*;
import javax.servlet.annotation.*;
import javax.servlet.http.*;
import java.util.*;
import java.io.*;
import java.util.concurrent.atomic.AtomicBoolean;
import org.apache.commons.io.FileUtils;
 

@WebServlet(name = "UploadFace", urlPatterns = {"/UploadFace"},   asyncSupported = true)
 
public class UploadFace extends HttpServlet 
{
    //HashMap<AsyncContext,Longprocess> vl = new HashMap<AsyncContext,Longprocess>(10);
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
        HttpSession session = request.getSession(true);
        int orgnum = Toolbox.setcharset(request, response);
        if (orgnum == -1) return;
        CachedStyle cachedstyle = new CachedStyle(request, orgnum);
        if (Toolbox.hasface == false)
        {
            String msg = "myprompt('featrue not available')";
            PrintWriter out = response.getWriter();
            try 
            {
                out.println(msg);
            } finally 
            {
                out.close();
            }
        return;
        }
               
        User user = User.authorize(orgnum, Systemroles.TOTAL, getServletConfig().getServletContext(), session, request, response, "UploadFace", true);
        if (user == null || user.orgnum!=orgnum) 
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
        orgnum = user.orgnum;  
        String pathcode = Toolbox.defaultParam(orgnum,request, "pathcode", null, "$-_", 200);
        String cid = Toolbox.defaultParam(orgnum,request, "CourseId", null, "-_", 20);
        String sessionname = Toolbox.defaultParam(orgnum,request, ("Session"), null);
        final AtomicBoolean running = new AtomicBoolean(true);
         
        if (pathcode == null)
        {
            HashMap<String, String> params = new HashMap<String, String>();
            UploadFile.readbinary(params,  request);
            pathcode = params.get("pathcode");
            cid = params.get("CourseId");
            sessionname = params.get("Session");
        }
        
        if (cid!=null && sessionname!=null && sessionname.equals(""))
        {
             String msg = "myprompt('Error')";
             try
             {
                 Encode6b encoder = new Encode6b(orgnum);
                 String file0 = encoder.rto6b(pathcode);
                 int j = file0.lastIndexOf(File.separator );
                 String filename = "" ;
                 if (j>0) filename = file0.substring(j+1);

                 if ( file0.indexOf(user.webFileFolder + File.separator + cid + File.separator + "attendance") == 0 
                    && filename.matches("[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]\\.[a-z|A-Z]+")  || 
                      file0.indexOf(user.webFileFolder + File.separator + cid + File.separator + "f") ==0  && filename.matches("[0-9]+\\.png") )
                 {

                     FileUtils.deleteQuietly(new File(file0));
                     msg = "notagoodface('" + pathcode + "');";
                 }
                 else { }
             }catch(Exception e){ }
             try 
            {
                PrintWriter out = response.getWriter();
                out.println(msg);
                out.close();
            } 
            catch (IOException e) 
            {

            }
            running.set(false);
            
            return;
        }
        
        request.setAttribute("org.apache.catalina.ASYNC_SUPPORTED", true);
  
        AsyncContext asyncCtx = request.startAsync();
        
        asyncCtx.addListener(new AsyncListener(){
           
            public void onComplete(AsyncEvent asyncEvent) throws IOException {

               // ServletResponse response = asyncEvent.getAsyncContext().getResponse();
                running.set(false);
            }

            public void onError(AsyncEvent asyncEvent) throws IOException {

               // ServletResponse response = asyncEvent.getAsyncContext().getResponse();
               // vl.remove(asyncEvent.getAsyncContext());
                running.set(false); 
               
            }

            public void onStartAsync(AsyncEvent asyncEvent) throws IOException {

              
                running.set(true);
            }


            public void onTimeout(AsyncEvent asyncEvent) throws IOException {

                ServletResponse response = asyncEvent.getAsyncContext().getResponse();
                PrintWriter out = response.getWriter();
                out.write("myprompt('Taking too long. Quited')");
                //Longprocess lp = (Longprocess)(vl.get(asyncEvent.getAsyncContext())) ; 
                
                running.set(false);
            }
         }
        );
        asyncCtx.setTimeout(0);
        ThreadPoolExecutor executor = (ThreadPoolExecutor) request.getServletContext().getAttribute("executor");
        Longprocess lp = new Longprocess(asyncCtx, user, pathcode, cid, sessionname, running);
        executor.execute(lp);
}
    
 static public boolean  moveFile(File afile,File bfile)
  {
      InputStream inStream = null;
	  OutputStream outStream = null;
      boolean ans = true;
	 FileUtils.deleteQuietly(bfile);
    	try{
    		
    	    
    	    inStream = new FileInputStream(afile);
    	    outStream = new FileOutputStream(bfile);
        	
    	    byte[] buffer = new byte[1024];
    		
    	    int length;
    	    //copy the file content in bytes 
    	    while ((length = inStream.read(buffer)) > 0){
    	  
    	    	outStream.write(buffer, 0, length);
    	 
    	    }
    	 
    	    inStream.close();
    	    outStream.close();
    	    
    	    
    	    FileUtils.deleteQuietly(afile);
    	   
    	    
    	}catch(Exception e){
    	    ans = true;   
    	}
        return ans;
    }
   
 
 protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
     doGet(request, response);
 }
    
}
