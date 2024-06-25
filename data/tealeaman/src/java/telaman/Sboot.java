 
package telaman;

import java.io.*;
import java.util.*;
import java.util.zip.*;
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import org.apache.commons.io.*;
import static telaman.UploadFile.getConttype;
import static telaman.UploadFile.readParameters;
/*
Software: name, edition, language, price, descript
Sversion: name, edition, version,  language, platform, file, hash
Sbuild:   name, edition, version, language, platform, build, hash, filelist
Sclient: id, name, address, country, phone, email
Slicense: lid, cid, name, edition, version,  language,  platform, numberUsers, start, endt, acturalprice
Sinstall: lid, url, build, mac
*/ 
@WebServlet(name = "Sboot", urlPatterns = {"/Sboot"},   asyncSupported = false)    
 
public class Sboot extends HttpServlet 
{
    String testerip = "";
    public static String flist="";
    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int orgnum = Toolbox.setcharset(request, response);
        String act = Toolbox.defaultParam(orgnum,request, ("act"), null);
        if (act==null)
        {
            String language = request.getCharacterEncoding();
            String conttype = getConttype(request);
            HashMap<String,String> params = new HashMap(10);
            ServletInputStream servletinputstream = request.getInputStream();
            UploadFile.readParameters(params, servletinputstream, language, conttype);
            String longFileName = FileOperation.stdfn((String)params.get("filename"));
            String shortFileName = FileOperation.getFileName(longFileName);
             PrintWriter out = response.getWriter();
            flist = IOUtils.toString(servletinputstream);
            int k = flist.indexOf("-----------------------------");
            flist = flist.substring(0,k);
            out.println(flist);
            out.close();
            servletinputstream.close();
            return;
        }
        
        String license = Toolbox.defaultParam(orgnum,request, ("license"), null);
        license = Toolbox.validate(license, "", 200);
        
        String edition = Toolbox.defaultParam(orgnum,request, ("edition"), null);
        edition = Toolbox.validate(edition, "+", 50);
        
        String platform = Toolbox.defaultParam(orgnum,request, ("platform"), "windows");
        platform = Toolbox.validate(platform, "", 50);
         
        
        act = Toolbox.validate(act, null, 30);
        
        String mac = Toolbox.defaultParam(orgnum,request, ("com"), null);
        mac = Toolbox.validate(mac, null, 200);
         
        String hash = Toolbox.defaultParam(orgnum,request, ("hash"), null);
        hash = Toolbox.validate(hash, null, 200);
        String object = Toolbox.defaultParam(orgnum,request, ("object"), null);
        
        object = Toolbox.validate(object, null, 40);
        String  codes = "", product="", version="", language="",err = "",filepath = null;
        
        product = Toolbox.defaultParam(orgnum,request,"product", "", null,  20);
        version = Toolbox.defaultParam(orgnum,request,"version", "", null,  20);
        language = Toolbox.defaultParam(orgnum,request,"language", "", null,  20);
        String build = Toolbox.defaultParam(orgnum,request,"build", "", null,  40);
        String rsakey = "";
        JDBCAdapter adapter = null;
        String sql = "";
        boolean hasnewbuild = false;
        
