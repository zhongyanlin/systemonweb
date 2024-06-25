 
package telaman;

import java.io.*;
import java.util.*;
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
 
@WebServlet(name = "ServerAgent", urlPatterns = {"/ServerAgent"},   asyncSupported = false)
public class ServerAgent extends HttpServlet 
{
    public static String workingFolder = null;
    private static HashMap commands = new HashMap<>();
    public static String coms = "sort\nlatex\npdflatex\ndvips\nbcc32\nconvert";
    public int orgnum = Toolbox.langnum<<16;
    
    
    protected void processRequest(HttpServletRequest request, HttpServletResponse response, boolean isget) throws ServletException, IOException {
        String ext;
        String course = null;
        String subfolder = null;
        String command = null;
        String content = null;
        String[] exts = null;
        String source = null;
        String str = null;
        String dir = null;
        boolean hasFile = true;
        int exitVal = 0;
        HttpSession session = request.getSession(true);
        orgnum =  Toolbox.setcharset(request, response); 
        if (orgnum == -1) return;
CachedStyle cachedstyle = new CachedStyle(request, orgnum);
    User user = (User)(session.getAttribute("User"));
        String option = Toolbox.defaultParam(orgnum,request, "option", "", "+,", 100);
        command = Toolbox.defaultParam(orgnum,request, "command", null);
        if (command != null) {
            command = command.trim();
        }
        if ((content = Toolbox.defaultParam(orgnum,request, "Source", null)) == null) {
            content = Toolbox.defaultParam(orgnum,request, "Content", null);
        }
        if (content == null) {
            content = Toolbox.defaultParam(orgnum,request, "source", null);
        }
        if (content == null) {
            content = Toolbox.defaultParam(orgnum,request, "content", null);
        }
        if (content != null) {
            content = content.replaceAll("\r", "");
        }
        if ((ext = Toolbox.defaultParam(orgnum,request, "ext", null, ",", 20)) == null) {
            exts = new String[2];
        } else if ((exts = ext.split(",")).length == 1) {
            exts = new String[2];
            exts[0] = ext;
        }
        
        if ( command == null || !Toolbox.verifytoken(request)) {
           
            PrintWriter out = response.getWriter();
            out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" >" + Toolbox.getMeta(orgnum) + " <head><title>" + Toolbox.emsgs(orgnum,133) + "</title></head><body>no command</body></html> ");
            out.close();
            return;
        }
         
        Commandline cm = this.getCommandline(command.replaceFirst(" .*", ""), orgnum);
       
        if (cm.roles != -1) {
            if ((user = User.authorize(orgnum, Systemroles.TOTAL, this.getServletConfig().getServletContext(), session, request, response, "ServerAgent", false)) == null) {
                return;
            }
            orgnum = user.orgnum; 
        } else if ((user = (User)session.getAttribute("User")) == null) {
          
                
            user = new User(orgnum);
            user.roles = 2;
        }
        
