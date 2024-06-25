<%@  page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*,java.io.*,java.util.zip.*" %>
<%!
boolean thesame(String x, String y)
{
    String [] xs = x.split("\\|"); String [] ys = y.split("\\|");
    int j = 0;
    for( ; j < xs.length-1; j++)
        if (!xs[j].equals(ys[j])) return false;
    xs[j] = "," + xs[j].replaceAll(" ","") + ",";
    ys[j] = "," + ys[j].replaceAll(" ","") + ","; 
    return xs[j].contains(ys[j]) || ys[j].contains(xs[j]);
}
boolean checkPass(String code, AssOption assopt, User user, ServletContext app,  String key, String iid, JDBCAdapter adapter )
{
     boolean checkpass = false; 
     String acode = assopt.code; 
   
     if (acode == null || acode.equals(""))
         return true;
     if (acode.indexOf("attendance")==0)
     {
        HashMap<String,String> absence = (HashMap)app.getAttribute(key); 
        if (absence == null)
        {
            absence = getabsence(adapter,key);
            app.setAttribute(key,absence);
            if (absence.get(user.id) == null) 
            checkpass = true;
        }
        else if (absence.get(user.id) == null) 
        {
            checkpass = true;
        }
        else
        {   
            absence = getabsence(adapter,key);
            app.setAttribute(key,absence);
            if (absence.get(user.id) == null) 
                checkpass = true;
        }
     }
     else if (acode.indexOf("distinct") == 0)
    {
        synchronized(this)
        {
           String y = null; 
           HashMap<String,String> asids = (HashMap)app.getAttribute(key); 
           if (asids == null)
           {
                asids = new HashMap<>();
           } 
           y = asids.get(code);
           if (y!=null && y.equals(user.id))
               checkpass = true;
           else if (y!=null && y.equals(""))
           {
               checkpass = true;
               asids.put(code,user.id);
               app.setAttribute(key,asids); 
           }
           else if (y == null)
           {
               getdcodes(adapter,iid,asids);
               y = asids.get(code);
               if (y!=null && y.equals(user.id))
                   checkpass = true;
               else if (y!=null && y.equals(""))
               {
                   checkpass = true;
                   asids.put(code,user.id);
               }  
               else if (asids.size() == 0)
                  checkpass = true;
               if (asids.size() != 0) 
                  app.setAttribute(key,asids); 
               
           }
        }
    }
   else if (!acode.equals(""))
   {
       checkpass = (code!=null && acode.equals(code));
   }
   return checkpass;
}  

void getdcodes(JDBCAdapter adapter, String iid,HashMap<String,String> asids)
{
    String sqls  = "SELECT code,sid FROM DistinctCode WHERE iid='" +  iid + "'";                        
    boolean bn = adapter.executeQuery2(sqls, true);
    String x2 = "";  
    for (int i = 0; bn && (x2=adapter.getValueAt(i, 0))!=null; i++) 
    {
        String y = adapter.getValueAt(i,1);
        if (y==null  ) y = "";
        asids.put(x2, y); 
     }
}
//
//getattendance(atapter,subdb,semester,course,sessionname)
static int delay = 2700;// 45 minutes
HashMap<String,String>   getabsence(JDBCAdapter adapter, String key)
{
    String [] parts = key.split("\\|");
    String semester = parts[1];
     String course = parts[2];
    String assignname = parts[3];
    String sessionnames = parts[4];
     
    String sqls  =  "SELECT sid FROM Absence WHERE  courseid='"  
    + course +"' AND sessionname IN　'("   + sessionnames.replaceAll(",", "','") + "')" 
    + "  AND semester=" + semester +"   AND atime > " + (System.currentTimeMillis()/1000-delay);
    boolean bn = adapter.executeQuery2(sqls, true);
    HashMap<String,String> s = new HashMap<>();
    String x2 = "";  
    for (int i = 0; bn && (x2=adapter.getValueAt(i, 0))!=null; i++) 
    {
       s.put(x2,"1");
    }
    return s;
}

boolean zipfiles(String [] filenames, String dir, String zipFile) 
{
    int i = 0; 
    File f = new File(dir, zipFile);
    boolean hasfile = f.exists();
    if  ( hasfile )
    {
        f.delete();
    }
    try
    {
        FileOutputStream fout = new FileOutputStream(f);
        ZipOutputStream zout = new ZipOutputStream(fout);
        addDirectory(zout, filenames, dir);
        zout.close();
        zout.closeEntry();
        fout.close();
    }
    catch(IOException ioe)
    {
        
    }
    return f.exists();
}

private static void addDirectory(ZipOutputStream zout, String [] filenames, String dir) 
{
    for(int i=0; i < filenames.length; i++)
    {
        try
        {
            byte[] buffer = new byte[1024];
            File f = new File(dir, filenames[i]);
           
            FileInputStream fin = new FileInputStream(f);
            zout.putNextEntry(new ZipEntry(filenames[i]));
           
            int length;
            while((length = fin.read(buffer)) > 0)
            {
               zout.write(buffer, 0, length);
            }
            
            fin.close();
        }
        catch(IOException ioe)
        {
            
        }
    }
} 
String[] atta(String x, String subdb, String course, int orgnum)
{
     
     if (  x == null || x.equals("") ) return new String[]{"",""};
     Encode6b encoder = new Encode6b(orgnum);
     String str = Toolbox1.unzip(x).replaceFirst(",$",""); 
     CSVParse parse = new CSVParse(str,'\'',new String[]{"@",","});
     
     String [][] ats = parse.nextMatrix();
     String atstr = "";
     HashMap<String,String> fn2code = new HashMap(3);  
     String q = "";
     for (int i=0;  i < ats.length; i++)
     {
         String xs[] = ats[i];
         String code = xs[xs.length-1];
         if ( xs[0].replaceAll("[0-9]","").equals("")  && code.replaceAll("[0-9]", "").equals("___"))
         {
            String ns[] = code.split("_");
            q += "div.imagelet" +  xs[0] 
              + "{background-image:url(" + xs[1] + ");background-position:-" + ns[0] + "px -" + ns[1] + "px;width:" + ns[2] + "px;height:" + ns[3] + "px;}\n"; 
            
            continue;
         }
         fn2code.put(xs[0], code); 
         String path = "";
         if (code.toLowerCase().indexOf("http")== 0)
         {
             atstr += " <span style=color:blue;cursor:pointer onclick=\"openproper('" + code + "','" + xs[0] + "',this)\" >" + xs[0] + "</span> "; 
            
         }
         else
         try
         {
             path = encoder.rto6b(code);
             path = path.replace('/', File.separatorChar ); 
             if ( path.toLowerCase().contains((File.separator +  Toolbox.emsgs(orgnum,1398).split(",")[1]+  File.separator).toLowerCase() ) )
             {
                 atstr += " <a href=\"" + xs[0] + "\" >" + xs[0] + "</a>";   
             }
         }catch(Exception e){}
     }
     return new String[]{atstr,q};
}    
    
boolean goodip(javax.servlet.http.HttpServletRequest request, String ip)
{
 if (ip.equals("")) return true;
 String addr = request.getRemoteAddr();
 return (addr.indexOf(ip) >=0 );
}
 
