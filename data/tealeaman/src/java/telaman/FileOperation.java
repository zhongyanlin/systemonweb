 
package telaman;

import java.util.*;
import java.util.zip.*;
import java.io.*;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.atomic.AtomicBoolean;
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
 
 

@WebServlet(name = "FileOperation", urlPatterns = {"/FileOperation"},   asyncSupported = true)
public class FileOperation extends HttpServlet
{
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException
    {
        HttpSession session = request.getSession(true);
        int orgnum = Toolbox.setcharset(request, response);
        response.addHeader("X-XSS-Protection", "0");
        if (orgnum == -1) return;
        CachedStyle cachedstyle = new CachedStyle(request, orgnum);
         
        HashMap<String,String> saved = (HashMap) (session.getAttribute("savedDBRequest"));
        String did = Toolbox.defaultParam(orgnum,request, "did", savedone(saved, "did"), "$_-", 200);
        User user = null;
        String dir0 = "";
        String file = "newfile";
        String des = "";
        String operation = null;
        String dir = null;
        String userdir = null;
        int sek = SessionCount.enq(session.getId());
        user = (User) session.getAttribute("User");
        String tt = "1" + (user==null); 
        if (user != null) {
            if (orgnum!=user.orgnum && orgnum!=-1) return;
            if ((user.roles & Systemroles.SYSTEMADMIN) > 0) {
                userdir = Toolbox.defaultParam(orgnum,request, "basedir", user.webFileFolder, "$@+:/\\;-,", 300);
            } else {
                userdir = user.webFileFolder;
            }
            dir = userdir;
            orgnum=user.orgnum;
        }
        
        String waive = Toolbox.defaultParam(orgnum,request, ("waivesecurity"), null);
        String coded = "";
        dir0 = savedone(saved, "folder");
        if (dir0 == null) {
            dir0 = Toolbox.defaultParam(orgnum,request, ("folder"), null);
        }
        file = stdfn(Toolbox.defaultParam(orgnum,request, "filedir", savedone(saved, "filedir"), "@#$:\\/-;,", 9000));
        
        boolean ispublic = false;
        String usedfor = Toolbox.defaultParam(orgnum,request, "usedfor", savedone(saved, "usedfor"), null,10);
        des = Toolbox.defaultParam(orgnum,request, "destination", savedone(saved, "destination"));
        operation = Toolbox.defaultParam(orgnum,request, "operation", savedone(saved, "operation"), null, 30);
        if (did == null || did.equals("")) 
        {
            if (user != null) 
            {
                if (usedfor==null&&(user.webFileFolder == null || user.webFileFolder.equals("") || waive == null && Toolbox.verifytoken(request) == false)) 
                {
                    return;
                }
            }
        } 
        else 
        {
            try 
            {
                coded = (new Encode6b(orgnum)).rto6b(did);
               
            } catch (Exception e1) 
            {
                //Toolbox.println(1, (user == null ? "" : user.id) + ": Wrong path code. ? " + did + "\n");
                return;
            }
            String bufferedfile = (String) session.getAttribute("publicfiles");
            ispublic = (bufferedfile != null && bufferedfile.indexOf(did) >= 0);
           
            if (ispublic && user == null || user!=null && file==null && operation==null && dir0==null) 
            {
                sendFileBytes(request, response, coded, des);
                return;
            }
            operation = "open";
            int j = coded.lastIndexOf(File.separator );
            file = coded.substring(j + 1);

            if (j > -1) 
            {
                dir0 = coded.substring(0, j);
            }
 
        }
         
        
        if (dir0 == null) 
        {
            return;
        } 
        else if (dir0.indexOf(Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator + "forms" + File.separator) >= 0) 
        {

        } 
        else if (user == null && operation != null && operation.equals("open")) 
        {
            if (ispicfile(file)) 
            {
                try 
                {
                    RequestDispatcher dispat = request.getServletContext().getRequestDispatcher("/image/nosession.gif");
                    dispat.forward((ServletRequest) request, (ServletResponse) response);
                } catch (Exception e) {  }
                return;
            } else if (file != null && file.toLowerCase().indexOf(".htm") < 0) {
                PrintWriter out = response.getWriter();
                out.print("No active session. Please relogin. " + (user==null) + tt);
                out.close();
                return;
            }
        } else if (user == null) {
            if (saved == null) {
                saved = new HashMap<String,String>(5);
            }
            saved.put("folder", dir0);
            
            if (file != null) {
                saved.put("filedir", file);
            }
            if (des != null) {
                saved.put("destination", des);
            }
            if (operation != null) {
                saved.put("operation", operation);
            }
            if (did != null) {
                saved.put("did", did);
            }
            if (saved.size() != 0) {
                session.setAttribute("savedDBRequest", saved);
            }
            if ((user = User.authorize(orgnum, Systemroles.TOTAL, getServletConfig().getServletContext(), session, request, response, "FileOperation", false)) == null) {
                return;
            }
            orgnum = user.orgnum; 
        } 
        else 
        {
            session.removeAttribute("savedDBRequest");
        }
        if (operation != null && operation.equals("dropbox")) 
        {
            String lastbackup = Toolbox.defaultParam(orgnum,request, "lastbackup", null);
            String backupperiod = Toolbox.defaultParam(orgnum,request, "backupperiod", null);
            String appkey = Toolbox.defaultParam(orgnum,request, "appkey", "");
            String appsecret = Toolbox.defaultParam(orgnum,request, "appsecret", "");
            String  accesstoken = Toolbox.defaultParam(orgnum,request, "accesstoken", "");
            String err = "";
            if (lastbackup==null&& backupperiod==null) 
                err = Dropbox.putkeys(orgnum, user.id, appkey, appsecret, accesstoken); 
            else
            {
                err = Dropbox.puttime(orgnum, user.id, lastbackup, backupperiod);
                if (err.equals("")){
                if(backupperiod !=null) try{user.backupperiod = Integer.parseInt(backupperiod);}catch(Exception e){}
                if(lastbackup !=null)  try{user.lastbackup = Long.parseLong(lastbackup);}catch(Exception e){}
                session.setAttribute("User",user);
                }
            }
            PrintWriter out = response.getWriter();
            out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + "</head><body>file=" + file + "<br>");
                out.println("<script>parent.dropboxmsg(\"" + (err.equals("")?Toolbox.emsgs(orgnum,71):err) + "\");</script></body></html>");
            out.flush();
            out.close();
            return;
        }
        else if (operation != null && operation.equals("delet")) 
        {
            if (dir0.indexOf(user.id) >= 0) 
            {
                operation = "delete";
                if (user.roles > 1) {
                    userdir = Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator + dir0.replace('/', File.separatorChar);
                } else if (user.roles == 1) {
                    userdir = Toolbox.dbadmin[orgnum%65536].webFileFolder1 + File.separator + dir0.replace('/', File.separatorChar);
                } else {
                    operation = null;
                }
            } else {
                PrintWriter out = response.getWriter();
                out.print("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + "</head><body><script  type=text/javascript>if (typeof(orgnum)=='undefined')var orgnum=" +  orgnum+ ";if (opener!=null && opener.syn) opener.syn('error',\"file=" + file + "<br>");
                out.print(" user=" + user.id + "<br>");
                out.print("dir0=" + dir0 + "<br>");
                out.println("You are not allowed to delete file in this folder.\");</script></body></html>");
                 out.flush();
            out.close();
            return;
            }

        } 
        else if (operation != null && operation.equals("open")) 
        {
            operation = "download";
            if (dir0.indexOf(Toolbox.dbadmin[orgnum%65536].webFileFolder) == 0) 
            {
                dir = dir0.replace('/', File.separatorChar);
            } 
            else if (dir0.indexOf(Toolbox.dbadmin[orgnum%65536].webFileFolder1) == 0) 
            {
                dir = dir0.replace('/', File.separatorChar);
            } 
            else if (dir0.indexOf(Toolbox.installpath + File.separator + "image") == 0) 
            {
                dir = dir0.replace('/', File.separatorChar);
            } 
            else if (dir0.indexOf(File.separator) != 0 && dir0.indexOf(":") != 1) 
            {
                dir = Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator + dir0.replace('/', File.separatorChar);
            } 
            else if (user!=null && (user.roles & Systemroles.SYSTEMADMIN) > 0) 
            {
                if (dir0.indexOf(File.separator) == 0 || dir0.indexOf(":") == 1) 
                {
                    dir = dir0.replace('/', File.separatorChar);
                } 
                else 
                {
                    dir = userdir + dir0.replace('/', File.separatorChar);
                }
            } 
            else if (coded.equals("") || user==null) 
            {
                PrintWriter out = response.getWriter();
                out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + "</head><body>file=" + file + "<br>");
                //out.println("user=" + user.id + "<br>");
                out.println("You can not allowed to access file in the folder.</body></html> ");
                out.close();
                return;
            } 
            else 
            {
                dir = dir0.replace('/', File.separatorChar); 
            }

        } 
      
