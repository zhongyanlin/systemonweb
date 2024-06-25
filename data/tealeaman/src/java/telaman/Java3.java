/*
 * Decompiled with CFR 0_87.
 * 
 * Could not load the following classes:
 *  javax.servlet.ServletConfig
 *  javax.servlet.ServletContext
 *  javax.servlet.ServletException
 *  javax.servlet.ServletOutputStream
 *  javax.servlet.http.HttpServlet
 *  javax.servlet.http.HttpServletRequest
 *  javax.servlet.http.HttpServletResponse
 */
package telaman;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.Reader;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.concurrent.atomic.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpSession;
@WebServlet(name = "Java3", urlPatterns = {"/Java3"},   asyncSupported = false)
public class Java3
extends HttpServlet {
    private String applethead = "public class MyProg";
    static AtomicInteger porder0 = new AtomicInteger(0);

    public static String title(String str) {
        return "<center><table BORDER=0 COLS=1 WIDTH=100% style=\"background:url(header.gif) #00BBBB\" height=42><tr ALIGN=CENTER><td><font color=#DDCC11 size=+2><b><NOBR>" + str + "</NOBR></b></font></td></tr></table></center>\n";
    }

    public void init(ServletConfig config) throws ServletException {
        super.init(config);
    }

    String applethead(int porder) {
        return "import java.applet.Applet;\nimport java.awt.*;\npublic class MyProg" +  porder + " extends Applet\n" + "{\n" + "protected  void yourcodes()\n" + "{\n";
    }

    String applettail(String[] fs) {
        return "\n}\nprivate Graphics g = null;\nprivate int  x = 0, y =20;\nprotected void print(boolean nl,String s)\n{ \n    g.drawString(s,x,y);\n    if (nl){x=0;y +=" + fs[2] + ";}\n" + "    else { x += " + fs[1] + "*s.length();}\n" + "}\n" + "public void paint(Graphics g1)\n" + "{\n" + "  g = g1;\n" + "  g.setFont(new Font(\"monospaced\", Font.BOLD," + fs[0] + "));\n" + "  yourcodes();\n" + " }\n" + "}\n";
    }

    private String applethead2(String[] fs) {
        return " extends Bapt\n{\nprotected void yourcodes()\n{\n   setSize(" + fs[0] + "," + fs[1] + "," + fs[2] + ");\n   super.yourcodes();\n";
    }

    public void destroy() {
    }

    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession(true);
        String content;
        User user = (User)(session.getAttribute("User"));
        String aline;
        String option;
        String javahome;
        if (!Toolbox.verifytoken(request)) {
            PrintWriter out = response.getWriter();
            out.println(" NOT verified");
            out.close();
            return;
        }
        String codebase = request.getRequestURL().toString().replaceFirst(".Java3","");
        int orgnum =  Toolbox.setcharset(request, response); 
        if (orgnum == -1) return;
CachedStyle cachedstyle = new CachedStyle(request, orgnum);
       // request.setCharacterEncoding("utf-8");
        String pppp = Toolbox.defaultParam(orgnum,request, ("pppp"), null);
        pppp = Toolbox.validate(pppp, ",", 20);
        if (pppp == null) {
            pppp = "18,10,20";
        }
        String[] fsize = pppp.split(",");
        if ((content = Toolbox.defaultParam(orgnum,request, ("content"), null)) == null) {
            content = Toolbox.defaultParam(orgnum,request, ("source"), null);
        }
        content = Toolbox.removescript(content);
        String notapplet = Toolbox.validate(Toolbox.defaultParam(orgnum,request, ("notapplet"), null), null, 3);
        if ((option = Toolbox.validate(Toolbox.defaultParam(orgnum,request, ("option"), null), null, 20)) == null) {
            option = "";
        }
        javahome = (javahome = Toolbox.validate(Toolbox.defaultParam(orgnum,request, ("javahome"), null), "/\\:", 50)) == null ? "" : javahome + File.separator + "bin" + File.separator;
         
        String dir = ServerAgent.workingFolder; 
        if (dir.charAt(dir.length()-1) == File.pathSeparatorChar)
            dir = dir.substring(0, dir.length()-1);
        if ((new File(dir)).exists() == false)
            (new File(dir)).mkdir();
        if (content == null || content.equals("")) 
        {
           // response.setContentType("text/html;charset=utf-8");
            PrintWriter out = response.getWriter();
            out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + "</head><body>No source codes");
            out.close();
            return;
        }
        
        int porder = porder0.addAndGet(1)%200;
         
        String sourcefilename;
        Pattern p = Pattern.compile("class\\s+[_|\\w]+");
        Matcher m = p.matcher((CharSequence)content);
        if ( m  == null || m.find() == false)
        {
            sourcefilename = "MyProg" +  porder + ".java";
            if (notapplet!=null)
            content = "public class MyProg" +  porder + "{\npublic static void main(String [] s){\n" + content + "}\n}" ;
        }
        else
        {
             sourcefilename = content.substring(m.start(), m.end());
             sourcefilename = sourcefilename.replaceFirst("class\\s+", "") + ".java";
        }
        if ( notapplet == null) 
        {
             content = this.applethead(porder) + content.replaceAll("System.out.println\\(", "print(true,\"\"+").replaceAll("System.out.print\\(", "print(false,\"\"+") + this.applettail(fsize);
        }
        FileWriter  aWriter = new FileWriter(dir + File.separator + sourcefilename, false);
        aWriter.write(content);
        aWriter.close();
        int exitVal = -1;
        int[] rarray = new int[100];
        int N = 0;
        String aline2 = "";
        String old = "";
        StringBuffer sb = new StringBuffer();
        try {
            Runtime r = Runtime.getRuntime();
            String command = "javac -classpath \"" + dir + "\"  " + sourcefilename  ;
           
            Process proc = r.exec(command,  null, new File(dir));
            InputStream stderr = proc.getErrorStream();
            InputStreamReader isr = new InputStreamReader(stderr);
            BufferedReader br = new BufferedReader(isr);
            while ((aline = br.readLine()) != null) {
                 
                aline2 = aline.replaceFirst(sourcefilename + ":(\\d+):.*", "$1");
                int ttt = 0;
                try {
                    ttt = Integer.parseInt(aline2);
                    if (notapplet == null) {
                        ttt-=6;
                    }
                    if (!(aline2.equals(old) || N >= 100)) {
                        rarray[N++] = ttt;
                        old = aline2;
                    }
                }
                catch (Exception e) {
                    // empty catch block
                }
                String aline1 = aline.replaceFirst(sourcefilename + ":(\\d+):", "<a href=#$1>Line " + ttt + ":</a>");
                aline1 = aline1.replaceAll("print\\(false\\,\"\"\\+", "Toolbox.print(1,").replaceAll("print\\(true\\,\"\"\\+", "Toolbox.println(1,");
                sb.append("<nobr>" + aline1 + "</nobr><br>");
            }
            exitVal = proc.waitFor();
        }
        catch (Exception e) {
            sb.append("<nobr>" + e.toString() + "</nobr><br>");
        }
        int jj = 1;
        int ll = 0;
        if (exitVal != 0) {
            int i;
            response.setContentType("text/html");
            PrintWriter out = response.getWriter();
            out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" >");
            out.println("<head>");
            out.println("<title>Java Compilation and Applet Execution</title>");
            out.println("</head>");
            out.println("<style type=\"text/css\">\n.special {background-color:#8000ff;color:white}\n</style>\n");
            out.println("<body style=\"font-weight:700\">");
            out.println(Java3.title("Web Javac Compilation"));
            out.println("<div style=text-font:courier;font-size:" + fsize[0] + ">" + sb.toString());
            out.println("</div><table cellspacing=2 cellpadding=2><tr><td align=right style=color:brown;text-font:courier;font-size:" + fsize[0] + ">");
            int nn = rarray[0];
            String[] codelines = content.split("\n");
            for (i = 1; i <= codelines.length; ++i) {
                out.println("" + i + "<br>");
            }
            out.println("</td><td align=left style=color:black;font-weight:700;text-font:courier;font-size:" + fsize[0] + ">");
            for (i = 0; i < codelines.length; ++i) {
                aline = codelines[i];
                int kk = jj;
                aline = aline.replaceAll(" ", "&nbsp;");
                aline = aline.replaceAll("\t", "&nbsp;&nbsp;&nbsp;");
                if (nn == kk) {
                    out.print("<nobr><a name=" + nn + "></a><font class=special>" + aline + "</font>");
                    if (ll + 1 < N) {
                        nn = rarray[++ll];
                    }
                } else {
                    out.print("<nobr>" + aline);
                }
                out.print("<br>");
                ++jj;
            }
            out.println("</body>");
            out.println("</html>");
            out.close();
        } else if (notapplet != null) {
            int j;
            String classfile = sourcefilename.replaceFirst("java", "class");
            response.setContentType("application/x-download");
            response.setHeader("Content-Disposition", "attachment;filename=" + classfile);
            ServletOutputStream os = response.getOutputStream();
            FileInputStream fin = new FileInputStream(new File(dir + File.separator + classfile));
            byte[] buf = new byte[2024];
            while ((j = fin.read(buf)) > 0) {
                os.write(buf, 0, j);
            }
            fin.close();
            os.close();
        } 
        else 
        {
            String winsize;
            String htmlfile = sourcefilename.replaceFirst("java", "html");
            String classfile = sourcefilename.replaceFirst("java", "class");
            Encode6b encoder = new Encode6b(orgnum);
            File ff = new File(dir, classfile);
            File ft = new File(dir, htmlfile);
            aWriter = new FileWriter(dir + File.separator + htmlfile, false);
            if ((winsize = Toolbox.defaultParam(orgnum,request, ("rsize"), null)) == null) {
                winsize = "400_500";
            }
            String[] xy = winsize.split("_");
            aWriter.write("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><META HTTP-EQUIV=\"Pragma\" CONTENT=\"no-cache\"> <body  style=\"background-color:#CCCC00;margin:0px 0px 0px 0px\"> <applet name=" + classfile.replaceFirst(".class", "") + " type=\"application/x-java-applet;jpi-version=6\" code=\"FileOperation?did=" + encoder.to6b(ff.getAbsolutePath()) + "\" codeBase=\"" + codebase + "\" width=" + xy[0] + " height=" + xy[1] + " border=0></applet><script>document.body.childNodes[0].code=\"FileOperation?did=" + encoder.to6b(ff.getAbsolutePath()) + "\";</script><body></html>");
            aWriter.close();
            response.setContentType("text/html");
            PrintWriter out = response.getWriter();
            out.println("<meta http-equiv=refresh content=\"1;url=FileOperation?did=" + encoder.to6b(ft.getAbsolutePath()) + "\">");
            out.close();
        }
         
        new File(dir + File.separator + sourcefilename).delete();
        this.clean(dir);
        
    }

    public void clean(String directory) {
        File f;
        File[] fl;
        if (directory == null || directory.equals("")) {
            return;
        }
        Date d = new Date();
        long y = d.getTime();
        long diff = 86400000;
        if ((fl = (f = new File(directory)).listFiles()) != null) {
            for (int i = 0; i < fl.length; ++i) {
                if (y - fl[i].lastModified() <= diff || fl[i].getName().equals("index.html")) continue;
                fl[i].delete();
            }
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.processRequest(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.processRequest(request, response);
    }

    public String getServletInfo() {
        return "Short description";
    }
}
