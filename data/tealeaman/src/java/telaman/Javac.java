 
package telaman;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.RandomAccessFile;
import java.io.Reader;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import telaman.DBAdmin;
import telaman.ServerAgent;
import telaman.Toolbox;
import telaman.User;
@WebServlet(name = "Javac", urlPatterns = {"/Javac"},   asyncSupported = false)
public class Javac
extends HttpServlet {
   

    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        PrintWriter out;
        String className;
        String javahome;
        String aline;
        HttpSession session = request.getSession(true);
        int orgnum =  Toolbox.setcharset(request, response); 
        if (orgnum == -1) return;
        CachedStyle cachedstyle = new CachedStyle(request, orgnum);
        User user = (User)(session.getAttribute("User"));
        
        request.setCharacterEncoding(Toolbox.encodings[orgnum>>16]);
        String content = Toolbox.defaultParam(orgnum,request, "Content", null);
        if (content == null) {
            content = Toolbox.defaultParam(orgnum,request, "Source", null);
        }
        if (content == null) {
            content = Toolbox.defaultParam(orgnum,request, "source", null);
        }
        if (content == null) {
            content = Toolbox.defaultParam(orgnum,request, "content", null);
        }
        if (!Toolbox.verifytoken(request)) {
            PrintWriter out2 = response.getWriter();
            out2.println(" NOT verified");
            out2.close();
            return;
        }
         
        java.util.Enumeration e1 = request.getParameterNames();
        while (e1.hasMoreElements()) {
            String na = (String)e1.nextElement();
            
            String va = Toolbox.defaultParam(orgnum,request, (na), null);
           
        }
       
        String option = Toolbox.defaultParam(orgnum,request, "option", "", ",", 30);
        javahome = (javahome = Toolbox.defaultParam(orgnum,request, "javahome", null, "@#$+;\\/", 200)) == null ? "" : javahome + File.separator + "bin" + File.separator;
        String filename = null;
        String dir = null;
        if (content == null) {
            Object current;
           
            if ((filename = Toolbox.defaultParam(orgnum,request, "filename", null, "@#$+\\:/-_", 100)) == null) {
                
                PrintWriter out3 = response.getWriter();
                out3.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" >");
                out3.println(Toolbox.getMeta(orgnum));
                out3.println("<head>");
                out3.println("<title>" + Toolbox.emsgs(orgnum,130) + "</title>");
                out3.println(cachedstyle.toString() + "<link rel=\"stylesheet\" type=\"text/css\" href=\"styleb" + (orgnum) + ".css\" />");
                out3.println("</head>");
                out3.println("<style type=\"text/css\">\n.special {background-color:#8000ff;color:white}\n</style>\n");
                out3.println("<body  style=\"background-color:" + cachedstyle.DBGCOLOR + ";margin:5px 5px 0px 5px\">");
                out3.println(Toolbox.title(Toolbox.emsgs(orgnum,129)));
                out3.println(Toolbox.emsgs(orgnum,131));
                out3.println(Toolbox.emsgs(orgnum,845));
                out3.println(Toolbox.emsgs(orgnum,844));
                out3.close();
                return;
            }
            if ((current = (session).getAttribute("User")) == null) 
            {
                filename = null;
            } 
            else 
            {
                 user = (User)current;
                if ((dir = Toolbox.defaultParam(orgnum,request, "subfolder", null, "@#$+\\:/-_", 100)) == null) 
                {
                    filename = null;
                } 
                else 
                {
                    if (File.separator.equals("\\")) 
                    {
                        while (dir.indexOf("/") >= 0) 
                        {
                            dir = dir.replace('/', '\\');
                        }
                    } 
                    else 
                    {
                        while (dir.indexOf("\\") >= 0) 
                        {
                            dir = dir.replace('\\', '/');
                        }
                    }
                    if ( user.webFileFolder.equals(Toolbox.dbadmin[user.orgnum%65536].webFileFolder + File.separator + user.id))
                    dir = Toolbox.dbadmin[user.orgnum%65536].webFileFolder + File.separator + user.id + File.separator + dir;
                    else 
                    dir = user.webFileFolder + File.separator + dir;
                }
            }
        }
        if (((className = this.findClassName(content)) == null || className.equals("")) && filename == null) {
            response.setContentType("text/html");
            out = response.getWriter();
            out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" >");
            out.println(Toolbox.getMeta(orgnum));
            out.println("<head>");
            out.println("<title>" + Toolbox.emsgs(orgnum,130) + "</title>");
            out.println(cachedstyle.toString() + "<link  rel=\"stylesheet\" type=\"text/css\" href=\"styleb" + (orgnum) + ".css\"  />");
            out.println("</head>");
            out.println("<style type=\"text/css\">\n.special {background-color:#8000ff;color:white}\n</style>\n");
            out.println("<body  style=\"background-color:" + cachedstyle.DBGCOLOR + ";margin:5px 5px 0px 5px\">");
            out.println(Toolbox.title(Toolbox.emsgs(orgnum,129)));
            out.println(Toolbox.emsgs(orgnum,132));
            out.close();
            return;
        }
        if (dir == null) {
            dir = ServerAgent.workingFolder;
        }
        if (dir == null || dir.equals("")) {
            response.setContentType("text/html");
            out = response.getWriter();
            out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" >" + Toolbox.getMeta(orgnum) + "<head> <title>" + Toolbox.emsgs(orgnum,133) + "</title>");
            out.println(cachedstyle.toString() + "<link  rel=\"stylesheet\" type=\"text/css\" href=\"styleb" + (orgnum) + ".css\"  />");
            out.println("</head><body>");
            out.println(Toolbox.emsgs(orgnum,134));
            out.close();
            return;
        }
        if (dir.equals("")) 
        {
            dir = ServerAgent.workingFolder = Toolbox.installpath.substring(0, Toolbox.installpath.lastIndexOf(File.separator )+1) +  "temp";
        }
        if (filename == null && content != null) 
        {
            FileWriter aWriter = new FileWriter(dir + File.separator + className + ".java", false);
            aWriter.write(content);
            aWriter.close();
            FileWriter fw = new FileWriter(dir + File.separator + className + ".txt", false);
            fw.write("Manifest-Version: 1.0\r\n");
            fw.write("Main-Class: " + className + "\r\n");
            fw.write("X-COMMENT: Main-Class will be added automatically by build\r\n");
            fw.write("Class-Path: lib/appframework-1.0.3.jar lib/swing-worker-1.1.jar lib/swing-layout-1.0.3.jar\r\n");
            fw.write("Ant-Version: Apache Ant 1.7.1\r\n");
            fw.write("Created-By: 1.5.0_10-b03 (Sun Microsystems Inc.)\r\n");
            fw.close();
        } else {
            className = filename.replaceFirst("\\.java",  "");
        }
     
        int exitVal = -1;
        int[] rarray = new int[100];
        int N = 0;
        String old = "";
        StringBuffer sb = new StringBuffer(400);
        try {
            Runtime r = Runtime.getRuntime();
            Process proc = r.exec("javac  " + className + ".java", (String[])null, new File(dir));
            InputStream stderr = proc.getErrorStream();
            InputStreamReader isr = new InputStreamReader(stderr);
            BufferedReader br = new BufferedReader(isr);
            while ((aline = br.readLine()) != null) {
                String aline2;
                String aline1 = aline.replaceFirst(className + ".java:(\\d+):", "<a href=#$1>" + className + ".java:$1:</a>");
                if (!((aline2 = aline.replaceFirst(className + ".java:(\\d+):.*", "$1")).equals(old) || N >= 100)) {
                    try {
                        int ttt = Integer.parseInt(aline2);
                        rarray[N++] = ttt;
                    }
                    catch (Exception e) {
                        // empty catch block
                    }
                    old = aline2;
                }
                sb.append(aline1 + "<br>");
            }
            exitVal = proc.waitFor();
        }
        catch (Exception e) {
            sb.append(e.toString());
        }
        int jj = 1;
        int ll = 0;
        if (exitVal > 0) {
            response.setContentType("text/html");
            PrintWriter out4 = response.getWriter();
            out4.println("<!DOCTYPE html>\n<html lang=\""+Toolbox.langs[orgnum>>16]+"\" >");
            out4.println(Toolbox.getMeta(orgnum));
            out4.println("<head>");
            out4.println("<title>Java Compilation</title>");
            out4.println(cachedstyle.toString() + "<link  rel=\"stylesheet\" type=\"text/css\" href=\"styleb" + (orgnum) + ".css\"  />");
            out4.println("<style type=\"text/css\">\n.special {background-color:#8000ff;color:white}\n</style>\n");
            out4.println("</head>");
            out4.println("<body  style=\"background-color:" + cachedstyle.DBGCOLOR + ";margin:5px 5px 0px 5px\">");
            out4.println(Toolbox.title("javac"));
            out4.println("<table><tr>" + Toolbox.fields("Exit Code",orgnum, cachedstyle) + "<td>" + exitVal + "</td></tr><tr>" + Toolbox.fields("Compiling Option",orgnum, cachedstyle) + "<td>" + option + "</td></tr><tr>" + Toolbox.fields("Directory",orgnum, cachedstyle) + "<td>" + dir + "</nobr></td></tr><tr>" + Toolbox.fields("Soruce File",orgnum, cachedstyle) + "<td>" + className + ".java</td></tr><tr>" + Toolbox.fields("Error Message",orgnum, cachedstyle) + "<td>");
            out4.println(sb.toString() + "</td></tr></table>");
            int nn = rarray[0];
            RandomAccessFile f = new RandomAccessFile(dir + File.separator + className + ".java", "r");
            while ((aline = f.readLine()) != null) {
                int kk = jj;
                out4.print("<font color=brown face=courier>  " + jj + " &nbsp;&nbsp;</font>");
                if (nn == kk) {
                    out4.print("<a name=" + nn + "><font face=courier class=special></a>");
                    if (ll + 1 < N) {
                        nn = rarray[++ll];
                    }
                } else {
                    out4.print("<font face=courier>  ");
                }
                aline = aline.replaceAll(" ", "&nbsp;");
                aline = aline.replaceAll("\t", "&nbsp;&nbsp;&nbsp;");
                out4.print(aline + "</font><br>");
                ++jj;
            }
            f.close();
            out4.println("</body>");
            out4.println("</html>");
            out4.close();
        } else {
            int exitValue = 1;
            StringBuffer errbuf = new StringBuffer();
            try {
                Runtime r = Runtime.getRuntime();
                Process proc = r.exec("jar cfm  " + className + ".jar " + className + ".txt " + className + ".class", (String[])null, new File(dir));
                InputStream stderr = proc.getErrorStream();
                InputStreamReader isr = new InputStreamReader(stderr);
                BufferedReader br = new BufferedReader(isr);
                while ((aline = br.readLine()) != null) {
                    errbuf.append(aline + "\n");
                }
                exitValue = proc.waitFor();
                 br.close();
                isr.close();
                stderr.close();
            }
            catch (Exception e) {
                // empty catch block
            }
            if (exitValue > 0) {
                response.setContentType("text/html");
                PrintWriter out5 = response.getWriter();
                out5.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + "</head><body>" + errbuf.toString() + "</body></html>");
                out5.close();
            } else {
                int j;
                response.setHeader("Content-Disposition", "attachment;filename=" + className + ".jar");
                ServletOutputStream os = response.getOutputStream();
                FileInputStream fin = new FileInputStream(new File(dir + File.separator + className + ".jar"));
                byte[] buf = new byte[2024];
                while ((j = fin.read(buf)) > 0) {
                    os.write(buf, 0, j);
                }
                fin.close();
                os.close();
            }
        }
        if (filename == null) {
            new File(dir + File.separator + className + ".java").delete();
            new File(dir + File.separator + className + ".jar").delete();
            new File(dir + File.separator + className + ".txt").delete();
            ServerAgent.clean(dir);
        }
    }
     public void init(ServletConfig config) throws ServletException {
        super.init(config);
    }

    public void destroy() {
    }
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.processRequest(request, response);
    }

    protected String findClassName(String cont) {
        Matcher m;
        Pattern p;
        if (cont == null) {
            return null;
        }
        if (!((m = (p = Pattern.compile("class\\s+[_|\\w]+")).matcher((CharSequence)cont)) != null && m.find())) {
            return null;
        }
        String ans = cont.substring(m.start(), m.end());
        ans = ans.replaceFirst("class\\s+", "");
        return ans;
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.processRequest(request, response);
    }

    public String getServletInfo() {
        return "Short description";
    }
}