        if ((new File(dir0.replace('/', File.separatorChar))).exists())
        {
            
        }
        else if (dir0 != null && !dir0.equals("")) 
        {
            if ( usedfor == null)
                dir = userdir + File.separator + dir0.replace('/', File.separatorChar);
            else
                dir = Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator + dir0.replace('/', File.separatorChar); 
           
        }
        if (dir == null) 
        {
            return;
        }
        
        dir = slashs(dir);
        userdir = slashs(userdir);
        PrintWriter out = null;
        String pagetitle = Toolbox.emsgs(orgnum,636);
  
          
        if (operation == null || !operation.equals("download") && !operation.equals("edit") &&  !operation.equals("backup")) 
        {
            if (out == null) 
            {
                out = response.getWriter();
            }
            out.println("<!DOCTYPE html>\n<html lang=\""+Toolbox.langs[orgnum>>16]+"\" >" + Toolbox.getMeta(orgnum));
            out.println("<head>");
            out.println("<title>" + Toolbox.emsgs(orgnum,636) + "</title>");
            out.println("</head>");
            out.println("<body  style=\"background-color:" + cachedstyle.DBGCOLOR + ";margin:5 5 0 5\">");
        } 
        else if (operation.equals("edit")) 
        {
            pagetitle = file;
        }
        String answer = "";
 
        String mounted = mountwebsite(dir, user);
  
        File thefile = (new File(mounted, file));

        if (operation != null && operation.equals("newfile")) {

            boolean b = false;
            try {
                b = thefile.createNewFile();
            } catch (Exception e2) {
                b = false;
            }
            if (out == null) {
                out = response.getWriter();
            }
            //out.println(   Toolbox.emsgs(orgnum,97) + " " +  file +"<br>");

            if (b) {
                operation = "edit";
                Encode6b encoder = new Encode6b(orgnum);
                out.println("<script  type=text/javascript>if (typeof(orgnum)=='undefined')var orgnum=" +  orgnum+ ";  if (opener!=null) opener.addedItem(\"" + file + "\",\"" + encoder.to6b(thefile.getAbsolutePath()) + "\");  </script>");
            } else {
                answer = "Failed to create a new file." + file;
                // out.println(answer.replaceAll(";", "<br>")
                //+ "<br> <center><input type=button style=background-color:#00BBBB;color:white onclick=fresh() value=\"" + Toolbox.emsgs(orgnum,93) + "\">"
                out.println("<script  type=text/javascript>if (typeof(orgnum)=='undefined')var orgnum=" +  orgnum+ ";if (opener!=null && opener.syn)opener.syn('error',\"" + answer + "\");</script>");
                out.println("</body>");
                out.println("</html>");
                out.close();
                return;
            }
        }