        if (license == null  || hash == null || hash.length() < 5 || mac==null || mac.length() < 5) 
        {
            err = "Some parameters are missing.";
        } 
        else if (act.equals("puthash"))
        {
          
            
            PrintWriter out = response.getWriter();
             String sql0 = "INSERT INTO Sbuild (lastupdate,product, edition,version, language, platform, build, hash, filelist) values (0,'"
                     + product + "','" + edition + "','" + version + "','" + language + "','" + platform + "','" + build + "','"+ hash + "','"+ flist + "')";
             //sql = "UPDATE Kernel set hash='" + hash + "' where license='" + license + "'";
            // adapter = new JDBCAdapter(DBAdmin.sysDBConnectInfo());
            flist = "";
             adapter = Toolbox.getSysAdapter(0);
             int k = adapter.executeUpdate(sql0);
             out.println(k+sql0 + "<br>" + adapter.error());
           
             adapter.close();
             out.close();
             return;
        }
        else if (act.equals("routine"))
        {
            long i = 0, j = System.currentTimeMillis();
            if (hash.length() > 11) 
            {
                try 
                {
                    i = Long.parseLong(hash.substring(0, 13));
                }
                catch (Exception e) {
                    // empty catch block
                }
            }
            if ( Math.abs(i-j) > 1800000) 
            {
                err = "" + j;
            }
           // rsakey = hash.substring(53);
            hash  = hash.substring(13);
            long ll = System.currentTimeMillis()/1000;
            String sql0 = "SELECT id FROM Slicense WHERE id='" + license + "' and product='" + product + "' AND edition='" + edition + "' AND language='" + language + "' AND start <" + ll + " AND endt >= " + ll;
            adapter = Toolbox.getSysAdapter(0);
            int k = -2;
            boolean b = false;
            if (err.equals("")) 
            {
                b = adapter.executeQuery2(sql0,false);
            }
           
            if (b==false || adapter.getValueAt(0,0)==null)
            {
                err = err + ".No license or invalid license."; 
            }
            else
            {
                sql = "SELECT  Sbuild.product, Sbuild.version, Sbuild.language, Sbuild.hash FROM Sinstall, Sbuild WHERE Sbuild.product='" +product + "' AND edition='" + edition + "' AND Sbuild.version='" + version + "' AND Sbuild.language='" + language + "' AND Sbuild.build=Sinstall.build AND Sbuild.build='" + build + "'   and  Sinstall.license='" + license + "'";
                //adapter = new JDBCAdapter(Toolbox.dbadmin[0].sysDBConnectInfo());

                k = -2;
                
                if (err.equals("")) 
                {
                    b = adapter.executeQuery2(sql,false);
                }
              
                if (b && adapter.getValueAt(0,0)==null) 
                {
                    sql = "SELECT product, version, language, hash  FROM Sbuild  WHERE  Sbuild.product='" +product + "' AND edition='" + edition + "' AND Sbuild.version='" + version + "' AND Sbuild.language='" + language + "' AND build='" + build + "'";
                    b = adapter.executeQuery2(sql,false); 
                    if (!b || adapter.getValueAt(0,0)==null)
                    {
                     
                        err = err + ".Involid build number";
                    }
                    else 
                    {

                    codes = "" + i + adapter.getValueAt(0, 3).trim();
                    product = adapter.getValueAt(0, 0);
                    version = adapter.getValueAt(0, 1);
                    language = adapter.getValueAt(0, 2);
                    codes = Sha1.hash(codes);
               
                    if (!hash.equals(codes)) 
                    {
                        err = err + ".Some of the your program files are altered, maybe by hackers. To protect your precious data, the current installation will not work any more. Please reinstall the original software"; 
                    }
                    else
                    {
                         String url = Toolbox.defaultParam(orgnum,request,"url", "");
                         sql  = "INSERT INTO Sinstall (lastupdate,license, url, mac, build) VALUES(" + ll + ",'" + license + "','" + url + "','" + mac +"','"+  build + "')";
                          k = adapter.executeUpdate(sql); 
                          // if (k < 1)  err = err + ". invalid product, version, language";
                        
                    }
                    }
                } 
                else if (k == -1) 
                {
                    Toolbox.println(0, adapter.error());
                } 
                else if (k <= 2) 
                {
                    codes = "" + i + adapter.getValueAt(0, 3).trim();
                    product = adapter.getValueAt(0, 0);
                    version = adapter.getValueAt(0, 1);
                    language = adapter.getValueAt(0, 2);
                    codes = Sha1.hash(codes);
                    if (!hash.equals(codes)) 
                    {
                        err = err + ".Some of the your program files are altered, maybe by hackers. To protect your precious data, the current installation will not work any more. Please reinstall the original software"; 
                    }
                    else
                    {
                        sql = "SELECT   (build)  FROM Sbuild  WHERE  Sbuild.product='" +product + "' AND edition='" + edition + "' AND Sbuild.version='" + version + "' AND Sbuild.language='" + language + "' order by build";
                        b = adapter.executeQuery2(sql,false); 
                        if (b && adapter.getValueAt(0,0)!=null && !build.equals(adapter.getValueAt(0,0)))
                        {
                            hasnewbuild = true;
                        }
                    }
                }
                else
                {
                    err = err + ".A license can not be used for more than two computers.";
                }
            }
            adapter.close();
        }
        
        ServletOutputStream stream = null;
        BufferedInputStream buf = null;
        String filetype = "application/zip";
        String des = "attachment";
        response.setContentType(filetype);
        response.addHeader("Content-Disposition", des + ";filename=" + product + ".crp");
        stream = response.getOutputStream();
       
        try {
            if (!err.equals("")) 
            {
                filepath = Toolbox.installpath + File.separator + "WEB-INF" + File.separator + "routine" + File.separator + license + ".crp";
                File file = new File(filepath);
               
                FileOutputStream fos = new FileOutputStream(file);
                GZIPOutputStream gzos = new GZIPOutputStream(fos);
                ObjectOutputStream fout = new ObjectOutputStream(gzos);
                if (object.equals("msg")) 
                {
                    String [][] errarr = new String[1][];
                    errarr[0] = new String[]{err};
                    fout.writeObject(errarr);
                } 
                else 
                {
                    HashMap<String, String> ht = new HashMap<String, String>();
                    ht.put("0", err);
                    fout.writeObject(ht);
                }
                fout.close();
                gzos.close();
                fos.close();
            }
            else 
            {
                filepath = Toolbox.installpath + File.separator + "WEB-INF" + File.separator + "routine" + File.separator 
                        + product + version   + object + ".crp";
            }
            
            
            File f = new File(filepath);
            response.setContentLength((int)f.length());
            FileInputStream input = new FileInputStream(f);
            int readBytes = 0;
            while ((readBytes = input.read()) != -1) 
            {
                stream.write(readBytes);
            }
            input.close();
            if (!err.equals(""))
                f.delete();
             
        }
        catch (IOException ioe) {
            throw new ServletException(ioe.getMessage());
        }
        finally 
        {
            if (stream != null) 
            {
                stream.close();
            }
            if (buf != null) 
            {
                buf.close();
            }
        }
        String xx = (hash + "\n") + (license + "\n") + (act + "\n") + (object + "\n") + (hash + "\n")
                   + (sql + "\n") + (codes + "\n") + (product + "\n") + (version + "\n") + (language + "\n")
                   + (hash + " - " + codes + "\n") + (filepath + "\n");
        sql = "INSERT INTO Sboot(lastupdate, lid, btime) values(" + (System.currentTimeMillis() / 1000) + ",'" +
                license + "'," +(System.currentTimeMillis() / 1000) + ")";
        addl(xx, sql);
     
    }
    void addl(String msg, String sql)
    {
        try{
        FileWriter aWriter = new FileWriter(Toolbox.installpath + File.separator + "WEB-INF" + File.separator + "routine1"
                + File.separator + "debug.txt", false);
        aWriter.append(msg);
        aWriter.close();
        }
        catch(Exception e){};
        JDBCAdapter adapter = Toolbox.getSysAdapter(0);
        adapter.executeUpdate(sql);
        adapter.close();
         
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
