/*
 * Decompiled with CFR 0_87.
 * 
 * Could not load the following classes:
 *  javax.servlet.ServletOutputStream
 *  javax.servlet.http.HttpServletResponse
 */
package telaman;

import java.io.File;
import java.io.FileInputStream;
import java.io.PrintWriter;
import java.io.RandomAccessFile;
import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import telaman.Encode6b;
import telaman.ServerAgent;
import telaman.Toolbox;
@WebServlet(name = "BCpp", urlPatterns = {"/BCpp"},   asyncSupported = false) 
public class BCpp extends ServerAgent {
    protected void outputresult(HttpServletRequest request,  HttpServletResponse response, String command, String source, String[] exts, String dir, int exitVal, String subfolder, boolean hasFile, long q, int size) {
        HttpSession session = request.getSession(true);
        try {
            User user = (User)(session.getAttribute("User"));
            if (!hasFile && exts[1] != null && new File(dir + File.separator + source + exts[1]).exists()) {
                int j;
                response.setContentType("application/" + exts[1]);
                response.setHeader("Content-Disposition", "attachment;filename=" + source + exts[1]);
                ServletOutputStream os = response.getOutputStream();
                FileInputStream fin = new FileInputStream(new File(dir + File.separator + source + exts[1]));
                byte[] buf = new byte[2024];
                while ((j = fin.read(buf)) > 0) {
                    os.write(buf, 0, j);
                }
                fin.close();
                os.flush();
                os.close();
                BCpp.clean((String)dir, (String)source);
            } else {
                int orgnum = Toolbox.setcharset(request, response);
                if (orgnum == -1) return;
                CachedStyle cachedstyle = new CachedStyle(request, orgnum);
                PrintWriter out = response.getWriter();
                out.println("<!DOCTYYPE html>\n<html lang=\""+Toolbox.langs[orgnum>>16]+"\" >");
                out.println(Toolbox.getMeta(orgnum));
                out.println("<head>");
                String cl = Toolbox.headercl(cachedstyle.IBGCOLOR);
                out.println("<style type=text/css>.outset2{border-style:outset;border-color:" + cl + ";border-width:2px;background-color:" + cl + "}\n.special {background-color:#8000ff;color:white}\n</style>");
                out.println("<title>" + Toolbox.emsgs(orgnum,74) + "</title>");
                out.println(cachedstyle.toString() + "<link rel=\"stylesheet\" type=\"text/css\" href=\"styleb" + (orgnum) + ".css\">");
                out.println("<script type=text/javascript>" + Toolbox.someconsts(orgnum) + "</script><script type=text/javascript  src=" + Toolbox.getUserLang(orgnum) + " ></script><script type=text/javascript  src=cookie.js></script>");
                out.println("<script type=text/javascript>" + Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle) + ";document.write(unifontstyle(" + Toolbox.defaultFontSize + "));</script>");
            
                out.println("</head>");
                out.println("<body  style=\"background-color:" + cachedstyle.DBGCOLOR + ";margin:5px 5px 0px 5px\">");
                out.println(Toolbox.title(getServletInfo()));
                this.output(source + ".1er", dir, "#CC0000", Toolbox.emsgs(orgnum,75), out, size);
                this.output1(source, dir, out,size);
                if (exts[1] != null && new File(dir + File.separator + source + exts[1]).exists()) 
                {
                    String pathname = "web/" + subfolder.replace(File.separator.charAt(0), '/') + "/" + source + exts[1];
                    out.println("<a href=\"" + pathname + "\">" + source + exts[1] + "</a>");
                    out.println("<script type=text/javascript>opener.syn('" + pathname + "');</script>");
                }  
                String[] list = new File(dir).list();
                boolean k = false;
                long ct = System.currentTimeMillis();
                Encode6b encoder = new Encode6b(orgnum);
                out.println("<div class=outset1 style=\"margin:5px 3px 0px 3px\">");
                for (int j = 0; j < list.length; ++j) 
                {
                    if (ct - new File(dir + File.separator + list[j]).lastModified() > ct - q) continue;
                    out.println("<a href=\"FileOperation?did=" + encoder.to6b(new StringBuilder().append(dir).append(File.separator).append(list[j]).toString()) + "\" target=_blank >" + list[j] + "</a>&nbsp;&nbsp;&nbsp;&nbsp;");
                }
                out.println("</div>");
                out.println("</body>");
                out.println("</html>");
                out.close();
            }
        }
        catch (Exception e) {
            // empty catch block
        }
    }

    void output1(String source, String directory, PrintWriter out,int size) {
        String aline = null;
        String old = "";
        out.println("<div class=outset1  style=\"margin:5px 3px 0px 3px;font-size:" + size +"px;font-weight:bold;font-family:courier;background-color:black;color:white\">");
        try {
            RandomAccessFile f = new RandomAccessFile(directory + File.separator + source + ".1ou", "r");
            int[] rarray = new int[100];
            int N = 0;
            while ((aline = f.readLine()) != null) {
                if (N==0 && aline.indexOf("Borland C++")==0)
                {
                    aline = f.readLine();
                    aline = f.readLine();
                    continue;
                }
                String aline2;
                String aline1 = aline.replaceFirst(source + ".cpp\\s(\\d+):", "<a href=#$1>" + source + ".cpp $1:</a>");
                if (!((aline2 = aline.replaceFirst(".+\\s(\\d+):.*", "$1")).equals(old) || N >= 100)) {
                    try {
                        int ttt = Integer.parseInt(aline2);
                        rarray[N++] = ttt;
                    }
                    catch (Exception e) {
                        // empty catch block
                    }
                    old = aline2;
                }
                out.print(aline1 + "<br>");
            }
            out.print("<br>");
            f.close();
            int jj = 1;
            int ll = 0;
            if (N > 0) {
                int nn = rarray[0];
                f = new RandomAccessFile(directory + File.separator + source + ".cpp", "r");
                while ((aline = f.readLine()) != null) {
                    int kk = jj;
                    out.print("<font color=brown face=courier>  " + jj + " &nbsp;&nbsp;</font>");
                    if (nn == kk) {
                        out.print("<a name=" + nn + "><font face=courier class=special></a>");
                        if (ll + 1 < N) {
                            nn = rarray[++ll];
                        }
                    } else {
                        out.print("<font face=courier>  ");
                    }
                    aline = aline.replaceAll(" ", "&nbsp;");
                    aline = aline.replaceAll("\t", "&nbsp;&nbsp;&nbsp;");
                    out.print(aline.replaceAll("<","&lt;").replaceAll(">","&gt;") + "</font><br>");
                    ++jj;
                }
                f.close();
            }
        }
        catch (Exception e) {
            // empty catch block
        }
        out.println("</div>");
    }
    public String getServletInfo() {
        return "Borland C++";
    }
}