        if (operation == null) {
            if (out == null) {
                out = response.getWriter();
            }
            out.print("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + "</head><body><script  type=text/javascript>if (typeof(orgnum)=='undefined')var orgnum=" +  orgnum+ ";if (opener!=null && opener.syn)opener.syn('error',\"file=" + file + "<br>");
            out.print("des=" + des + "<br>");
            out.print("dir0=" + dir0 + "<br>");
            out.print("No operation.\");</script></body></html> ");
            out.close();
            return;
        } else if (did == null && operation.equals("download")
                && dir.indexOf(user.webFileFolder) != 0 && lucked(mounted, file)) {
            if (out == null) {
                out = response.getWriter();
            }
            out.println("Download is not allowed");
            out.close();
        } else if (operation.equals("download") && thefile.exists() == false) 
        {
            if (out == null) 
            {
                out = response.getWriter();
            }
            out.print("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + "</head><body>");
            out.println(Toolbox.emsgs(orgnum,333) + " " + thefile.getAbsolutePath() + " " + Toolbox.emsgs(orgnum,1531));
            if (out != null) 
             {
                out.println("</body>");
                out.println("</html>");
                out.close();
             }
        } else if (operation.equals("rename")) {
            if (out == null) {
                out = response.getWriter();
            }

            if (out == null) {
                out = response.getWriter();
            }
            synchronized (forlock) {
                answer = !thefile.exists() || !thefile.renameTo(new File(mounted, des)) ? "0" : "1";
            }
            if (answer.equals("1")) {
                out.println("<script  type=text/javascript>parent.syn('ren','" + answer.replaceAll("'", "\\'") + "'); </script>");
            }
            if (out != null) 
             {
                out.println("</body>");
                out.println("</html>");
                out.close();
             }
            //else
            //    out.println( Toolbox.emsgs(orgnum,90) + " " + des + " " + Toolbox.emsgs(orgnum,91) +
            //    ".<br><center><input type=button style=background-color:#00BBBB;color:white onclick=window.close() value=\"" + Toolbox.emsgs(orgnum,82) + "\"> ");

        } else if (operation.equals("clssite")) {
            if (out == null) {
                out = response.getWriter();
            }
            boolean bb = false;
            String f0 = "website";
            if (!(user.webFileFolder + File.separator + "website").equals(Toolbox.dbadmin[orgnum%65536].websiteFolder + File.separator + user.websitename)) {

                if ((new File(user.webFileFolder + File.separator + f0)).exists()) {
                    while ((new File(user.webFileFolder + File.separator + f0)).exists()) {
                        f0 += "0";
                    }

                    synchronized (forlock) {
                        (new File(user.webFileFolder + File.separator + "website")).renameTo(new File(user.webFileFolder + File.separator + f0));
                    }
                }
                synchronized (forlock) {
                    bb = (new File(Toolbox.dbadmin[orgnum%65536].websiteFolder + File.separator + user.websitename)).renameTo(new File(user.webFileFolder + File.separator + "website"));
                }
            }

            if (bb) {
                out.println("<script  type=text/javascript>parent.syn('clssite','" + f0 + "'); </script>");
            } else {
                out.println("<script  type=text/javascript>parent.syn('clssit0','RENAME " + (Toolbox.dbadmin[orgnum%65536].websiteFolder + File.separator + user.websitename
                        + " TO " + user.webFileFolder
                        + File.separator
                        + "website").replace(File.separatorChar, '/') + "   FAILED'); </script>");
            }
             if (out != null) 
             {
                out.println("</body>");
                out.println("</html>");
                out.close();
             }
        } else if (operation.equals("publish")) {
            if (out == null) {
                out = response.getWriter();
            }

            boolean bb = true;
            boolean entitle = user.websitename != null && user.websitename.equals("") == false;

            if (entitle && !(user.webFileFolder + File.separator + "website").equals(Toolbox.dbadmin[orgnum%65536].websiteFolder + File.separator + user.websitename)) {
                synchronized (forlock) {
                    bb = (new File(user.webFileFolder + File.separator + "website")).renameTo(new File(Toolbox.dbadmin[orgnum%65536].websiteFolder + File.separator + user.websitename));
                }
            }

            if (bb) {
                out.println("<script  type=text/javascript>parent.syn('rensite',''); </script>");
            } else if (entitle) {
                out.println("<script  type=text/javascript>parent.syn('clssit0','Rename " + (user.webFileFolder + File.separator + "website to " + Toolbox.dbadmin[orgnum%65536].websiteFolder + File.separator + user.websitename).replace(File.separatorChar, '/') + " FAILED'); </script>");
            } else {
                out.println("<script  type=text/javascript>parent.myprompt('Your website name not exists. Ask Admin to assign one to you');</script>");
            }
        } else if (operation.equals("rensite")) {
            if (out == null) {
                out = response.getWriter();
            }
            JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
            boolean bn = adapter.executeQuery2("SELECT id FROM AppUser WHERE id='" + des + "' OR websitename='" + des + "'",false);
            boolean bb = (bn == false || adapter.getValueAt(0, 0)==null);
            if (bb == false && !des.equalsIgnoreCase(user.id)) {
                adapter.close();
                out.println("<script  type=text/javascript>parent.syn('rensit0','" + des.replaceAll("'", "\\'") + "'); </script>");
            } 
            else 
            {
                File fo = new File(Toolbox.dbadmin[orgnum%65536].websiteFolder + File.separator + user.websitename);
                File f1 = new File(Toolbox.dbadmin[orgnum%65536].websiteFolder + File.separator + des);
                synchronized (forlock) {
                    bb = f1.exists() == false && fo.renameTo(f1);
                }
                if (bb) {
                    user.websitename = des;
                    //HttpSession session =  request.getSession(true);
                    session.setAttribute("User", user);
                    adapter.executeUpdate("UPDATE AppUser SET websitename='" + des + "' WHERE id='" + user.id + "'");

                    out.println("<script  type=text/javascript>parent.syn('rensite','" + des + "'); </script>");
                } else {
                    out.println("<script  type=text/javascript>parent.syn('rensit0','" + des + "'); </script>");
                }
            }
            adapter.close();
            if (out != null) 
             {
                out.println("</body>");
                out.println("</html>");
                out.close();
             }
        } else if (operation.equals("newsite")) {
            if (out == null) {
                out = response.getWriter();
            }
            JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
            boolean bn = adapter.executeQuery2("SELECT id FROM AppUser WHERE (NOT id='" + user.id + "') AND (id='" + des + "' OR websitename='" + des + "')", false);
            if (bn == false || adapter.getValueAt(0, 0)==null) {
                File f1 = new File(Toolbox.dbadmin[orgnum%65536].websiteFolder + File.separator + des);
                boolean bb = f1.exists() == false && f1.mkdir();
                if (bb) {
                    user.websitename = des;
                    // HttpSession session =  request.getSession(true);
                    session.setAttribute("User", user);

                    adapter.executeUpdate("UPDATE AppUser SET websitename='" + des + "' WHERE id='" + user.id + "'");

                    out.println("<script  type=text/javascript> parent.addedItem(\"website\"); parent.syn('newsite',''); </script>");
                    //out.println("<script  type=text/javascript>parent.syn('rewsite','1'); </script>");
                } else {
                    out.println("<script  type=text/javascript>parent.syn('newsite','" + des + "'); </script>");
                }
            } else {
                out.println("<script  type=text/javascript>parent.syn('newsite','" + des + "'); </script>");
            }
            adapter.close();
           if (out != null) 
             {
                out.println("</body>");
                out.println("</html>");
                out.close();
             }
        } 
        else if (operation.equals("lock")) {
            if (out == null) {
                out = response.getWriter();
            }
            FileWriter aWriter = new FileWriter(mountwebsite(dir + File.separator + "tmlpermi.txt", user), false);
            aWriter.write(file);
            aWriter.close();
            File f = new File(mountwebsite(dir + File.separator + "tmlpermi.txt", user));
            String s = "-1";
            if (f.exists()) {
                s = "" + f.length();
            }
            out.println("<script  type=text/javascript>parent.syn('lock','" + s.replaceAll("'", "\\'") + "');</script>");
            if (out != null) 
             {
                out.println("</body>");
                out.println("</html>");
                out.close();
             }
        } 
        else if (operation.equals("newdir")) {
            if (out == null) {
                out = response.getWriter();
            }
            UploadFile.makedir(mountwebsite(dir + File.separator + file, user));
            File f = new File(mountwebsite(dir + File.separator + file, user));
            boolean b = f.exists();
            //out.println(  Toolbox.emsgs(orgnum,97)  +" " + dir + File.separator + file +"<br>");
            out.print("<!-- operation=" + operation + ", des=" + des + ", filedir=" + file + ", dir=" + dir + "-->");
            if (b) {
                String isc = Toolbox.defaultParam(orgnum,request, "iscourse", null);
                if ( isc!= null && isc.equals("yes")) 
                {
                    String[] xs = Toolbox.emsgs(orgnum,1398).split("[ ]*,[ ]*");
                    String xx = (dir + File.separator + file).replaceFirst("." + xs[0] + "$", "");
                    xs[0] = "attendance";
                  
                    for (int j=0; j < 5; j++)
                    {
                        File ff = new File(xx, xs[j]);
                        if (f.exists()==false)   ff.mkdir();
                    }
   
                    RequestDispatcher dispat = getServletConfig().getServletContext().getRequestDispatcher("/webfolder.jsp?folder=" + file);
                    dispat.forward(request, response);
                    return;
                    
                }
                if (dir.equals(user.webFileFolder) && file.equals("website")) {
                    RequestDispatcher dispat = getServletConfig().getServletContext().getRequestDispatcher("/webfolder.jsp?folder=" + file);
                    dispat.forward(request, response);
                } else {
                    out.println("<script  type=text/javascript>if(parent.addedItem) parent.addedItem(\"" + file + "\");  </script>");
                }
            } else {
                answer = Toolbox.emsgs(orgnum,96);
                out.println(answer.replaceAll(";", "<br>")
                        //+ "<br> <center><input type=button style=background-color:#00BBBB;color:white onclick=fresh() value=\"" + Toolbox.emsgs(orgnum,93) + "\">"
                        + "<script  type=text/javascript>parent.syn('error','" + answer.replaceAll("'", "\\'") + "');</script>");
            }
            if (out != null) 
             {
                out.println("</body>");
                out.println("</html>");
                out.close();
             }
        } else if (operation.equals("exist")) {
            if (out == null) {
                out = response.getWriter();
            }
            File f = new File(mountwebsite(dir + File.separator + file, user));
            if (f.exists()) {
                out.println("<script  type=text/javascript>parent.filexist('" + file + "'," + f.length() + ");</script>");
            } else {
                out.println("<script  type=text/javascript>parent.filexist('" + file + "',-1);</script>");
            }
            if (out != null) 
             {
                out.println("</body>");
                out.println("</html>");
                out.close();
             }
        } else if (operation.equals("save")) {

            if (out == null) 
            {
                out = response.getWriter();
            }
            try {
                String newfile = mountwebsite(dir + File.separator + file, user);

                FileWriter aWriter = new FileWriter(newfile, false);
                aWriter.write(des);
                aWriter.close();
 
                File f = new File(newfile);
                Encode6b encoder = new Encode6b(orgnum);
                String str = encoder.to6b(f.getAbsolutePath());
                out.println("<script  type=text/javascript>parent.renull('" + file + "'," + f.length() + ",'" + str + "'," + (f.lastModified() / 1000) + ");</script>");
            } catch (IOException e) {
                out.println("<script  type=text/javascript>parent.myprompt('" + e.toString().replace('\'', ' ').replaceAll("\n", "<br>") + "<br>"
                        + Toolbox.emsgs(orgnum,98) + (dir + File.separator + file).replace('\'', ' ').replaceAll("\n", "<br>").replace('\\', '/') + "');</script>.");
            }
            if (out != null) 
             {
                out.println("</body>");
                out.println("</html>");
                out.close();
             }
        } 
        else if (operation != null && operation.equals("content")) {
            if (out == null) {
                out = response.getWriter();
            }
            out.println("<script  type=text/javascript>");
            File f = new File(mountwebsite(dir, user), file);
            FileInputStream fin = new FileInputStream(f);
            byte[] buf = new byte[4096];
            int j;
            while ((j = fin.read(buf)) > 0) {
                String str = new String(buf, 0, j);
                out.println("opener.addContent(\"" + Generic.handle1(str) + "\");");
                // out.print(str.replaceAll("</","FD_dsf_4_M_fddw").replaceAll("&([a-z|A-Z][a-z|A-Z][a-z|A-Z][a-z|A-Z]);", "#$1;"));
            }
            fin.close();
            out.println("opener.doAct();</script></body></html>");
        } else if (operation.equals("edit")) {
            if (out == null) {
                out = response.getWriter();
            }
            if (file.indexOf(".doc") > 0 || file.indexOf(".zip") > 0 || file.indexOf(".jpg") > 0
                    || file.indexOf(".pdf") > 0 || file.indexOf(".ppt") > 0 || file.indexOf(".xls") > 0
                    || file.indexOf(".mp3") > 0 || file.indexOf(".wms") > 0 || file.indexOf(".gif") > 0) {
                out.println("File with this type can not be opened for editing");
            } else if (file.indexOf(".css") > 0) {
                try {
                    BufferedReader br = new BufferedReader(new FileReader(mountwebsite(dir, user) + File.separator + file));
                    String aline;
                    StringBuffer sb = new StringBuffer(1024);
                    while ((aline = br.readLine()) != null) {
                        sb.append(aline + "\n");
                    }
                    br = new BufferedReader(new FileReader(Toolbox.installpath + File.separator + "editcss.html"));
                    boolean first = true;
                    String installname = Toolbox1.geturl(request).replaceFirst(".FileOperation.*","").replaceFirst(".*/([^/]+)$","$1");
                    while ((aline = br.readLine()) != null) {
                        if (first && aline.indexOf("</textarea>") >= 0) {
                            out.println(aline.replaceFirst("</textarea>", sb + "</textarea>"));
                            first = false;
                        } else if (aline.indexOf("value=\"filename\"") >= 0) {
                            out.println(aline.replaceFirst("value=\"filename\"", "value=\"" + file + "\""));
                        } else if (aline.indexOf("</body>") >= 0) {
                            out.println(aline.replaceFirst("</body>.*", ""));
                            break;
                        } else {
                            out.println(aline.replaceAll("tealeaman",installname));
                        }
                    }
                } catch (Exception e) {
                    out.println("File can not be opened to read");
                }

            } else 
            {
                int slash = dir0.indexOf(File.separator);
                if (slash == -1) 
                {
                    slash = dir0.indexOf("/");
                }
                String courseid = dir0;
                if (slash != -1) 
                {
                    courseid = dir0.substring(0, slash);
                }
                JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
                    String sql = "SELECT  caption,category,description,name,cgi,opt,-1 from Operation WHERE name='LaTex'  OR name='Preview'"
                            + " UNION SELECT caption,category,description,name,cgi,opt,forstudent from Operation, OperationCourse where Operation.name=OperationCourse.operation and OperationCourse.course ='"
                            + courseid + "' AND  OperationCourse.forediting > 0 AND NOT cgi='preview.jsp' order by 7";
                    int n = 0;
                    boolean bn = adapter.executeQuery2(sql,false);
                    String alls = ",";
                    String toolstr = "";
                    int jj = 0;
                    for (int i = 0; bn && adapter.getValueAt(i, 0)!=null; i++) {
                        String url = adapter.getValueAt(i, 4).trim();
                        String name = adapter.getValueAt(i, 3).trim();

                        if (name.indexOf("RichEdit") >= 0 || url.indexOf("Upload") >= 0 || alls.indexOf("," + name + ",") >= 0) {
                            continue;
                        }
                        alls += name + ",";
                        jj++;
                        if (jj > 10) {
                            break;
                        }
                        for (int j = 0; j < 6; j++) 
                        {
                            String x = adapter.getValueAt(i, j);
                            if (name.equals("Preview") && j == 5) 
                            {
                                x = x.replaceFirst("format_t", "format_h");
                            }
                            toolstr += ";" + x.replaceAll(";", ",");
                        }
                    }
                    adapter.close();

                try 
                {
                    File f = new File(mountwebsite(dir, user), file);
                    FileInputStream fin = new FileInputStream(f);
                    InputStreamReader esr = new InputStreamReader(fin);
                    BufferedReader ebr = new BufferedReader(esr);
                    StringBuffer sb = new StringBuffer();
                    int k = 0;
                    String aline;
                    while (sb.length() < 3177 && (aline = ebr.readLine()) != null) 
                    {
                        if (sb.length()>0) sb.append("\n");
                        sb.append(aline);
                    }
                    int cpi = sb.indexOf("curvearr=[];");
                    int cpj = sb.indexOf("shapearr=[];");
                    
                    if (file.indexOf(".html") > 0 && cpi > 800 && cpj > 800) 
                    {    
                        String filetype = "text/HTML";
                        response.setContentType(filetype);
                        response.addHeader("Content-Disposition", "inline;filename=" + file);
                        //response.addHeader("X-XSS-Protection", "0");
                        if (out == null) 
                        {
                            out = response.getWriter();
                        }
                        
                        out.print(sb.toString().replaceAll("\n\\/\\*1\\*\\/","\n").replaceFirst("var filename=[^;]+", "var filename='" + file + "'").replaceFirst("var originalurl='[^;]+;", 
                                "var originalurl='" + Toolbox1.geturl(request).replaceFirst(".FileOperation.*","") + "';" ).replaceFirst("var orgnum=[0-9]+;", "var orgnum=" + orgnum + ";").replaceFirst("text/html;charset=[^\"]+","text/html;charset=" + Toolbox.encodings[orgnum>>16]).replaceFirst("var jsscripts = \\['[^,]+","var jsscripts = ['" + Toolbox.getUserLang(orgnum) +"'"  ));
                        boolean hastoolstr = false;
                        
                        while ( (aline = ebr.readLine())  != null) 
                        {
                            if (aline.indexOf("/*1*/")==0)
                                aline = aline.substring(5);
                             
                            if (aline.indexOf("var jsscripts = ['")>=0)
                            {
                               
                                out.print(aline.replaceFirst("var jsscripts = \\['[^,]+","var jsscripts = ['" + Toolbox.getUserLang(orgnum) +"'"  ));
                                continue;
                            }    
                            else if (aline.contains("var onlinetoolinitial = '';"))
                            {
                                hastoolstr = true;
                                out.print("\nvar onlinetoolinitial =\"" + toolstr + ";\";");
                                continue;
                            }
                             
                            out.print("\n" + aline);
                        }
                        ebr.close();
                        esr.close();
                        fin.close();
                        if (out != null) 
                        {
                            out.close();
                        }
                        return;
                    }
                    
                    
                    user.changedb(user.id);
                    
                    if (out == null) 
                    {
                        out = response.getWriter();
                    }
                    out.println("<!DOCTYPE html>\n<html lang=\""+Toolbox.langs[orgnum>>16]+"\" >" + Toolbox.getMeta(orgnum));
                    out.println("<head>");
                    out.println("<title>" + Toolbox.emsgs(orgnum,636) + "</title>");
                    out.println(Toolbox.jaxhead);
                    out.println("<script type=text/javascript>" + Toolbox.someconsts(orgnum) + "</script><script type=text/javascript  src=" + Toolbox.getUserLang(orgnum) + " ></script><script type=text/javascript  src=cookie.js></script>");
                    out.println("<script type=text/javascript  src=checkHTML.js></script>");
                    out.println(cachedstyle.toString() + "<link rel=\"stylesheet\" type=\"text/css\" href=\"styleb" + (orgnum) + ".css\">" );
                    out.println("</head>");
                    out.println("<body  style=\"background-color:" + cachedstyle.DBGCOLOR + ";margin:5 5 0 5\">"+ Toolbox.title(dir0 + "/" + file));
                    String tstmp = Toolbox.defaultParam(orgnum,request, "tstmp", "tinyerr", null, 20);
                    out.println("<form rel=opener name=f1 method=post action=FileOperation target=w" + tstmp + " onsubmit=\"return openwin()\" style=\"margin:5 0 0 0\"   >\n<input type=\"hidden\" name=\"securitytoken\" value=\""
                            + Toolbox.gentoken("editfile", "f1") + "\">");
                    out.println("<script  type=text/javascript>var needtranslator=true,onlinetoolinitial =  \"" + toolstr + "\";document.write(round1(''));</script><TABLE width=100% border=0 cellpadding=1 cellspacing=0 class=outset3 ><tr><td align=center>");
                    out.println("<table cellspacing=0 cellpadding=0><tr><td><nobr>");
                    out.println(Toolbox.emsgs(orgnum,358) + "</nobr></td><td>");
                    out.println("<input name=filedir type=hidden value=\"" + file + "\">");
                    out.println("<input name=folder type=hidden value=\"" + dir0 + "\">");
                    out.println("<input name=operation type=hidden value=save>");
                    out.println("<input type=hidden name=subfolder value=\"" + dir0 + "\">");
                    out.println("<input type=hidden name=winname value=\"\">");
                    out.println("<input type=hidden name=filename value=\"" + file.replaceFirst("\\..*", "") + "\"><input type=hidden name=ext value=\"tex,pdf\"><input type=hidden name=command value=pdflatex><input type=hidden name=feed value=x>");
                    out.println("<select name=fontsize onchange=\"chnfontsize(this)\">");
                    out.println("</select> </td><td><nobr>&nbsp;" + Toolbox.emsgs(orgnum,1348) + "</nobr></td><td><input name=linenum size=3 ></td><td>");
                    out.println("<input type=button class=GreenButton " + Toolbox.butstyle(cachedstyle.fontsize) + " name=goto value=\"" + Toolbox.emsgs(orgnum,1270) + "\" onclick=\"go2line(document.f1.linenum.value)\"></td><td>");
                    out.println("</td><td>");
                    out.println("<input type=text name=old size=10></td><td>");
                    out.println("<input type=button class=GreenButton " + Toolbox.butstyle(cachedstyle.fontsize) + " name=search value=\"" + Toolbox.emsgs(orgnum,1113) + "\" onclick=\"findstrintextarea(document.f1.old.value)\"></td><td>");
                    out.println("<input type=text name=newstr size=10></td><td>");
                    out.println("<input type=button  class=GreenButton " + Toolbox.butstyle(cachedstyle.fontsize) + " name=replace value=\"" + Toolbox.emsgs(orgnum,1114) + "\" onclick=\"replacestrintextarea(document.f1.newstr.value)\"></td><td>");
                    out.println("<input type=submit  class=OrangeButton " + Toolbox.butstyle(cachedstyle.fontsize) + " name=submit value=\"" + Toolbox.emsgs(orgnum,36) + "\" onclick=setaction('FileOperation')>");
                    if (file.toLowerCase().indexOf(".htm") > 0) {
                        out.println("<input type=button  class=OrangeButton  name=htmledit value=HTMLedit onclick=wyewyg(document.f1.destination)>");
                    }
                    String opt = Toolbox.defaultParam(orgnum,request, "option", "", ";:", 30);
                    
                    out.print("</td></tr></table></td></tr><tr><td align=left ><textarea name=destination style=\"" + opt + "font-size:" + cachedstyle.fontsize + "px;line-height:" + Math.round(1.4 * cachedstyle.fontsize) + "px\" rows=20 cols=50 onfocus=s(this) onblur=t(this) onkeypress=\"return mkstrike(this,event,'b')\">");
                    out.print(sb.toString().replaceAll("<", "&lt;"));
                    while ((aline = ebr.readLine()) != null) {
                        out.print("\n" + aline.replaceAll("<", "&lt;"));
                    }
                    fin.close();
                    out.println("</textarea>");
                    out.println("</td></tr></table><script  type=text/javascript>document.write(round2);</script></form>");
                    out.println("<script type=text/javascript  src=findrep.js></script>");
                    out.println("<script type=text/javascript  src=resizeCont.js></script>");
                    out.println("<script  type=text/javascript>");
                    out.println("var font_size=" + cachedstyle.fontsize + ";");
                     
                    out.println(Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle) + ";");
                    out.print(Toolbox.msgjspout((orgnum%65536)+user.id, true));
                    out.println("</script>");
                    out.println("<script type=text/javascript  src=editfile.js></script>");
                    out.println("<script src=curve.js?dn=30&sn=30></script>");
                    out.println("<script src=installtool.js></script>");
                    out.println("<iframe name=tinyerr0 width=1 height=1 style=visibility:hidden />");
                } catch (Exception e) {
                    out.println("</script>File can not be opened<br>");
                }
            }
             
            if (out != null) 
             {
                out.println("</body>");
                out.println("</html>");
                out.close();
             }
         
        } 
        else if (operation.equals("download")) 
        {
            File f = new File(mountwebsite(dir, user), file);
            
            sendFileBytes(request, response, f.getAbsolutePath(), des); 
            return;
        }
        else if (operation.equals("unzip")
            ||operation.equals("zip")
            ||operation.equals("backup")
            ||operation.equals("restore")
            ||operation.equals("delete")
            ||operation.equals("move")
            ||operation.equals("copy"))
            {
                if (operation.equals("backup") && request.getParameter("wheretogo").equals("download")) 
                {    
                     String ff = "tlf" + Toolbox.timestr("YYYYMMDD") + ".zip";
                     response.addHeader("Content-Disposition", "attachment;filename=" + ff);
                }
                final AtomicBoolean running = new AtomicBoolean(true);
                request.setAttribute("org.apache.catalina.ASYNC_SUPPORTED", true);
                AsyncContext asyncCtx = request.startAsync();
                asyncCtx.addListener(new AsyncListener(){

                public void onComplete(AsyncEvent asyncEvent) throws IOException {

                    //ServletResponse response = asyncEvent.getAsyncContext().getResponse();
                    running.set(false);
                }

                public void onError(AsyncEvent asyncEvent) throws IOException {

                   // ServletResponse response = asyncEvent.getAsyncContext().getResponse();
                    
                    running.set(false); 

                }

                public void onStartAsync(AsyncEvent asyncEvent) throws IOException 
                {

                    running.set(true);
                }


                public void onTimeout(AsyncEvent asyncEvent) throws IOException {

                    ServletResponse response = asyncEvent.getAsyncContext().getResponse();
                    PrintWriter out = response.getWriter();
                    out.write("myprompt('Taking too long. Quited')");
                    running.set(false);
                }
             }
            );
     
            asyncCtx.setTimeout(0);
            ThreadPoolExecutor executor = (ThreadPoolExecutor) request.getServletContext().getAttribute("executor");
            LongFilePro  lp = new LongFilePro(asyncCtx, user, operation, dir, file,userdir, orgnum, des, running,""+sek,cachedstyle);
            executor.execute(lp);
            
        }
    }
    