String[] attach(String x, String subdb, String course, boolean question, int orgnum)
{
     if (  x == null || x.equals("") ) return new String[]{"",""};
     Encode6b encoder = new Encode6b(orgnum);
     String str = Toolbox1.unzip(x).replaceFirst(",$",""); 
     CSVParse parse = new CSVParse(str,'\'',new String[]{"@",","});
     
     String [][] ats = parse.nextMatrix();
     String atstr = "";
     HashMap<String,String> fn2code = new HashMap(3);  
     String q = "";
     for (int i=0;  i < ats.length; i++)
     {
         String xs[] = ats[i];
         String code = xs[xs.length-1];
         if ( xs[0].replaceAll("[0-9]","").equals("")  && code.replaceAll("[0-9]", "").equals("___"))
         {
            String ns[] = code.split("_");
            q += "div.imagelet" +  xs[0] 
              + "{background-image:url(FileOperation?did=" 
              + fn2code.get(xs[1]) + ");background-position:-" + ns[0] + "px -" + ns[1] + "px;width:" + ns[2] + "px;height:" + ns[3] + "px;}\n"; 
            
            continue;
         }
         fn2code.put(xs[0], code); 
         
         String path = "";
         if (code.toLowerCase().indexOf("http")== 0)
         {
             atstr += " <span style=color:blue;cursor:pointer onclick=\"openproper('" + code + "','" + xs[0] + "',this)\" >" + xs[0] + "</span> "; 
         }
         else
         try
         {
             path = encoder.rto6b(code);
             path = path.replace('/', File.separatorChar ); 
             if ( question == false && code.indexOf("_") == 0 ) 
             {
                 atstr += " <span style=color:blue;cursor:pointer onclick=\"openproper('" + code + "','" + xs[0] + "',this)\" >" + xs[0] + "</span> "; 
             }
             else if ( question && (path.toLowerCase().contains(File.separator + "assignment" + File.separator) || path.toLowerCase().contains((File.separator +  Toolbox.emsgs(orgnum,1398).split(",")[1]+  File.separator).toLowerCase() ) ))
             {
                 atstr += " <span style=color:blue;cursor:pointer onclick=\"openproper('" + code + "','" + xs[0] + "',this)\" >" + xs[0] + "</span> ";   
             }
         }catch(Exception e){}
     }
     if (!atstr.equals(""))
     {
         atstr  =   Toolbox.emsgs(orgnum,355)+": " + atstr;  
     }
     return new String[] {atstr,   q  };
}

String delanspart(String x)
{
   
    x = Toolbox1.unzip(x);
    
    x = x.replaceFirst(",$","");
  
    String [] xs = x.split(","); 
    String ans = "";
    for (int i=0; i < xs.length; i++)
    {
     
        if (xs[i].indexOf("@_") < 0)
          ans += xs[i] + ",";
    }
    return ans; 
} 

String maybeimg(String x,   boolean question, int orgnum)
{
     
     if (  x == null || x.equals("") ) return "";
     Encode6b encoder = new Encode6b(orgnum);
     
     String [] ats = Toolbox1.unzip(x).split(","); 
     String atstr = "";
     String q = "";
     HashMap<String,String> fn2code = new HashMap(3); 
     for (int i=0;  i < ats.length; i++)
     {
         String xs[] = ats[i].split("@");
         String fn = xs[0].replaceFirst("^.*\\.([^\\.]+)$", "$1").toLowerCase();
         
         
         String code = xs[2];
         if ( xs[0].replaceAll("[0-9]","").equals("")  && code.replaceAll("[0-9]", "").length() > 2)
         {
            String xx = fn2code.get(xs[1]); if (xx == null) continue;
            String ns[] = code.split("_");
            q += "div.imagelet" +  xs[0] 
              + "{background-image:url(FileOperation?did=" 
              + xx + ");background-position:-" + ns[0] + "px -" + ns[1] + "px;width:" + ns[2] + "px;height:" + ns[3] + "px;}\n"; 
            
            continue;
         }
         if (!fn.equals("jpg") && !fn.equals("jepg") && !fn.equals("gif") && !fn.equals("png"))
         {
             continue;
         }
        
         
         
         String path = "";
         try
         {
             path = encoder.rto6b(code);
             path = path.replace('/', File.separatorChar ); 
             
             if ( question == false && code.indexOf("_") == 0 ) 
             {
                 atstr += "<img src=\"FileOperation?did=" + code + "\" ><br>"; 
                  fn2code.put(xs[0], code); 
             }
             else if ( question && (path.indexOf(File.separator +  Toolbox.emsgs(orgnum,537) +  File.separator) >=0
                                   || path.indexOf(File.separator +  "assignment"+  File.separator) >=0 )) 
             {
                 atstr += "<img src=\"FileOperation?did=" + code + "\" ><br>"; 
                  fn2code.put(xs[0], code); 
             }
         }catch(Exception e){}
     }
     if (!q.equals("")) atstr = "<style>" + q + "</style>" + atstr.replaceAll("\\[Imagelet([0-9]+)\\]", "<table style=display:inline><tr><td><div class=imagelet$1></div></td></tr></table>");
     return atstr;
}
%>
<%

int orgnum = Toolbox.setcharset(request,response);
if (orgnum == -1) return;

