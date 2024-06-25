package telaman;
import java.util.*;
import java.util.zip.*;
import java.io.*;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import static telaman.UploadFile.pfolders;

public class LongTestPro implements Runnable {

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

    protected ArrayList<String> findClassName(String cont) {
        if (cont == null) return null;
        ArrayList<String> z = new ArrayList<>();
        Pattern p = Pattern.compile("class[ |\r|\n]+[_|A-Z|a-z|0-9]+");
        Matcher m = p.matcher((CharSequence) cont);
        String main = null;
        int k = 0;
        int a[] = new int[100]; 
        int n = 0; 
        while (m.find(k)) 
        {
            int s = m.start();
            a[n] = s;
            int e = m.end();
            String cl = cont.substring(s+6,e).trim();
            z.add(cl);
            if (s > 0)
            {
                String q = cont.substring(0,s).trim();
                if (main == null && q.endsWith("public")) main = cl;
            }
            k = e;
        }
        if (main!=null) z.add(main);
        if (main == null && z.size() > 1) 
        {
            int j = cont.indexOf("void main");
            if (j > 0)
            {
                n=0; for (; n < a.length; n++)
                    if (j < a[n]) {z.add(z.get(n-1)); break;}
            }
            else  return null;
        }
        return z;
    }

    public String replace(String original, String newp) {
        int i = newp.indexOf("void main");
        int j = original.indexOf("void main");
        if (j == -1) {
            j = original.indexOf("void  main");
        }
        if (j == -1) {
            j = original.indexOf("void   main");
        }
        return original.substring(0, j) + newp.substring(i);

    }