    Object forlock = new Object();
    static public String slashs(String dir)
    {
        if (dir == null) return dir;
        if (File.separator.equals("/"))
        {   
            return dir.replace("\\", File.separator);
        }
        return dir.replace("/", File.separator);
    }
    static public String stdfn(String fn)
    {
        return fn;
    }
    static public String mountwebsite(String folder, User user)
    {
       
        if ( user==null || Toolbox.dbadmin[user.orgnum%65536].websiteFolder == null || folder.indexOf(Toolbox.installpath + File.separator + "image")==0) 
        {
            return folder;
        }
        int orgnum = user.orgnum;
        String x = Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator;
        int k = x.length();
        String y = File.separator + "website";
        int i = folder.indexOf(x);
        if (i!=0)
        {
            x = Toolbox.dbadmin[orgnum%65536].webFileFolder1 + File.separator;
            k = x.length();
            i = folder.indexOf(x);
        }
        int j = folder.indexOf(y,k);
        if (   i == 0 && j - k > 1 )
        {
            x = folder.substring(k,j);
            if (x.equals(user.id) )
            {
               if( user.websitename != null && !user.websitename.equals("no") && !user.websitename.equals(""))
               {
                   if ((new File(Toolbox.dbadmin[orgnum%65536].websiteFolder + File.separator + user.websitename)).exists())
                   {
                       folder = Toolbox.dbadmin[orgnum%65536].websiteFolder + File.separator + user.websitename + ( folder.length() > j+8 ? folder.substring(j+8):"" );
                   }
               }
            }
        }

        return folder;
    }



