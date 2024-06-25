 
package telaman;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.Reader;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import telaman.DBAdmin;
import telaman.Encode6b;
import telaman.ServerAgent;
import telaman.Systemroles;
import telaman.Toolbox;
import telaman.User;
@WebServlet(name = "WordImage", urlPatterns = {"/WordImage"},   asyncSupported = false) 
public class WordImage
extends HttpServlet {
    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String outfile;
        String dir;
        PrintWriter out;
        boolean b3;
        File folder;
        int kk;
        HttpSession session = request.getSession(true);
        int orgnum = Toolbox.setcharset(request, response);
        if (orgnum == -1) return;
        CachedStyle cachedstyle = new CachedStyle(request, orgnum);
        User user = User.authorize(orgnum, Systemroles.TOTAL, this.getServletConfig().getServletContext(), session, request, response, "WordImage", true);
        if (user == null) {
            return;
        }
        orgnum = user.orgnum; 
        String filename = Toolbox.defaultParam(orgnum,request, "FileIn", "", null, 50);
        if ((outfile = Toolbox.defaultParam(orgnum,request, "FileOut", "", null, 50)).equals("")) {
            outfile = "tempfile.gif";
        }
        String option = Toolbox.defaultParam(orgnum,request, "Command", null, "!@#$%^&+\\][{}:;\",/", 5000);
        dir = (dir = Toolbox.defaultParam(orgnum,request, "Dir", "", "@#$+\\./", 100)).equals("") ? user.webFileFolder + File.separator + "working" : Toolbox.installpath + File.separator + dir.replace('/', File.separator.charAt(0));
        if (option == null) {
            response.setContentType("text/html");
            PrintWriter out2 = response.getWriter();
            out2.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" >");
            out2.println("<head>");
            out2.println("<title>Image Processing</title>");
            out2.println(cachedstyle.toString() + "<link rel=\"stylesheet\" type=\"text/css\" href=\"styleb" + (orgnum) + ".css\">");
            out2.println("<script type=text/javascript>" + Toolbox.someconsts(orgnum) + "</script><script type=text/javascript  src=" + Toolbox.getUserLang(orgnum) + " ></script><script type=text/javascript  src=cookie.js></script>");
            out2.println("<script  type=text/javascript>document.write(unifontstyle(17));</script>");
            out2.println("</head>");
            out2.println("<body  style=\"background-color:" + cachedstyle.DBGCOLOR + ";margin:5px 5px 0px 5px\">");
            out2.println(Toolbox.title("Image Processing"));
            out2.println("Missing ImageMagick command line");
            out2.println("</body>");
            out2.println("</html>");
            out2.close();
            return;
        }
        if ((user.roles & 8) == 0 && dir.indexOf(user.webFileFolder) != 0 && dir.indexOf("image" + File.separator + "users") < 0) {
            response.setContentType("text/html");
            PrintWriter out3 = response.getWriter();
            out3.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" >");
            out3.println("<head>");
            out3.println("<title>Image Processing</title>");
            out3.println(cachedstyle.toString() + "<link rel=\"stylesheet\" type=\"text/css\" href=\"styleb" + (orgnum) + ".css\">");
            out3.println("<script type=text/javascript>" + Toolbox.someconsts(orgnum) + "</script><script type=text/javascript  src=" + Toolbox.getUserLang(orgnum) + " ></script><script type=text/javascript  src=cookie.js></script>");
            out3.println("<script  type=text/javascript>document.write(unifontstyle(17));</script>");
            out3.println("</head>");
            out3.println("<body  style=\"background-color:" + cachedstyle.DBGCOLOR + ";margin:5px 5px 0px 5px\">");
            out3.println(Toolbox.title("Image Processing"));
            out3.println("You are not permitted to use this folder " + dir);
            out3.println("</body>");
            out3.println("</html>");
            out3.close();
            return;
        }
        String comstr = option = option.replaceFirst("^[ ]+", "");
        if ((kk = option.indexOf(" ")) > 0) {
            comstr = option.substring(0, kk);
        }
        
        long roles = ServerAgent.getRoles(comstr,orgnum);
        String path = ServerAgent.getPath(comstr,orgnum);
        boolean b1 = (roles | user.roles) == 0;
        boolean b2 = path == null;
        boolean bl = b3 = !new File(path).exists();
        if (b1 || b2 || b3) {
            response.setContentType("text/html");
            PrintWriter out4 = response.getWriter();
            out4.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" >");
            out4.println("<head>");
            out4.println("<title>Image Processing</title>");
            out4.println(cachedstyle.toString() + "<link rel=\"stylesheet\" type=\"text/css\" href=\"styleb" + (orgnum) + ".css\">");
            out4.println("<script type=text/javascript>" + Toolbox.someconsts(orgnum) + "</script><script type=text/javascript  src=" + Toolbox.getUserLang(orgnum) + " ></script><script type=text/javascript  src=cookie.js></script>");
            out4.println("<script  type=text/javascript>document.write(unifontstyle(17));</script>");
            out4.println("</head>");
            out4.println("<body  style=\"background-color:" + cachedstyle.DBGCOLOR + ";margin:5px 5px 0px 5px\">");
            out4.println(Toolbox.title("Image Processing"));
            response.setContentType("text/html;charset=" + Toolbox.encodings[orgnum>>16]);
            out4.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" >" + Toolbox.getMeta(orgnum) + "<head> <title>" + Toolbox.emsgs(orgnum,133) + "</title> </head> <body>");
            if (b1) {
                out4.println(option + "<br><font color=purple>" + Toolbox.emsgs(orgnum,149) + ". roles=" + roles + "</font><br>");
            } else if (b2) {
                out4.println("<font color=purple>No command</font><br>");
            } else if (b3) {
                out4.println(comstr + "<br><font color=purple>" + Toolbox.emsgs(orgnum,1531) + "</font>");
            }
            out4.close();
            return;
        }
        option = ("\"" + path.trim() + "\" " + option.replaceFirst("^[^ ]+", "") + " \"" + outfile + "\"").trim();
        int exitVal = -1;
        int[] rarray = new int[100];
        boolean N = false;
        String old = "";
        StringBuffer sb = new StringBuffer(400);
        if (!(folder = new File(dir)).exists()) {
            folder.mkdir();
        }
        File fd = new File(dir, outfile);
        if (!outfile.equals("") && fd.exists()) {
            fd.delete();
        }
        try {
            String aline;
            Runtime r = Runtime.getRuntime();
            Process proc = r.exec(option, (String[])null, folder);
            InputStream stderr = proc.getErrorStream();
            InputStreamReader isr = new InputStreamReader(stderr);
            BufferedReader br = new BufferedReader(isr);
            while ((aline = br.readLine()) != null) {
                sb.append(aline + "<br>");
            }
            exitVal = proc.waitFor();
        }
        catch (Exception e) {
            sb.append(e.toString());
        }
        boolean jj = true;
        boolean ll = false;
        if (exitVal > 0) {
            response.setContentType("text/html");
            out = response.getWriter();
            out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" >");
            out.println("<head>");
            out.println("<title>Image Processing</title>");
            out.println(cachedstyle.toString() + "<link rel=\"stylesheet\" type=\"text/css\" href=\"styleb" + (orgnum) + ".css\">");
            out.println("<script type=text/javascript>" + Toolbox.someconsts(orgnum) + "</script><script type=text/javascript  src=" + Toolbox.getUserLang(orgnum) + " ></script><script type=text/javascript  src=cookie.js></script>");
            out.println("<script  type=text/javascript>document.write(unifontstyle(17));</script>");
            out.println("</head>");
            out.println("<body  style=\"background-color:" + cachedstyle.DBGCOLOR + ";margin:5px 5px 0px 5px\">");
            out.println(Toolbox.title("Image Processing"));
            out.println(sb.toString() + "<br><br>Command Line:<br>" + option);
            out.println("</body>");
            out.println("</html>");
            out.close();
        } else {
            response.setContentType("text/html");
            out = response.getWriter();
            out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" >");
            out.println("<head>");
            out.println("<title>Image Processing</title>");
            out.println(cachedstyle.toString() + "<link rel=\"stylesheet\" type=\"text/css\" href=\"styleb" + (orgnum) + ".css\">");
            out.println("<script type=text/javascript>" + Toolbox.someconsts(orgnum) + "</script><script type=text/javascript  src=" + Toolbox.getUserLang(orgnum) + " ></script><script type=text/javascript  src=cookie.js></script>");
            out.println("<script  type=text/javascript>document.write(unifontstyle(17));</script>");
            out.println("</head>");
            out.println("<body  style=\"background-color:" + cachedstyle.DBGCOLOR + ";margin:5px 5px 0px 5px\">");
            out.println(Toolbox.title("Image Processing"));
            int j = Toolbox.dbadmin[0].webFileFolder.length();
            String js = new File(dir, outfile).getAbsolutePath();
            if (js.indexOf(Toolbox.dbadmin[0].webFileFolder) >= 0) {
                Encode6b encoder = new Encode6b(orgnum);
                js = encoder.to6b(js);
                out.println("<center><br><img src=\"FileOperation?did=" + js + "\">" + "</center>");
            } else if (js.indexOf(Toolbox.installpath) >= 0) {
                j = Toolbox.installpath.length();
                js = js.substring(j + 1).replace(File.separator.charAt(0), '/');
                out.println("<center><br><img src=\"" + js + "\">" + "</center>");
            } else if (js.indexOf(Toolbox.dbadmin[0].webFileFolder1) >= 0) {
                Encode6b encoder = new Encode6b(orgnum);
                js = encoder.to6b(js);
                out.println("<center><br><img src=\"FileOperation?did=" + js + "\">" + "</center>");
            } else {
                out.println("<center><br>" + js + "</center>");
            }
        }
        ServerAgent.clean(user.webFileFolder + File.separator + "temp");
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