    private AsyncContext acontext;
    private String content,assignname,questionnum,course;
    private User user;
    String dir, javacpath, javaBin;
   Pattern pw = Pattern.compile("[ |\r|\n|;|\\{]while[ |\r|\t|\n]*\\(");
    Pattern pf = Pattern.compile("[ |\r|\n|;|\\{]for[ |\r|\t|\n]*\\(");
    Pattern pd = Pattern.compile("[ |\r|\n|;|\\{]do[ |\r|\t|\n|{]");
    int qq=0;
    static int closing(String s, boolean inconst[], char open, char close, int start)
    {
        int count = 1;
        for(start++; start < s.length(); start++)
        {
            if (!inconst[start])
            {
                if (s.charAt(start) == close){ count--; if (count == 0) return start;}
                else if (s.charAt(start) == open) count++;
            }
        }
        return start;
    }
int [][] jtrans = {{1,2,0,0,0,6,8,0},{1,2,0,0,0,8,8,0},{1,5,0,3,0,8,8,0},{3,3,3,4,3,3,3,3},{3,0,3,4,3,3,3,3},{5,5,5,5,0,5,5,5},{6,6,6,6,6,0,7,6},{6,6,6,6,8,6,6,6},{8,8,8,8,8,8,8,8}};
 
boolean [] mark(String  v)
{
    boolean b[] = new boolean[v.length()];
    int state = 0;
    for (int i=0; i < v.length(); i++)
    {
        int t = 0;
        char c = v.charAt(i); 
             
        if (!('z'>=c && 'a'<=c || 'A'<=c &&c <='Z' || '0'<=c && c <='9'))
        {
            switch(c)
            {
                case  '/': t = 1;break;
                case ' ': t = 2;break;
                case '*': t = 3; break;
                case  '\r': 
                case '\n': t = 4;break;
                case '"':  t = 5;break;
                case '\\': t = 6;break;
                default: t = 7;break;
             }
        }
        state = jtrans[state][t];
        b[i] = (state >= 3);
    }
    return b;
}
/*
                     a-z     /    space      *     \n\r    "      \  other
0: code              b1    o2     o0         o0     o0    o6      o8    o0
1: alphabet          b1   co2     co0       co0    co0   o8     o8   co0
2: /                 b1   o5      o0         o3     o0  o8      o8   o0
3:/ *                o3   o3    o3         o4      o3  o3        o3   o3
4:/ * *              o3    o0   o3         o4     o3  o3        o3  o3
5:/ /                o5    o5   o5         o5    o0  o5       o5  o5
6:"                 o6    o6    o6         o6     o6  o0    o7      o6
7:\                 o6    o6    o6        o6   o8   o6     o6     o6     
8:error            o6   o6     o6         o6   **/
    String antiinfinite(String s)
    {
        if (s.contains("new FileWriter")|| s.contains("new FileOutput")  || s.contains(".delete()" ) ) return "!";
        int i = s.indexOf("new File(");
        if (i > 0)
        {
            String a = s.substring(i+9,i+14);
 
            if (!a.equals("args[")) return "!";
        }
        else if ( (i = s.indexOf("new  File(")) > 0)
        {
            String a = s.substring(i+10,i+15); 
            if (!a.equals("args[")) return "!";
        }
        boolean inconst[] = mark(s);
        i = 0;
        while (true)
        {
            i = s.indexOf("'", i);
            if (i == -1) break;
            if (s.charAt(i+1) == '\\') 
            {
                inconst[i] = inconst[i+2] =inconst[i+1] =inconst[i+3] = true;
                i += 4;
            }
            else
            {
                inconst[i] = inconst[i+2] =inconst[i+1] = true;
                i += 3;
            }
        }
        Matcher mat = pw.matcher(s);int k =0;
        Matcher mat2 = pf.matcher(s);
        Matcher mat3 = pd.matcher(s);
        int s1=0,s2=0,s3=0, e1 = -1,e2=-1,e3=-1;
        StringBuilder sb = new StringBuilder();
        while(s1 < s.length() && mat.find(s1))
        {
            s1 = mat.start();
            if (!inconst[s1]){e1 = mat.end(); break;}
            s1 += 6;
        }
        if (e1 == -1) s1 = s.length();
        while(s2 < s.length() && mat2.find(s2))
        {
            s2 = mat2.start();
            if (!inconst[s2]){e2 = mat2.end(); break;}
            s2 += 4;
        }
        if (e2 == -1) s2 = s.length();
        while(s3 < s.length() && mat3.find(s3))
        {
            s3 = mat3.start();
            if (!inconst[s3]){e3 = mat3.end(); break;}
            s3 += 3;
        }
        if (e3 == -1) s3 = s.length();
       
        if (e1 == -1 && e2 == -1 && e3 == -1) 
        {
            return s;
        }
        else
        {
            s1++;s2++;s3++;
        }
    
        if (s1 < s2 && s1 <s3)
        {
            int endp = closing(s, inconst, '(', ')', e1-1);
            int k1 = endp+1;
            while(true)
            {
                k1 =s.indexOf(";",k1);
                if (k1>=0 && inconst[k1])k1+=2;
                else break;
            }
            sb.append(s.substring(0,s1));
            sb.append("{int asrt783df" + qq +"=0;while (asrt783df" + (qq++) +"++<10000 && " + s.substring(e1-1,endp+1) + ")");
            int k2;
            if (k1>=0 && !s.substring(endp,k1).contains("{"))
            {
                k2 = k1;
                k1 = endp+1;
            }
            else
            {
                k1 = endp+1;
                while(true)
                {
                    k1 =s.indexOf("{",k1);
                    if (k1>=0 && inconst[k1])k1+=2;
                    else break;
                }
                k2= closing(s, inconst,'{', '}', k1); 
            }
            return sb.toString() +  antiinfinite(s.substring(k1,k2+1))  +"}" + antiinfinite(s.substring(k2+1));
            
        }
        else if (s2 < s1 && s2 < s3)
        {
            int endp = closing(s, inconst, '(', ')', e2-1);
            int k1 = endp+1;
            while(true)
            {
                k1 =s.indexOf(";",k1);
                if (k1>=0 && inconst[k1])k1+=2;
                else break;
            }
            sb.append(s.substring(0,s2));
            String co = s.substring(e2-1, endp+1);
            co = co.replaceFirst("([^;]+;)([^;]+);","$1 asrt783df" + (qq) +"++<10000 && ($2);"); 
            sb.append("{int asrt783df" + qq +"=0; for " + co );
            qq++;
            k1 = s.indexOf(";", endp); int k2;
            if (k1>=0 && !s.substring(endp,k1).contains("{"))
            {
                k2 = k1;
                k1 = endp+1;
            }
            else
            {
                k1 = endp+1;
                while(true)
                {
                    k1 =s.indexOf("{",k1);
                    if (k1>=0 && inconst[k1])k1+=2;
                    else break;
                }
                k2= closing(s, inconst,'{', '}', k1); 
            }
            
            return sb.toString() +  antiinfinite(s.substring(k1,k2+1))  +"}" + antiinfinite(s.substring(k2+1));
        }
        
            int k1 = e3;
            while(true)
            {
                k1 =s.indexOf(";",k1);
                if (k1>=0 && inconst[k1])k1+=2;
                else break;
            }
            int k2, k3;
            if (k1>=0 && !s.substring(e3-1,k1).contains("{"))
            {
                k1 = k1+1;
                while(true)
                {
                    k1 =s.indexOf("while",k1);
                    if (k1>=0 && inconst[k1])k1+=5;
                    else break;
                } 
                if (k1==-1) return "error";
                k2 = k1+5;
                while(true)
                {
                    k2 =s.indexOf("(",k2);
                    if (k2>=0 && inconst[k2])k2+=2;
                    else break;
                }
                if (k2==-1) return "error";
                k3= closing(s, inconst,'(',')', k2); 
            }
            else
            {
                k1 = e3-1;
                while(true)
                {
                    k1 =s.indexOf("{",k1);
                    if (k1>=0 && inconst[k1])k1+=2;
                    else break;
                }
                k2 = closing(s, inconst, '{', '}', k1);
                k1 = k2+1;
                while(true)
                {
                    k1 =s.indexOf("while",k1);
                    if (k1>=0 && inconst[k1])k1+=5;
                    else break;
                } 
                if (k1==-1) return "error";
                k2 = k1+5;
                while(true)
                {
                    k2 =s.indexOf("(",k2);
                    if (k2>=0 && inconst[k2])k2+=2;
                    else break;
                }
                if (k2==-1) return "error";
                k3= closing(s, inconst,'(',')', k2); 
                
            }
            String co = s.substring(k2,k3+1);
            co =  "(asrt783df" + (qq) +"++<10000 && " + co + ")"; 
            sb.append(s.substring(0,s3));
            sb.append(  "{int asrt783df" + (qq) +"=0;do" + antiinfinite(s.substring(s3+2,k1)) + "while " +  co + ";}"); 
            qq++;
            return sb.toString() +  antiinfinite(s.substring(k3+1));
    }
//course,assignname,questionnum,content
    public LongTestPro(AsyncContext asyncCtx, User user, String course,String assignname, String questionnum,String content) {
        this.acontext = asyncCtx;
        this.content = content;
        this.questionnum = (questionnum!=null && questionnum.equals("")? null: questionnum);
        this.course = (course!=null && course.equals("")?null:course); 
        this.assignname = (assignname!=null && assignname.equals("")?null:assignname); 
        this.user = user;
      
        if (File.separator.equals("/")) {
            javaBin = "/bin/java";
            javacpath = "/bin/javac";
        } else {
            Map<String,String> m = System.getenv();
            javaBin = m.get("JRE_HOME");
            javacpath = m.get("JAVA_HOME");
            if (javaBin == null) javaBin = javacpath;
            if (javacpath.charAt(javacpath.length()-1) == File.separatorChar)
                javacpath = javacpath.substring(0,javacpath.length()-1);
            if (javaBin.charAt(javaBin.length()-1) == File.pathSeparatorChar)
                javaBin = javaBin.substring(0,javaBin.length()-1);
            javacpath += File.separator + "bin"+File.separator + "javac";
            javaBin += File.separator + "bin" + File.separator + "java";
        }
        
    }
    void clearfiles(ArrayList<String> classnames)
    {
        long ll = System.currentTimeMillis();
        for (String classname:classnames)
        {
         File fd = new File(dir);
         File[] fs = fd.listFiles();
            for (File ff : fs) {
                if (ff.getName().endsWith(".class") ){ ff.delete(); continue;}
                if ( ll - ff.lastModified() < 10000 &&  (ff.getName().startsWith(classname) || ff.getName().endsWith(".java"))) {
                    ff.delete();
                }
            }
        }
    }
    String inputmsg = "";
    public void run() 
    {
        ArrayList<String> classNames = findClassName(content);
        String javahome, aline;
        //String err = dir + "\n\n" + content + "\n\n" + className;
        acontext.getResponse().setContentType("text/plain");  // Set content type of the response so that jQuery knows what it can expect.
        acontext.getResponse().setCharacterEncoding("UTF-8");
        PrintWriter out = null;
        try {
            if (course!=null && user.subdb!=null && user.subdb.equals("") == false && assignname!= null  && !user.subdb.equals(user.id))
                dir =   Toolbox.dbadmin[user.orgnum%65536].webFileFolder + File.separator + user.subdb + File.separator + course.replaceAll(" ", "") + File.separator + "submission"+ File.separator + user.id;
            else if (course!=null && user.subdb!=null && user.subdb.equals("") == false && user.subdb.equals(user.id))
                dir =   Toolbox.dbadmin[user.orgnum%65536].webFileFolder + File.separator + user.subdb + File.separator + course.replaceAll(" ", "") + File.separator + "assignment";
            else if (user.subdb!=null && user.subdb.equals("") == false && user.subdb.equals(user.id))
                dir =   Toolbox.dbadmin[user.orgnum%65536].webFileFolder + File.separator + user.subdb + File.separator + "working";
             else  
                dir =   ServerAgent.workingFolder; 
            inputmsg = "\ncourse=" + course + "\nassignname=" + assignname + "\nsubdb=" + user.subdb + "\nquestionnum=" + questionnum + "\nlength=" + content.length();
      
            if ((new File(dir)).exists()==false) UploadTeaching.makedir( dir);
            String datapath = null;
            if (course!=null && user.subdb!=null && user.subdb.equals("") == false && assignname!= null && !assignname.equals(""))
                datapath = Toolbox.dbadmin[user.orgnum%65536].webFileFolder + File.separator + user.subdb + File.separator +  course + File.separator + "assignment" + File.separator + assignname;
            System.out.println("datapath =" + datapath);
            if (datapath!=null && questionnum!=null) 
                datapath += questionnum;
            if (datapath!=null) datapath += "data.txt";
         
            if (datapath!=null && new File(datapath).exists() == false) {
                datapath = null;
            }
            out = acontext.getResponse().getWriter();
            if (classNames == null || classNames.size() == 0) {
                try {
                    out.println("Error: No class name or no public main class was marked."+inputmsg);
                } catch (Exception e) {
                }
                out.close();
                return;
            }
            String className = classNames.get(classNames.size()-1);
            
            String codes = antiinfinite(content);
            if (codes.equals("!")) 
            {
                try {
                    out.println("Error: Can only read file using new File(args[0]).<br> No file write is allowed"+inputmsg);
                } catch (Exception e) {
                }
                out.close();
                return;
            }
            if (datapath == null && codes.contains("args[0]")) 
            {
                try {
                    out.println("Error: Your program contains args[0] but <br>" + assignname + questionnum + "data.txt has not been prepared.<br>Report this error message  to your instructor");
                } catch (Exception e) {
                }
                out.close();
                return;
            }
            if (datapath == null && codes.contains("Scanner")) 
            {
                try {
                    out.println("Error: No data file is prepared. The Scanner objects would hang the process");
                } catch (Exception e) {
                }
                out.close();
                return;
            }
            
            int exitVal = -1;
      
           
            FileWriter aWriter = new FileWriter(dir + File.separator + className + ".java", false);
            aWriter.write(codes);
            aWriter.close();
               
            ProcessBuilder probuilder = new ProcessBuilder(javacpath, className + ".java");
            probuilder.directory(new File(dir));
            Process proc = probuilder.start();
            InputStream stdin = proc.getErrorStream();
            InputStreamReader isr = new InputStreamReader(stdin);
            BufferedReader br = new BufferedReader(isr);
            while ((aline = br.readLine()) != null) {
                out.println(aline + "\n");
            }
            exitVal = proc.waitFor();
            proc.destroy();
            if (classNames.size() > 1) classNames.remove(classNames.size()-1);
            if (exitVal != 0) {
                out.println("Error: Compilation failed"+inputmsg);
                out.close();
                clearfiles( classNames);
                return;
            }
            if (datapath == null)
                probuilder = new ProcessBuilder(javaBin, "-classpath", ".", className);
            else
                probuilder = new ProcessBuilder(javaBin, "-classpath", ".", className, datapath);
            probuilder.directory(new File(dir));
            probuilder.redirectErrorStream(true);
            proc = probuilder.start();
            InputStream is = proc.getInputStream();
            isr = new InputStreamReader(is);
            br = new BufferedReader(isr);
            String line;
            while ((line = br.readLine()) != null) 
            {
                out.println(line + "\n");
            }
            out.close();
            exitVal = proc.exitValue();
            proc.destroy();
            clearfiles( classNames);
            
        } catch (Exception e) {
            if (out!=null) out.println(e.toString()+inputmsg);
        }
        try {
            acontext.complete();
        } catch (Exception e) {
        }
    }

}
 
