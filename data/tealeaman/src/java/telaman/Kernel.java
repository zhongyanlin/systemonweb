 
package telaman;

import java.io.*;
import java.util.*;
import java.util.zip.*;
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
 
@WebServlet(name = "Kernel", urlPatterns = {"/Kernel"},   asyncSupported = false)    
 
public class Kernel extends HttpServlet 
{
    String testerip = "";
    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int orgnum = Toolbox.setcharset( request, response);
        String license = Toolbox.defaultParam(orgnum,request, ("license"), null);
        license = Toolbox.validate(license, "", 50);
        String edition = "Personal"; 
        String act = Toolbox.defaultParam(orgnum,request, ("act"), null);
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
        if (license == null  || hash == null || hash.length() < 5 || mac==null || mac.length() < 5) 
        {
            err = "Some parameters are missing.";
        } 
        else if (act.equals("puthash"))
        {
             
            PrintWriter out = response.getWriter();
             String sql0 = "INSERT INTO Kernel (product, version, language, license, hash, mac, build) values ('"
                     + product + "','" + version + "','" + language + "','','" + hash + "','','" + build + "')";
             adapter = Toolbox.getSysAdapter(0);
             int k = adapter.executeUpdate(sql0);
             out.println(k+sql0);
             //              adapter.close();
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
            
            sql = "SELECT product, version, language, hash FROM Kernel where build='" + build + "'   and  license='" + license + "' and  mac='" + mac + "'";
            adapter = Toolbox.getSysAdapter(0);
             
           
            boolean b = false;
            if (err.equals("")) 
            {
                b = adapter.executeQuery2(sql,false);
            }
            if (b && adapter.getValueAt(0, 0)==null) 
            {
                sql = "SELECT product, version, language, hash FROM Kernel where build='" + build + "' and license='' and mac=''";
                b = adapter.executeQuery2(sql,false); 
                if (!b || adapter.getValueAt(0, 0)==null)
                   err = err + ".Involid build number";
                else 
                {
                     
                codes = "" + i + adapter.getValueAt(0, 3).trim();
                product = adapter.getValueAt(0, 0);
                version = adapter.getValueAt(0, 1);
                language = adapter.getValueAt(0, 2);
                codes = Sha1.hash(codes);
              //                 
                if (!hash.equals(codes)) 
                {
                    err = err + ".Some of the your program files are altered, maybe by hackers. To protect your precious data, the current installation will not work any more. Please reinstall the original software"; 
                }
                else
                {
                     sql  = "INSERT INTO Kernel (product, version, language, license, hash, mac, build) SELECT "+
                     " product,version,language,'" + license + "',hash,'" + mac +"',  build   FROM Kernel WHERE build='" + build + "' and license='' and product='" + product + "' and version='" +  version + "' and language='" + language + "'";
                      int k = adapter.executeUpdate(sql); 
                       if (k < 1)  err = err + ". invalid product, version, language";
                                     
                }
                }
            } else if (!b) {
                Toolbox.println(0, adapter.error());
            } 
            else if (b && adapter.getValueAt(0, 0)!=null) 
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
                    Vector<String> errarr = new Vector<String>();
                    errarr.addElement(err);
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
                filepath = Toolbox.installpath + File.separator + "WEB-INF" + File.separator + "routine" + File.separator + product + version + language + object + ".crp";
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
        sql = "INSERT INTO ClientBoot(lastupdate, product, vers , enc, hashcd, ipaddr) values(" + (System.currentTimeMillis() / 1000) + ",'" + product + "'," + version + ",'" + language + "','" + hash + "','" + request.getServerName() + "')";
        addl(xx, sql);
     
    }
    void addl(String msg, String sql)
    {
        try{
        FileWriter aWriter = new FileWriter(Toolbox.installpath + File.separator + "WEB-INF" + File.separator + "routine1" + File.separator + "debug.txt", false);
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
