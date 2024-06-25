 
package telaman;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.RandomAccessFile;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import telaman.DBAdmin;
import telaman.SyntaxFormat;
import telaman.Toolbox;
import telaman.UploadFile;
import telaman.User;
@WebServlet(name = "Listing", urlPatterns = {"/Listing"},   asyncSupported = false)
public class Listing extends HttpServlet 
{
    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String content;
        HttpSession session = request.getSession(true);
        int orgnum = Toolbox.setcharset(request, response);
        
        if (orgnum == -1) return;
        CachedStyle cachedstyle = new CachedStyle(request, orgnum);
        User user = (User)(session.getAttribute("User"));
     
        if ( (user = User.authorize(orgnum,  Systemroles.TOTAL,session.getServletContext(),session,request, response, "Listing", true)) == null) 
            return; 
        PrintWriter out = response.getWriter();
        if (!Toolbox.verifytoken(request)) {
            out.println(" NOT verified");
            out.close();
            return;
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
        String fontsize = Toolbox.defaultParam(orgnum,request, "fontsize", "16", null, 3);
        if (!Toolbox.verifytoken(request)) {
            out.println(" NOT verified");
            out.close();
            return;
        }
        if (content == null) {
            String subfolder;
            String name = Toolbox.defaultParam(orgnum,request, "FileName", Toolbox.defaultParam(orgnum,request, "filename", null, "@#$+\\:/-_", 100));
            if (name == null || (subfolder = Toolbox.defaultParam(orgnum,request, "SubFolder", Toolbox.defaultParam(orgnum,request, "subfolder", null, "@#$+\\:/-_", 100))) == null) {
                out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head> " + Toolbox.getMeta(orgnum) + Toolbox.emsgs(orgnum,848));
                return;
            }
            
            if (user == null || user.orgnum!=orgnum) 
            {
                RequestDispatcher dispat = this.getServletConfig().getServletContext().getRequestDispatcher("/login.jsp?error=generic&follow=Listing&orgnum=" + orgnum);
                dispat.forward((ServletRequest)request, (ServletResponse)response);
                return;
            }
            //subfolder = subfolder.equals("") ? File.separator + user.id : File.separator + user.id + File.separator + subfolder;
            String str = user.webFileFolder +  File.separator + subfolder + File.separator + name;
            UploadFile.makedir(Toolbox.dbadmin[user.orgnum%65536].webFileFolder + subfolder);
            try {
                RandomAccessFile f = new RandomAccessFile(str, "r");
                if (f == null) {
                    out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + Toolbox.emsgs(orgnum,333) + " " + str + " " + Toolbox.emsgs(orgnum,1531));
                    return;
                }
                StringBuffer bf = new StringBuffer(2048);
                String aline = null;
                while ((aline = f.readLine()) != null) {
                    bf.append(aline + "\n");
                }
                f.close();
                content = bf.toString();
            }
            catch (Exception e) {
                // empty catch block
            }
            if (content == null) {
                content = "";
            }
        }
        String option = Toolbox.defaultParam(orgnum,request, "option", "", ",+", 100);
        SyntaxFormat sf = new SyntaxFormat(content, option,user);
        if (option.equals("java")) {
            sf.leftd[4] = "import";
        }
        sf.highlihgt();
        sf.lineprocess();
        sf.format();
        String lineheight = "" + Math.floor((double)Integer.parseInt(fontsize) * 1.2 + 2.0);
        String width = "" + Math.floor((float)Integer.parseInt(fontsize) * Toolbox.charwidthrate());
        out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><meta http-equiv=\"Content-Type\" content=\"text/html; charset=" + Toolbox.encodings[orgnum>>16] + "\"><head><style  type=text/css>td{font-family:courier;font-size:" + fontsize + "px}\np{line-height:" + lineheight + "px;}</style></head><body  style=\"background-color:" + cachedstyle.DBGCOLOR + ";margin:5px 5px 0px 5px\"><table align=left>" + "<tr><td  align=right style=color:teal valign=top><p>" + sf.lines.toString() + "</p></td><td  align=left valign=top><p>" + sf.content + "</p></td></tr></table></center></body>");
        out.println("<script > if(window==parent)window.moveTo(screen.width/2 - 300,3);window.resizeTo(602,screen.height-30);</script></html>");
        out.close();
    }
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
    }

    public void destroy() {
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
