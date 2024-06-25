 
package telaman;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import telaman.DBAdmin;
import telaman.DBConnectInfo;
import telaman.FileOperation;
import telaman.JDBCAdapter;
import telaman.Sha1;
import telaman.Toolbox;
@WebServlet(name = "Esign", urlPatterns = {"/Esign"},   asyncSupported = false)
public class Esign
extends HttpServlet {
    public static String signrsastr  = null;
    
    
    boolean isget = false;

    

    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession(true);
        int orgnum = Toolbox.setcharset(request, response);
        if (orgnum == -1) return;
CachedStyle cachedstyle = new CachedStyle(request, orgnum);
        String x = Toolbox.defaultParam(orgnum,request, "content", "");
        String feeid = Toolbox.defaultParam(orgnum,request, "feeid", "", null, 30);
        String uid = Toolbox.defaultParam(orgnum,request, "uid", "", null, 30);
        
        JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
        boolean doit = false;
        boolean charge = true;
        long now = System.currentTimeMillis() / 1000;
        double a = 0.0;
         
        {
            String sql;
            int n;
            sql = "SELECT  price from  Fee WHERE   Fee.id=" + feeid;
            if (adapter.executeQuery2(sql,false) == false || adapter.getValueAt(0,0)==null)
            {
                doit = true;
                charge = false;
            } 
            else 
            {
                sql = "SELECT -balance  from Student  WHERE Student.id='" + uid + "'";
                a = Float.parseFloat(adapter.getValueAt(0, 0));
                if (( adapter.executeQuery2(sql,false)) ==false || adapter.getValueAt(0, 0)==null || (double)Float.parseFloat(adapter.getValueAt(0, 0)) <= a) {
                    sql = "SELECT  sum(payamount) from FeeCollect  WHERE uid='" + uid + "' AND paytime >=" + (now - 86400);
                    boolean bn = adapter.executeQuery2(sql,false);
                    try 
                    {
                        if (bn && adapter.getValueAt(0, 0)!=null && (double)Float.parseFloat(adapter.getValueAt(0, 0)) >= a) 
                        {
                            doit = true;
                        }
                    }
                    catch (Exception e) {}
                } 
                else 
                {
                    doit = true;
                }
            }
            if (!charge) 
            {
                adapter.close();
            }
        }
        if (doit && charge) {
            adapter.executeUpdate("UPDATE Student set balance=balance+" + a + " WHERE Student.id='" + uid.replaceAll("'", "''") + "'");
            adapter.executeUpdate("INSERT INTO FeeCharge(lastupdate, uid, feeid, units, chargeamount, chargetime) values(" + now + ",'" + uid.replaceAll("'", "''") + "'," + feeid + ",1," + a + "," + now + ")");
            
        }
        adapter.close();
        if (this.isget) 
        {
            x = Toolbox.c2c(x,orgnum);
        }
        int i1 = x.indexOf("<title>");
        String file = "doc.html";
        if (i1 > 0) {
            int i2;
            if ((i2 = x.indexOf("<", i1+=7)) - i1 > 10) {
                i2 = i1 + 10;
            }
            if (i2 > i1) {
                file = x.substring(i1, i2);
            }
        }
        if (doit && Esign.signrsastr  != null) 
        {
            response.addHeader("Content-Disposition", "attachment;filename=" + file + ".html");
            PrintWriter out = response.getWriter();
          //  String z = "<br><font size=2 color=" + cachedstyle.IBGCOLOR + ">* " + Toolbox.emsg(1118) + request.getRequestURL().toString().replaceFirst("Esign$", "authen.jsp").replaceFirst("SaveBack$", "authen.jsp") + "</font>";
            int j = x.toLowerCase().lastIndexOf("</body></html>");
            String y = (x.replaceAll("<[^>]*>", "").replaceAll("\r","").replaceAll("\n","").replaceAll(" ","").replaceAll("&nbsp;","").replaceAll("\t",  "") + Toolbox.emsgs(orgnum,1401) );
           
            y = Sha1.hash1(Esign.signrsastr+y);
            if (  j > 0 )
                 x = x.substring(0, j) + "<br>" + Toolbox.emsgs(orgnum,1401) + " " + y + "</body></html>"; 
            else
                 x =  x + "\n" + Toolbox.emsgs(orgnum,1401) + " " + y;
            
           out.print(x);
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.isget = true;
        this.processRequest(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.isget = false;
        this.processRequest(request, response);
    }
    
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
    }

    public static void submitReceipt(StringBuffer q, User user , char operation, String semester, String courseid, String assignname, long timesec, String content, String attach, String x, int orgnum,CachedStyle cachedstyle) {
        String file = FileOperation.getFileName(courseid + assignname);
        String formattedcontent = q.toString(); 
        StringBuffer needsign = new StringBuffer();
        q.setLength(0);
        q.append("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" >");
        q.append(Toolbox.getMeta(orgnum).replaceFirst("<sc.*", ""));
        q.append("<head><title>");
        q.append(file);
        q.append("</title></head><body bgcolor=");
        q.append(cachedstyle.DBGCOLOR);
        q.append("><center><h3>");
        String un = Toolbox.dbadmin[orgnum%65536].unitname[orgnum>>16].replaceFirst("/.*$", "");
        q.append(un);
        needsign.append(un);
        q.append("</h3><h2>");
        q.append(Toolbox.emsgs(orgnum,1329));  
        needsign.append(Toolbox.emsgs(orgnum,1329));
        q.append("</h2><table><tr><td align=left colspan=2><b>");
        q.append(Toolbox.emsgs(orgnum,1328));
        needsign.append(Toolbox.emsgs(orgnum,1328));
        q.append("</b></td></tr><tr><td align=left><nobr>");
        q.append(Toolbox.emsgs(orgnum,163));
        needsign.append(Toolbox.emsgs(orgnum,163));
        q.append("</nobr></td><td align=left><b>");
        q.append(user.id);
        needsign.append(user.id);
        q.append("</b></td></tr><tr><td align=left><nobr>");
        q.append(Toolbox.emsgs(orgnum,637));
        needsign.append(Toolbox.emsgs(orgnum,637));
        q.append("</nobr></td><td align=left><b>");
        x = operation == 'u' ? Toolbox.emsgs(orgnum,29) : Toolbox.emsgs(orgnum,51);
        q.append(x);
        needsign.append(x);
        q.append("</b></td></tr><tr><td align=left><nobr>");
        q.append(Toolbox.emsgs(orgnum,1004));                 
        needsign.append(Toolbox.emsgs(orgnum,1004));
        q.append("</nobr></td><td align=left><b>");
        q.append(semester);                         
        needsign.append(semester);  
        q.append("</b></td></tr><tr><td align=left><nobr>");
        q.append(Toolbox.emsgs(orgnum,982)); 
        needsign.append(Toolbox.emsgs(orgnum,982));
        q.append("</nobr></td><td align=left><b>");
        q.append(courseid);  
        needsign.append(courseid);
        q.append("</b></td></tr><tr><td align=left><nobr>");
        q.append(Toolbox.emsgs(orgnum,500)); 
        needsign.append(Toolbox.emsgs(orgnum,500)); 
        q.append("</nobr></td><td align=left><b>");
        q.append(assignname);  
        needsign.append(assignname); 
        q.append("</b></td></tr><tr><td align=left><nobr>");
        q.append(Toolbox.emsgs(orgnum,986));  
        needsign.append(Toolbox.emsgs(orgnum,986));
        q.append("</nobr></td><td align=left><b>");
        q.append(Toolbox.timestr(timesec));   
        needsign.append(Toolbox.timestr(timesec)); 
        q.append("</b></td></tr><tr><td align=left valign=top><nobr>");
        q.append(Toolbox.emsgs(orgnum,53));   
        needsign.append(Toolbox.emsgs(orgnum,53)); 
        q.append("</nobr></td><td align=left>");
        needsign.append(content.replaceAll("<[^>]+>", ""));
        if (formattedcontent.equals("")) 
        {
            q.append("<pre>" + Toolbox.formatstr("0", content) + "</pre>"); 
        }
        else
        {
            q.append(formattedcontent);
        }
        q.append("</td></tr><tr><td align=left><nobr>");
        q.append(Toolbox.emsgs(orgnum,355));    
        needsign.append(Toolbox.emsgs(orgnum,355));
        q.append("</nobr></td><td align=left>");
        if (attach == null) 
        {
            attach = "";
        }
        q.append(attach);    
        needsign.append(  attach); 
        q.append("</td></tr><tr><td align=left><nobr>");
        q.append(Toolbox.emsgs(orgnum,1401));    
        needsign.append(Toolbox.emsgs(orgnum,1401));
        q.append("</nobr></td><td align=left>");
         x = "";
         try
        {
            String pure =  needsign.toString().replaceAll("<[a-z][^>]+>", "").replaceAll("<\\/[a-z][^>]*>", "").replaceAll("\r","").replaceAll("\n","").replaceAll(" ","").replaceAll("\t",  "");
            x = Sha1.hash1( Esign.signrsastr  + pure ) ;
            System.out.println(pure + "|");
        }catch(Exception e){}
        
        q.append(x);
         
        q.append("</td></tr></table><script  type=text/javascript>if (typeof(orgnum)=='undefined')var orgnum=" +  orgnum+ ";if(parent.opener!=null&&typeof(parent.opener.syn)!='undefined')parent.opener.syn('1');</script></body></html>");
        
       
    }

    public String getServletInfo() {
        return "Short description";
    }
}
