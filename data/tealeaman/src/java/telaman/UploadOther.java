 
package telaman;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Scanner;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
 
@WebServlet(name = "UploadOther", urlPatterns = {"/UploadOther"},   asyncSupported = false) 
public class UploadOther extends UploadFile
{

    static public long MaxUploadSize = 8000000;
    private Object sessionlock = new Object();
    boolean detail(String whichc, int k)
    {
        if (whichc==null) return k>=4;
        return whichc.indexOf( ";" + k + ":detail;") >= 0;
    }
    String gradec(String whichc,String []x )
    {
        
        if (whichc==null) 
        {
            if (x.length < 4) return "";
            return x[3];
        }
        for (int k=0; k < x.length; k++)
        if (whichc.indexOf( ";" + k + ":score;") >= 0 ) 
            return x[k];
        return  "";
    }
    String pad(String w, int n)
    {
        for (int i=w.length(); i < n; i++)
            w += " ";
        return w + " ";
    }
    boolean match(String[] y, String[] x, String whichc)
    {
        if (whichc==null)
        {
            whichc = ";0:lastname;2:email;";
        }
        String lastname = y[0].trim();
        String email = y[1].trim();
        String sid = y[2].trim();
        boolean b = true;
        for (int k=0; k < x.length; k++)
        {
            if (whichc.indexOf( ";" + k + ":lastname;") >= 0) 
            {
                if(!lastname.equalsIgnoreCase(x[k].trim())) 
                        return false;
            }
            else if (whichc.indexOf( ";" + k + ":email;") >= 0) 
            {
                if( !email.equalsIgnoreCase(x[k].trim()))
                    return false;
            }
            else if (whichc.indexOf( ";" + k + ":sid;") >= 0) 
            {
                if (!sid.equalsIgnoreCase(x[k].trim()))
                    return false;
            }
        }
        return true;
    }
    @Override
    public void doPost(HttpServletRequest  request, HttpServletResponse  response)
        throws ServletException, IOException
    {
        HttpSession session = request.getSession(true);
        int orgnum = Toolbox.setcharset(request, response);
        if (orgnum == -1) return;
CachedStyle cachedstyle = new CachedStyle(request, orgnum);
        response.setContentType("text/html;charset=" + Toolbox.encodings[orgnum>>16]);
        User user = (User) (session.getAttribute("User"));
        String msg = "",str = "";
        if (user == null || user.orgnum!=orgnum)
        {
            try 
                {
                    RequestDispatcher dispat = request.getServletContext().getRequestDispatcher("/login.jsp?error=generic&orgnum=" + orgnum + "&follow=R" );
                    dispat.forward( request,  response);
                }
                catch (Exception e) 
                {
                }
            return;
        }
        else if  (user.orgnum!=orgnum || Systemroles.owndb(user.roles) == false && (user.iid == null || user.iid.equals("")) && (user.roles & Systemroles.INTERNAL) == 0)  
        {
            msg =  errmsg("No permission");
        }
        else
        {
            HashMap<String,String> params = new HashMap(10);
            ServletInputStream servletinputstream = request.getInputStream();
            String encoding = request.getCharacterEncoding();
            String conttype = UploadFile.getConttype(request);
            UploadFile.readParameters(params, servletinputstream, encoding, conttype);
            String langcode = (String)params.get("langcode");
            String longFileName = Toolbox.validate((String) (params.get("filename")), "@#$-+/\\:", 150);
            String shortFileName = FileOperation.getFileName(longFileName);
            File tempfile = null;
            String ss="";
            String err="";
            JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
            if (!shortFileName.endsWith(".csv") )
            {
                err = "Wrong file:" + shortFileName;
            }
            else try
            {
                String tempuploadfolder = Toolbox.dbadmin[user.orgnum%65536].webFileFolder + File.separator + "tempupload";
                tempfile = Uploadfile(params, tempuploadfolder, conttype, servletinputstream, langcode, MaxUploadSize);
                String  subdb = (String) (params.get("subdb"));
                String  csname = (String) (params.get("csname"));
                String  whichc = (String) (params.get("whichc"));
                int j = csname.lastIndexOf("-");
                String cid = csname.substring(0,j);
                String sessionname = csname.substring(j+1);
                String  item = (String) (params.get("item"));
                 
                String sql = "SELECT lastname,email, sid from AppUser, Registration WHERE courseid='" + cid + "' AND sessionname='" 
                        + sessionname + "' AND semester='" +  Toolbox.dbadmin[user.orgnum%65536].currentSemester + "' and  AppUser.id=Registration.sid order by sid";
                boolean b = adapter.executeQuery2(sql,false);
                
                if (!b ||  adapter.getValueAt(0, 0)==null) 
                {
                    msg +=(sql);
                    err += "cid=" + cid + ",session=" + sessionname;
                   
                }
                else
                {
                    java.util.ArrayList<String[]> lfi = new java.util.ArrayList();
                    for ( j=0; adapter.getValueAt(j, 0)!=null; j++)
                    {
                        String[] x = new String[3];
                        x[0] = adapter.getValueAt(j,0);
                        x[1] = adapter.getValueAt(j,1);
                        x[2] = adapter.getValueAt(j,2);
                        lfi.add(x); 
                        
                    }
                    long ll = System.currentTimeMillis()/1000; 
                    Scanner s =  new Scanner(tempfile);
                    str  = s.useDelimiter("\\Z").next();
                    s.close();
                    tempfile.delete();
                    CSVParse p = new CSVParse(str, '"', new String[]{",","\n"});
                    String [] x,  h=null; 
                    int m = 0;
                    while ( (x = p.nextRow()) !=null)
                   {
                        if ( x.length <5) 
                        {
                            msg += "file is invalid";
                            continue;
                        }
                        if (m ==0)
                        {
                             StringBuffer question = new StringBuffer("Reading Activities<br>\n");
                             int N = 1;
                             for (int k=0; k < x.length  ; k++)
                             {
                                 if (detail(whichc, k)){
                                 question.append(N++);
                                 question.append("  ");
                                 question.append(x[k].trim());
                                 question.append("<br>\n");
                                 }
                             }
                             N = 1;
                             StringBuffer assess = new StringBuffer();
                             for (int k=0; k < x.length ; k++)
                             {
                                 if (detail(whichc, k)){
                                 assess.append(N++);
                                 assess.append(",10,;");
                                 }
                             }
                             sql = "Update Assignment SET  lastupdate=" + ll + ", due=" + (ll ) + ", question='"
                                    + question.toString().replaceAll("'", "''") + "',answer='',format='1',status=2,atype=0,scale=100,weight=5,assgroup='Reading'"      
                                    + ",grader='" + subdb + "',assess='" + assess + "', attach='', latepermit='',timesplit=NULL "
                                    + "  WHERE name='" + item + "' AND course='" + cid + "' AND semester='" +  Toolbox.dbadmin[user.orgnum%65536].currentSemester  + "' AND sessionname='" 
                                    + sessionname + "' ";
                            if (adapter.executeUpdate(sql)!=1)
                            {
                                msg += adapter.error();
                               // err += "The question part has to be \"Not Documented\"";
                                break;
                            }
                            h = x;
                        }
                        else
                        {
                            String grade = "";
                            for ( j=0; j < lfi.size(); j++)
                            {
                                String lastname = lfi.get(j)[0];
                                String email = lfi.get(j)[1];
                                String sid = lfi.get(j)[2];
                              
                                if (match(lfi.get(j),x,whichc))
                                {    
                                     grade = gradec(whichc,x).trim();
                                     float f = 0.0F;
                                     if (grade.length() > 3)
                                     try
                                     {
                                          f = Math.round(10*Float.parseFloat(grade.trim()))/10.0F;
                                          grade = ""+f; 
                                          grade = grade.replaceFirst("\\.0$", "");
                                     }
                                     catch(Exception e){}
                                     ss += "['" + sid + "','" + grade + "'],";
                                     StringBuffer content = new StringBuffer();//"<table border=1 style=border-collapse:collapse >");
                                     int k; 
                                     int N = 1;
                                     StringBuffer assess = new StringBuffer();
                                     for ( k=0; k < x.length; k++)
                                     {
                                         if (detail(whichc, k))
                                         {
                                             f = 0.0F;
                                             try
                                             {
                                                 f = Math.round(10*Float.parseFloat(x[k].trim()))/10.0F;
                                             }
                                             catch(Exception e){break;}
                                             //content.append("<tr><td>");
                                             content.append(pad(h[k],30)  );
                                           //  content.append("</td><td>");
                                             content.append(f);
                                             content.append("\r\n");
                                             assess.append(N);
                                             assess.append(",10,");
                                             assess.append(f);
                                             assess.append(",;");
                                         }
                                     }
                                     
                                     
                                     N = 1;
                                     for (  k=0; k < x.length; k++)
                                     {
                                         if (detail(whichc, k)){
                                        }
                                     }
                                     if (!grade.equals("") && !grade.equals("0")) 
                                     {
                                          sql = "DELETE FROM Submission WHERE semester='" + Toolbox.dbadmin[user.orgnum%65536].currentSemester
                                                 + "' AND course='" + cid + "' AND assignname='" + item + "' AND sid='" + sid + "'";
                                         if (adapter.executeUpdate(sql) < 0)
                                         {
                                             msg += "<!--" + (adapter.error()) + "--><br>";
                                         }
                                         else
                                         {
                                             sql = "INSERT INTO Submission (lastupdate,sid,semester,course,assignname,content,comment,grade,submtime,format,attach, assess ) values (" + ll + ",'" + sid + "','" +  Toolbox.dbadmin[user.orgnum%65536].currentSemester
                                                 + "','" + cid + "','" + item + "','" + content.toString().replaceAll("'","''") 
                                                 + "','zybooks.com'," + grade + "," + ll + ",'0','','" + assess + "')";
                                             if (adapter.executeUpdate(sql)!=1)
                                             {
                                                 msg += "<!--" + (adapter.error()) + "--><br>";

                                             } 
                                         }
                                     }
                                     break;
                                }
                            }
                            if (grade.equals("")) 
                            {
                                if (err.equals(""))
                                {
                                     err += "<tr>";
                                     for (int k=0; k < x.length; k++)
                                     err +="<td>" + h[k].trim() + "</td>";
                                     err += "</tr>";
                                }
                                err += "<tr>";
                                for (int k=0; k < x.length; k++)
                                    err +="<td>" + x[k].replaceFirst("\\.([0-9]).*$",".$1").replaceAll("[\n|\r|\t]", "") + "</td>";
                                err += "</tr>";
                            }
                        }
                        m++;
                    }
                }
            }
            catch(Exception e){
               msg += e.toString();
            }
            adapter.close();
            if (tempfile!=null) 
            {
                if (ss.equals("") && err.equals(""))
                {
                    msg += str;
                }
            }
            msg += "<script>parent.setbackf([" + ss.replaceFirst(",$","") + "],'" + err.replace('\'',' ') + "');</script>";
            printout(response, msg, orgnum); 
        }
    }
}