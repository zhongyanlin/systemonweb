 
package telaman;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;
import java.util.HashMap;
import java.util.Vector;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
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
import telaman.BackRoutine;
import telaman.DBAdmin;
import telaman.DBConnectInfo;
import telaman.JDBCAdapter;
import telaman.LogicalExp;
import telaman.Toolbox;
import telaman.User;
@WebServlet(name = "Save", urlPatterns = {"/Save"},   asyncSupported = false)
public class Save extends HttpServlet 
{
    
    public static long timestamp = 1111111111;
    public static final Pattern setp = Pattern.compile("[ |\\n|\\r|\\t](?i)set[ |\\n|\\r|\\t]");
    
    public static String lastsql;
    
    //Save.process(c, adapter, v, null, w.postop, saved, str);
    
    public static String process(User c, JDBCAdapter a, String query, java.util.Vector comp,String postop, HashMap saved, StringBuffer str, CachedStyle cachedstyle)
    {
        int orgnum = Toolbox.langnum<<16;
        if (c!=null)   orgnum = c.orgnum;
        
        boolean needhtmlhead = (comp != null);
        boolean states = true, isc=true;
        int k = 0;
        int strleng = 0;
        if (comp == null) {

            strleng = query.length();
            comp = new java.util.Vector<>();
            
            for (int ii = 0; ii < strleng; ii++) {
                if (query.charAt(ii) == '\'')
                    states = !states;
                if (states &&  query.charAt(ii) == ';') {
                    if (ii>k)
                    {    
                        comp.addElement(query.substring(k,ii));
                         
                    }
                    k=ii+1;
                }
            }
            if (k < strleng) comp.addElement(query.substring(k));
        }
        String js = "";

        if (needhtmlhead)
           str.append( "<html lang=\""+Toolbox.langs[orgnum>>16]+"\" >" + Toolbox.getMeta(orgnum).replaceFirst("<sc.*","")   +
                "<body  style=\"background-color:" +  cachedstyle.DBGCOLOR +";margin:5 5 0 5\">");
        str.append( "<table id=\"report\" align=center cellspacing=3 cellpadding=3 width=100% ><tr><td valign=top id=\"summary\"  style=\"border:1px outset\"><table>" );
        JDBCAdapter adapter  = null;
        if (a == null)
            adapter = Toolbox.getUserAdapter(c, c.orgnum);
        else
            adapter = a;
        if (adapter.error().length() != 0)
        {
            str.append( "Error in Save: " + adapter.error());
            adapter.close();
            if(needhtmlhead) str.append( "</body></html>");
            return str.toString();
        }
        timestamp = (new java.util.Date()).getTime()/1000;
        String result = "";
        
        int n1=0, n2=0,    j=0;
        int len = comp.size();
        boolean attention = false;
        int height = 150;
        int mm = 0;
        Vector sqlstates   = new Vector(10);
        int ll = 0;
        boolean allright = true;
        String numstr = "";
        boolean atleastone = false;
        for (int i = 0; i < len  ; i++) 
        {
            String sqlstr = (String)(comp.elementAt(i));
   
            if ( sqlstr.length() < 5) continue;
            sqlstates.clear();
            n1= 0;
            String punc = "";
            if (result.equals("") == false)
                result += ",";
            states = true; 
            isc = false;
            strleng = sqlstr.length();
            k = -1;
            ll = 0;
            String tt = "";
            for (int ii = 0; ii < strleng; ii++) 
            {
                switch(sqlstr.charAt(ii)) 
                {
                    case '\'':
                        states = !states;
                        break;
                    case '#':  case '|': case '}': case '{':  
                        if (states) 
                        {
                            try
                            {
                            if (isc) 
                            {
                                tt += "@" +  ll +"@";
                                sqlstates.addElement(addTime(sqlstr.substring(k+1,ii)));
                                ll++;
                                isc = false;
                            }
                            }catch(Exception e)
                            {
 
                            }
                            tt += sqlstr.charAt(ii);
                            k =ii;
                        }
                        break;
                    case '[':case ']':
                        if (states) 
                        {
                            sqlstates.addElement(addTime( sqlstr.substring(k+1,ii)) );
                            ll++;
                            tt += 'a'; 
                            k = ii;
                        }
                        break;
                    case ' ':case '\n':case '\r':
                        
                        break;
                    default:
                        if (states && !isc) 
                        {
                            k = ii-1;
                            isc = true;
                        }
                        break;
                }
            }
            if (states && isc) 
            {
                tt+=  "@"+ll+"@";
                sqlstates.addElement(addTime(sqlstr.substring(k+1))); 
                ll++;
            }
            int z = 0, sum=0;
            String err = "";

            int d = 0;
            boolean qq = false;

            for (k=0; k < ll; k++) 
            {
                if (sqlstates.elementAt(k).equals("[")) 
                {
                    d = k+1;
                } 
                else if (sqlstates.elementAt(k).equals("]")) 
                {
                    try 
                    {
                        String [] zz = new String[k-d];
                        for (int y=0; y < zz.length; y++)
                        {
                            zz[y]=(String)(sqlstates.elementAt(y+d));
                         
                        }
                        qq = adapter.transacte(zz, 0, k-d);

                    } 
                    catch(Exception e){}
                    if (qq ==true) 
                    {
                        sum+= k-d;
                        tt = tt.replaceFirst("a[^a]+a","1");
                    } 
                    else 
                    {
                        tt = tt.replaceFirst("a[^a]+a","0");
                        err +=    adapter.error().replaceAll("</script>","< /script>");
                    }
                } 
                else 
                {
                    String sqi = (String)(sqlstates.elementAt(k));
                    z = adapter.executeUpdate(sqi); 
                    err +=    adapter.error().replaceAll("</script>","< /script>");
           
                    if (z >= 0)
                    { 
                        sum += z;
                        tt = tt.replaceFirst("@"+k+"@","1");
                        
                    } 
                    else 
                    {
                        if (adapter.error().length() > 0)
                        {
                            tt = tt.replaceFirst("@"+k+"@","0"); 
                            err +=    adapter.error().replaceAll("</script>","< /script>");
                        }
                        else 
                        {
                          tt = tt.replaceFirst("@"+k+"@","1"); sum++;  
                        }
                        punc = ((String)(sqlstates.elementAt(k)));
                    }
                   
                }
            }
             
            qq = LogicalExp.eval(tt);
            atleastone = qq || atleastone;
             String[] generr = Toolbox.emsgs(orgnum,951).split("\\.");
            if ( qq == false) 
            {
                if (   (c.roles & Systemroles.SYSTEMANALYST) == 0  && err.length() > 0) 
                {
                   punc = punc.trim().toLowerCase();
                   if (punc.indexOf("insert")==0)
                     err = generr[0];
                   else if (punc.indexOf("update")==0)
                     err = generr[1];
                   else if (punc.indexOf("delete")==0)
                     err = generr[2];
                   else err = Toolbox.emsgs(orgnum,745);
                }
                //js +=    "es[" + mm + "] = \""  +  Generic.handle(err) + "\";\n";
                if (len>1)numstr = "" + (i+1) + ". ";
                if (err.length() != 0)
                   str.append( "<tr><td nowrap=noWrap style=\"color:blue;cursor:pointer\" onclick=\"javascript:self.document.getElementById('errdetail').innerHTML=this.innerHTML.replace(/^[^<]+<!../,'').replace(/..>$/,'')\">" + numstr
                              + Toolbox.emsgs(orgnum,75) + "<!--" + err + "--></td></tr>");
                else
                   str.append(  "<tr><td>" + numstr  + Toolbox.emsgs(orgnum,71) +"</td></tr>");
                height += 30;
                attention = true;
                result += "-1";
                allright=false;
            } 
            else 
            {
                if (len>1)numstr = "" + (i+1) + ". ";
                if (sum == 0) 
                {
                    str.append( "<tr><td ><nobr>" + numstr +" 0 " + Toolbox.emsgs(orgnum,145) + "</nobr><tr><td>");
                    result += "0";
                    allright=false;
                } 
                else 
                {
                    result += sum ;
                    str.append( "<tr><td>" + numstr +" " +  sum + " " + Toolbox.emsgs(orgnum,145) + "<tr><td>");
                }
                height += 30; 
            } 
        }

        if (height > 600) 
        {
            height = 600;
        }
        else if (height < 300) 
            height=300;
        int vertical= (600-height)/2;

       str.append( "</table></td><td id=\"errdetail\" valign=top style=\"border:1px outset\">&nbsp;</td></tr><tr><td colspan=2>");
       String savingname = "";
        
       if (atleastone && postop!=null)
       {
           if (Toolbox.edition.contains("Personal") && postop.equals("createdb"))
           {
               postop = "assigndb";
           }
        
           savingname = BackRoutine.postproc(c,adapter,postop,saved,str,cachedstyle);
       }
       adapter.close();
       if (savingname.equals(""))
       {
       savingname = "inline;filename=saveresult.html";
       str.append( "</td></tr></table>\n<script  type=text/javascript>\nfunction pop(str)\n");
       str.append( "{\nvar hasalert=(typeof(promptwin)!='undefined' && promptwin!=null);");
       str.append( "if (hasalert)promptwin.style.width='600px';else window.resizeTo(600,600);");
       str.append( "\ndocument.getElementById(\"errdetail\").innerHTML='<p style=\"margin:2 2 2 2\">'+ str +'</p>'; ");
       str.append( "if (hasalert){promptwin.style.height = (document.getElementById(\"errdetail\").offsetHeight + 40) + 'px';centerlizeit();}\n}\n");
       str.append( "\nvar ss='<table cellpadding=3 cellspacing=3>' + document.getElementById('report').innerHTML +'</table>'; ");
       str.append( "\nvar es = new Array();\n" + js );
       str.append( "if (parent.syn)parent.syn('" + result +"',ss,es); else if (opener!=null && opener.syn) opener.syn('"+result +"',ss,es);\n");

       str.append( "</script>");
       if(needhtmlhead) str.append( "</body></html>");
       }
       return savingname;
    }
    
    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
        HttpSession session = request.getSession(true);
        int orgnum = Toolbox.setcharset(request, response);
        if (orgnum == -1) return;
        CachedStyle cachedstyle = new CachedStyle(request, orgnum);
        PrintWriter out = response.getWriter();
        if (!Toolbox.verifytoken(request)) 
        {
            out.println(Toolbox.emsgs(orgnum,1404));
            out.close();
            return;
        }
       
