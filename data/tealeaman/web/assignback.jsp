<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*, java.io.*, java.util.zip.*;" %>
 
<%!
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
User user = null;
if (!Toolbox.verifytoken(request) ||  (user = User.authorize(orgnum, Systemroles.INSTRUCTOR | Systemroles.TEACHINGADMIN |Systemroles.ASSESSER|Systemroles.STUDENT,application,session,request, response, "assignback.jsp", true)) == null)
 return; 
orgnum = user.orgnum; 
CachedStyle cachedstyle = new CachedStyle(request, orgnum); 
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

//des = Toolbox.validate( des, null, 20000);
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
sessionname = Toolbox.validate( sessionname, null, 30);

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

String formattxt = Toolbox.defaultParam(orgnum,request, ("formattxt"), null);
 
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
 
File f3 = new File(path);
if (f3.exists()) f3.delete(); 
 
FileWriter aWriter = new FileWriter(new File(path), false);
aWriter.write("<!DOCTYPE html>\n");
aWriter.write("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" >\n");
aWriter.write("<head>\n<meta http-equiv=\"content-type\" content=\"text/html;charset=" + Toolbox.encodings[orgnum>>16] + "\">\n");
aWriter.write(Toolbox.jaxhead );
aWriter.write("<title>" + course + " " + assignname + "</title>\n");
String options =    Toolbox.defaultParam(orgnum,request, ("Options"), null) ;
AssOption assopt = new AssOption(options,orgnum);
//des = Toolbox.defaultParam(orgnum,request, ("Question"), null);
des = Toolbox.removescript(formattxt);
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
aWriter.write(".GreenButton{background-color:#00BBBB;color:white;width:70px;font-weight:bold;font-size:18px}\n");
aWriter.write(".warncell{background-color:white;color:purple}\n");
aWriter.write(".title{font-size:34px;font-weight:bold;color:#dd1111;font-family:Times}\n");
aWriter.write(".outset1{border-radius:4px;font-size:" + assopt.fs+ "px;-webkit-border-radius:4px;-moz-border-radius:4px;background-color:#ABE1D3;border:1px #ABE1D3 outset;font-family:Times;padding:3px 3x 3px 3px}\n");
aWriter.write(imglet[1]);
aWriter.write("</style>\n");
aWriter.write("<script type=\"text/javascript\"  async src=\"https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/latest.js?config=TeX-MML-AM_CHTML\"></script>");
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
    aWriter.write("<form rel=opener name=form1 method=post    style=\"margin:0px 0px 0px 0px\"  >\n");
    aWriter.write("<center><textarea name=temptxt rows=3 style=\"align:left;width:600px;\"   onkeypress=\"return false\" class=blanklook></textarea></center>");
    aWriter.write("<center><div style=\"color:red;font-weight:bold;font-size:" + assopt.fs+ "px\" id=error></div>");
    aWriter.write("<input class=GreenButton  type=button name=restore value=\"" + Toolbox.emsgs(orgnum,1467) + "\" onclick=parsepaste()>");
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
    aWriter.write("<input type=hidden name=sid     value=" + user.id+ " >\n"); 
    aWriter.write("<input type=hidden name=testing value=\"1\">\n");
    aWriter.write("<input type=hidden name=leas    value=\"\">\n");
    aWriter.write("<input type=hidden name=subdb   value=" + user.id+ " >\n");
    aWriter.write("<input type=hidden name=assignname value=\"" + assignname+ "\" >\n");
    aWriter.write("<input type=hidden name=course     value=" + course+ " >\n");
    aWriter.write("<input type=hidden name=sessionname value=" + sessionname+ " >\n");
    aWriter.write("<input type=hidden name=semester   value=\"" + Toolbox.dbadmin[orgnum%65536].currentSemester+ "\">\n");

    aWriter.write("</form>\n");
    aWriter.write("<script type=\"text/javascript\" >\n");
    aWriter.write("var msg1468 = \"" + Toolbox.emsgs(orgnum,1468)   + "\";\n");
    aWriter.write("var msg1469 = \"" + Toolbox.emsgs(orgnum,1469)   + "\";\n");
    aWriter.write("var question = \"" + Toolbox.emsgs(orgnum,50)  + "\";\n");  
    aWriter.write("var maxorder = " + maxorder + ";\n");  
    aWriter.write("var timedue = " + due + ";\n");  
    String aline = Toolbox1.filebytes( "quizback.js",Toolbox.encodings[orgnum >> 16]);
    aWriter.write(aline);
    aWriter.write("</script>\n");
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
%>