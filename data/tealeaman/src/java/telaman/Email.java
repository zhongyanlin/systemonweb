 
package telaman;

//import com.sun.net.ssl.internal.ssl.Provider;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.InetAddress;
import java.security.Security;
import java.util.Properties;
import javax.activation.*;
import javax.mail.*;
import javax.mail.internet.*;
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import static telaman.DataRestore.chatcourse;
 
@WebServlet(name = "Email", urlPatterns = {"/Email"},   asyncSupported = false)
 
public class Email extends HttpServlet 
{
    public static int tid = -1;
    public static Msgboxrun mq = null;
    public static String sek = null;
    static final public String chatsendcellsms = "Send cell SMS";
    public static void postSMS(String nsmsg)
    {
        if (sek!=null )
        {
            mq = Msgboxrun.get("chat"+chatsendcellsms);
        }    
        if (mq!=null && sek!=null)
        {
            Msg m= new Msg(tid, "admin0", null, null, "plain", nsmsg, System.currentTimeMillis(), 1); 
            mq.dropmsg(m.toString());
        }
    }
     
    public static String postMail(String[] recipients, String subject, String message, String from, String attachment, int orgnum)  
    {
        
        boolean debug = false;
        int k = 0;
        String bad = "";
        
      
        StringBuffer alladd = new StringBuffer("");
        for (int i = 0; i < recipients.length; ++i) 
        {
            try 
            {
                InternetAddress dd = new InternetAddress(recipients[i]);
                dd.validate();
                if (alladd.length() > 0) alladd.append(",");
                alladd.append(recipients[i]);
                ++k;
                continue;
            }
            catch (Exception e) 
            {
                bad = bad + "," + recipients[i];
                
            }
        }
        if (k == 0) return bad;
        if (!bad.equals("")) bad =  Toolbox.emsgs(orgnum,115) + " " + bad;
        String encoding = Toolbox.encodings[orgnum>>16];
        String sender = Toolbox.dbadmin[orgnum%65536].stmpuser.replaceFirst("@.*","")
                +  "@" + Toolbox.dbadmin[orgnum%65536].stmphost.replaceFirst(".*\\.([^\\.]+\\.[^\\.]+)", "$1");
        InternetAddress sd = null;
        //from = sender;
        try 
        {
            sd = new InternetAddress(sender);
            sd.validate();
            
        }
        catch (Exception e) 
        {
            try{sd = new InternetAddress(from);}catch(Exception e1){ }
        }
        int port[] = new int[]{Toolbox.dbadmin[orgnum%65536].port,0,0};
        if (port[0] == 25){port[1] = 587; port[2] = 465;} 
        if (port[0] == 587){port[1] = 25; port[2] = 465;} 
        if (port[0] == 465){port[1] = 587; port[2] = 25;} 
        String bad1 = ""; 
        boolean sent = false;
        for (int q=0; q < 3; q++)
        {
           
            try
            {
                //Security.addProvider(new Provider());
                Properties props = new Properties();
                props.put("mail.mime.charset",  encoding);
                props.put("mail.smtp.starttls.enable","true");
                props.put("mail.smtp.host", Toolbox.dbadmin[orgnum%65536].stmphost);
                props.put("mail.smtp.auth", "true");
                props.put("mail.smtp.port", "" + port[q]);
                
              /* else 
                {
                    smtp_port = 465;
                    props.put("mail.smtps.starttls.enable","true");
                    props.put("mail.smtps.auth", "true");
                    props.put("mail.smtps.host", Toolbox.dbadmin[orgnum%65536].stmphost);
                    props.put("mail.smtps.port", "" + smtp_port); 
                    props.put("mail.smtp.socketFactory.port",  "465");
                    props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
                }*/
                
               // props.put("mail.smtp.socketFactory.port",  "465");
               // props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
                
               // SMTPAuthen auth = new SMTPAuthen(orgnum);
                //System.out.println(Toolbox.dbadmin[orgnum%65536].stmpuser + "\n" + Toolbox.dbadmin[orgnum%65536].stmppass);
                Session session = Session.getInstance((Properties)props);//, (Authenticator)auth);
                session.setDebug(debug);
                MimeMessage msg = new MimeMessage(session);
                if (sd!=null)
                {
                    msg.setFrom((Address)sd);
                }
                
                msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(alladd.toString()));
                msg.setSubject(subject);

                Transport transport =  transport = session.getTransport("smtp");
                 
                try{ 
                   transport.connect (Toolbox.dbadmin[orgnum%65536].stmphost, port[q], Toolbox.dbadmin[orgnum%65536].stmpuser, Toolbox.dbadmin[orgnum%65536].stmppass);
                }catch(Exception e2)
                {
                    try{ 
                    transport.connect (Toolbox.dbadmin[orgnum%65536].stmphost, port[q], Toolbox.dbadmin[orgnum%65536].stmpuser.replaceFirst("@.*$",""), Toolbox.dbadmin[orgnum%65536].stmppass);
                    }catch(Exception e3){
                    continue;
                }
                    
                }
                if (attachment != null && !attachment.equals("") && (new File(attachment)).exists() == false)
                {
                    BodyPart messageBodyPart = new MimeBodyPart();
                    messageBodyPart.setText(message);
                    Multipart multipart = new MimeMultipart();
                    multipart.addBodyPart(messageBodyPart);
                    messageBodyPart = new MimeBodyPart();
                    DataSource source = new FileDataSource(attachment);
                    messageBodyPart.setDataHandler(new DataHandler(source));
                    messageBodyPart.setFileName(attachment.substring(attachment.lastIndexOf(File.separator )+1)); 
                    multipart.addBodyPart(messageBodyPart);
                     
                }
                msg.setContent(message, "text/plain;charset=" +  encoding);
                transport.sendMessage(msg, msg.getAllRecipients());
                transport.close(); 
                Toolbox.dbadmin[orgnum%65536].port = port[q];
                sent = true;
                break;
            }
            catch(Exception e)
            {
                bad1 += "port=" +  port[q] + ":" +  e.toString() + "<br>";
            }
            
        }
        if (sent)
        return bad;
        else return bad + "<br>" +  bad1;
         
    }
        
     
    public static void notice(int orgnum) 
    {
        String emailMsgTxt = "";
        try 
        {
            InetAddress addr = InetAddress.getLocalHost();
            emailMsgTxt = addr.toString();
        }
        catch (Exception e) 
        {
            return;
        }
        String emailSubjectTxt = "telemann restart";
        String emailFromAddress = Toolbox.dbadmin[orgnum%65536].stmpuser;
        String[] emailList = new String[]{Toolbox.dbadmin[orgnum%65536].stmpuser + "@" 
                + Toolbox.dbadmin[orgnum%65536].stmphost.replaceFirst(".*\\.([^\\.]+\\.[^\\.]+)", "$1")};
        try 
        {
            Email.postMail(emailList, emailMsgTxt, emailSubjectTxt, emailFromAddress,null, orgnum);
        }
        catch (Exception e) 
        {
            // empty catch block
        }
    }

    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
        int i;
        String content;
        HttpSession session = request.getSession(true);
        int orgnum = Toolbox.setcharset(request, response);
        if (orgnum == -1) return;
        CachedStyle cachedstyle = new CachedStyle(request, orgnum);
        PrintWriter out = response.getWriter();
        User user  = User.authorize(orgnum, Systemroles.TOTAL, this.getServletConfig().getServletContext(), session, request, response, "Email", true);
        if (user == null) {
            return;
        }
        orgnum = user.orgnum;  
        String[] fields = new String[]{"email"};
        String[] dd = User.getAttribute(user.orgnum,user.id, fields);
        String from = Toolbox.dbadmin[orgnum%65536].stmpuser +  "@" + Toolbox.dbadmin[orgnum%65536].stmphost.replaceFirst(".*\\.([^\\.]+\\.[^\\.]+)", "$1");
        if (dd != null) 
        {
            from = dd[0];
        }
        String id =null;
        String emaildis = Toolbox.defaultParam(orgnum,request, "email", null, "@_,-", 10000);
        String phonens = ""; 
        String[] emailadds = null;
        JDBCAdapter adapter = null;
        if (emaildis != null) {
            emailadds = emaildis.split(",");
        } 
        else 
        {
           
            if ((id = Toolbox.defaultParam(orgnum,request, "UserId", null)) == null) {
                id = Toolbox.defaultParam(orgnum,request, "To", null);
            }
            if (id == null) {
                id = Toolbox.defaultParam(orgnum,request, "sid", null);
            }
            if (id == null) {
                id = Toolbox.defaultParam(orgnum,request, "SID", null);
            }
            
            if (id != null) 
            {
                id = id.trim().replaceAll("[ |,|;]+", ",");
                String sql = "SELECT email,phone FROM AppUser WHERE id IN ('" + id.replaceAll(",","','") + "')";
              
                adapter =  Toolbox.getSysAdapter(user.orgnum);
                boolean bm = adapter.executeQuery2(sql,false);
                if (bm && adapter.getValueAt(0,0)!=null)
                {
                    String idstr = "";
                    for (int j=0; adapter.getValueAt(j, 0)!=null; j++)
                    {
                        idstr +=   "," + adapter.getValueAt(j, 0);
                        phonens += " " + adapter.getValueAt(j, 1).replaceAll(" ","");
                    }
                    
                    emailadds = idstr.substring(1).split(",");
                     
                }
                
            } 
        }
        
        String subject = Toolbox.defaultParam(orgnum,request, "Subject", null, "@#$%^&*()+[]{}/;:'\",/", 100);
        if (subject == null) 
        {
            subject = Toolbox.defaultParam(orgnum,request, "subject", "");
        }
        if (subject == null) subject = "no subject";
        if ((content = Toolbox.defaultParam(orgnum,request, "Content", null)) == null) 
        {
            content = Toolbox.defaultParam(orgnum,request, "Message", "");
        }
        String sms = content;
        if (Toolbox.encodings[orgnum>>16].equals("gb2312"))
        {
            if (sms.length()>70) sms = sms.substring(0,70);
        }
        else
        {
            if (sms.length()>140) sms = sms.substring(0,140);
        }
        phonens += ";;" + sms;
        String attach = null;
        if ((attach = Toolbox.defaultParam(orgnum,request, "attach", null)) == null) 
        {
            if ((attach = Toolbox.defaultParam(orgnum,request, "Attach", null)) == null) 
            attach = Toolbox.defaultParam(orgnum,request, "Attachment", null);
        }
        if (attach!=null)
        {
            int j = attach.lastIndexOf(",");
            int k = attach.lastIndexOf("@");
            if (k > 0 && j >0)
            {
                String x = attach.substring(k+1, j);
                String z = "";
                try{ attach = (new Encode6b(orgnum)).rto6b(x); }catch(Exception e){}
            }
        }
        
        orgnum = Toolbox.setcharset(request, response);
    if (orgnum == -1) 
    {
        if (adapter!=null) adapter.close();
        return;
    }
         
        out.print("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><body style=\"background-color:" + cachedstyle.DBGCOLOR + ";margin:5px 5px 0px 5px\"> " );
        if (emailadds==null)
        {
            out.print("No email address");
        }
        else if ( content == null)
        {
            out.print("No message");
        }
        else
        {
            out.println( Toolbox.emsgs(orgnum,1124) + ":<br>");
            for (i = 0; i < emailadds.length; ++i) 
            {
                out.print(emailadds[i]);
                out.print("<br>");
            }
            try 
            {
                
                String s= Email.postMail(emailadds, subject, content, from, attach, orgnum);
                long l = System.currentTimeMillis();
                if (!s.equals("")) out.println("bad " + s + "<br>");
                String url = Toolbox1.url;
                if (url==null || url.equals(""))
                    url = Toolbox1.geturl(request).replaceFirst("Email.*","");
                out.println( hintforSMS(  adapter,  l,  user,  phonens, url, orgnum));
                if (adapter!=null)adapter.close();
            }
            catch (Exception e) 
            {
                out.print(Toolbox.emsgs(orgnum,72) + ":<br>" + Toolbox.removescript(e.toString()));
            }
            
        }
        
        out.print(  "<br><script  type=text/javascript>if (typeof(orgnum)=='undefined')" + Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle) + ";var ss=document.body.innerHTML.replace(/<script.*script>/,'');parent.myprompt(ss );</script>");
        out.println("</body></html>");
    }
    public static String hintforSMS(JDBCAdapter adapter, long l, User user, String phonens, String url, int orgnum)
    {
         String sq = "SELECT attach,lastupdate FROM ChatMsg WHERE sid='" + user.id + "' AND courseid='shortmsg' order by lastupdate";
                int n = 0;
                int x = (int)(Math.floor(Math.random()*10000)); 
                if (x < 1000) x += 1000;
                String xs = "" + x;
               
                String y = "";
                if (adapter!=null) 
                {  
                    boolean bn = adapter.executeQuery2(sq,false);
                    int n1=0;
                    String z; 
                    n=0;
                    while ((z = adapter.getValueAt(n,5))!=null){y=z; n++;}
                if  (y!=null && y.length()==4 && y.replaceFirst("[0-9][0-9][0-9][0-9]","").equals("")) 
                    xs = y;
                
                sq = "DELETE FROM ChatMsg WHERE sid='" + user.id + "' AND courseid='shortmsg'";
                if (adapter!=null) { adapter.executeUpdate(sq);}
                sq = "INSERT INTO ChatMsg(lastupdate,sid,courseid,endtime,content,attach) VALUES("
                        + l + ",'" + user.id + "','shortmsg'," + l + ",'" + phonens.replaceFirst("\\W$", "") + "','" + xs + "')";
                if (adapter!=null){ n=adapter.executeUpdate(sq);}
                return ("<br><a href=\"javascript:(function(){document.getElementById('needsms').style.display='block';})()\">" 
                        + Toolbox.emsgs(orgnum,1555) + "</a><div id=needsms style=display:none>" 
                        + Toolbox.emsgs(orgnum,1553) + "<table style=border-collapse:collapse border=1><tr><td colspan=2>"
                        + url + "smshub.apk</td></tr><tr><td><nobr>" 
                        + Toolbox.emsgs(orgnum,941) + ":</nobr></td><td>"
                        + url + orgnum + "</td></tr><tr><td><nobr>" 
                        + Toolbox.emsgs(orgnum,190) + ":</nobr></td><td>" 
                        + user.id + "</td></tr><tr><td><nobr>"
                        + Toolbox.emsgs(orgnum,1554) + ":</nobr></td><td>"  
                        + xs  + "</td></tr></table></div>" );
                }
                else return "";
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