        User c = (User)session.getAttribute("User");
        String query = Toolbox.defaultParam(orgnum,request, "wcds", "");
        String subdb = Toolbox.defaultParam(orgnum,request, "subdb", "", null, 30);
        if (c == null) {
            session.setAttribute("wcds", (Object)(subdb + " " + query));
            RequestDispatcher dispat = this.getServletConfig().getServletContext().getRequestDispatcher("/login.jsp?follow=Q&error=generic&orgnum=" + orgnum);
            dispat.forward((ServletRequest)request, (ServletResponse)response);
            return;
        }
        orgnum=c.orgnum;
        if (c.id.equals(subdb) && (c.roles & Systemroles.SYSTEMANALYST) > 0 || subdb.equals("") && (c.roles & Systemroles.TEACHINGADMIN) > 0) {
            c.changedb(subdb);
            StringBuffer str = new StringBuffer();
            String savingfile = Save.process(c, null, query, null, null, null, str, cachedstyle);
            response.addHeader("Content-Disposition", savingfile);
            out.print(str.toString());
            out.close();
        } else {
            
            out.print("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><body  style=\"background-color:" + cachedstyle.DBGCOLOR + ";margin:5px 5px 0px 5px\">Unauthorized Access to database " + subdb + ".  Your role code is " + c.roles);
            out.close();
        }
        session.removeAttribute("wcds");
    }

    private static int sum(int[] x, int k) {
        int y = x[0];
        for (int i = 1; i < k; ++i) {
            if (x[i] <= 0) continue;
            y+=x[i];
        }
        return y;
    }

    /*
     * Enabled force condition propagation
     * Lifted jumps to return sites
     */
    static String addTime(String sql) {
        if (!DBAdmin.sysonwebdb) return sql;
        if (sql == null) return sql;
        if (sql.length() < 6) {
            return sql;
        }
        sql = sql.trim();
        Matcher m = null;
        boolean tt = false;
        int L = sql.length();
        if (sql.substring(0, 6).toLowerCase().equals("update")) {
            int i;
            int k = 0;
            for (i = 7; i < L && sql.charAt(i) == ' '; ++i) {
            }
            k = i;
            if (i == L) {
                return sql;
            }
            for (; i < L && (Character.isLetterOrDigit(sql.charAt(i)) || sql.charAt(i) == '_'); ++i) {
            }
            try {
                m = Save.setp.matcher((CharSequence)sql);
                if (!m.find()) return sql;
                int z = m.end();
                if (z <= 0) return "";
                if (z == sql.length()) {
                    return "";
                }
                String qq = sql.substring(z).trim();
                if (qq.equals("")) return "";
                if (qq.toLowerCase().indexOf("where ") != 0) return m.replaceFirst(" SET " + sql.substring(k, i) + ".lastupdate=" + Save.timestamp + ",");
                return "";
            }
            catch (Exception e) {
                
                return "";
            }
        }
         
        if (!sql.substring(0, 6).toLowerCase().equals("insert")) return sql;
        int N = sql.length();
        StringBuffer y = new StringBuffer(N+29);
        int state = 0; int i, k=-1;
        char X[] = new char[]{'v','a','l','u','e','s'};
        char Y[] = new char[]{'s','e','l','e','c','t'};
        for (i=0; i < N; i++)
        {
            char c = sql.charAt(i);
            if (state == 0)
            {
                if (c == '\'')
                {
                    state = -1;
                }
                else if ( c == ')' || c == ' ' || c == '\n'|| c == '\r' || c == '\t' )
                {
                    state = 1; 
                }
                else if (c == '(')
                {if(k==-1)  k = i;}
            }
            else if (state == -1)
            {
                if (c == '\'')
                {
                    state = 0;
                }
            }
            else if (state == 1)
            {
                if (c == '\'')
                {
                    state = -1;
                }
                else if ( c == ')' || c == ' ' || c == '\n'|| c == '\r' || c == '\t' )
                {
                    
                }
                else if ( c == 'v' || c == 'V')
                {
                    state = 2; 
                }
                else if ( c == 's' || c == 'S')
                {
                    state = 12; 
                }
                else 
                {
                    state = 0;
                    if (c == '(') 
                    {if(k==-1)  k = i;}
                }
            }
            else if (state>= 2 && state < 7)
            {
                if (c == '\'')
                {
                    state = -1;
                }
                else if ( Character.toLowerCase(c) == X[state-1])
                {
                    state++; 
                }
                else 
                {
                    state = 0;
                    if (c == '(') {if(k==-1)  k = i;}
                }
            }
            else if (state == 7||state == 8)
            {
                if (c == '\'')
                {
                    state = -1;
                }
                else if ( c == ' ' || c == '\n'|| c == '\r' || c == '\t')
                {
                    state = 8;
                }
                else if  ( c == '(')
                {
                    if (k == -1 || sql.substring(k,i+1).toLowerCase().replaceAll("[ |\t|\n|\r]","").replace('(', ',').replace(')', ',').indexOf(",lastupdate,")>=0)
                        return sql; 
                    
                    y.append(sql.substring(0, k+1));
                    y.append("lastupdate,");
                    y.append(sql.substring(k+1,i+1));
                    y.append(Save.timestamp + ",");
                    y.append(sql.substring(i+1)); 
                    return y.toString();
                }
                else
                {
                    state = 0;
                     if (c == '(') {if(k==-1)  k = i;}
                }
            }
             
            else if (state>= 12 && state < 17)
            {
                if (c == '\'')
                {
                    state = -1;
                }
                else if ( Character.toLowerCase(c) == Y[state-11])
                {
                    state++; 
                }
                else 
                {
                    state = 0;
                    if (c == '(')  {if(k==-1)  k = i;}
                }
            }
            else if (state == 17)
            {
                if (c == '\'' ||  c == ' ' || c == '\n'|| c == '\r' || c == '\t'|| c == '(')
                {
                    if (k == -1 || sql.substring(k,i).toLowerCase().replaceAll("[ |\t|\n|\r]","").replace('(', ',').replace(')', ',').indexOf(",lastupdate,")>=0)
                        return sql; 
                    
                    y.append(sql.substring(0, k+1));
                    y.append("lastupdate,");
                    y.append(sql.substring(k+1,i)+" ");
                    y.append(Save.timestamp + ",");
                    y.append(sql.substring(i)); 
                    return y.toString();
                }
                else
                {
                    state = 0;
                }
            }
        }
        return sql; 
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