CachedStyle cachedstyle = new  CachedStyle(request, orgnum);
String savetodoc = request.getParameter("savetodoc");
if (savetodoc != null)
{
    User user = null;
    if (!Toolbox.verifytoken(request) ||  (user = User.authorize(orgnum, Systemroles.INSTRUCTOR | Systemroles.TEACHINGADMIN |Systemroles.ASSESSER|Systemroles.STUDENT,application,session,request, response, "assigndoc.jsp", true)) == null)
     return;
    orgnum = user.orgnum; 
    String format = Toolbox.defaultParam(orgnum,request, ("format"), null);
    if (format == null ) 
    {
     format = Toolbox.defaultParam(orgnum,request, ("Format"), null);
    }
    if (format == null ) 
    {
     format = "0";
    }
    format = Toolbox.validate( format, null, 20);

    boolean test = false;
    long tstmp = System.currentTimeMillis() % 10000000;
    String des = Toolbox.defaultParam(orgnum,request, ("Content"), null);
    if (des==null) des = Toolbox.defaultParam(orgnum,request, ("source"), null);
    if (des==null) des = Toolbox.defaultParam(orgnum,request, ("content"), null);
    if (des==null) des = Toolbox.defaultParam(orgnum,request, ("Content"), null); 
    if (des==null) des = Toolbox.defaultParam(orgnum,request, ("Message"), null); 

    if (des == null) des = "";
    String attach = Toolbox.defaultParam(orgnum,request, ("Attach"), null); 
    if (attach==null) attach = Toolbox.defaultParam(orgnum,request, ("attach"), null); 
    if (attach==null) attach = Toolbox.defaultParam(orgnum,request, ("Attachment"), null); 
    if (attach==null) attach = Toolbox.defaultParam(orgnum,request, ("Attached"), null); 

    String semester = Toolbox.defaultParam(orgnum,request, ("semester"), null);
    if (semester==null)semester = Toolbox.defaultParam(orgnum,request, ("Semester"), null);
    String coursetitle = Toolbox.defaultParam(orgnum,request, ("coursetitle"), null);
    if (coursetitle==null) coursetitle = Toolbox.defaultParam(orgnum,request, ("courseTitle"), null);

    String course = Toolbox.defaultParam(orgnum,request, ("Subject"), null);
    if (course==null) course = Toolbox.defaultParam(orgnum,request, ("CourseId"), null);
    if (course==null) course = Toolbox.defaultParam(orgnum,request, ("course"), null);
    if (course == null) course = Toolbox.defaultParam(orgnum,request, ("Course"), null);
    if (course==null) course = Toolbox.defaultParam(orgnum,request, ("courseid"), null);
    course = Toolbox.validate( course, null, 20);

    String sessionname = Toolbox.defaultParam(orgnum,request, ("sessionname"), null);
    if (sessionname == null) sessionname = Toolbox.defaultParam(orgnum,request, ("Sessions"), null);
    sessionname = Toolbox.validate( sessionname, ",-", 60);

    String assignname = Toolbox.defaultParam(orgnum,request, ("assignname"), null);
    
     
    if (assignname == null) assignname = Toolbox.defaultParam(orgnum,request, ("Assignname"), null);
    if (assignname == null) assignname = Toolbox.defaultParam(orgnum,request, ("Assignment"), null); 
    if (assignname == null) assignname = Toolbox.defaultParam(orgnum,request, ("AssignTest"), null);
    if (assignname == null) assignname = Toolbox.defaultParam(orgnum,request, ("Name"), null);
    if (assignname == null) return;
    assignname = Toolbox.validate(assignname, "-_", 50);

    String atype = Toolbox.defaultParam(orgnum,request, ("Type"), null);
    atype = Toolbox.validate(atype, null, 50);
    String answers = "", pts = "";

    String due1 = Toolbox.defaultParam(orgnum,request, ("Due"), null);
    long due = Toolbox.parseTime(due1, cachedstyle.timeformat);
    for (String ss : sessionname.split(","))
        Toolbox.dbadmin[orgnum%65536].assigncache.remove( course + "|" + ss);
    String formattxt = Toolbox.defaultParam(orgnum,request, ("formattxt"), null);
    if (formattxt == null || formattxt.equals("")) 
    {
        out.println("<!DOCTYPE html><html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><body><script>parent.savedazip(null);</script></body></html>");
        return;
    }  
    String fname = Toolbox.defaultParam(orgnum,request, ("fname"), null);
    fname = Toolbox.removescript(fname );
    String title =  semester + " " + course + "  " + coursetitle + "<br>" +  assignname;

    String butstyle = "border-radius: 4px;color:white;font-weight:700;width:" + Math.ceil(4.8*cachedstyle.fontsize) + "px;font-size:" + cachedstyle.fontsize+ "px"; 
    String imglet[] = atta(attach , user.id , course, orgnum) ; 
    String attafiles[] = null;
    
    
    String zipfname = null;
    String fileprefix = "hmwk"; 
    if (atype!=null && (atype.equals("2") || atype.equals("3"))) fileprefix = "test";
    String filename = fileprefix;
    Encode6b encoder =  new Encode6b(orgnum);

    String fnm = encoder.to6b(assignname);
    if (fnm.length() > 10) 
        fnm = fnm.substring(fnm.length()-10);
    fileprefix += fnm;
    zipfname = fileprefix + ".zip";
    int foldernum = 1;

    if (atype!=null && (atype.equals("3") || atype.equals("2") || atype.equals("4")))
    {
        foldernum = 2;
    }
    else if (atype!=null && (atype.equals("0") || atype.equals("1")))
    {
        foldernum = 1;
    }
    String path1 = user.webFileFolder + File.separator + course + File.separator + UploadFile.pfolders[3 - foldernum] + File.separator + zipfname;
    File f = new File(path1);
    if (f.exists()) f.delete(); 
    String path2 = user.webFileFolder + File.separator + course + File.separator + UploadFile.pfolders[foldernum] + File.separator + zipfname;
    File f2 = new File(path2);
    if (f2.exists()) f2.delete(); 
    String path =  user.webFileFolder + File.separator + course + File.separator + UploadFile.pfolders[foldernum] + File.separator +  "index.html";

    String startstr = Toolbox.defaultParam(orgnum,request, ("Start"), null);
    long starti = Toolbox.parseTime(startstr, cachedstyle.timeformat);
    
    File f3 = new File(path);
    if (f3.exists()) f3.delete(); 
    String options =    Toolbox.defaultParam(orgnum,request, ("Options"), null) ;
    String latepermit =    Toolbox.defaultParam(orgnum,request, ("LatePermit"), null) ;
    String keystr = (orgnum%65536) + "|" + semester + "|" + course + "|" + assignname + "|" + sessionname;
    String [] info = new String[]{""+starti, ""+due, ""+atype, options, latepermit};
   
    FileWriter aWriter = new FileWriter(new File(path), false);
    aWriter.write("<!DOCTYPE html>\n");
    aWriter.write("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" >\n");
    aWriter.write("<head>\n<meta http-equiv=\"content-type\" content=\"text/html;charset=" + Toolbox.encodings[orgnum>>16] + "\">\n");
    aWriter.write(Toolbox.jaxhead );
    aWriter.write("<title>" + course + " " + assignname + "</title>\n");
    des = Toolbox.removescript(formattxt);
    AssOption assopt = new AssOption(options,orgnum);
    butstyle = "border-radius: 4px;color:white;font-weight:700;width:" + Math.ceil(4.8*Integer.parseInt(assopt.fs)) + "px;font-size:" + Integer.parseInt(assopt.fs)+ "px"; 
    aWriter.write("<style type=\"text/css\">\n");
    aWriter.write("td,body  {font-size:" + assopt.fs+ "px;font-family:" + assopt.ff+ ";font-weight:" + assopt.fw+ "}\n");
    aWriter.write("textarea {font-size:" + assopt.fs+ "px;font-family:courier;font-weight:700}\n");
    aWriter.write(".rado{background-color:" +  cachedstyle.DBGCOLOR + "}\n");
    aWriter.write(".outstand{border:2px inset;font-weight:800;text-align:center;font-family:" + Toolbox.fontsnamestr(orgnum>>16)+ ";font-size:20px;width:60px;}\n");
    aWriter.write("#floater1Div {position:absolute;visibility:visible}\n");
    aWriter.write(".quesans{border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;background-color:" + cachedstyle.TBGCOLOR+ ";font-size:" + assopt.fs+ "px;font-family:" + assopt.ff+ ";font-weight:" + assopt.fw+ "}\n");
    aWriter.write(".blanklook{border:1px #b0b0b0 solid}\n");
    aWriter.write(".noborder{border:0px}\n");
    aWriter.write(".errorcell{background-color:white;color:red}\n");
    aWriter.write(".GreenButton{background-color:#00BBBB;color:white;width:70px;font-weight:bold;font-size:18px;border:1px grey outset;border-radius:3px;box-shadow:1px 1px grey;text-shadow:1px 1px grey}\n");
    aWriter.write(".warncell{background-color:white;color:purple}\n");
    aWriter.write(".title{font-size:34px;font-weight:bold;color:#dd1111;font-family:Times}\n");
    aWriter.write(".outset1{border-radius:4px;font-size:" + assopt.fs+ "px;-webkit-border-radius:4px;-moz-border-radius:4px;background-color:#ABE1D3;border:1px #ABE1D3 outset;font-family:Times;padding:3px 3x 3px 3px}\n");
    aWriter.write(imglet[1]);
    aWriter.write("</style>\n");
    aWriter.write("<script type=\"text/javascript\"  src=\"https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/latest.js?config=TeX-MML-AM_CHTML\"></script>");
    aWriter.write("</head>\n");
    aWriter.write("<body style=\"background-color:" + cachedstyle.DBGCOLOR+ ";margin:5px 5px 5px 5px\">\n");
    aWriter.write("<center><div class=title>" + title + "</div>");
    aWriter.write("<div style=\"color:#661111;font-size:" + assopt.fs+ "px\" >" + Toolbox.emsgs(orgnum,1466) + "</div>");
    aWriter.write("</center>"); 

    if (atype!=null && (atype.equals("0") || atype.equals("2")))
    {
        if (imglet!=null&&!imglet.equals("")) 
        {
            aWriter.write("<center>" + Toolbox.emsgs(orgnum,355)+ ": " + imglet[0] + "</center>");
            attafiles = ("index.html"  + imglet[0].replaceAll("<[^>]+>","")).split("[ ]+");
        }  
        else
        {
            attafiles = new String[1];  
            attafiles[0] = "index.html";
        }
        aWriter.write(des);
    }
    else
    {
        aWriter.write("<br><br><center>");
        aWriter.write("<div class=outset1  style=\"text-align:left;width:606px;padding:4px 4px 4px 4px;margin:4px 4px 4px 4px\" >" + Toolbox.emsgs(orgnum,1465) + "</div>");
        aWriter.write("</center>\n");
        aWriter.write("<form rel=opener name=form1 method=post action=\"https://zhongyanlin.pythonanywhere.com/asubmitsave\"  onsubmit=\"this.sid.value=this.sid.value.trim();if(this.sid.value.length!=9){alert('Enter Did');return false;}return true;\" style=\"margin:0px 0px 0px 0px\"  >\n");
        aWriter.write("<center><textarea name=temptxt rows=3 style=\"align:left;width:600px;\"   onkeypress=\"return false\" class=blanklook></textarea></center>");
        aWriter.write("<center><div style=\"color:red;font-weight:bold;font-size:" + assopt.fs+ "px\" id=error></div>");
        aWriter.write(Toolbox.emsgs(orgnum,163) + " <input name=sid value=D10  >  <input type=submit  class=GreenButton  style=\"width:78px;\" name=submit value=\"" + Toolbox.emsgs(orgnum,51) + "\"> <input class=GreenButton style=width:78px type=button name=restore value=\"" + Toolbox.emsgs(orgnum,1467) + "\" onclick=parsepaste()>");
        aWriter.write("</center>\n"); 
        //aWriter.write("\n"); 

        if (imglet!=null&&!imglet.equals("")) 
        {
           aWriter.write("<center>" + Toolbox.emsgs(orgnum,355)+ ": " + imglet[0] + "</center>");
           attafiles = ("index.html" + imglet[0].replaceAll("<[^>]+>","")).split("[ ]+");
        }  
        else
        {
            attafiles = new String[1];  
            attafiles[0] = "index.html";
        }
        Pattern p = Pattern.compile("<!\\-\\-[0-9]+\\-\\->");
        Matcher m = p.matcher(formattxt);

        int e = 0;
        int maxorder = 0;
        while (m.find(e)) 
        {
            int s = m.start();
            e = m.end();
            int i = Integer.parseInt(formattxt.substring(s+4, e-3));
            if (i > maxorder) maxorder = i;
        }

        aWriter.write(  formattxt  );
        aWriter.write("<div style=\"border-radius:4px;width:18px;height:18px;line-height:18px;text-align:center;vertical-align: middle;font-weight:bold;font-size: 18px;background-color:#909090;color:white\" onclick=\"addone()\"> + </div>");
       // aWriter.write("<input type=hidden name=sid     value=" + user.id+ " >\n"); 
        aWriter.write("<input type=hidden name=testing value=\"1\">\n");
        aWriter.write("<input type=hidden name=leas    value=\"0\">\n");
        aWriter.write("<input type=hidden name=subdb   value=" + user.id+ " >\n");
        aWriter.write("<input type=hidden name=assignname value=\"" + assignname+ "\" >\n");
        aWriter.write("<input type=hidden name=course     value=" + course+ " >\n");
        aWriter.write("<input type=hidden name=sessionname value=" + sessionname+ " >\n");
        aWriter.write("<input type=hidden name=semester   value=\"" + Toolbox.dbadmin[orgnum%65536].currentSemester+ "\">\n");
        aWriter.write("</form>\n");
        aWriter.write("<script type=\"text/javascript\" >\n");
        aWriter.write("var orgnum =  " + orgnum + ";\n"); 
        aWriter.write("var msg1468 = \"" + Toolbox.emsgs(orgnum,1468)   + "\";\n");
        aWriter.write("var msg1469 = \"" + Toolbox.emsgs(orgnum,1469)   + "\";\n");
        aWriter.write("var question = \"" + Toolbox.emsgs(orgnum,50)  + "\";\n");  
        aWriter.write("var maxorder = " + maxorder + ";\n");  
        aWriter.write("var timedue = " + due + ";\n");  
        aWriter.write("var font_size = 20;\n"); 
        aWriter.write("var onlinetoolinitial = ';LaTex;tealeaman;math;LaTex;findrep.js;showlatexpanel(content_a,this)';\n");
        aWriter.write("var larger = function(t){};\n"); 
        String aline = Toolbox1.filebytes( "quizback.js","UTF-8");
        aWriter.write(aline);
        aWriter.write("</script>\n");
        aWriter.write("<script type=text/javascript  src=https://zhongyanlin.github.io/site/js/en.js ></script>\n");
aWriter.write("<script type=text/javascript  src=https://zhongyanlin.github.io/site/js/cookie.js></script>\n");
aWriter.write("<script type=text/javascript  src=https://zhongyanlin.github.io/site/js/checkHTML.js></script>\n");
aWriter.write("<script type=text/javascript   src=https://zhongyanlin.github.io/site/js/installtool.js></script>\n");
aWriter.write("<script type=text/javascript   src=https://zhongyanlin.github.io/site/js/curve.js?sn=30&dn=20></script>\n");
    }
     
    aWriter.write("</body>\n</html>");
    aWriter.close();

    boolean a = zipfiles(attafiles, user.webFileFolder + File.separator + course + File.separator + UploadFile.pfolders[foldernum], zipfname); 
    (new File(user.webFileFolder + File.separator + course + File.separator + UploadFile.pfolders[foldernum],attafiles[0])).delete();
    String y =  "<nobr>" +File.separator + course + File.separator + UploadFile.pfolders[foldernum] + " " + Toolbox.emsgs(orgnum,1531) + "</nobr>";
    if (a)
    {
        y = Toolbox.emsgs(orgnum,545) + "<br><nobr><a href=FileOperation?did=" 
          + (new Encode6b(orgnum)).to6b(user.webFileFolder + File.separator + course + File.separator + UploadFile.pfolders[foldernum] +   File.separator + zipfname)
          +  " >" + "/" + course + "/" + UploadFile.pfolders[foldernum] +  "/" + zipfname + "</a></nobr><br>";
    }
    out.println("<!DOCTYPE html><html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><body><script>parent.savedazip(\"" + y.replace('\\', '/') + "\");</script></body></html>");
    return; 
}
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<%=Toolbox.getMeta(orgnum) + Toolbox.jaxhead%>
<%

User user = null;
if ( (user = User.authorize(orgnum,Systemroles.ASSESSER|Systemroles.SYSTEMADMIN| Systemroles.INSTRUCTOR|Systemroles.STUDENT|Systemroles.TA,application,session,request, response, "assigndoc.jsp", true)) == null|| !Toolbox.verifytoken(request)) 
 return;
  
String assignname,sessionname, option, course, subdb, sid, code, missed, semester,attach=""; 
assignname =  Toolbox.defaultParam(orgnum,request,"assignname",null, "_,-", 60);
if (assignname == null) assignname = Toolbox.defaultParam(orgnum,request, ("Assignname"), null, "_,-", 60);
if (assignname == null) assignname = Toolbox.defaultParam(orgnum,request, ("Assignment"), null, "_,-", 60); 
if (assignname == null) assignname = Toolbox.defaultParam(orgnum,request, ("AssignTest"), null, "_,-", 60);
if (assignname == null) assignname = Toolbox.defaultParam(orgnum,request, ("Name"), null, "_,-", 60);
if (assignname == null) return;
sessionname =  Toolbox.defaultParam(orgnum,request,"sessionname","", ",_-", 60); 
option =  Toolbox.defaultParam(orgnum,request,"option","des", null, 20);
course =  Toolbox.defaultParam(orgnum,request,"course","", null, 30);
subdb =  Toolbox.defaultParam(orgnum,request,"subdb","", null, 30);
sid =  Toolbox.defaultParam(orgnum,request,"sid", user.id, null, 30);
attach = "";
code =  Toolbox.defaultParam(orgnum,request,"code", "","!@#$%^&*+()|\\{}[]:;\"',/",20);
missed =  Toolbox.defaultParam(orgnum,request,"missed", "false", null, 30);
semester =  Toolbox.defaultParam(orgnum,request,"semester", Toolbox.dbadmin[orgnum%65536].currentSemester,null,40).replaceAll("'","''");
 
if ((user.roles & Systemroles.STUDENT)  > 0)
{
    user.iid = subdb;
    session.setAttribute("User", user);
}
user.changedb(subdb);
String imglet[]=null;
String imagelets[] = new String[1];
 
String keystr = (orgnum%65536) + "|" + semester + "|" + course + "|" + assignname + "|" + sessionname;
    
%>

<head>
<title><%=course + " " + assignname%></title>
<script type=text/javascript>
    <%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("assigndoc.jsp","f1")%>";
    var haswebfolder=<%=user.websitename != null && !user.websitename.equals("")||user.webFileFolder != null && !user.webFileFolder.equals("") %>;
    var cwin=null; 
    var needtranslator = true;
    
    function endload(){};
    function findwin(){cwin=window;while (cwin!=cwin.parent) cwin = cwin.parent;}
    <%=Toolbox.someconsts(orgnum)%>
</script>
<script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script>
 
<script type=text/javascript  src=cookie.js></script>
<script type="text/javascript" src="checkHTML.js"> </script> 
<script type="text/javascript" src="timeformat.js"> </script> 
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="stylea.css" />
<link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />

<style> #needf{background-image:none;background-color:#dddd11}</style>
<%
String course1 = course.replaceAll("'","''");
long tstmp = System.currentTimeMillis() % 10000000;
long l = System.currentTimeMillis()/1000;
String proctors = "";
boolean bb;
AssOption assopt = null; 
JDBCAdapter adapter = null; //Toolbox.getUserAdapter(user, orgnum);
AssignCache assigncache = null;
synchronized (this)
{
    assigncache = Toolbox.dbadmin[orgnum%65536].assigncache.get( course + "|" + sessionname); 
    if (assigncache == null || !thesame(assigncache.keystr,keystr))
    {
        assigncache = null;
        adapter =  Toolbox.getUserAdapter(user, orgnum);
        if (!adapter.error().equals(""))
        {
            out.println(adapter.server + Toolbox.emsgs(orgnum,1550) + "\n" + adapter.error());
            adapter.close();
            return;
        }
        String SQLstr = "SELECT name,due,question,format,atype,answer, start,status,Course.title,options,assess,attach,timesplit,latepermit,scale,weight,grader,sessionname  FROM Assignment, Course WHERE Assignment.course=Course.id AND Course.id = '" 
                + course1 + "' AND name='" + assignname.replaceAll("'","''") 
                +"' AND semester='" + semester.replaceAll("'","''")
                +"' AND (sessionname LIKE '%," + sessionname.replaceAll("'","''") 
                + ",%' OR sessionname LIKE '%," + sessionname.replaceAll("'","''") 
                + "' OR sessionname LIKE '" + sessionname.replaceAll("'","''") 
                + ",%' OR sessionname='" + sessionname.replaceAll("'","''") + "')"  ;

        int n = 0;
        bb = adapter.executeQuery2(SQLstr,false);
        if (!bb || adapter.getValueAt(0,0)==null )
        {
         out.println( Toolbox.getMeta(orgnum) + "</head><body>" 
                 + ((user.roles|Systemroles.SYSTEMADMIN|Systemroles.SYSTEMANALYST)>0?SQLstr:"") + "<br>" + course + "  " + assignname + " " + semester + " " + sessionname + " " + Toolbox.emsgs(orgnum,1531) + adapter.error() +"</body></html>");
         adapter.close();
         return;
        }
        assigncache = new AssignCache(adapter);
        assigncache.keystr = (orgnum%65536) + "|" + semester + "|" + course + "|" + assignname + "|" + assigncache.sessions; 
        if (Toolbox.dbadmin[orgnum%65536].cache.get(keystr) != null) 
        {  String info = assigncache.start + "," +  assigncache.due + "," +  assigncache.atype + ",'" +  (new AssOption(assigncache.options,orgnum)).shorter().replace("'","''") + "','" +  assigncache.latepermit + "'";
           synchronized(this){Toolbox.dbadmin[orgnum%65536].cache.put(keystr,info);}
        }

        if (Long.parseLong(assigncache.due)*1000 > System.currentTimeMillis() )
        {
             Toolbox.dbadmin[orgnum%65536].assigncache.put(course + "|" + sessionname, assigncache);
        }
    }
}



long starttime = -1;
long duetime = -1;
try
{
    starttime = Long.parseLong(assigncache.start);
    duetime = Long.parseLong(assigncache.due);
}
catch(Exception e ){} 
if (starttime > 0 && starttime > l)
{
    out.println( Toolbox.getMeta(orgnum) + "</head><body>"  + course + "  " + assignname + " " + semester + " " + sessionname + " "  +   Toolbox.emsgs(orgnum,6) + "  <script>document.write(timestr(" + starttime+",'" + cachedstyle.timeformat + "'));</script> </body></html>");
    if (adapter != null)   adapter.close();
    return;
}

if (!option.equals("des") && (duetime > 0 && duetime < l))
{
    String latepermit = assigncache.latepermit;
    long [] dues = new long[]{duetime};
    Toolbox1.extent(latepermit, sid, dues);
    duetime = dues[0];
    if (duetime > 0 && duetime < l)
    {
        if (adapter != null)   adapter.close();
%>
<jsp:forward  page="DataForm">
<jsp:param name="course"  value="<%=course%>" />
<jsp:param name="semester"  value="<%=semester%>" />
<jsp:param name="sessionname"   value="<%= sessionname%>" />
<jsp:param name="assignname"  value="<%= assignname%>" />
<jsp:param name="sid"  value="<%=sid%>" />
<jsp:param name="subdb"   value="<%=subdb%>" />
<jsp:param name="rdap"  value="studentsubmission" />
<jsp:param name="orgnum"  value="<%=orgnum%>" />
<jsp:param name="makescript"   value="makesubmission" />
</jsp:forward>
    <%
    return;
    }
}
 

String attached = assigncache.attach;
String timesplit = assigncache.timesplit.replaceAll("\n",";"); 
String scale = assigncache.scale;
String weight = assigncache.weight;
proctors =  assigncache.grader; 
String des = assigncache.question; 
 
String answer = "";
String assess = "";
String toolstr = "";
int jscode = 0;
String name = assigncache.name; 
if (name == null) name=""; else name = name.trim();
long due = l+3600*72;

try{ due = Long.parseLong(assigncache.due); } catch(Exception e){}
String latepermit = assigncache.latepermit;
if (latepermit==null) latepermit = "";
long [] dues = new long[]{due};  
Toolbox1.extent(latepermit, sid, dues);
due = dues[0];
long start = 0; 
try{ start = Long.parseLong(assigncache.start);}catch(Exception e){}
String format = assigncache.format;
if (format == null) format = "0";
int type = 0;
try{ type = Integer.parseInt(assigncache.atype);}catch(Exception e){} 
String options = assigncache.options;
 
if (options==null)  options = "";
assopt = new AssOption(options,orgnum); 
int status  = 2;
try{
 status  = Integer.parseInt(assigncache.status);
} catch(Exception e){}
if ( status <=2)  
 status = (l <= due)?1:0;
int statusold = status;
if (status!=0) status = 1;
String statusshow = (status==0)?Toolbox.emsgs(orgnum,299):Toolbox.emsgs(orgnum,218); //statustr[status].substring(2); 
String title = assigncache.courseTitle;
if (title == null)
 title = course;
else 
 title = title.trim(); 
title = Toolbox.validate(title, "@#$:", 200);
 
String saved = "";
String savedattach = "";
boolean doc = true; 
boolean qonly = false;
String txt = "";
String addr;
int nn;
boolean goodtogo = false;
boolean makearea = false;  
boolean failpass = false;
 
String butstyle = "border-radius: 4px;color:white;font-weight:700;width:" + Math.ceil(4.8*cachedstyle.fontsize) + "px;font-size:" + cachedstyle.fontsize+ "px"; 
if (option.equals("answer")) 
{
    imglet = Toolbox1.attach(attached, subdb, course, false, orgnum);
    String y = Toolbox1.addbreak(assigncache.answer, "1", orgnum);
    txt = Toolbox.formatstr(format, y);
    txt = Toolbox1.addbreak1(txt);
    txt = Toolbox1.dothetable(txt);
    String str = "SELECT grade FROM Submission WHERE sid='"
            + user.id + "' AND course='" + course.replaceAll("'", "''") + "' AND assignname='"
            + assignname.replaceAll("'", "''") + "' AND semester='" + semester.replaceAll("'", "''") + "' AND grade >= 0";
    if (adapter == null) adapter =  Toolbox.getUserAdapter(user, orgnum);
    bb = adapter.executeQuery2(str, false);
    if (!bb || adapter.getValueAt(0, 0) == null) {
        txt = Toolbox.emsgs(orgnum, 1532) + Toolbox.emsgs(orgnum, 1098) + ".";
    } else if (due >= l && type > 1) {
        txt = Toolbox.emsgs(orgnum, 283) + Toolbox.emsgs(orgnum, 1532);
    } else if (assopt.reviewable == false && type > 1 && missed.equals("true") )
    {
        txt = Toolbox.emsgs(orgnum, 1533);
    } else if (type < 2) 
    {
        txt = txt.replaceAll("\n([a-i]\\.)", "<br>&nbsp;$1").replaceAll("\n", "<br>"); // Toolbox.emsgs(orgnum,1099);
        if (txt.length() < 20) 
        {
            txt += maybeimg(attached, false, orgnum);
        }
    } 
    else 
    {
        txt = "";
    }
} 
else if (option.indexOf("des") == 0) 
{
   
    imglet = Toolbox1.attach(attached, subdb, course, true, orgnum);
    if (status == 0) 
    {
        if (assopt.reviewable == false && missed.equals("true") ) 
        {
            txt = Toolbox.emsgs(orgnum, 1533);
        } 
        else 
        {
            String y = Toolbox1.addbreak(assigncache.question, "1", orgnum);
            txt = Toolbox.formatstr(format, y);
            txt = Toolbox1.addbreak1(txt);
            out.println("<!--" + txt + "-->");
            txt = Toolbox1.dothetable(txt);
            if (type % 2 == 1) {
                txt = txt.replaceAll("\n([a-i]\\.)", "<br>&nbsp;$1").replaceAll("\n", "<br>");

            } else if (txt.length() < 20) {
                txt += maybeimg(attached, true, orgnum);
            }
        }
    } else if (goodip(request, assopt.ip) == false) {
        txt = Toolbox.emsgs(orgnum, 930);  //String code, AssOption assopt, User user, ServletContext app,  String key, String iid, JDBCAdapter adapter
    } else if (assopt.code.equals("") == false && checkPass(code,assopt,user,application,assigncache.keystr,subdb,adapter) == false) { 
        failpass = true;
        txt = "#";  
    } else {
        String y = Toolbox.removescript(assigncache.question);
        txt = Toolbox.formatstr(format, Toolbox1.addbreak(y, "1", orgnum));
        txt = Toolbox1.addbreak1(txt);
        out.println("<!--" + format + txt + "-->");
        txt = Toolbox1.dothetable(txt);
        if (type % 2 == 1) {
            txt = txt.replaceAll("\n([a-i]\\.)", "<br>&nbsp;$1").replaceAll("\n", "<br>");
        } else if (txt.length() < 20) {
            txt += maybeimg(attached, true, orgnum);
        }
    }
    if (option.indexOf("test") >= 0) {
        if (imglet == null) {
            imglet = Toolbox1.attach(attached, subdb, course, true, orgnum);
        }
        des = Toolbox.removescript(assigncache.question);
        String sqls = "SELECT  content,grade,lastupdate,attach FROM Submission WHERE sid='"
                + user.id + "' AND course='" + course1 + "' AND assignname='"
                + assignname.replaceAll("'", "''") + "'   AND semester='" + semester.replaceAll("'", "''") + "'";
        if (adapter ==null) adapter =  Toolbox.getUserAdapter(user, orgnum);
        if (adapter.executeQuery2(sqls, false) && adapter.getValueAt(0, 0) != null) {
            saved = adapter.getValueAt(0, 0);
            attach = adapter.getValueAt(0, 3);
        }
        if (assopt.code.equals("") == false && checkPass(code,assopt,user,application,assigncache.keystr,subdb, adapter) == false) 
        {
             failpass = true; 
             txt = "#";
        } 
        else  if (type == 2 || type == 3) 
        {
            if (assopt.norepeat) 
           {
                int n = adapter.executeUpdate("INSERT INTO Submission(sid,course,assignname,content,comment,grade,submtime,format,lastupdate,semester,attach,assess) values('"
                        + user.id + "','" + course1 + "','"
                        + assignname.replaceAll("'", "''") + "','','Test Aborted',0," + l + ",'1'," + l + ",'" + semester.replaceAll("'", "''") + "','','')");
                if (n != 1) 
                {
                    txt += "\n<script type=text/javascript >document.write('" + Toolbox.emsgs(orgnum, 7) + " " + assignname + "');</script>";
                }
                else 
                {
                    makearea = true;
                    txt += "\n<script type=text/javascript >var thesid='" + sid + "';{findwin(); /* cwin.opener.openLower(window.name," + due + ");*/ }</script>";
                }

            } else {
                makearea = true;
                txt += "\n<script type=text/javascript >var thesid='" + sid + "';{findwin(); /* cwin.opener.openLower(window.name," + due + "); */}</script>";
            }
        } else {
            makearea = true;
            txt += "\n<script type=text/javascript >var thesid='" + sid + "';{findwin();/*  cwin.opener.openLower(window.name," + due + ");*/ }</script>";
        }
        if (type == 2) {
            if (txt.length() < 20) {
                txt += maybeimg(attached, true, orgnum);
            }
        }
    }
} else if (option.equals("take")) 
{
    // imglet  = Toolbox1.attach(user,attached , user.id , course,true) ;
    //if (type % 2 == 0) {   txt = Toolbox.emsgs(orgnum, 933); } else 
    if (type <= 1) 
    {
        des = Toolbox.removescript(assigncache.question);
        answer = assigncache.answer; 
        String sqls = "SELECT  content,grade,lastupdate,attach FROM Submission WHERE sid='"
                + user.id + "' AND course='" + course1 + "' AND assignname='"
                + assignname.replaceAll("'", "''") + "'   AND semester='" + semester.replaceAll("'", "''") + "'";
        int n = 0;
        if (adapter == null) adapter =  Toolbox.getUserAdapter(user, orgnum);
        bb = adapter.executeQuery2(sqls, false);
        String contentstr = "", gradestr = "";
        attach = "";
        if (bb && adapter.getValueAt(0, 0) != null) {
            n = 1;
            contentstr = adapter.getValueAt(0, 0);
            gradestr = adapter.getValueAt(0, 1);
            attach = adapter.getValueAt(0, 3);
            if (attach == null) {
                attach = "";
            }
        }

        if (n == 1 && gradestr == null) {
            gradestr = "-2";
        }
        goodtogo = true;
        float gradenum = 0.0f;
        try {
            gradenum = Float.parseFloat(gradestr);
        } catch (Exception e) {
        }
        if (n == 1) 
        {
            if (gradenum == -2) 
            {
                if (adapter.cursor != -2 && adapter.getValueAt(0, 0) != null) 
                {
                    answer += "|" + adapter.getValueAt(0, 0);
                    saved = Toolbox.removescript(adapter.getValueAt(0, 2)) + "," + adapter.getValueAt(0, 0);
                    attach = adapter.getValueAt(0, 3);
                }
            } else 
            {
                goodtogo = false;
                txt = Toolbox.emsgs(orgnum, 7) + assignname;
            }
        } 
        else if (assopt.code.equals("") == false && checkPass(code,assopt,user,application,assigncache.keystr, subdb,adapter) == false) 
        {
            failpass = true;
            txt = "#";
        }
    } else //if (type == 3) 
   {
        if (goodip(request, assopt.ip) == false) {
            txt = Toolbox.emsgs(orgnum, 930);
        } else if (status == 0) {
            txt = Toolbox.emsgs(orgnum, 8);
        } else if (assopt.code.equals("") == false && checkPass(code,assopt,user,application,assigncache.keystr, subdb,adapter) == false) {
            failpass = true; 
           txt = "#";
         } else {
            des = Toolbox.removescript(assigncache.question);
            answer = assigncache.answer;
            String sq = "";
            int n;
           
            if (assopt.norepeat) 
            {
                if (adapter == null) adapter =  Toolbox.getUserAdapter(user, orgnum);
                sq = ("INSERT INTO Submission(sid,course,assignname,content,comment,grade,submtime,format,lastupdate,semester,attach,assess) values('"
                        + user.id + "','" + course1 + "','"
                        + assignname.replaceAll("'", "''") + "','','" + Toolbox.emsgs(orgnum, 285) + "',0," + l + ",'1'," + l + ",'" + semester.replaceAll("'", "''") + "','','')");
                n = adapter.executeUpdate(sq);

            } 
            else 
            {
                n = 1;
                if (l - starttime > 400)
                {
                    sq = ("SELECT grade,content,lastupdate,attach FROM Submission WHERE sid='"
                        + user.id + "' AND course='" + course1 + "' AND assignname='"
                        + assignname.replaceAll("'", "''") + "'   AND semester='" + semester.replaceAll("'", "''") + "'");
                    if (adapter == null) adapter =  Toolbox.getUserAdapter(user, orgnum);
                    bb = adapter.executeQuery2(sq, false);
                    if (bb && adapter.getValueAt(0, 0) != null) 
                    {
                        float ff = 0;
                        try
                        {
                            ff = Float.parseFloat(adapter.getValueAt(0, 0));
                        } catch (Exception e) {
                        }
                        if (ff >= -1) {
                            n = 0;
                        }
                        saved = adapter.getValueAt(0, 1);
                        attach = adapter.getValueAt(0, 3);
                    }
                }
            }

            if (n == 0) {
                txt = Toolbox.emsgs(orgnum, 7) + assignname + "<script type=text/javascript > findwin();cwin.opener.closeprompt();</script>";
            } else {
               goodtogo = true;
            }
        }
    }
}
boolean quiz = false;
String toolsql = "";
if (goodtogo && type % 2 == 1 || makearea) {
    doc = false;
    if (assigncache.toolstr.equals(""))
    {
      
        toolsql = "SELECT  DomainValue.domainvalue,category,DomainValue.description,name,cgi,opt,OperationCourse.forstudent from DomainValue,Operation, OperationCourse where  caption=CONCAT('',DomainValue.code) AND DomainValue.domain='Tool Caption' AND  DomainValue.language='" + Toolbox.langs[orgnum >> 16] + "' AND Operation.name=OperationCourse.operation and OperationCourse.course ='" + course + "' AND  OperationCourse.forstudent > 0 order by OperationCourse.forstudent";
        int n = 0;
        if (adapter == null) adapter =  Toolbox.getUserAdapter(user, orgnum);
        bb = adapter.executeQuery2(toolsql, false);
        for (int i = 0; bb && adapter.getValueAt(i, 0) != null; i++) {
            n++;
            for (int j = 0; j < 6; j++) {
                String x1 = adapter.getValueAt(i, j).replaceAll(";", ",");
                if (j == 5 && adapter.getValueAt(i, 4).equals("UploadTeaching")) {
                    x1 = x1 + "&course=" + course + "&subdb=" + subdb + "&sid=" + sid;
                }
                toolstr += ";" + x1;
            }
        }
        assigncache.toolstr = toolstr;
        toolstr += ";Rebuild;tealeaman;Tool Caption;Rebuild;installtool.js;rebuild('" + course + "','" + sessionname + "','" +  user.subdb + "')"; 
         
        synchronized (this){Toolbox.dbadmin[orgnum%65536].assigncache.put( course + "|" + sessionname, assigncache);}
    }
    else
       toolstr = assigncache.toolstr + ";Rebuild;tealeaman;Tool Caption;Rebuild;installtool.js;rebuild('" + course + "','" + sessionname + "','" +user.subdb + "')";
    quiz = true;
}
if (adapter != null)
{   
adapter.close(); 
adapter = null;
}
String pts = Toolbox.defaultParam(orgnum, request, "Assessment", "", "|,;", 400);
response.setHeader("X-XSS-protection", "0");
String forme = Toolbox.msgqueueget((orgnum%65536)+ user.id,course + ":" + assignname);
//synchronized (this){Toolbox.dbadmin[orgnum%65536].assigncache.put(course + "|" + sessionname, assigncache);}
%>


<% if (goodtogo && type%2==1 || makearea){
butstyle = "border-radius: 4px;color:white;font-weight:700;width:" + Math.ceil(4.8*Integer.parseInt(assopt.fs)) + "px;font-size:" + Integer.parseInt(assopt.fs)+ "px;font-family:var(--fontname)"; 
%>
<style type=text/css>
.rado{background-color:<%=cachedstyle.DBGCOLOR%>}
td,body  {font-size:<%=assopt.fs%>px;font-family:<%=assopt.ff%> !important;font-weight:<%=assopt.fw%>}
textarea {font-size:<%=assopt.fs%>px;font-family:courier;font-weight:700}
.quesans{border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;background-color:<%=cachedstyle.TBGCOLOR%>;font-size:<%=assopt.fs%>px;font-family:<%=assopt.ff%> !important;font-weight:<%=assopt.fw%>}
.blanklook{background-color:<%=cachedstyle.TBGCOLOR%>;border:1px #b0b0b0 solid; white-space: pre; word-wrap: normal;font-size:<%=assopt.fs%>px;font-family:<%=assopt.ff%> !important; }
.noborder{border:0px}
.outstand{border:2px inset;font-weight:800;text-align:left;font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%> !important;font-size:20px;}
#floater1Div {position:absolute;visibility:visible;width:100px}
<%=((imglet!=null && imglet[1]!=null)?imglet[1]:"")%>
</style>

<script type=text/javascript  src="checkHTML.js"></script> 
<script type=text/javascript  src="assessform.js"></script>
<%}%>
<script type=text/javascript >
<% if(!forme.equals("")) 
    out.println("var ugentmsg = \"" + Generic.handle(forme) + "\";");
%>
 
function nullme0()
{
   var i =  window.name.replace(/[a-z]/g,'');
   if(cwin==null)findwin(); 
   if(typeof(cwin.opener.nullme)!='undefined') 
   {
       cwin.opener.nullme(i);
   }
   if (proctored)
   {
      parent.opener.Msg.sendact("Msgretrive","leave",Msg.key,Msg.sek,Msg.sid); 
   }
}

</script>
<%
boolean proctored = false;
 
if (quiz || makearea)
{
    if (attached == null) attached = "";
    proctored = (type==3 ||type==1 && Msgboxrun.mbox.get(keystr)!=null);
  
%>
<script type=text/javascript >
 var theurl = "<%=Toolbox1.geturl(request).replace("/assigndoc.jsp?","/assigntest.jsp?")%>";
 var onlinetoolinitial = "<%=Generic.handle(toolstr)%>".replace(/File_f/g,'File_f&subfolder=submission').replace(/;;/g,'; ;');
 var timelastsec = <%= (assopt.maxtime==null || assopt.maxtime.equals(""))? "-1":assopt.maxtime %>*60;
 var timedif=<%=l%> - (new Date()).getTime()/1000;
 var upperrightwin = parent.frames[1];
 var keystr = "<%=keystr%>";
 var proctored = <%= proctored %>;
 var detailass = new Hwtake('take',
 "<%= Generic.handle(des)%>",
 null,
 '<%=delanspart(attached)%>',
 "<%= pts %>",
 '<%=format%>',-1,true,<%=makearea?"1":"null"%>,"<%=assopt.forceorder%>",<%=assopt.mbs%>
 );
 
</script>
<%}%>

</head>
<body  <%= (failpass?"":"onunload=\"nullme0()\"") %> >
  
<%=Toolbox.title(title + ": " + name)%> 
<% if (options.indexOf("sd:" + user.id)>=0){%>
<center><input type="button" onclick="deleteass('<%=course%>','<%=assignname%>')" class="RedButton" style=width:78px value="<%=Toolbox.emsgs(orgnum,30) %>"  ></center>
<%}
%>
<% if (true){%>
<center><span style="font-size:9px"><%=   Toolbox.emsgs(orgnum,1145)  %>:<%=scale%> &nbsp;&nbsp;&nbsp; <%=   Toolbox.emsgs(orgnum,254)  %>: <%=weight%>% </span></center>
<% 
}
if (quiz || makearea)
{  
%>
<script>
     var dv = document.createElement('style');
     dv.innerHTML = detailass.divs;
     document.getElementsByTagName('head')[0].appendChild(dv);
     document.write("<center>" + detailass.header + detailass.attachheader +"</center>");
    
</script>
<% 

String cidtitle =  course + "-" + sessionname + " " + title; 
if (quiz)
{
int sek = SessionCount.enq(session.getId());
//MsgTopic.unsubscribe(orgnum,"exam", ""+ sek); 
}
%>
 
<form rel=opener name=form1 method=post  style="margin:0px 0px 0px 0px"  >
<script type=text/javascript > 
var hasactivities = <%=assopt.recordactivity%>; 
var cidtitle = "<%=cidtitle%>";
var timesplitmode = <%=assopt.usetimequota%>;
detailass.assemble(<%= (type==3) %>); 
document.write(detailass.str );
needtranslator = true;// (<%=format%>==2);
var msg1468 = "<%=Toolbox.emsgs(orgnum,1468)%>";
var needregister=<%= type!=4 &&  user.id.matches("[0-9]+") && (user.lastname == null || user.lastname.equals("")) && (user.firstname== null || user.firstname.equals("")) %>;
</script>
<input type=hidden name=activities>  
<input type=hidden name=format  value="<%= format %>" >
<input type=hidden name=sid   value="<%=  sid %>" >
<input type=hidden name=subdb value="<%= subdb %>">
<input type=hidden name=assignname value="<%= assignname %>">
<input type=hidden name=course     value="<%= course %>">
<input type=hidden name=sessionname value="<%= sessionname %>">
<input type=hidden name=semester value="<%= semester %>">
<input type=hidden name=showimm  value=false >
<input type=hidden name=orders>
<input type=hidden name=leas>
<input type=hidden name=code value="<%=code%>" >
<input type=hidden name=attach value="<%=attach%>">
<input type=hidden name=Content>
<input type=hidden name=noanswer>
<input type=hidden name=rdap value=submissionsave>
<center><br>
<input class="GreenButton"  style="<%=butstyle%>;margin-top:5px" type=button name=submit0 value="<%=   Toolbox.emsgs(orgnum,813)  %>" onclick="previewass()">
<% if(type==0 || type==1) {%>
<input class="GreenButton" style="<%=butstyle%>;margin-top:5px" type=button name=submit2 value="<%=   Toolbox.emsgs(orgnum,36)  %>" onclick="tempsave()">
<%}%>
<input class="OrangeButton" style="<%=butstyle%>;margin-top:5px" type=button name=submit1 value="<%=   Toolbox.emsgs(orgnum,51)  %>" onclick="submitass()">
</center> 
</form>
 
<script type=text/javascript >
var tstmp=<%= tstmp %>;
 
var proctors = "<%=proctors%>";
var onloadbeforeassdoc = null;
if (typeof window.onload == 'function')
   onloadbeforeassdoc = window.onload;

window.onload = function()
{
<% if (proctored)
{
%>
    Msg.init({stoken:securitytoken,
    app:"exam",
    tid:'',
    sid:'<%= user.id%>',
    sname:'<%= user.id%>',
    rid:'',
    code:'',
    msg:'',
    key:keystr,
    sendhandle:"Msgretrive",
    sek:'<%= SessionCount.enq(session.getId())%>'});
    Msg.recevhandle = "Msgretrive";
<%}
%>     
    if (onloadbeforeassdoc != null) 
    {
       onloadbeforeassdoc();
    }
     
    if (timesplitmode == true)
    {
        detailass.parseTimequota("<%=timesplit.replaceAll("\n",";").replaceAll("([0-9]+,[0-9]+)[^;]+","$1,x") %>");
        runtimequota();
    }  
}
 
var sofar="<%=  Generic.handle(saved==null?"":saved) %>".replace(new RegExp("\\[Imagelet([0-9]+)","ig"),"[" +  textmsg[1303] + "$1");
document.form1.noanswer.value=detailass.orders;
var serial='<%= (assopt.norepeat?1:0)%>,<%=(assopt.openbook?1:0)%>,' + detailass.quesnums.length + ',<%=(System.currentTimeMillis()/1000)%>,<%=due %>';
var subdb='<%= subdb %>';
var thesid='<%=sid%>';
 
var qFontSize = <%=assopt.fs%>;
function showattachment(t)
{
    var allAttachTodel = ResizeUploaded.unzip(t);
    
    var xx = document.getElementById("theattach"  );
    if (xx!=null  )
    {
        xx.innerHTML = allAttachTodel.replace(/@[^,]+/g,'').replace(/,$/,'').replace(/,/g,', ');
    }
     
    if (typeof(savedQuizName) != 'undefined'  )
    {
        localStorage[savedQuizName+'a'] =  t;
    }
}

function deleteass(cid, ass)
{
    postopen('studentassign.jsp',['ff','course','assignname','subdb'],['deleteass',cid, ass.replace(/<%=Toolbox.emsgs(orgnum,1574)%>/,""),'<%=subdb%>'],'w' + tstmp);
}
</script>
<script type=text/javascript   src="attachment.js" ></script> 
<script type=text/javascript   src="quizmaker.js" ></script>
<script type=text/javascript   src="quizclock.js" ></script>
<script type=text/javascript   src="sha1.js" ></script>
<script type=text/javascript > 
 
ResizeUploaded.attachref = document.form1.attach;
//findwin();cwin.opener.openLower(window.name,<%=due%>);
</script>
 <%
 }
 else
 {
 if (imglet!=null) 
 {
 out.print("<center>" + imglet[0] + "</center>");
 out.print("<style>" + imglet[1] + "</style>");
 }
 if (txt.equals("#"))  // failed pass
{ 
    String fromstr = Toolbox.defaultParam(orgnum, request, "from", "-1", null,1);
 
    int fromnum = -1; try{fromnum = Integer.parseInt(fromstr);}catch(Exception e){}
    if (fromnum == -1)
    {
%>
 <script type=text/javascript > 
 findwin();
 if (cwin!=null && typeof(cwin.opener)!='undefined' && cwin.opener!=null && typeof(cwin.opener.wrongcode)!='undefined') 
 {
     cwin.opener.wrongcode(<%=assopt.code.contains("attendance")%>); 
     cwin.opener.focus();
     cwin.close(); 
 }
 else 
 {
     
     delCookie(orgnum%65536 + 'user');
     parent.frames[1].open('login.jsp?follow=logout')
     parennt.parent.close();
 }
</script>
 <%
    }
    else if (fromnum == 3)
    { 
%>
<script>alert('Too man tries');window.parent.parent.close();</script>  
<%
    } 
    else if (assopt.code.contains("attendance") == false)
    {
%>
 <center><table class="outset1"  style="margin:20px 0px 0px 0px;width:300px">
  <tr><td colspan="3" align="center" style="color:red"><nobr><%=Toolbox.emsgs(orgnum,116)%>&nbsp;&nbsp; (<%= 1+fromnum%> &#8804; 3)</nobr></td></tr>
  <tr><td><nobr> <script>document.write(textmsg[1929].split(/@/)[4])</script></nobr></td>
<td><input id="code" style="padding:3px 3px 3px 3px;border:1px #b0b0b0 solid;border-radius:3px"></td>
<td><input id="but" 
           type="button" 
           value="<%=Toolbox.emsgs(orgnum,6)%>" 
           class=OrangeButton 
           style="width:80px;border-radius:4px;padding-top:3px;padding-bottom:3px"
           onclick="javascript:go()" >
</td>
</tr>
</table>
</center>
 <script>
function go()
{
    document.location.href =document.location.toString().replace(/&code=.*$/,"").replace(/&from=[0-9]/,'&from=<%= fromnum+1%>')   + '&code=' + encodeURIComponent(document.getElementById('code').value);
}
</script>          
 <%  }
     else
    {
%>
 <script> document.write(textmsg[1929].split(/@/)[2]);
 window.onload = function(){document.getElementById('but').value = textmsg[1918].replace(/@.*$/,'');}
 function go(){document.location.href= document.location.toString().replace(/&code=.*$/,"").replace(/&from=[0-9]/,'&from=<%= fromnum+1%>');}
 </script>  
 <center><input id="but" 
           type="button" 
           value="<%=Toolbox.emsgs(orgnum,6)%>" 
           class=OrangeButton 
           style="width:80px;border-radius:4px;padding-top:3px;padding-bottom:3px"
           onclick="javascript:go()" ></center>
<%
    }
}
else 
{
  out.print(  "<div width=100% class=outset1  style=\"border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;;border:1px #b0b0b0 outset;margin:5px 2px 0px 2px;padding:3px 3px 3px 3px;\">" 
         + Toolbox1.todiv(orgnum,txt,-1) + "</div>");
 if (txt.indexOf("thesid")>0  )
 { %>
<script type=text/javascript > 
var timedue = <%=due %>;
</script>
<style type="text/css">
 .outstand{border:2px inset;font-weight:800;text-align:left;font-family:<%=Toolbox.fontsnamestr(orgnum>>16)%> !important;font-size:20px;}
  #floater1Div{position:absolute;visibility:visible;width:100px}
</style>
 <%}
 }
}
%>

<%if (quiz || makearea){%>
<script type=text/javascript  src=installtool.js></script>
 <%}%>
<script type=text/javascript  src=curve.js?sn=40&dn=30></script>
<%
if (quiz || makearea){%>
<iframe name="w<%=tstmp%>" width="1" height="1" style="visibility:hidden" />
<%}%>
</body>
</html>
 
 