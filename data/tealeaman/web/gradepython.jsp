
<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.math.*,java.util.regex.*,java.io.*"%>
<%!
     protected String read(String path) {
        try {
            FileInputStream fin = new FileInputStream(path);
            InputStreamReader esr = new InputStreamReader(fin, "utf-8");
            BufferedReader ebr = new BufferedReader(esr);
            StringBuffer contents = new StringBuffer();
            String aline;
            while ((aline = ebr.readLine()) != null) {
                contents.append(aline + "\n");
            }
            ebr.close();
            esr.close();
            fin.close();
            return contents.toString();
        } catch (Exception e) {
            return "";
        }
    }

    String removecomments(String codes)
    {
        int i, k,j = 0,p,q, r,N = codes.length();
        StringBuffer s = new StringBuffer();
        String [] pq = new String[]{"#","\n","'''","'''","\"\"\"","\"\"\""};
         
        while (j < N)
        {
            q = -1; r = 0;
            for ( i = 0; i < 3; i++)
            {   
                k = codes.indexOf(pq[i*2], j); 
                if (k >=0 && (k < q || q < 0))
                {q = k; r = i;}
            }
            if (q < 0) break;
            p = codes.indexOf(pq[2*r+1],q); 
            s.append(codes.substring(j, q));
            int L = p==-1?N:(r==0?(p+1):(p+3));
            for (k=q; k < L; k++)
                if (codes.charAt(k) == '\t' || codes.charAt(k)=='\n') 
                          s.append(codes.charAt(k));
                else 
                          s.append(" ");
            if (p==-1) 
                    return s.toString();
            j = L;
        }
        s.append(codes.substring(j));        
        return s.toString();
    }
    String antiinfinite(String s)
    {
        if (s.contains("open(" ) && s.contains("'w'") ) return "!";
        s = removecomments(s);
       return s.replaceAll("\n([\t]+)while([^:]+):\n", "\n$1ert332fs=0;\n$1while ert332fs < 100000 and ($2):\n$1\tert332fs = ert332fs + 1\n");
    }
 void clearfiles(ArrayList<String> classnames, String dir)
    {
        long ll = System.currentTimeMillis();
         File fd = new File(dir);
         File[] fs = fd.listFiles();
        for (String classname:classnames)
        {
        
            for (File ff : fs) {
                if (ff.getName().endsWith(".class") ){ ff.delete(); continue;}
                if ( ll - ff.lastModified() < 10000 &&  (ff.getName().startsWith(classname) || ff.getName().endsWith(".java"))) {
                    ff.delete();
                }
            }
        }
    }
%>

<%
int orgnum = Toolbox.setcharset(request, response);
if (orgnum == -1){
 out.println("orgnum=-1");
 return;
 }    
String dir, javacpath, javaBin;  
User user = null;
if ((user = User.authorize(orgnum, Systemroles.TOTAL, application, session, request, response, "gradeProgram.jsp", true)) == null) 
{
     out.println("Error: No active login");
     out.close();
     return;
}
orgnum = user.orgnum; 
String course = request.getParameter("course");
String sid = request.getParameter("sid");
String subdb = request.getParameter("subdb");
user.subdb = subdb;
String assignname = request.getParameter("assignname");
String content = request.getParameter("content");
 
String questionnum =  request.getParameter("questionnum");    
 
String  pythonBin;
        if (File.separator.equals("/")) {
            pythonBin = "/usr/bin/python";
           
        } else {
            pythonBin = "python";
        }
        user.subdb = subdb;
String javahome, aline;
response.setContentType("text/plain");  // Set content type of the response so that jQuery knows what it can expect.
response.setCharacterEncoding("UTF-8");

