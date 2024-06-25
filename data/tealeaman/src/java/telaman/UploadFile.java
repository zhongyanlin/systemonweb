 
package telaman;

import java.io.*;
import java.util.HashMap;
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
 
@WebServlet(name = "UploadFile", urlPatterns = {"/UploadFile"},   asyncSupported = false) 
public class UploadFile
extends HttpServlet {
    public static long MaxUploadSize = 81000000;
    protected static String separator = "";
    protected static String newline = "\n";
    protected static final Object newfilelock = new Object();
    protected static final Object renamefilelock = new Object();
    
    protected static int HOW_LONG = 2;
    protected static int fnum = 0;
    static public String[] pfolders = null;
    static public void makepfolder()
    {
        if (pfolders == null) 
        {
            pfolders = Toolbox.emsg(1398).trim().split("[ ]*,[ ]*");
            int N = pfolders.length;
            for (int i = 5; i < N-1; i++)
            {
                pfolders[i] = pfolders[N-1] + File.separator + pfolders[i];
            }
        } 
    }
   // protected static Encode6b encoder = new Encode6b(orgnum);
    
     
    public void init(ServletConfig servletconfig) throws ServletException {
        super.init(servletconfig);
        UploadFile.separator = System.getProperty("file.separator");
        UploadFile.newline = System.getProperty("line.separator");
        
        makepfolder();
    }
    
    public static void createfolder(int i)
    {
        
        String tempuploadfolder = Toolbox.dbadmin[i%65536].webFileFolder + File.separator + "tempupload";
        String wfauploadfolder = Toolbox.dbadmin[i%65536].webFileFolder + File.separator + "wfattach";
        if (!new File(tempuploadfolder).exists()) {
            UploadFile.makedir(tempuploadfolder);
        }
        if (!new File(wfauploadfolder).exists()) {
            UploadFile.makedir(wfauploadfolder);
        }
    }

    protected String errmsg(String msg) {
        return "<script  type=text/javascript>parent.failupload('" + msg.replaceAll("'", "\\'") + "');</script>";
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    }
    
    public static void readbinary(HashMap params, HttpServletRequest request)
    {
        String encoding = request.getCharacterEncoding();
        String conttype = getConttype(request);
        try{
        ServletInputStream servletinputstream = request.getInputStream(); 
        readParameters(params, servletinputstream, encoding, conttype);
        }catch(Exception e){}
    }
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
        String msg;
        HttpSession session = request.getSession(true);
        int orgnum = Toolbox.setcharset(request, response);
         
    if (orgnum == -1) return;
CachedStyle cachedstyle = new CachedStyle(request, orgnum);
        response.setContentType("text/html;charset=" + Toolbox.encodings[orgnum>>16]);
        User user = (User)session.getAttribute("User");
      /*  if (!Toolbox.filehash.equals("") && (System.currentTimeMillis()%100) == 0
         && !Sha1.sha1dir(new File(Toolbox.installpath), null).equals(Toolbox.filehash) )
        {
        msg = "Compromised software detected. System shuts down to protect data";
        } 
        else */if (user == null && orgnum!=user.orgnum) 
        {
            //msg = errmsg("Please relogin");
            try 
            {
                RequestDispatcher dispat = request.getServletContext().getRequestDispatcher("/login.jsp?orgnum=" + orgnum + "&error=generic&follow=R");
                dispat.forward((ServletRequest)request, (ServletResponse)response);
            }
            catch (Exception e) 
            {
            }
            return;

        } 
        else if (user.orgnum!=orgnum || user.webFileFolder == null || user.webFileFolder.equals("")) 
        {
            msg = errmsg("Not authorized");
        } 
        else 
        {
            orgnum=user.orgnum;
            String browser;
            boolean issafari = (browser = request.getHeader("User-Agent")).indexOf("Safari") > 0;
            String encoding = request.getCharacterEncoding();
            String conttype = getConttype(request);
            HashMap<String,String> params = new HashMap(10);
            ServletInputStream servletinputstream = request.getInputStream();
            readParameters(params, servletinputstream, encoding, conttype);
            String longFileName = FileOperation.stdfn((String)params.get("filename"));
            String shortFileName = FileOperation.getFileName(longFileName);
           
            File tempfile = null;
            if (longFileName == null || longFileName.equals("")) {
                msg = errmsg(Toolbox.emsgs(orgnum,102));
            } 
            else 
            {
               
                try 
                {
                    String savedfile;
                    String saveddir;
                    
                    String tempuploadfolder = Toolbox.dbadmin[user.orgnum%65536].webFileFolder + File.separator + "tempupload";
                    tempfile = Uploadfile(params, tempuploadfolder, conttype, servletinputstream, Toolbox.langs[orgnum>>16], UploadFile.MaxUploadSize);
                   
                    if (tempfile == null) 
                    {
                      msg = errmsg((String)params.get("uploaderrors"));
                      
                    }
                    else  if (params.get("adminmaintain") != null && (Systemroles.SYSTEMADMIN & user.roles) == 0) 
                    {
                        msg = errmsg("Please relogin as System Admin to perform this task");
                        tempfile.delete();
                        tempfile = null;
                       
                    }
                    else 
                    {
                        String dir = user.webFileFolder;
                        if (params.get("adminmaintain") != null && (Systemroles.SYSTEMADMIN & user.roles) > 0) {
                            dir = Toolbox.installpath;
                        }
                         
                        if (!((saveddir = (String)params.get("saveindir")) == null || saveddir.equals(""))) {
                            dir = dir + File.separator + saveddir.replace('/', File.separatorChar);
                        }
                        dir = FileOperation.mountwebsite(dir, user);
                        if ((savedfile = FileOperation.stdfn((String)params.get("saveasfile"))) == null) {
                            savedfile = shortFileName;
                        }
                       
                        if (!new File(dir).exists()) {
                            new File(dir).mkdir();
                        }
                        File file1 = new File(dir, savedfile);
                        String to6 = file1.getAbsolutePath();
                       
                        try 
                        {  

                            boolean welldone = false;
                            long len = tempfile.length();
                            Object object = UploadFile.renamefilelock;
                           
                            synchronized (object) 
                            {
                                if (file1.exists() && file1.isFile()) 
                                {
                                    file1.delete();
                                }
                                String filestr2 =  file1.getAbsolutePath();
                                filestr2 = filestr2.substring(0, filestr2.lastIndexOf(File.separator ));
                              
                                File f2 = new File(filestr2);
                                if (f2.exists() == false) DBAdmin.mkdir(filestr2);
                                welldone = tempfile.renameTo(file1);
                              
                            }
                            if (welldone) 
                            {
                                String fn = file1.getName();
                                boolean notadmin = (params.get("adminmaintain") == null);
                                boolean bb= user.webFileFolder.contains(Toolbox.dbadmin[orgnum%65536].webFileFolder);
                                    String str1 = "";
                                    if (bb){ 
                                        String fd = file1.getAbsolutePath();
                                        int l0 = fd.length();
                                        int l1 = user.webFileFolder.length();
                                        int l2 = fd.lastIndexOf(File.separator);
                                        str1 = fd.substring(l1, l2);
                                        if (str1.length()>0 && str1.charAt(0) == File.separatorChar)
                                            str1 = str1.substring(1);
                                        if (str1.length()>0 && str1.charAt(str1.length()-1) == File.separatorChar)
                                            str1 = str1.substring(0,str1.length()-1);
                                         
                                    }
                                if (notadmin)
                                {
                                    if (FolderMaintain.isimage(fn))
                                    {
                                         String dir1 = file1.getAbsolutePath(); 
                                         int j = dir1.lastIndexOf(File.separator);
                                          String folder = dir1.substring(0,j);
                                          
                                         (new Thread(new FolderMaintain( orgnum, folder,  fn, "add"))).start();
                                    }
                                    Encode6b encoder = new Encode6b(orgnum);
                                    
                                    msg =  "<script  type=text/javascript>" + (bb? ("parent.ResizeUploaded.initfolder='" + str1 + "';"):"") + "parent.addedItem('" + shortFileName + "',\"" +  encoder.to6b(to6) + "\"," + len + "," + (file1.lastModified()/1000)+ "); </script>";
                                }
                                else
                                {
                                    msg = (bb?("<script>parent.ResizeUploaded.initfolder='" + str1 + "';</script>"):"")  +  encodefilepath(file1, "/", orgnum); 
                                }
                            }
                            else msg = errmsg(tempfile.getAbsolutePath().replace(File.separatorChar, '/') + "rename failed" + file1.getAbsolutePath().replace(File.separatorChar, '/'));
                        }
                        catch (Exception e2) 
                        {
                            if (tempfile != null) 
                            {
                                tempfile.delete();
                            }
                            msg = errmsg(e2.toString());
                        }
                    }
                }
                catch (Exception exception) 
                {
                    
                    msg = errmsg(longFileName + " " + Toolbox.emsgs(orgnum,81));
                }

           }
        }
        printout(response, msg, orgnum);
    }

    protected void printout(HttpServletResponse response, String msg, int orgnum) throws ServletException, IOException {
        PrintWriter out = response.getWriter();
        
        try {
            out.println("<!DOCTYPE html>");
            out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" >");
            out.println("<head>");
            out.println(Toolbox.getMeta(orgnum));
            out.println("<title>Attachment</title>");
            out.println("</head>");
            out.println("<body>" + msg);
            out.println("</body>");
            out.println("</html>");
        }
        finally {
            out.close();
        }
    }

    long maxsize(HashMap params) {
        String MaxUploadSiz;
        if (params == null) {
            return -1;
        }
        if ((MaxUploadSiz = (String)params.get("MaxUploadSize")) != null) {
            try {
                float fl =  Float.parseFloat(MaxUploadSiz);
                long ll = fl  > 1000.0  ? (long)Math.round(fl) : (long)Math.round(fl  * 1024  * 1024 );
                return ll;
            }
            catch (Exception e) {
                // empty catch block
            }
        }
        return -1;
    }

    protected File Uploadfile(HashMap params, String tempdir, String boundary, ServletInputStream servletinputstream, String langcode, long l1) throws ServletException, IOException {
        long ll = maxsize(params);
        if (ll < l1 && ll > -1) l1 = ll;
        int ecn = 0; for (; ecn < Toolbox.langs.length; ecn++)
        {
           if (Toolbox.langs[ecn].equals(langcode)) break;
        }
        if (ecn == Toolbox.langs.length)
            ecn = 0;
        String tempfilename  = getId();
         
        File file = new File(tempdir, tempfilename);
        FileOutputStream fileoutputstream = null;
        String aline, moreline = null;
        byte buf[] = new byte[512];
        byte crlf[] = new byte[2];
        int k, B =  boundary.length()+2;
        boolean left = false;
         
        boolean hasboundary = false;
        long leng = 0;
         
        try
        {
            
            fileoutputstream = new FileOutputStream(file);
            while (l1>=0 && (k = servletinputstream.readLine(buf, 0, buf.length)) > 0)
            {
         
               if ( k - B  <=2 && k>=B && (aline=new String(buf, 0, k)).indexOf(boundary)==0)
               {
                   hasboundary = true;
                   break;
               }
               else
               {
                   leng += k;
                   l1 -= k;
                   if (left)
                   {
                       fileoutputstream.write(crlf, 0, 2); 
                   }
                   if (k<2)
                   {   
                       fileoutputstream.write(buf, 0, k);
                       left = false;
                   }
                   else
                   {
                      if (k > 2)
                      fileoutputstream.write(buf, 0, k-2);
                     
                      crlf[0] = buf[k-2];
                      crlf[1] = buf[k-1];
                      left = true;
                   }
               }
            }
         
        }
        catch(Exception e)
        {
            
            params.put("uploaderrors", e.toString());
        }
        finally
        {
           if (fileoutputstream!=null)
           {   
               fileoutputstream.flush();
               fileoutputstream.close();
           }
        }  
 
        if (hasboundary)
        {
            readParameters(params,servletinputstream, Toolbox.encodings[ecn], boundary);
        }
         
        servletinputstream.close();
        
        ll  =  maxsize(  params);
        
        if ( ll >-1 && ll <  leng - 10000  )
        { 
             params.put("uploaderrors", Toolbox.emsg(ecn,79) + ll);
             file.delete();
             return null;
        } 
      
        return file;
    }

    public static String getConttype(HttpServletRequest request) {
        if (request==null) return null;
        String conttype = request.getContentType();
        if (conttype == null) return null;
        int i = conttype.indexOf("boundary=");
        if (i != -1) {
            conttype = conttype.substring(i + 9);
            conttype = "--" + conttype;
        }
        return conttype;
    }

    static String readLine(byte[] abyte0, int[] ai, ServletInputStream servletinputstream, String s) {
        try {
            ai[0] = servletinputstream.readLine(abyte0, 0, abyte0.length);
            if (ai[0] == -1) {
                return null;
            }
        }
        catch (IOException ioexception) {
            return null;
        }
        try {
            if (s == null) {
                return new String(abyte0, 0, ai[0]);
            }
            return new String(abyte0, 0, ai[0], s);
        }
        catch (Exception exception) {
            return null;
        }
    }

    static public boolean readParameters(HashMap params, ServletInputStream sim, String charcode, String boundary) 
    {
        if (boundary == null) return false;
        byte[] abyte0 = new byte[4096];
        String line = null;
        int[] a1 = new int[1];
        boolean first = true;
        int j = 0;
        String paramname = "";
        boolean ready = true;
        String value = "";
        boolean haslang = false;
        while ((line = readLine(abyte0, a1, sim, charcode)) != null) {
            if ((j = line.indexOf("filename=\"")) > 0) {
                if (!paramname.equals("")) {
                    params.put(paramname, value.trim());
                }
                line = line.substring(j + 10);
                j = line.indexOf("\"");
                params.put("filename", line.substring(0, j));
                line = readLine(abyte0, a1, sim, charcode);
                if (line == null) {
                    return false;
                }
                if (line.indexOf("Content-Type") == 0) {
                    params.put("Content-type", line.substring(14));
                }
                line = readLine(abyte0, a1, sim, charcode);
                return true;
            }
            if ((j = line.indexOf("name=\"")) > 0) {
                if (!paramname.equals("")) {
                    params.put(paramname, value.trim());
                }
                line = line.substring(j + 6);
                j = line.indexOf("\"");
                paramname = line.substring(0, j);
                if (paramname.equals("langcode"))
                {
                    haslang = true;
                }
                line = readLine(abyte0, a1, sim, charcode);
                value = "";
                continue;
            }
            if (line.indexOf(boundary) != 0) {
                value = value + line;
                continue;
            }
            ready = true;
        }
        params.put(paramname, value.trim());
        if (haslang == false)
        {
            int ecn =0;
            for (; ecn < Toolbox.langs.length; ecn++)
               if(Toolbox.encodings[ecn].equals(charcode)) break;
            if (ecn ==Toolbox.langs.length)ecn =0;
            params.put("langcode", Toolbox.langs[ecn]);
                   
        }
        return true;
    }

    protected String replace(String s, String s1, String s2) {
        int i = s.indexOf(s1);
        if (i < 0) {
            return s;
        }
        StringBuffer stringbuffer = new StringBuffer(s.length() + 50);
        if (i > 0) {
            stringbuffer.append(s.substring(0, i));
        }
        stringbuffer.append(s2);
        if (i + s1.length() >= s.length()) {
            return stringbuffer.toString();
        }
        stringbuffer.append(replace(s.substring(i + s1.length()), s1, s2));
        return stringbuffer.toString();
    }

    public static String getId() {
        long l = 0;
        Object object = UploadFile.newfilelock;
        synchronized (object) {
            l = System.currentTimeMillis();
            UploadFile.fnum = (UploadFile.fnum + 1) % 100000;
        }
        long x = 100000 + UploadFile.fnum;
        return String.valueOf(l) + String.valueOf(x).substring(1);
    }

    public static void makedir(String x) {
        if (x == null || x.length() < 1) {
            return;
        }
        int l = x.length() - 1;
        if (x.charAt(l) == File.separatorChar) {
            --l;
        }
        int L = l;
        int kk = 0;
        while (!(l < 0 || new File(x.substring(0, l + 1)).exists())) {
            for (; l >= 0 && x.charAt(l) != File.separatorChar; --l) {
            }
            --l;
            ++kk;
        }
        if (kk == 0) {
            return;
        }
        kk = 0;
        while (l < L) {
            File fd;
            ++l;
            for (; l < L && x.charAt(l + 1) != File.separatorChar; ++l) {
            }
            if ((fd = new File(x.substring(0, l + 1))).mkdir()) continue;
            Toolbox.println(l, "can not make folder " + x.substring(0, l + 1));
        }
    }

    public String mkfn(String folder, String newfile) {
        File f = new File(folder, newfile);
        if (!f.exists()) {
            return newfile;
        }
        int k = 1;
        int i = newfile.lastIndexOf(".");
        String fext = "";
        if (i != -1) {
            fext = newfile.substring(i);
            newfile = newfile.substring(0, i);
        }
        while ((f = new File(folder, newfile + "-" + k + fext)).exists()) {
            ++k;
        }
        return newfile + "-" + k + fext;
    }

    public static String addone(String sn) {
        int j;
        int i = sn.indexOf(".");
        if (i == -1) {
            i = sn.length();
        }
        for (j = i - 1; j >= 0 && sn.charAt(j) <= '9' && sn.charAt(j) >= '0'; --j) {
        }
        String t = "";
        if (j + 1 == i) {
            t = sn.substring(0, i) + '1';
        } else {
            if ((t = sn.substring(j + 1, i).replaceFirst("^0+", "")).equals("")) {
                t = "0";
            }
            int k = Integer.parseInt(t) + 1;
            t = "" + k;
            while (t.length() < i - j - 1) {
                t = t + '0' + t;
            }
            if (j + 1 > 0) {
                t = sn.substring(0, j + 1) + t;
            }
        }
        if (i < sn.length()) {
            t = t + sn.substring(i);
        }
        return t;
    }

    public String getServletInfo() {
        return "Short description";
    }

    /*
     * Unable to fully structure code
     * Enabled force condition propagation
     * Lifted jumps to return sites
     */
    public static synchronized boolean renameTo(File f, File g) {
      if (f.renameTo(g)) 
        {
            return true;
        }
        FileInputStream fin = null;
        FileOutputStream fout = null;
        try {
            fin = new FileInputStream(f);
            fout = new FileOutputStream(g);
            byte[] buf = new byte[2048];
            int i, j;
            while ((i = fin.read(buf)) > 0) 
            {
                fout.write(buf, 0, i);
            }

        } catch (Exception e) 
        {
            Toolbox.println(1, "" + e);
            return false;
        } 
        finally 
        {
            try {
                if (fin != null) 
                {
                    fin.close();
                }
                if (fout != null) 
                {
                    fout.close();
                }
                if (fin != null && fout != null) 
                {
                    f.delete();
                }
            } 
            catch (Exception e) 
            {
            }
        }
        return true;
    }

    protected String encodefilepath(File file, String pipe, int orgnum) 
    {
        String js = file.getAbsolutePath();
         
        String js1 = file.getName();
        long tm = file.lastModified()/ 1000;
        Encode6b encoder = new Encode6b(orgnum);
        String fn = file.getName();
        if (FolderMaintain.isimage(fn))
        {
             String dir1 = file.getAbsolutePath(); 
             int j = dir1.lastIndexOf(File.separator);
             String folder = dir1.substring(0,j);
             (new Thread(new FolderMaintain( orgnum, folder,  fn, "add"))).start();
        }
        js =  encoder.to6b(js);
        js = pipe != null ? "web" + pipe + js : "web";
        return "<script  type=text/javascript>if (parent!=window && parent.syn) parent.syn('" + js + "','" + js1 + "@" + tm + "'); if (opener!=null && opener.syn){\nopener.syn('" + js + "','" + js1 + "@" + tm + "');   if(opener!=window){var win=window.open('','_top','',true);win.opener=true;win.close();}  }   </script>";
    }
}