    static public String typedes(String des, String file)
    {
            if (des==null|| des.equals(""))
            {
                des = "inline";
            } 
            String fnl = file.toLowerCase();
            String filetype ;
                 if (fnl.indexOf(".mp3")>0||fnl.indexOf(".wma")>0) 
                 {
                     filetype = "audio/mpeg";
                 }
                 else if (fnl.indexOf(".doc")>0)
                 {
                     filetype = "application/msword";
                 } 
                 else if (fnl.indexOf(".pdf")>0)
                 {
                     filetype = "application/pdf";
                 } 
                 else if (fnl.indexOf(".xls")>0)
                 {
                     filetype = "application/vnd.ms-excel";
                 } 
                 else if (fnl.indexOf(".ppt")>0)
                 {
                     filetype = "application/vnd.ms-ppt";
                 } 
                 else if (fnl.indexOf(".htm")>0)
                 {
                     filetype = "text/HTML";
                 }
                 else if (fnl.indexOf(".xml")>0)
                 {
                     filetype = "text/xml";
                 }
                 else if (fnl.indexOf(".jpg")>0)
                 {
                     filetype = "image/JPEG";
                 }
                 else if (fnl.indexOf(".gif")>0)
                 {
                     filetype = "image/GIF";
                 }
                 else if (fnl.indexOf(".png")>0)
                 {
                     filetype = "image/PNG";
                 }
                 else if (fnl.indexOf(".jar")>0)
                 {
                     filetype = "application/java";
                 }
                 else if (fnl.indexOf(".txt")>0 ||fnl.indexOf(".tex")>0
                         ||fnl.indexOf(".java")>0 ||fnl.indexOf(".cpp")>0 || fnl.indexOf(".c")>0 ||fnl.indexOf(".h")>0
                         ||fnl.indexOf(".js")>0 ||fnl.indexOf(".tex")>0)
                 {
                     filetype = "text/plain";
                     des = "attachment";
                 }
                 else if (fnl.indexOf(".zip")>0)
                 {
                    filetype = "application/zip";
                    des = "attachment";
                 }
                 else  
                 {
                     filetype = "application/x-download";
                     des = "attachment";
                 } 
                 return  des + "," + filetype;
     }
    public FileOperation()
    {
    }
    @Override
    public void init(ServletConfig config)
        throws ServletException
    {
        super.init(config);
    }
    @Override
    public void destroy()
    {
    }
    
