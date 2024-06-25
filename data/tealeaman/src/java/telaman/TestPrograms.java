 
package telaman;
import java.util.*;
import java.util.zip.*;
import java.io.*;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

@WebServlet(name = "TestPrograms", urlPatterns = {"/TestPrograms"}, asyncSupported = true)
public class TestPrograms extends HttpServlet 
{
     protected String errmsg(String msg) {
        return "<script  type=text/javascript>parent.failupload('" + msg.replaceAll("'", "\\'") + "');</script>";
    }
     public void doPost(HttpServletRequest request, HttpServletResponse response)
     {
        HttpSession session = request.getSession(true);
        int orgnum = Toolbox.setcharset(request, response);
        response.addHeader("X-XSS-Protection", "0");
        if (orgnum == -1) {
            return;
        }
        CachedStyle cachedstyle = new CachedStyle(request, orgnum);
        final User user = (User)session.getAttribute("User");
        String msg = "";
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
        } 
        final AtomicBoolean running = new AtomicBoolean(true);
        ArrayList<String> ns = new ArrayList<>();
        for (Enumeration x = request.getParameterNames(); x.hasMoreElements();)
        {
            String nm = ((String)x.nextElement()); 
            String vl = request.getParameter(nm);
            
        }
         
        request.setAttribute("org.apache.catalina.ASYNC_SUPPORTED", true);
        final String course = request.getParameter("course");
        String subdb = request.getParameter("subdb");
        user.subdb = subdb;
        final String assignname = request.getParameter("assignname");
        final String content = request.getParameter("content");
        
        final String questionnum =  request.getParameter("questionnum");
        AsyncContext asyncCtx = request.startAsync();
        asyncCtx.setTimeout(10000L);
        asyncCtx.addListener(new AsyncListener() {
            public void onComplete(AsyncEvent asyncEvent) throws IOException {
                running.set(false);
            }

            public void onError(AsyncEvent asyncEvent) throws IOException {
                running.set(false);
            }

            public void onStartAsync(AsyncEvent asyncEvent) throws IOException {

                running.set(true);
            }

            public void onTimeout(AsyncEvent asyncEvent) throws IOException {
                ServletResponse response = asyncEvent.getAsyncContext().getResponse();
                PrintWriter out = response.getWriter();
                out.write("myprompt('Taking too long. Quited')");
                running.set(false);
            }
        }
        );

     
        ThreadPoolExecutor executor = (ThreadPoolExecutor) request.getServletContext().getAttribute("executor");
        LongTestPro lp = new LongTestPro(asyncCtx,user,course,assignname,questionnum,content);
        executor.execute(lp); 
         
    }
}

