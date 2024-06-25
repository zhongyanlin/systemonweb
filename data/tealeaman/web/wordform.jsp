<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*,java.util.zip.*,java.io.*" %>

<%
    int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
%>
<%! 
    boolean isimage(String fext)
    {
        return fext.toLowerCase().equals("jpg") || fext.toLowerCase().equals("jpeg") || fext.toLowerCase().equals("png") || fext.toLowerCase().equals("gif"); 
    }
    String fields2(String str, int fontsize, int orgnum, CachedStyle  cachedstyle) 
    {
        return "<table width=100% cellspacing=0 cellpadding=0 style=\"margin:0px 0px 0px 0px\"><tr><td style=\"background:linear-gradient(to right," + cachedstyle.IBGCOLOR  + "," +  Toolbox.headercl(cachedstyle.IBGCOLOR) + ")\" ><font color=#DDCC11><b><nobr>" + str + "</nobr></b></font></td></tr></table>";
    }

    class SamePrefix implements FilenameFilter {

        String prefix = "";

        SamePrefix(String s) {
            prefix = s;
        }

        public boolean accept(File dir, String fn) {
            String f = new File(fn).getName();
            return f.indexOf(prefix + "_") == 0 && f.indexOf(".htm") > 0
                    || f.indexOf(prefix + ".htm") == 0;
        }
    }

    void renameFiles(String filename, String newname, int orgnum) {
        try {
            File fd = new File(Toolbox.dbadmin[orgnum%65536].webFileFolder +  File.separator + "forms");
            String[] ls = fd.list(new SamePrefix(filename));
            for (int i = 0; i < ls.length; i++) 
            {
                FileInputStream fin = new FileInputStream(path(ls[i],orgnum));
                InputStreamReader esr = new InputStreamReader(fin);
                BufferedReader ebr = new BufferedReader(esr);
                String aline = null;
                FileWriter awriter = new FileWriter(path(ls[i].replaceFirst(filename, newname),orgnum));
                while ((aline = ebr.readLine()) != null) {
                    awriter.write(aline.replaceAll("forms/" + filename + "/", "forms/" + newname + "/") + "\n");
                }
                awriter.close();
                fin.close();
                path(ls[i],orgnum).delete();
            }
          

        } catch (Exception e) {
        }
    }

    void delete(String discard, JDBCAdapter adapter,int orgnum)   
    {
        try 
        {
            path(discard,orgnum).delete(); 
            File f = new File(Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator + "forms/" + discard); 
            File list[] = f.listFiles();
            for (int i = 0; i < list.length; i++) {
                list[i].delete();
            }
            f.delete();
            int n = adapter.executeUpdate("DELETE FROM UserForm   WHERE formname='" + discard.replaceAll("'", "''") + "'");
            n = adapter.executeUpdate("DELETE FROM Task   WHERE  name='" + discard.replaceAll("'", "''") + "'");
            n = adapter.executeUpdate("DELETE FROM Apptable   WHERE  tname='" + discard.replaceAll("'", "''") + "'");
        } catch (Exception e) {
        }
    }

    File path(String filename, int orgnum) {
        if (filename.indexOf(".htm") < 0) {
            filename += ".htm";
        }
        return new File(Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator +  "forms" + File.separator + filename);
    }

    boolean deldir(File fd) {
        try {
            if (!fd.exists()) {
                return true;
            }
            if (fd.isFile()) {
                return fd.delete();
            }
            File t[] = fd.listFiles();
            boolean ans = true;
            for (int i = 0; i < t.length; i++) {
                ans = ans && deldir(t[i]);
            }
            ans = ans && fd.delete();
            return ans;

        } catch (Exception e) {
            return false;
        }
    }

    String parse(String aline, StringBuffer srcs, String rdap, String uid1, String labels, int state[], int orgnum) {
        if (aline.indexOf("<script type=text/javascript >var uid='") >= 0) {
            state[1] = 1;
            return aline;
        }
        int K = 0;
        String lowsecase = aline.toLowerCase();
        if (state[0] == 0) {
            if (lowsecase.indexOf("<html") >= 0) {
                state[0] = 1;
            }
        }
        if (state[0] == 1) 
        {
            if ( (K = lowsecase.indexOf("<body")) >= 0) 
            {
                state[0] = 2;
            }
        }
        int j = 0;

        boolean hasimgage = false;

        if (state[0] == 2 && ((j = lowsecase.indexOf("src=",K+4)) >= 0 || (j = lowsecase.indexOf("href=",K+4)) >= 0)) 
        {
            while (j >= 0) 
            {
                hasimgage = true;
                j = aline.indexOf("=", j);
                int j1 = j + 3;

                if (aline.charAt(j + 1) == '"') {
                    j++;
                    j1 = aline.indexOf("\"", j + 1);
                } else {
                    j1 = aline.indexOf(" ", j + 1);
                }
                if (j1 == -1) {
                    j1 = aline.indexOf(">", j + 1);
                }

                String src = "";
                if (j1 != -1) {
                    src = aline.substring(j + 1, j1);
                } else {
                    src = aline.substring(j + 1);
                }
                String nameonly = src.substring(src.lastIndexOf("/") + 1);
                if (src.toLowerCase().indexOf("http://") < 0 && src.toLowerCase().indexOf("https://") < 0) 
                {
                    String xx = "";
                    if (j1 != -1) 
                    {
                        xx = aline.substring(j1);
                    }
                    if ((new File(Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator + "forms" + File.separator + rdap + File.separator + nameonly)).exists()) {
                        aline = aline.substring(0, j + 1) + "forms/" + rdap + "/" + nameonly + xx;
                    } else if ((new File(Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator + src.replace('\\', File.separator.charAt(0)))).exists()) {
                        aline = aline.substring(0, j + 1) + src.replace('\\', '/') + xx;
                    } else {
                        File fd = new File(Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator + "forms" + File.separator + rdap);
                        if (fd.exists() == false) {
                            fd.mkdir();
                        }
                        aline = aline.substring(0, j + 1) + "forms/" + rdap + "/" + nameonly + xx;
                        srcs.append(src + ", ");
                    }
                }
                j1 = aline.indexOf("src=", j + 4);
                if (j1 < 0) 
                {
                    j1 = aline.indexOf("href=", j + 4);
                }
                j = j1;
            }
        }

        if (state[0] >= 2 && lowsecase.indexOf("</body>") >= 0) {
            state[0] = state[0] + 1;
        }

        if (state[0] >= 3 && lowsecase.indexOf("</html>") >= 0) {
            aline = aline.replaceFirst("<.[h|H][t|T][m|M][l|L]>", "");
        }

        return aline;
    }
    public String addone(String sn) {
        int i = sn.indexOf(".");
        if (i == -1) {
            i = sn.length();
        }
        int j = i - 1;
        while (j >= 0 && sn.charAt(j) <= '9' && sn.charAt(j) >= '0') {
            j--;
        }
        String t = "";
        if (j + 1 == i) {
            t = sn.substring(0, i) + '1';
        } else {
            t = sn.substring(j + 1, i).replaceFirst("^0+", "");
            if (t.equals("")) {
                t = "0";
            }
            int k = Integer.parseInt(t) + 1;
            t = "" + k;
            while (t.length() < i - j - 1) {
                t += '0' + t;
            }
            if (j + 1 > 0) {
                t = sn.substring(0, j + 1) + t;
            }
        }
        if (i < sn.length()) {
            t += sn.substring(i);
        }
        return t;

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
       
        String x = Toolbox.validate(s, null, 30).replaceAll(" ","");
       
        x =  x.replaceAll("[\\.]+", ".");
        if (x.equals("")) x = "a.txt";
        else if (x.charAt(0)=='.') x = "a" + x;
        return x;
    }
    
    String merge(String help, String defaultv)
    {
            if ( defaultv == null || defaultv.trim().equals("") ) return help;
            
            CSVParse parse = new CSVParse(help, '\'', new String[]{",","\r\n"});
            String [][] xs = parse.nextMatrix(true);
            String [] dfv = defaultv.split("\n");
            for (int i=0; i < dfv.length; i++)
            {
                int j=0;
                if (dfv[i].indexOf("=")<2) continue;
                String [] ys = dfv[i].split("=");
                if (ys.length == 1) continue;
                for (; j < xs.length; j++)
                {
                    if (xs[j][0]!=null && ys[0]!=null && xs[j][0].trim().toLowerCase().equals(ys[0].trim().toLowerCase()))
                    {
                        if (xs[j].length<3) 
                        {
                            xs[j] = new String[]{xs[j][0], xs[j][1], ys[1].trim()};
                        }
                        else 
                            xs[j][2] = ys[1].trim();
                        break;
                    }
                }
            }
            help = "";
            for (int i=0; i < xs.length; i++)
            {
                if (i>0) help += "\n";
                for (int j=0; j < xs[i].length; j++)
                {
                    if (j > 0)
                        help += ",";
                    if (xs[i][j] == null) 
                        continue;
                    if (xs[i][j].indexOf(",")>=0 || xs[i][j].indexOf("\n") >= 0|| xs[i][j].indexOf("\r") >= 0|| xs[i][j].indexOf("'") >= 0)
                        help += "'" + xs[i][j].replaceAll("'", "''") + "'";
                    else
                        help +=  xs[i][j]; 
                }
            }
           
            return help;
    }