    String savedone(HashMap h, String s)
    {
        if (h==null) 
        {
            return null;
        }
        Object x = h.get(s);
        if (x==null)
        {
            return null;
        }
        h.remove(s);
        return (String)(x);
    }
    public static boolean lucked(String dir, String  file)
    {
        try
        {
           File permitFile = new File( dir , "tmlpermi.txt");
           FileInputStream fin = new FileInputStream(permitFile);
           byte [] buf = new byte[256]; int j;
           StringBuffer allnames =  new StringBuffer(";");
           while ( ( j = fin.read(buf)) > 0)
           {
               allnames.append(new String(buf, 0, j));
           }
           fin.close();
           int k = allnames.indexOf(";" + file + ";" );
           return (k > -1);
         }
         catch(Exception e){}
         return false;
    }
    
    
    public static long getFileOrDirectorySize(File file) 
    {
       long size = 0;
       if (file==null) return 0;
       else if(file.isDirectory())
       {
          File[] files = file.listFiles();
          if(files != null) 
          {
             for(int i = 0; i < files.length; i++) 
             {
                long tmpSize = getFileOrDirectorySize(files[i]);
                size += tmpSize;
             }
             return size;
          }
          return 0;
      }
      else if (file.isFile())
         return file.length();
      return 0;
    }
    
