 
package telaman;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.atomic.AtomicBoolean;
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import org.apache.commons.io.FileUtils;

 


@WebServlet(name = "Schedule", urlPatterns = {"/Schedule"},   asyncSupported = true)
public class Schedule extends HttpServlet implements SingleThreadModel
{

    
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(true);
       int orgnum = Toolbox.setcharset(request, response);
        if (orgnum == -1) return;
CachedStyle cachedstyle = new CachedStyle(request, orgnum);
        
        User user = User.authorize(orgnum, Systemroles.TOTAL, getServletConfig().getServletContext(), session, request, response, "Schedule", true);
        if (user == null) 
        {
              try 
              {
                    RequestDispatcher dispat = request.getServletContext().getRequestDispatcher("/login.jsp?error=generic&orgnum=" + orgnum + "&follow=" + (new Encode6b(orgnum)).to6b("click('do again)") );
                    dispat.forward( request,  response);
              }
              catch (Exception e) 
              {
              }
            return;
        }
        orgnum = user.orgnum;  
        String dept = Toolbox.defaultParam(orgnum,request, ("dept"), null);
        dept = Toolbox.validate(dept, null, 20);
        String semester = Toolbox.defaultParam(orgnum,request, ("semester"), null);
        semester = Toolbox.validate(semester, null, 3);
        String semesterName = Toolbox.defaultParam(orgnum,request, ("semesterName"), null);
        semesterName = Toolbox.validate(semesterName, null, 30);
        String err = "";
        String fix = Toolbox.defaultParam(orgnum,request, ("fix"), null);
        fix = Toolbox.validate(fix, null, 15);
       
        String candidate = Toolbox.defaultParam(orgnum,request, ("candidate"), null);
        candidate = Toolbox.validate(candidate, null, 15);
         
        String goodtime = Toolbox.defaultParam(orgnum,request, ("goodtime"), null);
        goodtime = Toolbox.validate(goodtime, null, 15);
       
        String exclusion = Toolbox.defaultParam(orgnum,request, ("exclusion"), null);
        exclusion = Toolbox.validate(exclusion, null, 15);
       
        String timeshare = Toolbox.defaultParam(orgnum,request, ("timeshare"), null);
        timeshare = Toolbox.validate(timeshare, null, 15);
       
        String sek = Toolbox.defaultParam(orgnum,request, ("sek"), null);
        sek = Toolbox.validate(sek, null, 15);
        
        final AtomicBoolean running = new AtomicBoolean(true);
        request.setAttribute("org.apache.catalina.ASYNC_SUPPORTED", true);
        AsyncContext asyncCtx = request.startAsync();
        asyncCtx.addListener(new AsyncListener()
        {
            public void onComplete(AsyncEvent asyncEvent) throws IOException 
            {
                
                running.set(false);
            }

            public void onError(AsyncEvent asyncEvent) throws IOException
            {
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
      
        asyncCtx.setTimeout(0);
        ThreadPoolExecutor executor = (ThreadPoolExecutor) request.getServletContext().getAttribute("executor");
        Schrun lp = new Schrun(asyncCtx, cachedstyle.fontsize,  orgnum, sek, user.id, dept, semester, semesterName,fix.equals("1"),candidate.equals("1"),goodtime.equals("1"),exclusion.equals("1"),timeshare.equals("1"), running);
        executor.execute(lp);
    }

  
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    
    @Override
    public String getServletInfo() {
        return "Short description";
    } 

}