%>
<%
    
    User user = null;

    if ((user = User.authorize(orgnum, -1, application, session, request, response, "wordform.jsp", true)) == null) {
        return;
    }

    if ((user = User.dbauthorize(application, session, request, response, "wordform.jsp", true)) == null) {
        return;
    }
    CachedStyle cachedstyle = new  CachedStyle(request, orgnum);
    String securitytoken = Toolbox.gentoken("wordform.jsp", "f1");
    String style = Toolbox.butstyle(cachedstyle.fontsize);
    boolean bb = user.changedb(user.id);
    long tstmp = System.currentTimeMillis() % 10000000;
    String uid1 = user.id;
    String subdb = "&subdb=" + user.id + "&cdrdap=1";

    if (user.getDBConnectInfo().equals(Toolbox.dbadmin[orgnum%65536].sysDBConnectInfo())) {
        subdb = "";
        uid1 = "";
    }

    JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
    if (!adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
    return;
}
    String mode = Toolbox.defaultParam(orgnum,request, ("mode"), null);
    mode = Toolbox.validate(mode, null, 20);
    String sec = Toolbox.defaultParam(orgnum,request, ("securitytoken"), null);
    
    if (mode != null && !Toolbox.verifytoken(request)) {
        adapter.close();
        return;
    }
    
    String labels = "',font_size=" + cachedstyle.fontsize + ",lblorder='" + Toolbox.emsgs(orgnum,231) + "',lblsearch='" + Toolbox.emsgs(orgnum,37) + "',lblhint='" + Toolbox.emsgs(orgnum,1044) + "',lblsubmit='" + Toolbox.emsgs(orgnum,51) + "',lblsave='" + Toolbox.emsgs(orgnum,36)+ "',lblcancel='" + Toolbox.emsgs(orgnum,169) + "',lblupdate='" + Toolbox.emsgs(orgnum,1447) + "',lbldelete='" + Toolbox.emsgs(orgnum,30) + "',lblreview='" + Toolbox.emsgs(orgnum,960) + "',lblnorecord='" + Toolbox.emsgs(orgnum,491) + "',lblenterone='" + Toolbox.emsgs(orgnum,866) + ' ' + Toolbox.emsgs(orgnum,231) + "',lblreally='" + Toolbox.emsgs(orgnum,1067) + "',lblman='" + Toolbox.emsgs(orgnum,1332) + "',lblall = '" + Toolbox.emsgs(orgnum,1279) + "',lbloriginal = '" + Toolbox.emsgs(orgnum,479) + "',lblwait = '" + Toolbox.emsgs(orgnum,154) + "',lblselect = '" + Toolbox.emsgs(orgnum,206) + "',lblsep = '" + Toolbox.emsgs(orgnum,1448) +"',lblselect = '" + Toolbox.emsgs(orgnum,828) + "',lblalls = '" + Toolbox.emsgs(orgnum,1280);
    String modifyinstr = "";
    String srcs = "";
    String rdap = null;
    String override = null;
    String fontname = Toolbox.fontsnamestr(orgnum>>16); 
    String apath = "";
    
    
    if (mode == null || mode.equals("")) 
    {

        String aline;
        String filename = null;
        String filename1 = null;
        String fileextname = null;
        String attach = null;
        File saveFile = null;
        int k, j = 0;
 
        if (Toolbox.defaultParam(orgnum,request, ("filedir"), null) != null && Toolbox.defaultParam(orgnum,request, ("folder"), null) != null && Toolbox.defaultParam(orgnum,request, ("operation"), null) != null) 
        {
            aline = Toolbox.defaultParam(orgnum,request, ("destination"), null);
            aline = Toolbox.removescript(aline);
            filename = user.id + "_fm0";
            saveFile = new File(Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator +  "forms" + File.separator + filename);
            FileWriter aWriter = new FileWriter(saveFile, false);
            aWriter.write(aline);
            aWriter.close();
            fileextname = "html";
            rdap = Toolbox.defaultParam(orgnum,request, ("filedir"), null);
            rdap = Toolbox.validate(rdap, null, 30);
            
        } 
        else 
        {
            String boundary = request.getContentType();
            int i;
            if ((i = boundary.indexOf("boundary=")) != -1) {
                boundary = boundary.substring(i + 9);
                boundary = "--" + boundary;
            }
            int B = boundary.length() + 2;
            ServletInputStream sin = request.getInputStream();
            byte b[] = new byte[2048];
            byte crlf[] = new byte[2];
            boolean left = false;
            boolean had = false;
            
 

            FileOutputStream binout = null;

            int numlines = 0;


            while ((k = sin.readLine(b, 0, 2048)) > 0) 
            {
                if (k <= 100) // if a line > 100, it is for sure a middle file content
                {
                    aline = new String(b, 0, k);
                } 
                else 
                {
                    aline = "";
                }
 
                if (had == false) 
                {
                  
                    if (k > 100) 
                    {
                        continue;
                    } 
                    else if (aline.indexOf("attach") >= 0) 
                    {
                        do 
                        {
                            k = sin.readLine(b, 0, 2048);
                            aline = (new String(b, 0, k)).trim();
                        } while (aline.length() < 2);
                        attach = aline;
                        
                    }
                    else if (aline.indexOf("fontname") >= 0) 
                    {
                        do 
                        {
                            k = sin.readLine(b, 0, 2048);
                            aline = (new String(b, 0, k)).trim();
                        } while (aline.length() < 2);
                        fontname = aline;
                       
                    } else if (aline.indexOf("securitytoken") >= 0) {
                        do {
                            k = sin.readLine(b, 0, 2048);
                            aline = (new String(b, 0, k)).trim();
                        } while (aline.length() < 2);
                        securitytoken = aline;
                       
                    } else if (aline.indexOf("rdap") >= 0) {
                        do {
                            k = sin.readLine(b, 0, 2048);
                            aline = (new String(b, 0, k)).trim();
                        } while (aline.length() < 2);
                        rdap = aline;
                        rdap = Toolbox.validate(rdap, null, 30);
                       
                    } else if (aline.indexOf("override") >= 0) {
                        do {
                            k = sin.readLine(b, 0, 2048);
                            aline = (new String(b, 0, k)).trim();

                        } while (aline.length() < 2);
                        override = aline;
                        
                        override = Toolbox.validate(override, "/\\@-", 30);  
                        if (override.indexOf("---") >= 0) {
                            override = null;
                        }
                        
                    } else if (aline.indexOf("filename") >= 0) {
                        aline = aline.toLowerCase(); // extract file extension name
                     
                        k = aline.indexOf("filename=\"");
                        aline = aline.substring(k + 10).replaceFirst("\"", "");
                        k = aline.lastIndexOf("/");
                        if (k == -1) {
                            k = aline.lastIndexOf("\\");
                        }
                        filename = aline.substring(k + 1);
                        apath = filename;
                        k = aline.lastIndexOf(".");
                        if (k == -1) 
                        {
                            fileextname = "";
                        } 
                        else 
                        {
                            fileextname = aline.substring(k + 1).toLowerCase().trim();
                            filename = aline.substring(0, k);
                        }
                       
                        if (override == null || rdap == null) 
                        {
                            filename = user.id + "_fm0";
                            saveFile = new File(Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator + "forms" + File.separator + filename);
                        } 
                        else 
                        {
                            if ( 0 == adapter.executeQuery("select formname from UserForm WHERE formname='" + rdap + "' AND uid='" + user.id + "'")) 
                            {
                                 adapter.close();
                                 out.println("Not authortize to modify form " + rdap);
                                 return;
                            }
                             
                            if ((k = override.lastIndexOf("/")) > 0) 
                            {
                                apath = Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator + "forms";
                                saveFile = new File(apath);
                                if (saveFile.exists() == false) 
                                {
                                    saveFile.mkdir();
                                }
                                apath += File.separator + rdap;
                                saveFile = new File(apath);
                                if (saveFile.exists() == false) 
                                {
                                    saveFile.mkdir();
                                }
                                filename = override.substring(k + 1);
                                saveFile = new File(apath, filename);
                            } 
                            else 
                            { //although override is known, saved as temp to participate parse
                                filename = user.id + "_fm0";
                                saveFile = new File(Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator +  "forms" + File.separator + filename);
                            }
                             
                        }
                        
                        try
                        { 
                            binout = new FileOutputStream(saveFile);
                        }
                        catch(Exception e)
                        {
                            out.print("8" + e.toString()); 
                            return;
                        }
                        
                        k = sin.readLine(b, 0, 2048);
                        k = sin.readLine(b, 0, 2048);
                        had = true;
                        numlines = 0;

                    }
                } // had == true
                else 
                {
                    numlines++;
                    if (aline.indexOf(boundary) == 0) 
                    {
                        had = false;
                    } else 
                    {
                        if (left) 
                        {
                            binout.write(crlf, 0, 2);
                        }
                        if (k < 2) 
                        {
                            binout.write(b, 0, k);
                            left = false;
                        } else 
                        {
                            if (k > 2) 
                            {
                                binout.write(b, 0, k - 2);
                            }
                            crlf[0] = b[k - 2];
                            crlf[1] = b[k - 1];
                            left = true;
                        }
                    }
                }
            }
 

            if (saveFile == null) {
                out.println(Toolbox.emsgs(orgnum,1349));
                adapter.close();
                return;
            }
            binout.close();
            if (rdap == null ||   mode!=null && !Toolbox.verifytoken(securitytoken) ) 
            {
                out.println("No form name");
                adapter.close();
                return;
            }
            // now override, rdap are ready. rename
            if (filename.equals(user.id + "_fm0")) 
            {
                if (override == null) 
                {
                    if (fileextname.indexOf("txt") < 0 && fileextname.indexOf("htm") < 0) {
                        out.println(Toolbox.emsgs(orgnum,1349));
                        saveFile.delete();
                        adapter.close();
                        return;
                    }
                    //will parse
                } 
                else 
                {
                    File targetFile = null;
                    if (override.indexOf("@@@@@@@@")>=0)
                    {
                        if (!fileextname.equals("")) 
                           fileextname = "." + fileextname;
                        filename = getFileName(apath);
                        apath = Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator + "attach" + File.separator + rdap;
                        if ( (new File(apath)).exists() == false)  (new File(apath)).mkdir();
                        if ( (new File(apath)).exists() == false)
                        {
                            out.println("OS disallow creating folder " + apath); 
                            adapter.close();
                            return;                                    
                        }
                        targetFile = new File(apath, filename);
                        try 
                        {
                           targetFile.delete();  //rename
                           saveFile.renameTo(targetFile);
                        } catch (Exception e) { }
                    }
                    else  if ((k = override.indexOf("/")) > 0) 
                    {
                        filename = override.substring(k + 1);
                        targetFile = new File(Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator + "forms");
                        if (targetFile.exists() == false) 
                        {
                            targetFile.mkdir();
                        }
                        targetFile = new File(Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator + "forms" + File.separator + rdap);
                        if (targetFile.exists() == false) 
                        {
                            targetFile.mkdir();
                        }
                        targetFile = (new File(Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator + "forms" + File.separator + rdap + File.separator + filename));
                        try 
                        {
                            targetFile.delete();  //rename
                            saveFile.renameTo(targetFile);
                        } catch (Exception e) {
                        }
                    }
                }
            }
        }

// end of binary file case
 //begin parseing
boolean b1 = (fileextname.indexOf("txt") == 0 || fileextname.indexOf("htm") == 0); 
boolean b2 = filename.equals(user.id + "_fm0");
boolean b3 = b1 && b2;
if (b3==false) saveFile = path(user.id + "_fm",orgnum);
 
 if (attach!=null ) 
        {
            
            Encode6b encoder = new Encode6b(orgnum);
            String js = encoder.to6b(Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator +  "forms"+  File.separator + rdap +  File.separator + filename);
            out.println("<!DOCTYPE html><html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + "<script type=text/javascript  src=" + Toolbox.getUserLang(orgnum) + "></script><script type=text/javascript  src=cookie.js></script></head>");
            out.println("<body ><script>");
            out.println("parent.frames[1].document.body.style.backgroundImage='url(FileOperation?did=" + js + ")';");
            out.println("myprompt('<img src=image/guide1.gif height=60 style=\"float:left\">'+ textmsg[1578].replace(/\\n/g,'<br>'),null,null,textmsg[191]);");
            out.println("</script></body>");
            return; 
        }  
        else if ( b3 || saveFile.exists()) 
        {

            File fou = null;
            FileWriter fout = null;
            boolean isfm = saveFile.getName().equals(user.id + "_fm.htm");
            filename = user.id + "_fm.htm";
            if (!isfm) {
                fou = path(filename,orgnum);
                fout = new FileWriter(fou, false);
            }
            try 
            {    
                Scanner scanner = new Scanner(saveFile);   
                aline = scanner.useDelimiter("\\Z").next();
                scanner.close();
                int state[] = {0, 0};
                StringBuffer buf = new StringBuffer("");
                aline = Toolbox.removescript(aline);
                aline = Toolbox1.dothetable(aline);
                aline = parse(aline, buf, rdap, uid1, labels, state,orgnum); 
 
                    if (fout != null) 
                    {
                        if (state[0] == 3 && state[1] == 0) 
                        {
                             
                            fout.write(aline.replaceFirst("(i?)</body>", "\n<script>var uid='" + uid1 + labels + "';var fontname='" + fontname + "';</script>\n</body>") + "\n");
                          
                        } 
                        else if (!aline.equals("")) 
                        {
                            fout.write(aline + "\n");
                        }
                    }
                    if (state[0] == 3) 
                    {
                        aline = aline.replaceFirst("(i?)</body>", "</body>\n<script type=text/javascript>" + Toolbox.someconsts(orgnum) + "</script><script type=text/javascript  src=\"" + Toolbox.getUserLang(orgnum) + "\"></script>\n" + (state[1] == 0 ? "<script type=text/javascript >var uid='" + uid1 + labels + "';" : "<script>") + "var filename='" + rdap + "';parent.parent.frames[0].sendSrcs(\"" + buf + "\"); " +  Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)  + ", securitytoken=\"" + securitytoken + "\";var fontname='" + fontname + "';</script><script type=text/javascript src=databind.js></script>");
                        state[0] = 4;   
                        int hasmath [] = new int[1];
                        aline = DataManager.addMath(aline, hasmath);
                        if (hasmath[0] == 1)
                           aline = aline + "<script type=text/javascript src=curve.js></script>";
                    }
               
                out.println(aline);
                srcs = buf.toString();
                
                if (fout != null && !isfm) 
                {
                    fout.close();
                    saveFile.delete();
                }
                if (state[0] != 4) 
                {    
                    out.println("<b>" + Toolbox.emsgs(orgnum,804) + "</b>");
                    if (state[0] == 0) {
                        out.println("<b>" + Toolbox.emsgs(orgnum,805) + "</b>");
                    } else if (state[0] == 1) {
                        out.println("<b>" + Toolbox.emsgs(orgnum,806) + "</b>");
                    } else if (state[0] == 2) {
                        out.println("<b>" + Toolbox.emsgs(orgnum,807) + "</b>");
                    }
                } else if (override != null) 
                {   
                    int n = adapter.executeQuery("select query from Task where name='" + rdap + "'");
                    String xx = adapter.getValueAt(0, 0);
                    j = xx.indexOf(" FROM");
                    out.println("<script type=text/javascript >parent.frames[0].consistant('" + xx.substring(0, j).replaceFirst("SELECT", "").replaceAll("[a-z][0-9]+ AS ", "").replaceFirst("n as n_h,", "").replaceAll("_[a-z]", "").trim() + "','" + override + "');</script>");
                } 
            } 
            catch (Exception e) 
            {
                out.println(Toolbox.emsgs(orgnum,808));
            }

            adapter.close();
        } 
        else if (!(saveFile = path(user.id + "_fm",orgnum)).exists() && path(rdap,orgnum).exists())  
        {
            mode = "9";
        } 
        else if ( (saveFile = path(user.id + "_fm",orgnum)).exists() == false && (new File(Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator +  "forms"+  File.separator + rdap +  File.separator + filename)).exists() && isimage(fileextname))  
        {
             
            Encode6b encoder = new Encode6b(orgnum);
            String js = encoder.to6b(Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator +  "forms"+  File.separator + rdap +  File.separator + filename);
            out.println("<!DOCTYPE html><html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + "</head><body><script>parent.parent.frames[0].makeit('" + js + "');</script></body>");
        }
        else 
        {
             
            out.println("<!DOCTYPE html><html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>" + Toolbox.getMeta(orgnum) + "</head><body><script>parent.parent.frames[0].myprompt('" + Toolbox.emsgs(orgnum,71) + "');</script></body>");
        }
        

    } // end of mode==null

    if (mode != null) {
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
    <head><title><%=Toolbox.emsgs(orgnum,4)%></title>
        <%=Toolbox.getMeta(orgnum)+ Toolbox.jaxhead%>
        <%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
        <style type="text/css">
            td.fieldlbl{background-color:<%=cachedstyle.TBGCOLOR%>}
            td.fieldhead{background-color:<%=cachedstyle.BBGCOLOR%>;font-weight:700}
            td.value2{padding:0px 0px 0px 0px;width:<%=Math.round(4.4*cachedstyle.fontsize)%>px;background-color:<%=cachedstyle.TBGCOLOR%>;color:<%=cachedstyle.IBGCOLOR%>;font-family:<%=Toolbox.fontsnamestr(orgnum>>16) %>;font-size:<%=cachedstyle.fontsize%>px;font-weight:bold;margin:1px 1px 1px 1px;}
            td.fields2{padding:0px 0px 0px 0px;background:<%="linear-gradient(to right," + cachedstyle.IBGCOLOR  + "," +  Toolbox.headercl(cachedstyle.IBGCOLOR) + ")"%>;color:#DDCC11;font-family:<%=Toolbox.fontsnamestr(orgnum>>16) %>;font-size:<%=cachedstyle.fontsize%>px;font-weight:bold;margin:1px 1px 1px  px;}
            .tdbutton{width:<%=Math.round(4.4*cachedstyle.fontsize)%>px;border:1px green outset;color:white;font-family:<%=Toolbox.fontsnamestr(orgnum>>16) %>;font-size:<%=cachedstyle.fontsize%>px;font-weight:bold;text-shadow:#606060 -1px -1px;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:3px;margin:3px 3px 3px 3px;}
            .buttong {border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;background:url(image/GreenButton.gif);color:white;width:<%=4 * cachedstyle.fontsize%>px;border:1px #EEEEEE outset;font-size:<%=cachedstyle.fontsize%>px;font-weight:bold;text-shadow:#707070 -1px -1px}
            .buttonr {border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;background:url(image/RedButton.gif);color:white;width:<%=4 * cachedstyle.fontsize%>px;border:1px #EEEEEE outset;font-size:<%=cachedstyle.fontsize%>px;font-weight:bold;text-shadow:#707070 -1px -1px}
            .buttono {border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;background:url(image/OrangeButton.gif);color:white;width:<%=4 * cachedstyle.fontsize%>px;border:1px #EEEEEE outset;font-size:<%=cachedstyle.fontsize%>px;font-weight:bold;text-shadow:#707070 -1px -1px;text-align:center}
            .buttonb {border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;background:url(image/BlueButton.gif);color:white;width:<%=4 * cachedstyle.fontsize%>px;border:1px #EEEEEE outset;font-size:<%=cachedstyle.fontsize%>px;font-weight:bold;text-shadow:#707070 -1px -1px}
        </style>
        <script type="text/javascript" ><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle) %>, securitytoken="<%=securitytoken%>";var theurl = "<%=Toolbox1.geturl(request)%>";</script>
        <script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
        <%=Toolbox.unifontstyle(cachedstyle.fontsize,orgnum)%>
    </head>
    <body style="background-color:<%=cachedstyle.DBGCOLOR%>;margin:4px 4px 4px 4px;<%=(mode!=null&&mode.equals("1"))?"":("background-position:0px -100px") %>" >

        <%
            if (mode.equals("1")) {
                String convertleft = Formr.incomplete(user, adapter, "convert");
                if (convertleft != null && !convertleft.equals("")) {
                    rdap = convertleft;
                    mode = "2";
                } else {
                    int n = -1;
                    if (convertleft == null) {
                        n = 0;
                        int sindex = Toolbox.begintranslate("mysql");
                        int tindex = Toolbox.begintranslate(adapter.dbms);
                        String sql = "Create Table UserForm(lastupdate BIGINT,formname varchar(20),uid varchar(20),roles BIGINT, permits varchar(255),primary key(formname))";
                        int m = adapter.executeUpdate(Toolbox.translateStr(sql, sindex, tindex));

                        sql = "CREATE TABLE Apptables (lastupdate BIGINT  NOT NULL ,tname VARCHAR (20)   NOT NULL ,definition TEXT  NOT NULL ,roles BIGINT  NOT NULL,PRIMARY KEY (tname) )";
                        m = adapter.executeUpdate(Toolbox.translateStr(sql, sindex, tindex));

                        sql = "CREATE TABLE Task (lastupdate BIGINT  NOT NULL, name VARCHAR (50) NOT NULL,title VARCHAR (80),query TEXT  NOT NULL ,insertQuery TEXT ,updateQuery TEXT ,deleteQuery TEXT ,webService TEXT ,format VARCHAR (25) NOT NULL,help TEXT ,roles BIGINT  NOT NULL ,insertroles BIGINT  NOT NULL ,updateroles BIGINT  NOT NULL ,deleteroles BIGINT  NOT NULL ,jscript VARCHAR (20),preop VARCHAR (20),postop VARCHAR (20),permits VARCHAR (200), options TEXT,PRIMARY KEY (name))";
                        m = adapter.executeUpdate(Toolbox.translateStr(sql, sindex, tindex));
                    }
                    int wtd = Math.round(cachedstyle.fontsize * Toolbox.charwidthrate());
                    if (wtd > 80) {
                        wtd = 80;
                    }

        %>
    <center>
        <%=Toolbox.title(Toolbox.emsgs(orgnum,4))%>

        <table cellspacing="0" cellpadding="0" > <tr height=5><td valign=TOP></td></tr></table>
        <table BORDER=0 cellspacing=1 cellpadding="0" align="center"   >
            <tr><td>

                    <form rel=opener style="margin:3px 0px 3px 0px" name="form1" onsubmit="return valid"  target="subwin" method="post" action="wordform.jsp"  >


                        <input name="mode"    type="hidden" value="" >

                        <table border=0 cellspacing="2" cellpadding="0" align="center"  >
                            <tr><td align="center"   class="tdbutton GreenButton" onclick="if(sinkbut(this)) newform()">
                                 <%=Toolbox.emsgs(orgnum,34)%> 
                                </td><td> <input name="sql"  type="hidden" value=""></td>
                                <td><span style="padding:0 0 0 0px;margin:0px 0px 0px 0px" id="lbl"><nobr><%=  Toolbox.emsgs(orgnum,1396) %></nobr></span></td>
                                <td style="padding:0px 0px 0px 0px"> <select style="margin:-1px 0px -1px 0px;border:1px #b0b0b0 outset !important;font-size:<%=cachedstyle.fontsize-2%>"
                                              name="rdap" align="left" onchange="show()">
                                        <option value=""> <%=Toolbox.emsgs(orgnum,1271)%> </option>
                                        <%
                                            if (n == -1) {
                                                String sql = "SELECT UserForm.formname,Task.name FROM UserForm, Task WHERE UserForm.uid='" + user.id + "'  AND UserForm.formname=Task.name AND NOT UserForm.lastupdate=-1";
                                                n = adapter.executeQuery(sql);
                                            }
                                            for (int i = 0; i < n; i++) {
                                                out.println("<option value=\"" + adapter.getValueAt(i, 0) + "\">" + adapter.getValueAt(i, 0) + "</option>");
                                            }

                                            File fd = new File(Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator + "forms");
                                            if (fd.exists() == false) {
                                                fd.mkdir();
                                            }
                                            String initrdap = Toolbox.defaultParam(orgnum,request, ("initrdap"), null);
                                            initrdap = Toolbox.validate(initrdap, null, 30);

                                        %>
                                    </select></td>
                                <td class="tdbutton GreenButton"  align="center"   onclick="if(sinkbut(this))show()"><%=Toolbox.emsgs(orgnum,923)%>
                                </td><td class="tdbutton OrangeButton"  align="center"    onclick="if(sinkbut(this))ren()"><%=Toolbox.emsgs(orgnum,89)%>
                                </td><td class="tdbutton OrangeButton"  align="center"   onclick="if(sinkbut(this))modify()"><%=Toolbox.emsgs(orgnum,261)%>
                                </td><td class="tdbutton BlueButton"  align="center"   onclick="if(sinkbut(this))permit()" ><%=Toolbox.emsgs(orgnum,1283)%>
                                </td><td class="tdbutton BlueButton"  align="center"   onclick="if(sinkbut(this))transform()" ><%=Toolbox.emsgs(orgnum,503)%>
                                </td><td class="tdbutton RedButton"  align="center"   onclick="if(sinkbut(this))delete1()"><%=Toolbox.emsgs(orgnum,30)%>
                                </td>
                            </tr>

                        </table>
                        <input type="hidden" name="securitytoken" value="<%=securitytoken%>" >
                    </form>

                </td></tr>

        </table>
    </center>

    <script type="text/javascript" >
        open("wordform.jsp?mode=<%=((initrdap == null) ? "4&withhead=1" : ("10&rdap=" + initrdap))%>", parent.frames[1].name);
        var thismode = <%=mode%>;
        
        var tstmp = <%=tstmp%>;
        var font_size = <%=cachedstyle.fontsize%>,
        userid = '<%=user.id%>',notexist = "<%=Toolbox.emsgs(orgnum,1531)%>",
        msg206="<%=Toolbox.emsgs(orgnum,206)%>",msg160="<%= Toolbox.emsgs(orgnum,160)%>",msg923="<%= Toolbox.emsgs(orgnum,923)%>",
        msg1283="<%=Toolbox.emsgs(orgnum,1283)%>",msg1278="<%=Toolbox.emsgs(orgnum,1278)%>",
        msg1285="<%=Toolbox.emsgs(orgnum,1285)%>",msg1286="<%=Generic.handle(Toolbox.emsgs(orgnum,1286))%>",msg1449="<%=Generic.handle(Toolbox.emsgs(orgnum,1449))%>",
        hasone=<%=(n > 0)%>,uid='<%=user.id + labels%>',subdb='<%=subdb%>',
        supportfile = "<%=Toolbox.emsgs(orgnum,1290)%>",
        lblupload = "<%=Toolbox.emsgs(orgnum,1291)%>",
        capupload = "<%=Toolbox.emsgs(orgnum,647)%>", capsave="<%=Toolbox.emsgs(orgnum,36)%>",
        IBGCOLOR = "<%=cachedstyle.IBGCOLOR%>", enterone="<%=Toolbox.emsgs(orgnum,231)%>",
        msg1292="<%=Toolbox.emsgs(orgnum,1292)%>",
        instr="<%=Toolbox.emsgs(orgnum,958)%>";
        //resizebut(document.form1,<%=cachedstyle.fontsize%>,<%=(cachedstyle.fontsize > 20) ? "false" : "true"%>);
        var buttonhints = textmsg[1587];
        function tellrdap(){return document.form1.rdap.value;}
         //       ";New:Create a form;URL:The URLs of all operations on the form;Rename:Rename the form;Modify:Modify the form design;Permit:Set permissions;Transform:Transform to standard form;Delete:Delete the form and data;";
    </script>

    <script type="text/javascript"   src=hints.js></script>
    <script type="text/javascript"   src=curve.js></script>
    <script type="text/javascript"   src=wordform.js></script>

<%
    if (initrdap != null) 
    {%>
    <script type="text/javascript" >
        var sel = document.form1.rdap;
        for (var i=0; i < sel.options.length; i++)
            if (sel.options[i].value=='<%=initrdap%>')
            { 
                sel.selectedIndex = i; 
                break;
            }
        show();
        formnewaction(document.form1);
        visual(document.form1);
document.form1.submit();
    </script>
    <%}
    %>

</body>
<%
    }
}


    if (mode.equals("2")) 
    {
        boolean frommode1 = true;
        if (rdap == null) 
        {
            frommode1 = false;
            rdap = Toolbox.defaultParam(orgnum,request, "rdap", "", null, 30);
        }
        int wtd = Math.round(cachedstyle.fontsize * Toolbox.charwidthrate());
        if (wtd > 80) 
        {
            wtd = 80;
        }
%>

<center>
    <%=Toolbox.title(Toolbox.emsgs(orgnum,4))%>

    <table cellspacing="0" cellpadding="0" > <tr height=5><td valign=TOP></td></tr></table>
    <table BORDER=0 cellspacing=0 cellpadding="0" align="center"   width="100%">
        <tr><td>
            <form rel=opener style="margin:3px 0px 3px 0px" name="form1" onsubmit="return validate()" target="tlmcvtfm" method="post" action="wordform.jsp"    >
                <input type="hidden" name="override">
                    <input  name="rdap" type="hidden"  value="<%=rdap%>" >
                    <input name="sql"     type="hidden" value="">
                    <input name="sql2"     type="hidden" value="">
                    <input type="hidden" name="defaultav" value="">
                    <input name="fontname"    type="hidden" value="<%=Toolbox.fontsnamestr(orgnum>>16)%>" >
                    <input  name="mode"  type="hidden" value="" >
                <table cellspacing="2" cellpadding="0" align="center" >
                  <tr>
                    <td class="fields2"><nobr><%=Toolbox.emsgs(orgnum,1271)%></nobr></td>
                    <td  class="value2" id="lb0" align="left"><%=rdap%></td>
                    <td><input  type=file style="width:1px;visibility:hidden" name=localpath value="<%=Toolbox.emsgs(orgnum,458)%>"  onchange="upload()"></td>
                    <td class="tdbutton GreenButton"  align="center" onmouseover="showmyhint(0)" onmouseout="hidemyhint()" id=parsebtn     onclick="closeprompt();if(sinkbut(this)){choose()}"><%=Toolbox.emsgs(orgnum,647)%></td>
                    <td align="center" id=makeitlbl ><nobr><%=Toolbox.emsgs(orgnum,1381)%></nobr></td>
                    <td class="tdbutton GreenButton"   align="center"  onmouseover="showmyhint(1)"  onmouseout="hidemyhint()"   id=savebtn onclick="makeit()"    ><nobr><%=Toolbox.emsgs(orgnum,1380)%></nobr></td>
                    <td class="tdbutton RedButton"  align="center"  onmouseover="showmyhint(2)"  onmouseout="hidemyhint()"  id=deletebtn     onclick="closeprompt();if(sinkbut(this))cancel();"><%=Toolbox.emsgs(orgnum,169)%></td>
                  </tr>
                </table>
                    
            </form>
         </td></tr>
    </table>
</center>
 
<script type="text/javascript" >
    var theurl = "<%=Toolbox1.geturl(request)%>";
    open("wordfmsp.jsp?numfrms=2&rdap=<%=rdap%>", parent.frames[1].name);
    var hints = ['1','2','3'];
    var thismode = <%=mode%>;
    
    var IBGCOLOR = '<%=cachedstyle.IBGCOLOR%>';
    var DBGCOLOR = '<%=cachedstyle.DBGCOLOR%>';
    
    var font_size = <%=cachedstyle.fontsize%>, userid = '<%=user.id%>',notexist = "<%=Toolbox.emsgs(orgnum,1531)%>",
    msg206="<%=Toolbox.emsgs(orgnum,206)%>",msg160="<%= Toolbox.emsgs(orgnum,160)%>",msg923="<%= Toolbox.emsgs(orgnum,923)%>",
    msg1283="<%=Toolbox.emsgs(orgnum,1283)%>",msg1278="<%=Toolbox.emsgs(orgnum,1278)%>",
    msg1285="<%=Toolbox.emsgs(orgnum,1285)%>",msg1286="<%=Generic.handle(Toolbox.emsgs(orgnum,1286))%>",msg1449="<%=Generic.handle(Toolbox.emsgs(orgnum,1449))%>",
    uid='<%=user.id + labels%>',subdb='<%=subdb%>',
    supportfile = "<%=Toolbox.emsgs(orgnum,1290)%>",
    lblupload = "<%=Toolbox.emsgs(orgnum,1291)%>",
    capupload = "<%=Toolbox.emsgs(orgnum,647)%>", capsave="<%=Toolbox.emsgs(orgnum,36)%>",
    enterone="<%=Toolbox.emsgs(orgnum,231)%>",
    msg1292="<%=Toolbox.emsgs(orgnum,1292)%>",
    msg1290="<%=Toolbox.emsgs(orgnum,1290)%>",
    msg1382 = "<%=Toolbox.emsgs(orgnum,1382)%>",
    msg727 = "<%=Toolbox.emsgs(orgnum,727)%>",
    instr="<%=Toolbox.emsgs(orgnum,958)%>";
    document.form1.override.disabled = true;
    var buttonhints = textmsg[1588];
    // resizebut(document.form1,<%=cachedstyle.fontsize%>,<%=(cachedstyle.fontsize > 20) ? "false" : "true"%>);
    var formimg = false;
    var suspects = "";
    function giveColors(){return "<%=cachedstyle.DBGCOLOR + "," + cachedstyle.BBGCOLOR %>";}
    
    
  
</script>
<script type="text/javascript"   src=hints.js></script>
<script type="text/javascript"   src=curve.js></script>
<script type="text/javascript"   src=wordform.js></script>

<%if (frommode1) {%>
<script type="text/javascript" > state = 1; formname='<%=rdap%>';
<%

File file = new File(Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator +  "forms", user.id + "_fm.htm");
try 
{
         Scanner s =  new Scanner(file);
         String txt = s.useDelimiter("\\Z").next();
         s.close();
         int i1 = txt.indexOf("FileOperation?did=");
         int i2 = txt.indexOf(")",i1);
         int i3 = txt.indexOf("\"d0\"",i2);
         int i4 = txt.indexOf("relative",i3);
         if (i1>0 && i2>0 && i3>0 && i4>0)
         {
            String z = txt.substring(i1+18,i2);
            Encode6b encoder = new Encode6b(orgnum);
            String path = encoder.rto6b(z);
            if ( (new File(path)).exists()){
            %>
             var z = "<%=z %>";
             
             
             makeit(z);
             //open("wordfmsp.jsp?numfrms=3&rdap=" + document.form1.rdap.value + (z!=null?('&js='+z):''), parent.frames[1].name);
            <% }
            else
            {
                file.delete();  
            }
         }
         else
         {
             file.delete(); 
         }
} 
catch (Exception e) 
{

}
out.println("</script>");



}%>

</body>
<%

} else if (mode.equals("3")) {

    rdap = Toolbox.defaultParam(orgnum,request, ("rdap"), null);
    if (rdap == null || rdap.equals(""))
    {
        (new File(Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator + "forms" + File.separator + user.id + "_fm.htm")).delete();
        (new File(Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator + "forms" + File.separator + user.id + "_fm0")).delete();
        out.println("<script type=text/javascript > document.location.href= 'wordform.jsp?mode=4&withhead=1';</script>");
    }
    else
    {
    rdap = Toolbox.validate(rdap, null, 30);
    int k = 0;
    String err = "";
    if (rdap != null && !rdap.equals("")) {
        String sql[] = new String[4];
        sql[0] = "DELETE FROM Task where name='" + rdap + "'";
        sql[1] = "DELETE FROM Apptables where tname='" + rdap + "'";
        sql[3] = "DROP  TABLE  " + rdap;
        sql[2] = "DELETE FROM UserForm where formname='" + rdap + "' AND uid='" + user.id + "'";
        boolean b = adapter.transacte1(sql, 0, 4);
        err = adapter.error().trim();
        try {
            path(rdap,orgnum).delete();
        } catch (Exception e) {
            err += "<br>" + e.toString();
        }
        deldir(new File(Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator + "forms" + File.separator + rdap));
        (new File(Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator + "forms" + File.separator + user.id + "_fm.htm")).delete();
        (new File(Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator + "forms" + File.separator + user.id + "_fm0")).delete();
        Generic.storedProc.remove(rdap);
        Formr.modifyFile(rdap, null, null, uid1, -1, user, 0);
    }
    out.println(err);

    if (err.toString().equals("")) {
        out.println(Toolbox.emsgs(orgnum,1278));
        out.println("<script type=text/javascript > open('wordform.jsp?mode=1', parent.frames[0].name);</script>");
    }
    }
    out.println("</body>");
} else if (mode.equals("4")) {
    %>
    
    <div class="outset3" style="padding:4px 4px 4px 4px;margin:-3px -3px -3px -3px">
    <%
    String withhead = Toolbox.defaultParam(orgnum,request, "withhead", null, null, 10);
    int kk = orgnum>>16;
   if (!Toolbox.locales[kk].hasinstru)
   {
       kk = Toolbox.langnum;
       if (!Toolbox.locales[kk].hasinstru)
          kk = 0;
   }
    String txt = Toolbox1.filebytes("WEB-INF" + File.separator + "conf" + File.separator + Toolbox.langs[kk] + "m.html", "UTF-8");
    
    if (txt!=null && withhead == null) 
    {
        txt = txt.substring(txt.indexOf("<br><br>")+8);
    }
    if (txt!=null)
    out.println(txt.replaceAll("_blank", "tlmcvtfm"));
    
    //out.println(  Toolbox.emsgs(orgnum,1270) );
%>
    </div>
    
<script type="text/javascript"  src="curve.js"></script>
<script type="text/javascript" >
    var thismode = <%=mode%>;
    
    document.body.style.margin = "0px 0px 0px 0px";
    function usemytool()
    {
        if (parent.frames.length==2 && self == parent.frames[1])
        {
            myprompt('You need to New a form first. Click a the "New" button above');
        }
        else if (parent.frames.length==2 && self == parent.frames[0])
        {
            parent.parent.frames[0].makeit();
        }
        else if (parent.frames.length==3 )
        {
            myprompt('The tool is opened next to this frame')
        }
    }


 
    var a = "<%=Toolbox.emsgs(orgnum,1291)%>";
    if ( parent.frames[1] == self)
        a = "<%=Toolbox.emsgs(orgnum,796)%>";
    else if (parent.frames.length == 3)
        a =  "Following this specification about the data control to design the underscore patterns and upload to convert the form";
    if (parent.frames.length != 3)
    {
        myprompt( "<div style=\"float:left\"><img src=image/guide1.gif height=60></div>" + a,true,null,textmsg[191]);
    }
    setRoundedWidth(promptwin, 300);
    if (parent!=self && parent.parent!=parent && typeof(parent.parent.frames[0].Anchor)!='undefined')
        new parent.parent.frames[0].Anchor(self);
</script>
<div id="copyright" style="text-align:center;color:#4d5ddd;font-size:12px"> 
<%= Toolbox.copyright[orgnum>>16]%> 
</div>
</body>
<%
} else if (mode.equals("5")) {
    String discard = Toolbox.defaultParam(orgnum,request, ("discard"), null);
    discard = Toolbox.validate(discard, null, 30);

    if (discard != null) {
        delete(discard, adapter,orgnum);
    }
    out.println("<script type=text/javascript >var thismode = " + mode + ";</script></body>");
} else if (mode.equals("6")) {
    if (request.getMethod().equals("GET")) {
        return;
    }

    String sqls = Toolbox.defaultParam(orgnum,request, ("sql"), null);

    if (sqls == null || sqls.equals("")) {
        out.println(Toolbox.emsgs(orgnum,1243) + " " + Toolbox.emsgs(orgnum,333));
        adapter.close();
        return;
    }
    int sindex = Toolbox.begintranslate("mysql");
    int tindex = Toolbox.begintranslate(adapter.dbms);

    sqls = Toolbox.translateStr(sqls, sindex, tindex);

    String s[] = sqls.split("&-@;#");
    if (s.length >= 8) {
        String sql[] = new String[5];
        sql[0] = s[0].replaceAll("DEFAULT '[^']*'", "");
        sql[4] = s[6];
        long ct = System.currentTimeMillis() / 1000;

        String defaultav = Toolbox.defaultParam(orgnum,request, "defaultav", "");
        //s[3] += "\n\n" + defaultav;
        s[7] = merge(s[7], defaultav);
        sql[1] = "INSERT INTO Task(lastupdate,name,title,query,insertQuery,updateQuery,deleteQuery,webService,format,help,roles,insertroles,updateroles,deleteroles,jscript,preop,postop,permits) values (" + ct + ",'" + s[1] + "', '" + s[1] + " Data','" + s[2].replaceAll("'", "''") + "','" + s[3].replaceAll("'", "''") + "','" + s[4].replaceAll("'", "''") + "','" + s[5].replaceAll("'", "''") + "','','Web','" + s[7].replaceAll("'", "''") + "',0,-1,0,0,'','','','1+" + user.id + ",3+" + user.id + ",4+" + user.id + "')";
        sql[2] = "INSERT INTO Apptables(lastupdate,tname, definition, roles) values(" + ct + ",'" + s[1] + "','" + s[0].replaceAll("'", "''") + "'," + Systemroles.TOTAL + ")";
        sql[3] = "UPDATE UserForm SET lastupdate=" + ct + " WHERE formname='" + s[1] + "' AND uid='" + user.id + "'";

        boolean b = adapter.transacte1(sql, 0, 5);
        String err = adapter.error().trim();
        if (err.equals("") == false) 
        {
            for (int i = 0; i < 1; i++) 
            {
                out.println(sql[i] + " <br><br>");
            }
            out.println("Error:" + err);
            try 
            {
                path(user.id + "_fm",orgnum).delete();
            } catch (Exception e) {
            }

        } 
        else 
        {
            if (subdb.equals("")) {
                Generic.genStoredProc(s[1], adapter, orgnum);
            }
            try {
                path(s[1],orgnum).delete();
                System.gc();
                path(user.id + "_fm",orgnum).renameTo(path(s[1],orgnum)); 
                System.gc();
                FileWriter fw = new FileWriter(path(s[1],orgnum), true);
                 
                fw.append("<script type=text/javascript >var defaultorinitv =\"" + Generic.handle(defaultav) + "\";</script>");
                fw.close();

            } catch (Exception e) {
                out.println(e.toString());
            }
            //modifyFile(s[1], "", "", uid1, -1,user);
            //for (int i=0; i < 5; i++)

%>
<script type="text/javascript" >
    var thismode = <%=mode%>;
    
    parent.frames[0].location.href = "wordform.jsp?mode=1&initrdap=<%=s[1]%>";
</script>

<%
    }
    out.println("</body>");
} else {
    out.println("Not a form:");
    String base = request.getRequestURL().toString().replaceFirst("wordform\\.jsp.*", "");

    try {
        path(s[1],orgnum).delete();
        System.gc();
        path(user.id + "_fm",orgnum).renameTo(path(s[1],orgnum));
    } catch (Exception e) {
        out.println(e.toString());
    }
//modifyFile(s[1], "", "", uid1, -1,user);
%>
<script type="text/javascript" >
    var thismode = <%=mode%>;
    
    parent.frames[0].addone("<%=Generic.handle(Toolbox.emsgs(orgnum,1282))%>");
</script>
<%
    }
    out.println("</body>");
} else if (mode.equals("7")) {
    rdap = Toolbox.defaultParam(orgnum,request, ("rdap"), null);
    rdap = Toolbox.validate(rdap, null, 30);
    int fcode = 8;
    String title1 = Toolbox.emsgs(orgnum,89) + ": ";
    if (rdap == null || rdap.equals("")) {
        title1 = "";// Toolbox.emsgs(orgnum,34);
        fcode = 15;
        rdap = "";
    }
    title1 += Toolbox.emsgs(orgnum,899);

    String goodrdap = Toolbox.defaultParam(orgnum,request, "goodrdap", "");
    String badrdap = Toolbox.defaultParam(orgnum,request, ("badrdap"), null);
    badrdap = Toolbox.validate(badrdap, null, 20);
    TreeSet tree = Formr.nameTree(user, adapter);
    Iterator iter = tree.iterator();
    out.print("<script type=text/javascript > allrdaps = [");
    while (iter.hasNext()) {
        out.print("'" + iter.next() + "',");
    }
    out.println("''];</script>");
%>
<table cellpadding="0" cellspacing="0"  valign=top  align="center">
    <tr><td  align=center width=100% class=outset2 style="background:linear-gradient(<%=cachedstyle.IBGCOLOR%>,<%=Toolbox.headercl(cachedstyle.IBGCOLOR)%>);border:1px   outset"   >
            <table><tr><td><div class=forcurve2 style="color:#DDCC11" id=curve3><nobr><%=title1%></nobr></div>
                    </td></tr>
            </table></td>
    </tr>
</table>
<script type="text/javascript" >document.write(round1('100%'));</script>
<table align="center" class="outset3" width="100%"><tr>
        <td colspan="9" align="left">
            <% if (badrdap != null) {%><font color="red>"><%=badrdap%> <script type="text/javascript" >document.write(textmsg[98]);</script></font><br> <%}%>

            <%=Toolbox.emsgs(orgnum,886)%>
            <br></td> </tr>
    <tr>
        <%

            for (int i = 0; i < 26; i++) {
                if (i % 3 == 0) {
                    out.println("<td width=60px valign=top>");
                }

                int jj = 0;
                int kk = 0;
                while (kk < 2) {
                    String tt = "" + ((char) ('A' + i)) + (jj++);
                    if (!tree.contains(tt)) {
                        kk++;
                        out.print("<span  onclick=\"getthis(this)\">" + tt + "</span><br>");

                    }
                }
                if (i % 3 == 2) {
                    out.println("</td>");
                } else {
                    out.println("<br>");
                }
            }

        %></tr>
    <tr><td colspan="9" align="center">
            <form rel=opener style="margin:20px 0px 0px 0px" name="form1"   method="post" action="wordform.jsp" onsubmit="return surenew()"  >
                <input name="mode" value="<%=fcode%>" type="hidden">
                <input name="rdap" value="<%=rdap%>"  type="hidden">
                <table cellpadding=0 cellspacing=0>

                    <tr>
                        <td class="fields2"><nobr><%=Toolbox.emsgs(orgnum,662)%></nobr></td>
                        <td><input name="newname"  value="<%=goodrdap%>"></td>
                        <td  class="tdbutton OrangeButton"  width="<%=4 * cachedstyle.fontsize%>"  id="sb" onclick="next()" align=center ><nobr><%=Toolbox.emsgs(orgnum,1046)%></nobr></td>
                        <td  class="tdbutton RedButton"  width="<%=4 * cachedstyle.fontsize%>"   id="cb" onclick="cancel()" align=center ><nobr><%=Toolbox.emsgs(orgnum,169)%></nobr></td>
                    </tr></table>
            </form>
        </td></tr>
</table><script type="text/javascript" >document.write(round2);</script>
<script type="text/javascript" >
    var thismode = <%=mode%>;
    var font_size = <%=cachedstyle.fontsize%>;
    
    var rdap = '<%=rdap%>';
    resizebut(document.form1, <%=cachedstyle.fontsize%>);
    function getthis(td)
    {
        document.form1.newname.value=td.innerHTML;
    }

   
    
    function surenew()
    {

        var anewname = document.form1.newname.value;
        anewname = anewname.replace(/^\s*/,'').replace(/\s*$/,'');
        anewname = anewname.toUpperCase();
        document.form1.newname.value = anewname;
      
        if (anewname=='')
        {
            myprompt('<%=Toolbox.emsgs(orgnum,662)%>');
            return false;
        }
        if (anewname.length > 10)
        {
            myprompt("Too long. Use less than 11");
            return false;
        }
        if (anewname.charAt(0)>'Z' || anewname.charAt(0)<'A' || anewname.replace(/[A-Z|0-9]/g,'')!='')
        {
            myprompt( " <%=Toolbox.emsgs(orgnum,886)%>");
            return false;
        }

        for (var i=0; i < allrdaps.length; i++)
            if (allrdaps[i]==anewname)
        {
            myprompt(anewname + " <%=Toolbox.emsgs(orgnum,446)%>");
            return false;
        }
        return true;
    }
    function next()
    {
        if (surenew())
        {
            formnewaction(document.form1);
            visual(document.form1);
document.form1.submit();
        }
    }
   
    function cancel()
    {
        if (rdap=='') 
            parent.parent.frames[0].openpage('wordform.jsp?mode=1','');
        else
            document.location.href = "wordform.jsp?mode=10&rdap=" + rdap; 
    }
</script>
<script type="text/javascript"  src="curve.js"></script>
  <div id="copyright" style="text-align:center;color:#4d5ddd;font-size:12px"> 
<%= Toolbox.copyright[orgnum>>16]%> 
</div>
</body>
<%
} else if (mode.equals("8")) {
    rdap = Toolbox.defaultParam(orgnum,request, "rdap", null, null, 30);
    if (rdap == null) {
        adapter.close();
        return;
    }
    String newname = Toolbox.defaultParam(orgnum,request, ("newname"), null);
    newname = Toolbox.validate(newname, null, 30);
    String newname1 = Formr.unifilename(user, newname, adapter);
    if (newname1 != null) {
        adapter.close();
%>
<jsp:forward page="wordform.jsp" >
    <jsp:param name="mode"  value="7" />
    <jsp:param name="rdap"  value="<%=rdap%>" />
    <jsp:param name="badrdap"  value="<%=newname%>" />
    <jsp:param name="goodrdap"  value="<%=newname1%>" />
</jsp:forward>
<%
        return;
    }

    int sindex = Toolbox.begintranslate("mysql");
    int tindex = Toolbox.begintranslate(adapter.dbms);
    String sql[] = new String[5];
    sql[0] = "ALTER TABLE " + rdap + " RENAME TO " + newname;
    String retrv = "SELECT title, query,insertQuery,updateQuery,deleteQuery FROM Task WHERE name='" + rdap.replaceAll("'", "''") + "'";
    int m = adapter.executeQuery(retrv);
    if (m == 1) {
        String newv[] = new String[5];
        newv[0] = adapter.getValueAt(0, 0).replaceFirst(rdap, newname).replaceAll("'", "''");
        for (int i = 1; i < 5; i++) {
            newv[i] = adapter.getValueAt(0, i).replaceAll(" " + rdap, " " + newname).replaceAll("'", "''");
        }
        sql[1] = "UPDATE Task SET name='" + newname + "', title='" + newv[0] + "', query='" + newv[1] + "', insertQuery='" + newv[2] + "', updateQuery='" + newv[3] + "', deleteQuery='" + newv[4] + "' where name='" + rdap + "'";
    } else {
        sql[1] = "UPDATE Task SET name='" + newname + "' where name='" + rdap + "'";
    }
    retrv = "SELECT definition FROM Apptables where tname='" + rdap + "'";
    m = adapter.executeQuery(retrv);
    if (m == 1) {
        sql[2] = "UPDATE Apptables SET tname='" + newname + "', definition='" + adapter.getValueAt(0, 0).replaceFirst(" " + rdap, " " + newname).replaceAll("'", "''") + "'  where tname='" + rdap + "'";
    } else {
        sql[2] = "UPDATE Apptables SET tname='" + newname + "'  where tname='" + rdap + "'";
    }
    if (subdb.equals("")) {
        Generic.storedProc.remove(rdap);
        Generic.genStoredProc(newname, adapter, orgnum);
    }
    sql[3] = "DELETE FROM UserForm WHERE lastupdate=-1 AND uid='" + user.id + "'";
    sql[4] = "UPDATE UserForm SET lastupdate = " + (System.currentTimeMillis() / 1000) + ",formname='" + newname + "' WHERE formname='" + rdap + "'";
    boolean b = adapter.transacte1(sql, 0, 5);   
    renameFiles(rdap, newname,orgnum);
    Formr.renameIndex(rdap, newname, uid1, user, 0);
    Formr.updateassociate(newname, rdap, user);

    if (adapter.error().equals("") == false) {
        for (int i = 0; i < 3; i++) {
            out.println(sql[i] + " <br><br>");
        }
        out.println(adapter.error());
        //(new File(Toolbox.installpath + File.separator + "forms" + File.separator + s[1] +".htm")).delete();
    }
%>
<center>
    <%=Toolbox.emsgs(orgnum,71)%>
</center>
<script type="text/javascript" >
    var thismode = <%=mode%>;
    
    parent.frames[0].rename('<%=rdap%>','<%=newname%>');
    parent.parent.frames[0].location.reload();
    setTimeout( close ,2000);
</script>
</body>
<%
} else if (mode.equals("9")) {
    if (rdap == null) {
        rdap = Toolbox.defaultParam(orgnum,request, ("rdap"), null);
    }
    rdap = Toolbox.validate(rdap, null, 30);


%>
<table cellpadding="0" cellspacing="0"  valign=top  align="center">
    <tr><td  align=center width=100% class=outset2 style="background:linear-gradient(<%=cachedstyle.IBGCOLOR%>,<%=Toolbox.headercl(cachedstyle.IBGCOLOR)%>);border:1px   outset"   >
            <table><tr><td><div class=forcurve2 style="color:#DDCC11" id=curve3><nobr><%=Toolbox.emsgs(orgnum,1384)%></nobr></div>
                    </td></tr>
            </table></td>
    </tr>
</table>
<script type="text/javascript" >document.write(round1('100%'))</script> 
<div class="outset3" style="padding:5px 5px 5px 5px">
    <form rel=opener name="form5"  style="margin:1px 0px 1px 0px"   >
A. <%=Toolbox.emsgs(orgnum,1355)%>:  <input type="button" name="transfer1" class="tdbutton GreenButton"   value="<%=Toolbox.emsgs(orgnum,6)%>" onclick="doinits()"><br><br>
B. <%=Toolbox.emsgs(orgnum,1379)%>:
    <input type="button" name="transfer" class="tdbutton OrangeButton" value="<%=Toolbox.emsgs(orgnum,6)%>" onclick="opensource()"><br><br>
    </form>
<% 
File file = new File(Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator +  "forms" + File.separator + rdap + ".htm");
String ftxt = "";  
try 
{
     Scanner s =  new Scanner(file);
     ftxt = s.useDelimiter("\\Z").next();
     s.close(); 
}catch(Exception e){}
if (ftxt.indexOf(".commonlooking{") < 0)
{
    
         
%>
C. <%=Toolbox.emsgs(orgnum,1356)%>
<form rel=opener   name="form2"  style="margin:3px 0px 3px 0px"   enctype="multipart/form-data" method="post" action="wordform.jsp" onsubmit="return openit2()"  >
    <table align="center" border="0" style="border:1px #EEEEEE inset;border-radius:4px">
            <input type="hidden" name="rdap" value="<%=rdap%>">
                <input type="hidden" name="override">
                <input type=file  style="border:1px #b0b0b0 solid;width:1px;visibility:hidden"  name=localpath   size="60" value="" onchange="document.form2.submit()">
           
        <!--tr>
            <td class=fields2><%=Toolbox.emsgs(orgnum,155)%></td>
            <td colspan="3">
             </td></tr-->


        <%
            File d = new File(Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator +   "forms");
            File dir[] = d.listFiles(new SamePrefix(rdap));
            if (dir != null)
                for (int i = 0; i < dir.length; i++) {
                    if (i > 0) {
        %>
        <tr><td valign="top"></td>
            <%} else {%>
        <tr><td valign="top" class=fields2><%=Toolbox.emsgs(orgnum,1114)%> </td>
            <%}
            %>
            <td><input type="radio" style="background-color:transparent" name="overrider"  value="<%=dir[i].getName()%>" ></td><td><%=dir[i].getName() + "  </td><td>(" + Toolbox.timestr(dir[i].lastModified() / 1000)%> )</td></tr>
                <%
                    }
                %>  <%
                    d = new File(Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator + "forms" + File.separator + rdap);
                    dir = d.listFiles();
                    if (dir != null)
                         for (int i = 0; i < dir.length; i++) 
            {
                if (!dir[i].equals("Thumbs.db"))
                {
    %>
<tr><td></td><td><input type="radio" style="background-color:transparent" name="overrider"   value="<%=rdap%>/<%=dir[i].getName()%>" ></td><td><%=dir[i].getName() + " </td><td>(" + Toolbox.timestr(dir[i].lastModified() / 1000)%> )</td></tr>
    <%
                }
            }
            if (!srcs.equals("")) 
            {
                    String needfiles[] = srcs.replaceFirst("..$", "").split(", ");
            %>
        <tr><td valign="top" class=fields2><%=Toolbox.emsgs(orgnum, 35)%> </td>
            <%
                    for (int i = 0; i < dir.length; i++) {
                        int ii = needfiles[i].lastIndexOf("/") + 1;
                        if (i > 0) {
                            out.println("<tr><td></td>");
                        }
                        out.println("<td><input type=\"radio\"  style=\"background-color:transparent\"  name=\"overrider\"   value=\"" + rdap + "/" + needfiles[i].substring(ii) + "\"></td><td>" + needfiles[i] + " </td><td>(" + Toolbox.emsgs(orgnum, 995) + ")</td></tr>");
                    }
                }
            %>

        <tr><td valign="top" class="fields2"><%=srcs.equals("") ? (Toolbox.emsgs(orgnum,35)) : ""%> </td>
            <td  valign="middle"><input type="radio"  style="background-color:transparent"   id="overrideas1" name="overrider" value=""  ></td>
            <td>  <%=Toolbox.emsgs(orgnum,809)%> <%=rdap%>_<input name="more1"  style="border:1px #b0b0b0 solid"  onblur="passmore1(this)"  value="" size="2">.htm</td><td>(<%=Toolbox.emsgs(orgnum,810)%>)</td></tr>


        <tr><td colspan="4" align="center">
        <input type=button name=uploadbtn class="tdbutton OrangeButton"   value="<%=Toolbox.emsgs(orgnum,647)%>" onclick="document.form2.localpath.click()" />
            </td></tr>
    </table>
</form>
<%} 
else 
{
int j = ftxt.indexOf("FileOperation?did=");
String js = "";
if (j>=0  )
{
     js = ftxt.substring(j+18);
     j = js.indexOf(")");
     if (j >= 0)
     {
         js = js.substring(0,j);
     }
}        
    
%>
C. <%=Toolbox.emsgs(orgnum,1509)%><input type="button" name="transfer2"  class="tdbutton OrangeButton" value="<%=Toolbox.emsgs(orgnum,6)%>" onclick="domodify('<%=js%>')"><br>
    
<%}%>
D. <%=Toolbox.emsgs(orgnum,1284)%>
<table><tr><td><%=Toolbox.emsgs(orgnum,1357)%></td>
        <td valign="bottom"><form rel=opener style="margin:3px 0px 3px 0px" name="form3"  > <input size="5" name="newrdap">
    <input type="button" name="transfer3"  class="tdbutton OrangeButton" value="<%=Toolbox.emsgs(orgnum,6)%>" onclick="startcopy(this)">
</form></td>   
    </tr></table>
 

 </div>
<script type="text/javascript" >document.write(round2)</script>
<script type="text/javascript" >
    var thismode = <%=mode%>;
    
    var font_size = <%=cachedstyle.fontsize%>;
     
    function domodify(js)
    {
        open("wordform.jsp?mode=26&rdap=<%=rdap%>&pathcode="+js,parent.frames[0].name);
        open("wordfmsp.jsp?numfrms=3&rdap=<%=rdap%>&js=1", "_self");
        
    }
    function doinits()
    {
        open("Form?rdap=<%=rdap%>&ac=m", window.name);
    }
    
    function opensource()
    {
        open("wordform.jsp?rdap=<%=rdap%>&mode=22&width=" + thispagewidth() + "&height=" + thispageheight(), window.name);
    }
    function startcopy(btn)
    {
        var newform = document.form3.newrdap.value;
        if (newform=='') 
        {
            myprompt(textmsg[1634] );
            return;
        }
        var hd = window.open("", "_blank");
        hd.document.write("<html><frameset cols=\"500,120,500\"><frame name=s1 src=\"Form?rdap=<%=rdap%>&ac=m\" /><frame name=s2 src=\"wordform.jsp?mode=20&rdap=<%=rdap%>&newrdap=" + newform +"\" /><frame name=s3 src=\"Form?rdap=" + newform +"&ac=m\" /></frameset></html>");
    }
    resizebut(document.form5);
    resizebut(document.form2);
    resizebut(document.form3);
    <%
        if (override != null && !override.equals("")) {
    %>

        var ovs = document.form2.overrider;
        for (var i=0; i < ovs.length-3; i++)
            if (ovs[i].value=='<%=override%>')
        {
               
            ovs[i+1].checked = true;
            break;
        }
    <%
        }
    %>

        function extractfn()
        {
            var fn = document.form2.localpath.value;
            var j = fn.length - 1;
            while (j >=0 && fn.charAt(j)!='/' && fn.charAt(j) != '\\') j--;
            document.form2.more.value = fn.substring(j+1);
            // document.getElementById("overrideas").value = '<%=rdap%>/' + document.form2.more.value;
        }
        function passmore1(x)
        {
            if (x.value=='') myprompt("Enter variant suffix");
            overridestr =   x.value;
            document.getElementById("overrideas1").value = '<%=rdap%>_' + document.form2.more1.value +".htm";
        }
        function passmore(x)
        {
            if (x.value=='') myprompt("Enter file name");
            //overridestr =  '<%=rdap%>/' + x.value;
            //document.getElementById("overrideas").value = '<%=rdap%>/' + document.form2.more.value;
        }
        function openit2()
        {
            var ovs = document.form2.overrider;
            var selv = ''; var j=0;
            for (var i=0; i < ovs.length; i++)
            {
                if (ovs[i].checked )
                {
                    selv = ovs[i].value; j=1;
                    break;
                }
            }
            if (j==0){myprompt(textmsg[247]);  return false;}
            if (selv==''){myprompt("<%=Toolbox.emsgs(orgnum,810)%>"); return false;}
            // document.getElementById("overrideas").disabled = true;
             
            if (selv.indexOf("/") > 0 )
            {
                document.form2.target="w" + tstmp;
            }
            else
                document.form2.target="subwin";
            for (var i=0; i < ovs.length; i++)
            {
                ovs[i].disabled = true;
            }
            document.getElementById("overrideas1").disabled = true;
            document.form2.override.value = selv;
            return true;

        }
        parent.frames[0].closeprompt();
</script>

<%

    out.println(modifyinstr);
    out.println("</body>");
} else if (mode.equals("10")) {
    rdap = Toolbox.defaultParam(orgnum,request, ("rdap"), null);
    rdap = Toolbox.validate(rdap, null, 30);
%>
<script type="text/javascript" ><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle) %>, securitytoken="<%=securitytoken%>";var theurl = "<%=Toolbox1.geturl(request)%>";</script>
        <script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
       
<table cellpadding="0" cellspacing="0"  valign=top  align="center">
    <tr><td  align=center width=100% class=outset2 style="background:linear-gradient(<%=cachedstyle.IBGCOLOR%>,<%=Toolbox.headercl(cachedstyle.IBGCOLOR)%>);border:1px   outset"   >
            <table><tr><td><div class=forcurve2 style="color:#DDCC11" id=curve3><nobr><%=Toolbox.emsgs(orgnum,1383)%></nobr></div>
                    </td></tr>
            </table></td>
    </tr>
</table>
<form rel=opener name="f" action="wordform.jsp" method="post" target="w<%=tstmp%>"  >
    <input name="mode" value="11" type="hidden">
    <input name="rdap" value="<%=rdap%>" type="hidden">
    <input name="uid" value="<%=uid1%>" type="hidden">
    <input name="roles" value="-1" type="hidden">
    <input name="extra" value="" type="hidden">
    <input name="df" type="hidden" value="0">
    <table align="center"   cellspacing="0" cellpadding="0" >
        <tr><td  align="center"  >
                <script type="text/javascript" >document.write(round1(''));</script>
                <table cellpadding=0 cellspacing=0 class=outset3 width=100% ><tr><td  width=100% >
                            <table cellpadding=1 cellspacing=1 border=0  width=100%>
                                <script type="text/javascript" >
                                    document.write(parent.frames[0].url());
                                </script>
                            </table></td></tr>
                    <tr><td align="left" style="padding:4px 4px 4px 4px"><%=Toolbox.emsgs(orgnum,811)%></td></tr>
                </table>
                <script type="text/javascript" >document.write(round2);</script>
            </td></tr>
        <tr><td>&nbsp;</td></tr>
        <tr><td  align="center"  >
                <script type="text/javascript" >document.write(round1('100%'));</script>
                <table cellpadding=0 cellspacing=0 class=outset3 width=100% >
                    <tr><td align="center" width=100% ><b><%=Toolbox.emsgs(orgnum,195)%></b></td></tr>
                    <tr><td  width=100% >
                            <table cellpadding=1 cellspacing=1 border=0  width=100% id="urllink">
                                <tr><td align="left" class=fieldhead><%=(Toolbox.emsgs(orgnum,15))%></td>
                                    <td align="left" width="300" class=fieldhead><%=Toolbox.emsgs(orgnum,923)%></td><td class=fieldhead></td></tr>
                            </table>
                        </td></tr>
                </table>
                <script type="text/javascript" >document.write(round2);</script>
            </td></tr>
        <tr><td>&nbsp;</td></tr>
        <tr><td  align="center"  >
                <script type="text/javascript" >document.write(round1('100%'));</script>
                <table cellpadding=0 cellspacing=0 class=outset3 width=100% >
                    <tr>
                        <td align="center" width=100% >
                            <b><%= Toolbox.emsgs(orgnum,1288)%></b>
                        </td>
                    </tr>
                    <tr>
                        <td  width=100% >
                            <table cellpadding=1 cellspacing=1 border=0  width=100% >
                                <tr>
                                    <td align="left" class=fieldhead><%=Toolbox.emsgs(orgnum,816)%> </td>
                                    <td  align="left" class=fieldhead><%=(Toolbox.emsgs(orgnum,15))%></td>
                                </tr>
                                <tr>
                                    <td  align="left" class=fieldlbl  style=background-color:white >
                                        <select name="cat" onchange="addone()" ><option value=""><%=Toolbox.emsgs(orgnum,206)%></option></select>
                                    </td>
                                    <td  align="left" class=fieldlbl style=background-color:white >
                                        <input style="border:0px" name="title" size="45" value="">
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                <script type="text/javascript" >document.write(round2);</script>
            </td></tr>
        <tr><td align="center">
                <input type=button name=savebtn class="OrangeButton"  <%=style.replaceFirst("GreenButton", "OrangeButton")%>  value="<%=Toolbox.emsgs(orgnum,36)%>"  onclick="savecat()" >
            </td></tr>

    </table>

</form>

<script type="text/javascript" >
    var thismode = <%=mode%>;
    var needtranslator=true;
    var font_size = <%=cachedstyle.fontsize%>;
     
    var tstmp = <%=tstmp%>;
    var msg816="<%=Toolbox.emsgs(orgnum,816)%>",msg34="<%=Toolbox.emsgs(orgnum,34)%>",msg206="<%=Toolbox.emsgs(orgnum,206)%>",msg231="<%=Toolbox.emsgs(orgnum,231)%>",
    msg1289="<%=Generic.handle(Toolbox.emsgs(orgnum,1289))%>",font_size=<%=cachedstyle.fontsize%>,msg1282="<%=Generic.handle(Toolbox.emsgs(orgnum,1282))%>";
    function forcereload(jsfileid)
    {
        document.getElementById(jsfileid).src = jsfileid;
    }
    var act = [textmsg[841],textmsg[842],textmsg[843],textmsg[846],textmsg[844],textmsg[845]];
   function genqrcode1(url,i,v)
{
    url = url.replace(/i$/,v);
    var fm = url.replace(/.*rdap=([A-z|a-z|0-9]+).*/,'$1');
    myprompt("<div id=warning0></div><img src=\"Qrlink?url=" + Msg.hex(url) + (i==0?'&nlg=1':'') + "\"  onload=warning(this) style=alignment:center />",null,null,act[i] + ":" + fm);
}
function genqrcode(url,i)
{
    if (i>=3)
    {  
        myprompt(textmsg[542] + "=", "1", "genqrcode1('" + url + "'," + i + ",v)");
        return;
    }
    var fm = url.replace(/.*rdap=([A-z|a-z|0-9]+).*/,'$1');
    myprompt("<div id=warning0></div><img src=\"Qrlink?url=" + Msg.hex(url) + (i==0?'&nlg=1':'')+ "\"  onload=warning(this)  style=alignment:center  />",null,null,act[i] + ":" + fm);
}
</script>
<script type="text/javascript"  id="formlist<%=(user.orgnum%65536)%>.js" src="formlist<%=(user.orgnum%65536)%>.js" ></script>
<script type="text/javascript"  id="formassociated<%= user.orgnum%>.js" src="formassociated<%= user.orgnum%>.js" ></script>
<script type="text/javascript"  src="wordformurl.js" ></script>
<iframe name="w<%=tstmp%>" width="1" height="1" style="visibility:hidden" />
</body>
<%
} else if (mode.equals("11")) {
    rdap = Toolbox.defaultParam(orgnum,request, "rdap", "", null, 30);
    String cat = Toolbox.defaultParam(orgnum,request, ("cat"), null);
    cat = Toolbox.validate(cat, null, 30);
    String title = Toolbox.defaultParam(orgnum,request, "title", "", "@#$:+", 200);
    String uid = Toolbox.defaultParam(orgnum,request, "uid", "", null, 30);
    String rolest = Toolbox.defaultParam(orgnum,request, "roles", "-1", null, 30);
    String extra = Toolbox.defaultParam(orgnum,request, "extra", null);
    String df = Toolbox.defaultParam(orgnum,request, "df", "0", null, 30);
    long roles = -1;
    try {
        roles = Long.parseLong(rolest);
    } catch (Exception e) {
    }

    if (!rdap.equals("")) {
        String ans = "";
        if (extra != null) {
            ans = Formr.updateassociate(extra, rdap, user);
        }
        ans += Formr.modifyFile(rdap, title, cat, uid, roles, user, Integer.parseInt(df));
        if (subdb.equals("")) {
            Generic.genStoredProc(rdap, adapter, orgnum);
        }
        String err = null;
        if (user.getDBConnectInfo().server.equals(Toolbox.dbadmin[orgnum%65536].sysDBConnectInfo().server)) {
            err = Generic.genStoredProc(rdap, null,orgnum);
        }
        out.println(ans);
        if (ans.equals("") || ans.indexOf(Toolbox.emsgs(orgnum,71)) >= 0) {
%>
<script type="text/javascript" >
    if (typeof (parent.forcetoreload)!='undefined') parent.forcetoreload('formlist<%= (user.orgnum%65536)%>.js');
    if (typeof (parent.forcetoreload)!='undefined') parent.forcetoreload('formassociated<%= (user.orgnum%65536)%>.js');
     
    parent.parent.parent.frames[0].document.location.reload(); 
</script>
<%         }
    }
    out.println("</body>");
} else if (mode.equals("12")) {
    out.println(modifyinstr);
    out.println("<script type=text/javascript >var thismode = " + mode + ";var needtranslator=true;</script></body>");
} else if (mode.equals("13")) {
    String fn = Toolbox.defaultParam(orgnum,request, ("file"), null);
    fn = Toolbox.validate(fn, null, 30);
    File file = new File(Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator +  "forms", fn);
    try 
    {
         String aline = null;
         Scanner s =  new Scanner(file);
         aline = s.useDelimiter("\\Z").next();
         s.close();
         out.println(aline);
    } 
    catch (Exception e) 
    {
        out.println(fn + " not exist");
    }
    out.println("</body>");
} else if (mode.equals("15")) {
    rdap = Toolbox.defaultParam(orgnum,request, ("newname"), null);
    rdap = Toolbox.validate(rdap, null, 20);
    String newname1 = Formr.unifilename(user, rdap, adapter);
    adapter.close();
    if (newname1 != null) {%>
<jsp:forward page="wordform.jsp" >
    <jsp:param name="mode"  value="7" />
    <jsp:param name="badrdap"  value="<%=rdap%>" />
    <jsp:param name="goodrdap"  value="<%=newname1%>" />
</jsp:forward>

<%
    return;
} else {
%>
<script type="text/javascript" > 
    var thismode = <%=mode%>; 
    
    open("wordform.jsp?mode=2&rdap=<%=rdap%>", parent.frames[0].name);
</script>
<%
    }
    out.println("</body>");
} else if (mode.equals("16")) {
    rdap = Toolbox.defaultParam(orgnum,request, ("rdap"), null);
    rdap = Toolbox.validate(rdap, null, 30);
    File fd = new File(Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator + "forms" + File.separator + rdap);
    deldir(fd);
    fd = new File(Toolbox.dbadmin[orgnum%65536].webFileFolder +  File.separator + "forms" + File.separator + user.id + "_fm.htm");
    fd.delete();
    fd = new File(Toolbox.dbadmin[orgnum%65536].webFileFolder +  File.separator + "forms" + File.separator + user.id + "_fm0");
    fd.delete();
    adapter.executeUpdate("DELETE FROM UserForm where lastupdate=-1 AND uid='" + user.id + "' AND formname='" + rdap + "'");
    adapter.close();
    {%>
<jsp:forward page="wordform.jsp" >
    <jsp:param name="mode"  value="1" />
</jsp:forward>
<%       }

    return;
} else if (mode.equals("17")) {
    int state[] = {0, 0};
    rdap = Toolbox.defaultParam(orgnum,request, ("rdap"), null);
    rdap = Toolbox.validate(rdap, null, 30);
    try {
        File saveFile = path(user.id + "_fm",orgnum);   
        FileInputStream fin = new FileInputStream(saveFile);
        InputStreamReader esr = new InputStreamReader(fin);
        BufferedReader ebr = new BufferedReader(esr);
        String aline;
        StringBuffer buf = new StringBuffer();
 
        while ((aline = ebr.readLine()) != null) {
            aline = parse(aline, buf, rdap, uid1, labels, state,orgnum);
            if (state[0] == 3) {
                aline = aline.replaceFirst("(i?)</body>", "</body>\n<script type=text/javascript>" + Toolbox.someconsts(orgnum) + "</script><script type=text/javascript  src=\"" + Toolbox.getUserLang(orgnum) + "\"></script>\n" + (state[1] == 0 ? "<script type=text/javascript >var uid='" + uid1 + labels + "';" : "<script>") + "var  filename='" + rdap + "';parent.parent.frames[0].sendSrcs(\"" + buf + "\");</script><script type=text/javascript  src=databind.js></script>");
 
                state[0] = 4;
            }
            out.println(aline);
        }  
 
        fin.close();
        if (state[0] < 4) {
            out.println("<b>" + Toolbox.emsgs(orgnum,804) + "</b>");
            if (state[0] == 0) {
                out.println("<b>" + Toolbox.emsgs(orgnum,805) + "</b>");
            } else if (state[0] == 1) {
                out.println("<b>" + Toolbox.emsgs(orgnum,806) + "</b>");
            } else if (state[0] == 2) {
                out.println("<b>" + Toolbox.emsgs(orgnum,807) + "</b>");
            }
        }
 
    } catch (Exception e) {
        out.println(Toolbox.emsgs(orgnum,808));
    }
    if (state[0] != 4) {
        out.println("</body>");
    }
} else if (mode.equals("18")) {
    rdap = Toolbox.defaultParam(orgnum,request, ("rdap"), null);
    rdap = Toolbox.validate(rdap, null, 30);
    String yellow = Toolbox.defaultParam(orgnum,request, ("yellow"), null);
    yellow = Toolbox.validate(yellow, ",", 400);

    if (yellow != null) {
        if (yellow.equals("") == false) {
            String sqls[] = yellow.split(",");
            for (int i = 0; i < sqls.length; i++) {
                if (sqls[i].charAt(0) == 'b') {
                    continue;
                }
                String sql = "ALTER TABLE " + rdap + " ALTER COLUMN"
                        + sqls[i].replaceFirst("_", " VARCHAR(") + ")";
                int n = adapter.executeUpdate(sql);

            }
        }
        override = Toolbox.defaultParam(orgnum,request, ("override"), null);
        override = Toolbox.validate(override, null, 30);
        if (override != null) {
            path(override,orgnum).delete();
            path(user.id + "_fm",orgnum).renameTo(path(override,orgnum));
        }
    } else {
        path(user.id + "_fm",orgnum).delete();
    }
    adapter.close();
%>
<jsp:forward page="wordform.jsp" >
    <jsp:param name="mode"  value="9" />
    <jsp:param name="rdap"  value="<%=rdap%>" />
</jsp:forward>

<%

} else if (mode.equals("19")) {
    if (request.getMethod().equals("GET")) {
        return;
    }
    rdap = Toolbox.defaultParam(orgnum,request, ("rdap"), null);
    rdap = Toolbox.validate(rdap, null, 30);
    String defaultav = Toolbox.defaultParam(orgnum,request, "defaultav", "");
  
    if (rdap != null) {
        String sql = "SELECT help FROM Task where name='" + rdap + "'";
        
        int n = adapter.executeQuery(sql);
        if (n == 1) {
            String   help = merge(adapter.getValueAt(0, 0).trim(), defaultav);
           // String insertQuery[] = sql.split("\n[\r]*\n+");
            sql = "UPDATE Task SET help='"  +  help.replaceAll("'", "''")  + "' WHERE name='" + rdap + "'";

            n = adapter.executeUpdate(sql);
            if (n == 1) 
            {
                FileWriter fw = null;
                FileInputStream fin = null;
                try 
                {
                    fw = new FileWriter(path(user.id + "_fm",orgnum), false);
                    fin = new FileInputStream(path(rdap,orgnum)); 
                    InputStreamReader esr = new InputStreamReader(fin);
                    BufferedReader ebr = new BufferedReader(esr);
                    String aline;
                    while ((aline = ebr.readLine()) != null) 
                    {
                        int j = aline.indexOf("<script type=text/javascript >var defaultorinitv =");
                        if (j == -1) 
                        {
                            fw.append(aline + "\n");
                        } 
                        else if (j > 0) 
                        {
                            fw.append(aline.substring(0, j) + "\n");
                        }
                    }
                    fw.append("<script type=text/javascript >var defaultorinitv =\"" + Generic.handle(defaultav) + "\";</script>");
                } finally {
                    if (fw != null) {
                        fw.close();
                    }
                    if (fin != null) {
                        fin.close();
                    }
                    if (fw != null && fin != null) {
                        path(rdap,orgnum).delete();
                        path(user.id + "_fm",orgnum).renameTo(path(rdap,orgnum));
                    }
                }
                out.print(Toolbox.emsgs(orgnum,71));
            } else {
                out.print("wrong SQL:" + sql);
            }
        } else {
            out.print("wrong SQL:" + sql);
        }

    } else {
        out.print("no rdap");
    }
    out.println("<script type=text/javascript >var thismode = " + mode + ";</script></body>");
} else if (mode.equals("20")) {
    rdap = Toolbox.defaultParam(orgnum,request, ("rdap"), null);
    rdap = Toolbox.validate(rdap, null, 30);
    String newrdap = Toolbox.defaultParam(orgnum,request, "newrdap", "", null, 30);
    if (rdap.equals(newrdap))
    {  
        out.println("the same table");
        return; 
    }
%>
<center>
    <center><div  style="background:<%="linear-gradient(to right," + cachedstyle.IBGCOLOR  + "," +  Toolbox.headercl(cachedstyle.IBGCOLOR) + ")"%>;color:#DDCC11;font-weight: 700" width="100%" align="center"><nobr><%=Toolbox.emsgs(orgnum,875)%></nobr></div></center>
    
    <form rel=opener name="f1" style="margin:4px 0px 0px 0px"  >
         
        <div class="outset3" id="instr" style="color:purple;text-align:left"><%=Toolbox.emsgs(orgnum,1385)%></div> 
        <div class="outset3" style="margin:4px 0px 0px 0px"> 
            <input type="button" value="<%=Toolbox.emsgs(orgnum,943)%>" class="GreenButton" onclick="buildit()">
        <table cellpadding="1" cellspacing="1" bgcolor="<%=cachedstyle.BBGCOLOR%>">
            <tr>
                <td><%=rdap%>  </nobr></td>
                <td bgcolor="<%=cachedstyle.TBGCOLOR%>"></td>
                <td><%=newrdap%> </td>
            </tr>
        </table></form>
    <form rel=opener name="f2" method="post" action="wordform.jsp" onsubmit="return makesql()"  >
        <input type="hidden" name="securitytoken" value="<%=securitytoken%>" >
        <input type="hidden" name="mode" value="21">
        <input type="hidden" name="newrdap" value="<%=newrdap%>">
        <input type="hidden" name="rdap" value="<%=rdap%>">
        <input type="hidden" name="X" value="">
        <input type="hidden" name="Y" value="">
        <input type="submit" value="<%=Toolbox.emsgs(orgnum,727)%>" class="OrangeButton"> 
        <input type="button" value="<%=Toolbox.emsgs(orgnum,169)%>" class="RedButton" onclick="close()" >
        
    </form>
    </div>
</center>
<script type="text/javascript" >
    var thismode = <%=mode%>;
    var font_size = <%=cachedstyle.fontsize%>;
    
    var msg1386 = "<%= Toolbox.emsgs(orgnum,1386) %>";
    resizebut(document.f1);
    resizebut(document.f2);
</script>
<script src="wordform.js"></script>
<%
    out.println("</body>");
} else if (mode.equals("21")) {
    rdap = Toolbox.defaultParam(orgnum,request, ("rdap"), null);
    rdap = Toolbox.validate(rdap, null, 30);
    String newrdap = Toolbox.defaultParam(orgnum,request, ("newrdap"), null);
    newrdap = Toolbox.validate(newrdap, null, 30);
    String X = Toolbox.defaultParam(orgnum,request, "X", "");
    X = Toolbox.validate(X, "'\",!@#$%^&*()-+={[]}\\|:;/?", 400);
    String Y = Toolbox.defaultParam(orgnum,request, "Y", "");
    Y = Toolbox.validate(Y, "'\",!@#$%^&*()-+={[]}\\|:;/?", 400);
    String sql = "INSERT INTO " + newrdap +"("
            +  X
            +  ") SELECT "
            +  Y 
            + " FROM " + rdap + " WHERE n>0"; 
    int n = adapter.executeUpdate(sql);
    out.println("<div class=outset1>");
    if (n > 0) {
        out.println(Toolbox.emsgs(orgnum,83) + ":" + n);
    } 
    else 
    {
        out.println(Toolbox.emsgs(orgnum,1508));
        if ( (user.roles & Systemroles.SYSTEMADMIN) > 0)
            out.println(sql + "<br>" + adapter.error());
    }
    out.println("</div>");
    out.println("<script type=text/javascript >var thismode = " + mode + ";</script></body>");
} else if (mode.equals("22")) {

    rdap = Toolbox.defaultParam(orgnum,request, ("rdap"), null);
    rdap = Toolbox.validate(rdap, null, 30);
    String widthstr = Toolbox.defaultParam(orgnum,request, ("width"), null);
    widthstr = Toolbox.validate(widthstr, null, 5);
    String heightstr = Toolbox.defaultParam(orgnum,request, ("height"), null);
    heightstr = Toolbox.validate(heightstr, null, 5);
    int width = 400;
    int height = 300;
    try {
        width = Integer.parseInt(widthstr);
        height = Integer.parseInt(heightstr);
    } catch (Exception e) {
    }
    try 
    {
        String aline = new Scanner( path(rdap,orgnum)).useDelimiter("\\Z").next();
        String js = (new Encode6b(orgnum)).to6b( path(rdap,orgnum).getAbsolutePath());  
      
        out.println("<form rel=opener name=f1 method=post action=wordform.jsp target=w" + tstmp + "  style=\"margin:0px 0px 0px 0px\"   >");
        out.println("<table width=100% border=0 cellpadding=1 cellspacing=0  ><tr><td align=center>");
        out.println("<table cellspacing=0 cellpadding=0><tr>");
        if (aline.indexOf("commonlooking") < 0)
           out.println("<td  class=\"tdbutton GreenButton\"   id=editor  onclick=\"wyewyg(document.f1.destination)\"  align=center><script>document.write('<nobr>'+textmsg[1378]+'</nobr>');</script></td>" );
        else
           out.println("<td  class=\"tdbutton GreenButton\"   id=editor  onclick=\"domodify('" + js +  "')\"  align=center><nobr> " + Toolbox.emsgs(orgnum,261) + "</nobr></td>" ); 
            
        out.print("<td><input name=mode type=hidden value=\"" + 23 + "\">");
        out.println("<input name=rdap type=hidden value=\"" + rdap + "\"></td><td style=\"background:inear-gradient(to right," + cachedstyle.IBGCOLOR  + "," +  Toolbox.headercl(cachedstyle.IBGCOLOR) + ") ;color:#DDCC11\"><nobr> " + Toolbox.emsgs(orgnum,1348) + "</nobr></td><td><input name=linenum size=3 ></td>");
        out.println("<td class=\"tdbutton GreenButton\"   id=goto  onclick=\"go2line(document.f1.linenum.value)\" align=center>" + Toolbox.emsgs(orgnum,1270) + "</td><td>");
        out.println(" </td><td>");
        out.println("<input type=text name=old size=10></td>");
        out.println("<td class=\"tdbutton GreenButton\"   id=search onclick=\"findstrintextarea(document.f1.old.value)\"  align=center>" + Toolbox.emsgs(orgnum,1113) + "</td>");
        out.println("<td> </td><td><input type=text name=newstr size=10></td>");
        out.println("<td  class=\"tdbutton GreenButton\"   id=replace  onclick=\"replacestrintextarea(document.f1.newstr.value)\"  align=center>" + Toolbox.emsgs(orgnum,1114) + "</td>");
        out.println("<td  class=\"tdbutton OrangeButton\"   id=submit   onclick=\"if(validate()){formnewaction(document.f1);visual(document.f1);document.f1.submit();}\"  align=center>" + Toolbox.emsgs(orgnum,36));
        out.print("</td><td  class=\"tdbutton RedButton\"   id=cancel   onclick=\"cancel()\"  align=center>" + Toolbox.emsgs(orgnum,169));
        //out.print("</td><td  class=\"tdbutton GreenButton\"   id=closebut   onclick=\"cancel()\"  align=center>" + Toolbox.emsgs(orgnum,82));
        out.print("</td></tr></table></td></tr>");
        out.println("<tr><td align=left ><textarea name=destination style=\"font-size:" + cachedstyle.fontsize + ";width:" + (width - 40) + "px;height:" + (height - 100 - cachedstyle.fontsize) + "px\"  >");
            
        int j = aline.indexOf("<script>var uid='");
        if (j > 0) 
        {
            out.print(aline.substring(0, j).replaceAll("<", "&lt;") + "&lt;/body>&lt;/html>");
            out.println("</textarea></td></tr><tr><td style=\"color:red;text-align:center;font-weight:700\" ><input type=hidden value=1 name=tail>" + Toolbox.emsgs(orgnum,1397) + "</td></tr>");
        } 
        else 
        {
             out.print(aline.replaceAll("<", "&lt;"));
             out.println("</textarea></td></tr><tr><td style=\"color:red;text-align:center;font-weight:700\" >" + Toolbox.emsgs(orgnum,1397) + "</td></tr>");
        }
        out.println("</table></form>");
        out.println("<script type=text/javascript  src=findrep.js></script>");
        out.println("<script type=text/javascript > var thismode = " + mode + ";");
        out.println("function domodify(js) { open(\"wordform.jsp?mode=26&rdap=" + rdap + "&pathcode="+js+"\",parent.frames[0].name); open(\"wordfmsp.jsp?numfrms=3&rdap=" + rdap + "&js=1\", \"_self\");}");
        out.println("if (typeof(DBGCOLOR)=='undefined')var DBGCOLOR='" + cachedstyle.DBGCOLOR  + "';var bs='';\nfunction init(){bs = document.f1.destination.value;");
        out.println("textareatobesearch=document.f1.destination;}\nfunction cancel(){document.location.href = 'wordform.jsp?mode=9&rdap=" + rdap + "';}");
        out.println("function msg(){if (bs !=document.f1.destination.value)return textmsg[791];}");
        out.println("function validate(){if (bs==document.f1.destination.value){myprompt('No change');setTimeout('closeprompt()',1000);return false;} else {myprompt('" + Toolbox.emsgs(orgnum,154) + "'); return true; }}");
        out.println("function syn(x){myprompt(x); if (x == '" + Toolbox.emsgs(orgnum,71) + "'){bs=document.f1.destination.value; setTimeout('closeprompt()',1000);}}");
        out.println("\nwindow.onbeforeunload=msg;\n onload = init;</script>\n<iframe name=w" + tstmp + " width=1 height=1 style=\"visibility:hidden;border:0px 0px 0px 0px;margin:0px 0px 0px 0px\" />");
    } 
    catch (Exception e) 
    {
        out.println(rdap + "  " + Toolbox.emsgs(orgnum,1531));
    }
    out.println("</body>");
} else if (mode.equals("23")) {
    rdap =  Toolbox.defaultParam(orgnum,request, "rdap", null,null,30);
    String tail =  Toolbox.defaultParam(orgnum,request, "tial", null, null, 1);
    
    String des = Toolbox.defaultParam(orgnum,request, ("destination"), null);
    des = Toolbox.removescript(des);
    int jj = des.lastIndexOf("</body>");
    des = des.substring(0,jj);
    if (des.length() > 300000) des = des.substring(0,300000);
    String aline = "";
    //if (tail!=null)
    {
        aline = new Scanner(path(rdap,orgnum)).useDelimiter("\\Z").next();
        int j = aline.indexOf("<script>var uid='");
        aline = "\n" + aline.substring(j);
    }
    try 
    {
        FileWriter aWriter = new FileWriter(path(rdap,orgnum).getAbsolutePath(), false);
        aWriter.write(des);
        aWriter.write(aline);
        aWriter.close();
        out.println("<script type=text/javascript >parent.syn('" + Toolbox.emsgs(orgnum,71) + "');</script>");
    } catch (Exception e) 
    {
        out.println("<script type=text/javascript >var thismode = " + mode + ";parent.syn('" + e.toString() + "<br>" + Toolbox.emsgs(orgnum,98) + "');</script>");
    }
    out.println("</body>");
} else if (mode.equals("24")) 
{
    rdap = Toolbox.defaultParam(orgnum,request, ("rdap"), null);
    if (rdap != null) 
    {
        String ans = Formr.modifyFile(rdap, null, null, "", -1, user, 0);
        if (ans.equals("")) {%>
<script type="text/javascript" >
    var addr = parent.frames[0].document.location.toString();
    var jss =  parent.frames[0].document.getElementsByTagName('script');
    for (var j=0; j < jss.length; j++)
    if (jss[j].src == 'formlist<%= (user.orgnum%65536)%>.js') break;
    jss[j].src = 'formlist<%= (user.orgnum%65536)%>.js';
    parent.frames[0].document.location.href = addr;
</script>
<%}
    }
    out.println("<script type=text/javascript >var thismode = " + mode + ";</script></body>");
}
else if (mode.equals("25")) 
{
    rdap =  Toolbox.defaultParam(orgnum,request, "rdap", null, null, 30);
    if (rdap != null) 
    {
        String fn = Toolbox.defaultParam(orgnum,request, "fn", null, null, 20);
        String pa = Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator + "attach" + File.separator + rdap +  File.separator +  fn;
        boolean ans = (new File(pa)).delete();
        if (ans ) 
        {%>
        <script type="text/javascript" > opener.syndelete('<%=fn%>');</script>
        <%}
    }
    out.println("<script type=text/javascript >var thismode = " + mode + ";</script></body>");
}
else if (mode.equals("26")) 
{
    rdap = Toolbox.defaultParam(orgnum,request, "rdap", "", null, 30);
     
    int wtd = Math.round(cachedstyle.fontsize * Toolbox.charwidthrate());
    if (wtd > 80) 
    {
        wtd = 80;
    }
    String pathcode =  Toolbox.defaultParam(orgnum,request, "pathcode", "$_", null, 50);
    String filepath = "";
    try{filepath = (new Encode6b(orgnum)).rto6b(pathcode);}catch(Exception e){}
    String savein = filepath;
    int i = filepath.lastIndexOf(File.separator);
    String filename = filepath.substring(i+1);
%>

<center>
    <%=Toolbox.title(Toolbox.emsgs(orgnum,4))%>

    <table cellspacing="0" cellpadding="0" > <tr height=5><td valign=TOP></td></tr></table>
    <table BORDER=0 cellspacing=0 cellpadding="0" align="center"   width="100%">
        <tr><td>
            <form rel=opener style="margin:3px 0px 3px 0px" name="form1" onsubmit="return validate()" target="tlmcvtfm" method="post" action="wordform.jsp"    >
                 <input type="hidden" name="override" value="<%=filename%>">
                    <input  name="rdap" type="hidden"  value="<%=rdap%>" >
                    <input name="sql"     type="hidden" value="">
                    <input name="sql2"     type="hidden" value="">
                    <input type="hidden" name="defaultav" value="">
                    <input name="fontname"    type="hidden" value="<%=Toolbox.fontsnamestr(orgnum>>16)%>" >
                    <input  name="mode"  type="hidden" value="" >
                    <input type="hidden" name="attach" value="1">
                <table cellspacing="2" cellpadding="0" align="center" >
                  <tr>
                    <td class="fields2"><nobr><%=Toolbox.emsgs(orgnum,1271)%></nobr></td>
                    <td  class="value2" id="lb0" align="left"><%=rdap%></td>
                    <td><input  type=file style="width:1px;visibility:hidden" name=localpath value="<%=Toolbox.emsgs(orgnum,458)%>"  onchange="upload()"></td>
                    <td class="tdbutton GreenButton"  align="center" onmouseover="showmyhint(0)" onmouseout="hidemyhint()" id=parsebtn     onclick="closeprompt();if(sinkbut(this)){choose()}"><%=Toolbox.emsgs(orgnum,647)%></td>
                    <td align="center" id=makeitlbl ><nobr><%=Toolbox.emsgs(orgnum,1381)%></nobr></td>
                    <td class="tdbutton GreenButton"   align="center"  onmouseover="showmyhint(1)"  onmouseout="hidemyhint()"  id=savebtn      onclick="savemmodify()"    ><nobr><%=Toolbox.emsgs(orgnum,36)%></nobr></td>
                    <td class="tdbutton RedButton"    align="center"  onmouseover="showmyhint(2)"  onmouseout="hidemyhint()"  id=deletebtn     onclick="closeprompt();if(sinkbut(this))cancelmodify();"><%=Toolbox.emsgs(orgnum,169)%></td>
                  </tr>
                </table>
            </form>
         </td></tr>
    </table>
</center>
 
<script type="text/javascript" >
var thismode = <%=mode%>,
hints = ['1','2','3'],
IBGCOLOR = '<%=cachedstyle.IBGCOLOR%>',
DBGCOLOR = '<%=cachedstyle.DBGCOLOR%>',
font_size = <%=cachedstyle.fontsize%>, 
userid = '<%=user.id%>',
notexist = "<%=Toolbox.emsgs(orgnum,1531)%>",
msg206="<%=Toolbox.emsgs(orgnum,206)%>",
msg160="<%= Toolbox.emsgs(orgnum,160)%>",
msg923="<%= Toolbox.emsgs(orgnum,923)%>",
msg1283="<%=Toolbox.emsgs(orgnum,1283)%>",
msg1278="<%=Toolbox.emsgs(orgnum,1278)%>",
msg1285="<%=Toolbox.emsgs(orgnum,1285)%>",
msg1286="<%=Generic.handle(Toolbox.emsgs(orgnum,1286))%>",
msg1449="<%=Generic.handle(Toolbox.emsgs(orgnum,1449))%>",
uid='<%=user.id + labels%>',
subdb='<%=subdb%>',
supportfile = "<%=Toolbox.emsgs(orgnum,1290)%>",
lblupload = "<%=Toolbox.emsgs(orgnum,1291)%>",
capupload = "<%=Toolbox.emsgs(orgnum,647)%>", 
capsave="<%=Toolbox.emsgs(orgnum,36)%>",
IBGCOLOR = "<%=cachedstyle.IBGCOLOR%>", 
enterone="<%=Toolbox.emsgs(orgnum,231)%>",
msg1292="<%=Toolbox.emsgs(orgnum,1292)%>",
msg1290="<%=Toolbox.emsgs(orgnum,1290)%>",
msg1382 = "<%=Toolbox.emsgs(orgnum,1382)%>",
instr="<%=Toolbox.emsgs(orgnum,958)%>",
formimg = false,
buttonhints = textmsg[1588];

document.form1.override.disabled = true;
function tellrdap(){return document.form1.rdap.value;}
function helphints(){}

function upload()
{
    document.form1.encoding='multipart/form-data';
    parse();
    if (valid) visual(document.form1);
document.form1.submit();
}
function choose()
{
    var myfontname1 = localStorage['myfontname'];
    if (myfontname1!=null) 
    {
         myfontname = myfontname1;
    }
    else
        myfontname = defaultfontfamily;
    document.form1.fontname.value = myfontname;
    document.form1.localpath.click();
}
function cancelmodify()
{
    document.form1.encoding = "application/x-www-form-urlencoded";
    document.location.href = "wordform.jsp?mode=1&initrdap=<%=rdap%>";
}
var suspects = "";
function getsuspects(x){suspects = x;}
function showsavebtn(){}
function  savemmodify()
{
    document.form1.mode.value = "27";
    document.form1.target = parent.frames[1].frames[2].name;
    visual(document.form1);
document.form1.submit();
}

</script>
<script type="text/javascript"   src=hints.js></script>
<script type="text/javascript"   src=curve.js></script>
<script type="text/javascript"   src=wordform.js></script>
<script type="text/javascript">
var onloadbeforewf = null;
if (typeof window.onload == 'function')
onloadbeforewf = window.onload;
window.onload = function()
{
    if (onloadbeforewf!=null) onloadbeforewf();
    makeanchor();
}
</script>
</body>
<%
}
else if (mode.equals("27")) 
{
    String sqls = Toolbox.defaultParam(orgnum,request, "sql", "");
    String delete1 = Toolbox.defaultParam(orgnum,request, "sql2", "");
    
    int sindex = Toolbox.begintranslate("mysql");
    int tindex = Toolbox.begintranslate(adapter.dbms);
    sqls = Toolbox.translateStr(sqls, sindex, tindex);
    String s[] = sqls.split("&-@;#");
    String X[]=null, Y[]=null;
    boolean doit =(s.length >= 8);
    String which = "";
    String olddef = null; 
    int k;
    if (!doit)
        out.println("s.length=" + s.length);
    else
    {
        long ct = System.currentTimeMillis() / 1000;
// parsed = sql + "&-@;#" + rdap + "&-@;#" + fds +"&-@;#" +  inst + "&-@;#" + updatesql + "&-@;#" + deletesql+ "&-@;#" + zeror + "&-@;#" + helpstr + " ";
        String defaultav = Toolbox.defaultParam(orgnum,request, "defaultav", "");
        //s[3] += "\n\n" + defaultav;
        k = adapter.executeQuery("SELECT definition FROM Apptables WHERE tname='" + s[1] + "'");
        if (k < 1)
        {
            out.println(adapter.error());
            doit = false;
        }
        else
        {
            olddef = adapter.getValueAt(0,0);  
            X = olddef.replaceFirst("(i?),[ ]*PRIMARY KEY.*", "").replaceFirst("[^,]+,","").split("[\\S]*,[\\S]*");
            Y =   s[0].replaceFirst("(i?),[ ]*PRIMARY KEY.*", "").replaceFirst("[^,]+,","").split("[\\S]*,[\\S]*"); 
            if (X.length-1 == Y.length)
            {
                which = "delete"; 
                int i=0; 
                for (; i < Y.length && X[i].equals(Y[i]); i++); 
                int j = Y.length-1;
                for (; j>=0 && X[j].replaceFirst("([a-z])" + (j+1), "$1" + j).equals(Y[j]); j--);
                
            }
            else if (X.length <= Y.length)
            {
                which = "modify";
            }
        }
    }
    if (doit) 
    {
        for (int i=0; i < Y.length; i++) 
        {
            String sqlstr = "";
            if (i >= X.length)
            {
                sqlstr  += "ALTER TABLE " + s[1] + " Add COLUMN " + Y[i];
                k = adapter.executeUpdate(sqlstr);
                 
            }
            else if (!X[i].equals(Y[i]))
            {
                if ( adapter.dbms.indexOf("access") >= 0)
                sqlstr  += "ALTER TABLE " + s[1] + " ALTER COLUMN " + X[i].replaceFirst(" .*","") + " TO " + Y[i].replaceFirst(" .*","");
                else if (adapter.dbms.indexOf("mysql") >= 0)
                sqlstr += "ALTER TABLE " + s[1] + " CHANGE COLUMN " + X[i].replaceFirst(" .*","") + " TO " + Y[i];
                else
                sqlstr += "ALTER TABLE " + s[1] + " RENAME COLUMN " + X[i].replaceFirst(" .*","") + " TO " + Y[i].replaceFirst(" .*","");
                if ( adapter.dbms.indexOf("access") < 0)
                sqlstr +=   "; ALTER TABLE " + s[1] + " MODIFY COLUMN " + Y[i].replaceFirst(" .*","");
                else
                sqlstr +=   "; ALTER TABLE " + s[1] + " ALTER COLUMN " + Y[i].replaceFirst(" .*","");
                k = adapter.executeUpdate(sqlstr);
                
            }
        }
        
        String sql1 = "UPDATE Task SET query='" + s[2].replaceAll("'","''") +   "', insertQuery='" + s[3].replaceAll("'", "''") + "',updateQuery='"  + s[4].replaceAll("'", "''") + "',deleteQuery='" + s[5].replaceAll("'", "''") + "'"    
                  +  " WHERE name='" + s[1] + "'" ;   
        k = adapter.executeUpdate(sql1);
       
        sql1  = "UPDATE Apptables set definition = '" + s[0].replaceAll("'", "''") + "' where tname='" + s[1] + "'";  
        k = adapter.executeUpdate(sql1); 
       
        String tablename = s[1];
       
        rdap =  Toolbox.defaultParam(orgnum,request, "rdap", null, null, 30);
        File saveFile = path(rdap,orgnum);  
        Scanner scanner = new Scanner(saveFile);   
        String  aline = scanner.useDelimiter("\\Z").next();
        scanner.close();
        int j = aline.indexOf("<script");
        String yy = aline.substring(j);
        saveFile = path(user.id + "_fm",orgnum);  
        scanner = new Scanner(saveFile);   
        aline = scanner.useDelimiter("\\Z").next();
        scanner.close();
        j = aline.indexOf("<script");
        FileWriter aWriter = null;
        try 
        {
            aWriter = new FileWriter(path(rdap,orgnum).getAbsolutePath(), false);
            aWriter.write(aline.substring(0,j));
            aWriter.write(yy);
            aWriter.close();
            %>
            <script type=text/javascript > parent.parent.frames[0].location.href = "wordform.jsp?mode=1&initrdap=<%=rdap%>";
            </script>
            <%
        } catch (Exception e) 
        {
            if (aWriter!=null)aWriter.close();
            out.println("<script type=text/javascript >var thismode = " + mode + ";</script>" + e.toString() + "<br>" + Toolbox.emsgs(orgnum,98)  );
        } 
        
    }
}
     
}
adapter.close();

%>
</html>