    public static boolean copy(String source, String dest)
    {
        if (source==null || dest == null  )
                    return false;
        source =source.trim();
        dest = dest.trim();
        if (dest.indexOf(source) == 0 || source.indexOf(dest) == 0)
             return false;
        boolean ans = true;
        if ( (new File( (source))).isFile())
        {
               
            int jj = 0; byte buf[]= new byte[1024];
            try 
            {
                FileInputStream fin = new FileInputStream(new File( (source)));
                FileOutputStream fout = new FileOutputStream(new File( (dest)));
                while ( (jj = fin.read(buf)) > 0) fout.write(buf,0,jj);
                fin.close();
                fout.close();
            }
            catch( Exception e){ ans = false;}
               
        }
        else
        {
           // System.out.println(source + "  ->  "  +dest);
            source = source.replace('/', File.separator.charAt(0));
            if  ( !(new File( (dest))).mkdir() )
                ans = false;
            else
            {   
                 
                 String ls [] = null;
                 File fs = new File(source);
                 if (fs.exists()) ls = fs.list();
                 if (ls==null)
                     ans = true;
                 else
                 for (int j =0; j < ls.length; j++)
                    ans = ans && copy(source + File.separator + ls[j] , dest + File.separator + ls[j]);
            } 
        }
        return ans;         
    }