try {
    if (course!=null && user.subdb!=null && user.subdb.equals("") == false && assignname!= null  && !user.subdb.equals(user.id))
        dir =   Toolbox.dbadmin[user.orgnum%65536].webFileFolder + File.separator + user.subdb + File.separator + course.replaceAll(" ", "") + File.separator + "submission"+ File.separator + user.id;
    else if (course!=null && user.subdb!=null && user.subdb.equals("") == false && user.subdb.equals(user.id))
    {
        if (sid!=null)
        dir =   Toolbox.dbadmin[user.orgnum%65536].webFileFolder + File.separator + user.subdb + File.separator + course.replaceAll(" ", "") + File.separator + "submission"+ File.separator + sid;
        else  
        dir =   Toolbox.dbadmin[user.orgnum%65536].webFileFolder + File.separator + user.subdb + File.separator + course.replaceAll(" ", "") + File.separator + "assignment";
    
    }
    else if (user.subdb!=null && user.subdb.equals("") == false && user.subdb.equals(user.id))
        dir =   Toolbox.dbadmin[user.orgnum%65536].webFileFolder + File.separator + user.subdb + File.separator + "working";
     else  
        dir =   ServerAgent.workingFolder; 
    String inputmsg = "\ncourse=" + course + "\nassignname=" + assignname + "\nsubdb=" + user.subdb + "\nquestionnum=" + questionnum + "\nlength=" + content.length();
    
    if ((new File(dir)).exists()==false) UploadTeaching.makedir( dir);
    String datapath = null;
    if (course!=null && user.subdb!=null && user.subdb.equals("") == false && assignname!= null && !assignname.equals(""))
        datapath = Toolbox.dbadmin[user.orgnum%65536].webFileFolder + File.separator + user.subdb + File.separator +  course + File.separator + "assignment" + File.separator + assignname;
    inputmsg += ("\ndatapath =" + datapath);
    if (datapath!=null && questionnum!=null) 
        datapath += questionnum;
    if (datapath!=null) datapath += "data.txt";
   
    if (datapath!=null && new File(datapath).exists() == false) {
        datapath = null;
    }

    String codes = antiinfinite(content);
    if (codes.equals("!")) 
     {
                    try {
                        out.println("Error: No file write is allowed. Need to Output using System.out.print. Failed  requirements. Not read project specification");
                    } catch (Exception e) {
                    }
                    out.close();
                    return;
                }
    
    if (codes.equals("!")) 
    {
        try {
            out.println("Error: Can only read file using new File(args[0]).<br> No file write is allowed"+inputmsg);
        } catch (Exception e) {
        }
        out.close();
        return;
    }
    if (datapath == null && codes.contains("sys.argv")) 
    {
        try {
            out.println("Error: Your program contains args[0] but <br>" + assignname + questionnum + "data.txt has not been prepared.<br>Report this error message  to your instructor");
        } catch (Exception e) {
        }
        out.close();
        return;
    }
    String programname = "D" + sid + ".py";
    FileWriter aWriter = new FileWriter(dir + File.separator + programname  , false);
    aWriter.write(codes);
    aWriter.close();
    

    int exitVal = -1;
    StringBuffer sb = new StringBuffer();;
    ProcessBuilder probuilder;
    Process proc;
    InputStreamReader isr;
    BufferedReader br;

    if (datapath == null) {
        probuilder = new ProcessBuilder(pythonBin, programname);
    } else {
        probuilder = new ProcessBuilder(pythonBin, programname, datapath);
    }
    probuilder.directory(new File(dir));
    probuilder.redirectErrorStream(true);
    proc = probuilder.start();
    InputStream is = proc.getInputStream();
    isr = new InputStreamReader(is);
    br = new BufferedReader(isr);
    String line;
    int cc = 0;

    while ((line = br.readLine()) != null) {
        line = line.trim();
        if (!line.equals("")  ) {
            out.println(line);
            cc++;
        }
    }
    if (cc == 0) {
        out.println("no output");
    }

    exitVal = proc.exitValue();
    proc.destroy();
    File f = new File(dir,programname);
    f.delete();
    
} catch (Exception e) {
           
    out.println(e.toString());
}
       
%>