        String uid = "";
        if (user.roles == 1) 
        {
            uid = user.iid;
            if (uid == null || ServerAgent.workingFolder == null || ServerAgent.workingFolder.equals("")) 
            {
                
                PrintWriter out = response.getWriter();
                out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" >" + Toolbox.getMeta(orgnum) + " <head> <title>" + Toolbox.emsgs(orgnum,133) + "</title></head><body>");
                out.println(Toolbox.emsgs(orgnum,134));
                out.close();
                return;
            }
        } 
        else 
        {
            uid = user.id;
        }
        if (command != null && command.equals("configure") && ext != null && ext.equals("serveragent")) 
        {
            if ((user.roles & 8) == 0) {
                RequestDispatcher dispat = this.getServletConfig().getServletContext().getRequestDispatcher("/unauthorize.jsp?level=8");
                dispat.forward((ServletRequest)request, (ServletResponse)response);
                return;
            }
             
            PrintWriter out = response.getWriter();
            out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" > <head> <title>" + Toolbox.emsgs(orgnum,133) + "</title></head><body>");
            ServerAgent.coms = content.trim();
            out.println(Toolbox.emsgs(orgnum,148) + ServerAgent.coms.replaceAll("\n", "<br>"));
            out.close();
            return;
        }
        course = FileOperation.stdfn(Toolbox.defaultParam(orgnum,request, "course", null, null, 30));
        if ((subfolder = FileOperation.stdfn(Toolbox.defaultParam(orgnum,request, "subfolder", "", "@#$+:\\/-_", 100))) == null || subfolder.equals("")) {
            subfolder = "working";
        } else if (course != null) {
            subfolder = course + File.separator + subfolder;
        }
        if (File.separator.equals("\\")) {
            while (subfolder.indexOf("/") >= 0) {
                subfolder = subfolder.replace('/', '\\');
            }
        } else {
            while (subfolder.indexOf("\\") >= 0) {
                subfolder = subfolder.replace('\\', '/');
            }
        }
        //subfolder = subfolder.equals("") ? File.separator + uid : File.separator + uid + File.separator + subfolder;
        long roles = 0;
        String path = null;
        if (cm != null) 
        {
            roles = cm.roles;
            path = cm.path;
        }
        source = Toolbox.defaultParam(orgnum,request, "filename", null, "@#$+\\:/-_", 50);
        boolean b1 = ((roles | user.roles) == 0);
        boolean b2 = (path == null );
        boolean b3 =  (command.contains("python") && !noharm(source!=null,content) );
        if (b1 || b2 || b3) 
        {
            response.setContentType("text/html;charset=" + Toolbox.encoding);
            PrintWriter out = response.getWriter();
            out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" >" + Toolbox.getMeta(orgnum) + "<head> <title>" + Toolbox.emsgs(orgnum,133) + "</title> </head> <body>");
            out.println(Toolbox.title(command));
            String err =  Toolbox.emsgs(orgnum,149) + "("; 
            if (b1) err +=  "role "; 
            if (b2) err +=  " path "; 
            if (b3) err +=  " insecure "; 
            out.println(command + "  " + err  + ")");
            out.close();
            return;
        }
        command = (command = command.replaceFirst("^[^ ]+", "")).equals("") ? path : path + " " + command;
        String feed = Toolbox.defaultParam(orgnum,request, "feed", "", ",+$", 30);
        int n = Toolbox.getCounter();
        
        if (source == null) 
        {
            source = "f" + n;
            hasFile = false;
        } else {
            int kk;
            hasFile = true;
            if ((kk = source.indexOf(".")) != -1) {
                if (exts[0] == null || exts[0].equals("")) {
                    exts[0] = source.substring(kk + 1);
                }
                source = source.substring(0, kk);
            }
        }
        exts[0] = exts[0] != null && exts[0].length() > 0 ? "." + exts[0] : "";
        exts[1] = exts[1] != null && exts[1].length() > 0 ? "." + exts[1] : "";
        
        if (user.webFileFolder != null && !user.webFileFolder.equals("")) 
            dir = user.webFileFolder + File.separator + subfolder;
        else 
            dir = ServerAgent.workingFolder + File.separator + subfolder;
        if (!new File(dir).exists()) 
        {
            UploadFile.makedir(dir);
        } 
        else 
        {
            ServerAgent.clean(dir);
        }
        str = dir + File.separator + source + exts[0];
        String str1 = dir + File.separator + source + ".1er";
        String str2 = dir + File.separator + source + ".1ou";
        if (!(hasFile || content == null)) {
            new File(str).delete();
            try {
                FileWriter aWriter = new FileWriter(str, true);
                aWriter.write(content);
                aWriter.close();
            }
            catch (Exception e) {
                // empty catch block
            }
        }
        
        if ( (new File(dir, source + exts[0])).exists() == false) 
        {
            response.setContentType("text/html;charset=" + Toolbox.encoding);
            PrintWriter out = response.getWriter();
            out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" >" + Toolbox.getMeta(orgnum) + "<head> <title>" + Toolbox.emsgs(orgnum,133) + "</title>");
            out.println("<script type=text/javascript>document.write(unifontstyle(" + Toolbox.defaultFontSize + "));</script>");
            out.println("</head> <body>");
            out.println(Toolbox.title(getServletInfo()));
            if (hasFile) 
            {
                out.println("The operation requires file type " + exts[0]);
            } 
            else 
            {
                out.println("File " + dir + File.separator + source + exts[0] + " does not exist.");
            }
            out.close();
            return;
        }
        long tt = System.currentTimeMillis();
        int size = 20;
        
        try {
            String exename = exts[1].toLowerCase();
            Runtime r = Runtime.getRuntime();
            Process proc = null;
            String dq = source.indexOf(" ") >= 0 ? "\"" : "";
             
            String line = "\"" + command + "\" " + option + " " + dq + source + exts[0] + dq;
             
            proc = r.exec(line, (String[])null, new File(dir));
            OutputStream out = proc.getOutputStream();
            if (feed != null) {
                feed = feed + "\n";
                byte[] buf = feed.getBytes();
                out.write(buf);
            }
            out.close();
            SharedInt ss = new SharedInt();
            StreamThread errorGobbler = new StreamThread(proc.getErrorStream(), str1, ss);
            StreamThread outputGobbler = new StreamThread(proc.getInputStream(), str2, ss);
            errorGobbler.start();
            outputGobbler.start();
            exitVal = proc.waitFor();
            exitVal = proc.exitValue();
            proc.destroy();
         
            String ppath = dir + File.separator + source + exts[1];
            
            
            if ( (new File(ppath)).exists() == false && exts[1].equals("exe") && command.contains("bcc32"))
            {
                String link =  "\"" + command.replace("bcc32","ilink32") + "\"  -aa -c -x -Gn " + source + ".obj c0w32.obj," + source + ".exe,,import32.lib cw32.lib,," + source + ".res";
                proc = r.exec(link, (String[])null, new File(dir));
                 new File(str1).delete();
                 new File(str2).delete();
                errorGobbler = new StreamThread(proc.getErrorStream(), str1, ss);
                outputGobbler = new StreamThread(proc.getInputStream(), str2, ss);
                errorGobbler.start();
                outputGobbler.start();
                exitVal = proc.waitFor();
                exitVal = proc.exitValue();
                proc.destroy();
            }
            if (new File(ppath).exists() )
            {
                boolean isexe = exename.equals(".exe") && Toolbox.defaultParam(orgnum,request, ("exe"), null) != null && noharm(hasFile,content);
                if (isexe) 
                {
                    new File(str2).delete();
                    proc = r.exec('"' + ppath + '"', (String[])null, new File(dir));
                    StreamThread outputstr = new StreamThread(proc.getInputStream(), str2, ss);
                    outputstr.start();
                    exitVal = proc.waitFor();
                    exitVal = proc.exitValue();
                    proc.destroy();
                }
                if (exename.equals(".exe") || exename.equals(".bat") || exename.equals(".sh") || exename.equals(".jsp") || exename.equals(".asp") || exename.equals(".php"))  
                {     
                    ZipUnZip.zipfile(ppath);
                    new File(ppath).delete();
                    if (!isexe)
                    {
                        exts[1] = ".zip";
                    }
                }
            }
            
            size = Integer.parseInt(Toolbox.defaultParam(orgnum,request, ("size"), null));
        }
        catch (Exception e) {
            exitVal = 1;
        }
        this.outputresult( request,response, command, source, exts, dir, exitVal, subfolder, hasFile, tt, size, orgnum);
    }
    public boolean noharm(boolean hasFile,String content)
    {
        if (hasFile) return false;
        int k=6; int N = content.length();
        if (N < 7) return true;
        String word= content.substring(0,6);
        while (k < N)
        {
            if (word.indexOf("delete") == 0 || word.indexOf("remove")==0 || word.indexOf("open")== 0 || word.indexOf("write") == 0)
            return false; 
            word = word.substring(1) + content.charAt(k);
            k++;
        }
        return true;
    }
    public static void clean(String directory, String fn) {
        if (directory == null || directory.equals("")) {
            return;
        }
        File f = new File(directory);
        File[] fl = f.listFiles();
        for (int i = 0; i < fl.length; ++i) {
            String fns;
            if ((fns = fl[i].getName()).indexOf(fn + ".") != 0) continue;
            fl[i].delete();
        }
    }

    public static void clean(String directory) {
        File[] fl;
        if (directory == null || directory.equals("")) {
            return;
        }
        Date d = new Date();
        long y = d.getTime();
        long diff = 7200000;
        File f = new File(directory);
        long t = f.lastModified();
        if ((fl = f.listFiles()) != null) {
            for (int i = 0; i < fl.length; ++i) {
                if (y - fl[i].lastModified() <= diff) continue;
                fl[i].delete();
            }
        }
    }

    public static void loaddb(int orgnum) 
    {
        JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
        int n = 0;
        boolean b = adapter.executeQuery2("SELECT command,path,roles FROM Commandline",false);
        if (b) 
        {
            ServerAgent.commands.clear();
        }
        String cm;
        for (int i = 0; adapter.getValueAt(i, 0)!=null ; ++i) 
        {
            if ((cm = adapter.getValueAt(i, 1)) == null) continue;
            if ((cm = cm.trim()).indexOf(" ") >= 0) {
                cm = "\"" + cm + "\"";
            }
            ServerAgent.commands.put(adapter.getValueAt(i, 0), new Commandline(adapter.getValueAt(i, 0).trim(), cm, Long.parseLong(adapter.getValueAt(i, 2))));
        }
        adapter.close();
    }

    public static String getPath(String sv, int orgnum) {
        Commandline cm;
        if (ServerAgent.commands.size() == 0) {
            ServerAgent.loaddb(orgnum);
        }
        if ((cm = (Commandline)ServerAgent.commands.get(sv)) == null) {
            return null;
        }
        return cm.path;
    }

    public static long getRoles(String sv, int orgnum) {
        Commandline cm;
        if (ServerAgent.commands.size() == 0) {
            ServerAgent.loaddb(orgnum);
        }
        if ((cm = (Commandline)ServerAgent.commands.get(sv)) == null) {
            return 0;
        }
        return cm.roles;
    }

    Commandline getCommandline(String sv, int orgnum) 
    {
        if (ServerAgent.commands.size() == 0) {
            ServerAgent.loaddb(orgnum);
        }
        return (Commandline)ServerAgent.commands.get(sv);
    }

    protected void outputresult(HttpServletRequest request,HttpServletResponse response, String command, String source, String[] exts, String dir, int exitVal, String subfolder, boolean hasFile, long tt, int size, int orgnum) {
        try {
            HttpSession session = request.getSession(true);
            User user = (User)(session.getAttribute("User"));
            PrintWriter out = response.getWriter();
            CachedStyle cachedstyle = new CachedStyle(request, orgnum);
            response.setContentType("text/html;charset=" + Toolbox.encoding);
            out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" >");
            out.println(Toolbox.getMeta(orgnum) + "<head>");
            out.println("<title>Server Agent</title>");
            out.println(cachedstyle.toString() + "<link rel=\"stylesheet\" type=\"text/css\" href=\"styleb" + (orgnum) + ".css\">");
            out.println("<script type=text/javascript>" + Toolbox.someconsts(orgnum) + "</script><script type=text/javascript  src=" + Toolbox.getUserLang(orgnum) + " ></script><script type=text/javascript  src=cookie.js></script>");
            out.println("<script type=text/javascript>document.write(unifontstyle(" + Toolbox.defaultFontSize + "));</script>");
            out.println("</head>");
            out.println("<body  style=\"background-color:" + cachedstyle.DBGCOLOR + ";margin:5px 5px 0px 5px\">");
            out.println(Toolbox.title(getServletInfo()));
            Encode6b encoder = new Encode6b(orgnum);
            if (exts[1] != null && new File(dir + File.separator + source + exts[1]).exists()) {
                String js = encoder.to6b(dir + File.separator + source + exts[1]);
                String pathname = "web" + subfolder.replace(File.separator.charAt(0), '/') + "/" + source + exts[1];
                out.println("<a href=\"FileOperation?did=" + js + "\">" + source + exts[1] + "</a>");
                out.println("<script  type=text/javascript>if (typeof(opener.syn)!='undefined')opener.syn('" + pathname + "');</script>");
            } else {
                out.println("<font color=teal face=courier>\"" + command + "\" \"" + source + exts[0] +"\", Exit Code:" + exitVal + "<br>");
                if (exts[1] != null) {
                    this.output(source + exts[0], dir, "#0000CC", "Source", out, size);
                }
            }
            String cl = command.contains("python")? "#FFFFFF" : "#00CC00";
            this.output(source + ".1er", dir, "#CC0000", "Error Message", out,size);
            this.output(source + ".1ou", dir, cl,  "Output Message", out,size);
            out.println("<br> " + dir);
            String[] list = new File(dir).list();
            boolean k = false;
            long ct = System.currentTimeMillis();
            for (int j = 0; j < list.length; ++j) {
                if (list[j].equals(source + exts[1]) || ct - new File(dir + File.separator + list[j]).lastModified() > ct - tt) continue;
                out.println("<br><a href=\"FileOperation?did=" + encoder.to6b(new StringBuilder().append(dir).append(File.separator).append(list[j]).toString()) + "\" target=_blank >" + list[j] + "</a>");
            }
            out.println("</body>");
            out.println("</html>");
            out.close();
            new File(dir + File.separator + source + ".1er").delete();
            new File(dir + File.separator + source + ".1ou").delete();
        }
        catch (Exception e) {
            // empty catch block
        }
    }

    void output(String f, String directory, String cl, String title, PrintWriter out, int size) 
    {
        if (!new File(directory + File.separator + f).exists()) 
        {
            return;
        }
        try 
        {
            RandomAccessFile r = new RandomAccessFile(directory + File.separator + f, "r");
            String aline = null;
            boolean empty = true;
            int j = 1;
            while ((aline = r.readLine()) != null) 
            {
                if (empty) 
                {
                    out.println("<div class=outset1 style=\"" + (cl.equals("#FFFFFF")?"background-color:black;":"") + "margin:5px 3px 0px 3px;font-size:" + size + "px\" >");
                    if (title != null) 
                    {
                        out.println("<font color=" + cl + "  face=courier><b>" + title + "</b>:<br>");
                    }
                    empty = false;
                }
                String jstr = "";
                if (cl.equals("#0000CC"))
                {
                    jstr = "" + j;
                    if (jstr.length() == 1) jstr = "&nbsp;&nbsp;&nbsp;" + jstr;
                    else if (jstr.length() == 2) jstr = "&nbsp;&nbsp;" + jstr;
                    else if (jstr.length() == 3) jstr = "&nbsp;" + jstr;
                    j++;
                    jstr += "&nbsp;";
                    jstr = "<font color=black><b>" + jstr + "</b></font>";
                }
                out.println(jstr   + aline.replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll("\t","&nbsp;&nbsp;&nbsp;")+ "<br>");
                
            }
            r.close();
            if (empty == false)
            {
                out.println("</font><br>");
                out.println("</div>");
            }
        }
        catch (Exception e) {
            // empty catch block
        }
        
        new File(directory + File.separator + f).delete();
    }

    void del(String d, String s) {
        String[] ls = new File(d).list();
        for (int i = 0; i < ls.length; ++i) {
            if (ls[i].indexOf(s) < 0) continue;
            new File(d + File.separator + ls[i]).delete();
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.processRequest(request, response, true);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.processRequest(request, response, false);
    }

    public String getServletInfo() {
        return "ServerAgent";
    }
}