    static public String getFileName(String s)
    {
        if (s==null) return "a.txt";
        s = s.trim();
        int i = s.lastIndexOf("\\");
        if(i < 0 || i >= s.length() - 1)
        {
            i = s.lastIndexOf("/");
            if(i < 0 || i >= s.length() - 1)
               i=-1;
        }
        s = s.substring(i + 1);
        String x = "";
        int N = 20;
        boolean inname = true;
        for (i=0; i < s.length(); i++)
        {
           char c = s.charAt(i);
           if (c=='.')
           {
              inname = false;
              x += '.';
           }
           else if (c <= 'Z' && c >='A' || c <='z' && c>='a' || c<='9' && c>='0'|| c=='_'||c=='-'||c=='$')
           {
              if (inname == false ||  x.length() < N )
                 x += c;
           }
        }
        x =  x.replaceAll("\\.\\.", ".");
        if (x.equals("")) x = "a.txt";
        else if (x.charAt(0)=='.') x = "a" + x;
        return x;
    }
    private void writeIndex(String fn)
    {
        try 
        {     
           FileWriter aWriter = new FileWriter( fn+File.separator+"index.html" , false);
           aWriter.write("<script  type=text/javascript>window.location.href='/" + Toolbox.appname +"/index.jsp';</script>");
           aWriter.close();
        } 
        catch(Exception e){Toolbox.print(1,e.toString());}
    }
    boolean ispicfile(String f)
    {
        if (f == null) return false;
        f = f.toLowerCase();
        return f.indexOf(".jpg")>0 || f.indexOf(".png")>0 || f.indexOf(".gif")>0;
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException
    {
        processRequest(request, response);
    }
     @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException
    {
        processRequest(request, response);
    }
     @Override
    public String getServletInfo()
    {
        return "Short description";
    }
    
    void sendFileBytes(HttpServletRequest request, HttpServletResponse response, String coded, String des) throws ServletException
    {
        int orgnum = Toolbox.setcharset(request, response);
        File f = new File(coded);
        if (f.exists() == false) return;
        
        if (f.getName().toLowerCase().contains(".htm") && des!=null && des.equals("inline")) 
        {
            try
            {
                String filetype = "text/HTML";
                response.setContentType(filetype);
                response.addHeader("Content-Disposition", "inline;filename=" + f.getName());
                PrintWriter out = response.getWriter();
                FileInputStream fin = new FileInputStream(f);
                InputStreamReader esr = new InputStreamReader(fin);
                BufferedReader ebr = new BufferedReader(esr);
                StringBuffer sb = new StringBuffer();
                int k = 0;
                String aline;
                while (sb.length() < 3177 && (aline = ebr.readLine()) != null) 
                {
                    if (sb.length()>0) sb.append("\n");
                    sb.append(aline);
                }
                int cpi = sb.indexOf("curvearr=[];");
                int cpj = sb.indexOf("shapearr=[];");
                if (cpi > 800 && cpj > 800) 
                {    
                    out.print(sb.toString().replaceAll("var editable=true;","var editable=false;").replaceAll("\n\\/\\*1\\*\\/","\n").replaceFirst("var filename=[^;]+", "var filename='" + f.getName() + "'").replaceFirst("var originalurl='[^;]+;", 
                            "var originalurl='" + Toolbox1.geturl(request).replaceFirst(".FileOperation.*","") + "';" ).replaceFirst("var orgnum=[0-9]+;", "var orgnum=" + orgnum + ";").replaceFirst("text/html;charset=[^\"]+","text/html;charset=" + Toolbox.encodings[orgnum>>16]).replaceFirst("var jsscripts = \\['[^,]+","var jsscripts = ['" + Toolbox.getUserLang(orgnum) +"'"  ));
                    while ( (aline = ebr.readLine())  != null) 
                    {
                        if (aline.indexOf("/*1*/")==0)
                            aline = aline.substring(5);
                        if (aline.indexOf("var jsscripts = ['")>=0)
                        {
                            out.print(aline.replaceFirst("var jsscripts = \\['[^,]+","var jsscripts = ['" + Toolbox.getUserLang(orgnum) +"'"  ));
                        }    
                        out.print("\n" + aline);
                    }
                    
                }
                else
                {
                    out.println(sb.toString());
                    while ( (aline = ebr.readLine()) != null) 
                    {
                        out.println(aline); 
                    }
                }
                ebr.close();
                esr.close();
                fin.close();
                if (out != null) 
                {
                    out.close();
                }
            }
            catch(Exception e){}
        }
        else
        {
            ServletOutputStream stream = null;
            BufferedInputStream buf = null;
            int jj = coded.lastIndexOf(File.separator );
            String file = coded.substring(jj + 1);
            if (des == null || des.equals("")) 
            {
                des = "inline";
            }
            String filetypes[] = typedes(des, file).split(",");
            String filetype = filetypes[1];
            des = filetypes[0];
            try {
                response.setContentType(filetype);
                response.addHeader("Content-Disposition", des + ";filename=" + file);
                stream = response.getOutputStream();
                response.setContentLength((int) f.length());
                FileInputStream input = new FileInputStream(f);
                buf = new BufferedInputStream(input);
                int readBytes = 0;
                while ((readBytes = buf.read()) != -1) 
                {
                    stream.write(readBytes);
                }
                input.close();
            } catch (IOException ioe) 
            {
                throw new ServletException(ioe.getMessage());
            } 
            finally 
            {
                if (stream != null) 
                {
                   try{ stream.close();}catch(IOException ioe)
                   {
                       throw new ServletException(ioe.getMessage());
                   } 
                }
                if (buf != null) 
                {
                    try{ buf.close();}catch(IOException ioe)
                   {
                       throw new ServletException(ioe.getMessage());
                   } 
                }
            }
        }
    }  
}

 