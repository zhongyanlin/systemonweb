<%@  page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*,java.io.*,java.util.zip.*" %>
<%!
    protected String read(String path)
{
  try{
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
          }catch(Exception e){return "";}
}
    protected String findClassName(String cont) {
        Matcher m;
        Pattern p;
        if (cont == null) {
            return null;
        }
        if (!((m = (p = Pattern.compile("class\\s+[_|\\w]+")).matcher((CharSequence)cont)) != null && m.find())) {
            return null;
        }
        String ans = cont.substring(m.start(), m.end());
        ans = ans.replaceFirst("class\\s+", "");
        return ans;
    }
    String replace(String original, String newp)
{
     int i = newp.indexOf("void main");
     int j = original.indexOf("void main");
     if (j == -1)j = original.indexOf("void  main");
     if (j == -1)j = original.indexOf("void   main"); 
     return original.substring(0,j) + newp.substring(i);
    
}
%>
<%
    String content = request.getParameter("codes");
    String filename = request.getParameter("filename");
    
    if (content == null)
    {%>
<!DOCTYPE html>
<html>
   <body>
          <table align="center" width="500">
                <tr><td align="center"><h1> Uniform Unit Test</h1></td></tr>
                <tr><td>
            Copy paste your the source codes of your  workable program to the following text box  then click the Test button. 
            Your test driver (the main method) should be the last method in the class, and it will be replaced by 
            a  uniform test driver. After the execution results coming out, copy them one by one by number to the answering boxes on the submission page.
                    </td></tr><tr><td><form rel=opener name="f" method="post" action="TestPrograms?r=<%=(new java.util.Date()).getTime()%>" target="results">
                            <textarea name="codes" rows="20" cols="80"></textarea>
                        </td></tr><tr><td align="center">
                <input type="hidden" name="filename" value="<%=filename%>"> 
                <input type="hidden" name="random" value="<%=(new java.util.Date()).getTime()%>"> 
                <input type="submit" name="submit" value="Test" width="70"></form></td></tr>
                <tr><td><iframe name="results" width="600" height="500"></iframe></td></tr>
             </table>
        </body>
    </hml>
    <%}
else {
    String className;
    String javahome;
    String aline;
    String dir = "C:\\customer0\\web\\D10059906\\working\\";
    if (File.separator.equals("/")) 
           dir = "/home/opc/customer0/web/D10059906/working/";

    if (((className = this.findClassName(content)) == null || className.equals("")) && filename == null) {
        response.setContentType("text/html");
        out.println("<html lang=en >");
        out.println("<head>");
        out.println("</head>");
        out.println("<style type=\"text/css\">\n.special {background-color:#8000ff;color:white}\n</style>\n");
        out.println("<body>No class Name </body></html>");
        return;
    }

    FileWriter aWriter = new FileWriter(dir +  className + ".java", false);
    aWriter.write(content);
    aWriter.close();
 
    int exitVal = -1;
    int[] rarray = new int[100];
    int N = 0;
    String old = "";
    StringBuffer sb = new StringBuffer(400);
    try {
        Runtime r = Runtime.getRuntime();
        Process proc = r.exec("javac  " + className + ".java", (String[]) null, new File(dir));
        InputStream stderr = proc.getErrorStream();
        InputStreamReader isr = new InputStreamReader(stderr);
        BufferedReader br = new BufferedReader(isr);
        while ((aline = br.readLine()) != null) {
            String aline2;
            String aline1 = aline.replaceFirst(className + ".java:(\\d+):", "<a href=#$1>" + className + ".java:$1:</a>");
            if (!((aline2 = aline.replaceFirst(className + ".java:(\\d+):.*", "$1")).equals(old) || N >= 100)) {
                try {
                    int ttt = Integer.parseInt(aline2);
                    rarray[N++] = ttt;
                } catch (Exception e) {
                    // empty catch block
                }
                old = aline2;
            }
            sb.append(aline1 + "<br>");
        }
        exitVal = proc.waitFor();
        proc.destroy();
    } catch (Exception e) {
        sb.append(e.toString());
    }
    int jj = 1;
    int ll = 0;
    if (exitVal > 0) {
        response.setContentType("text/html");
        out.println("<!DOCTYPE html>\n<html lang=en >");
        out.println("<head>");
        out.println("<title>Java Compilation</title>");
        out.println("<style type=\"text/css\">\n.special {background-color:#8000ff;color:white}\n</style>\n");
        out.println("</head>");
        out.println("<body  style=\"background-color:white;margin:5px 5px 0px 5px\">");
        out.println(Toolbox.title("javac"));
        out.println("<table><tr><td>" + exitVal + "</td></tr><tr><td>Compiling Option<td> </td></tr><tr><td>Directory<td>" + dir + "</nobr></td></tr><tr><td>Soruce File<td>" + className + ".java</td></tr><tr><td>Error Message<td>");
        out.println(sb.toString() + "</td></tr></table>");
        int nn = rarray[0];
        RandomAccessFile f = new RandomAccessFile(dir + className + ".java", "r");
        while ((aline = f.readLine()) != null) {
            int kk = jj;
            out.print("<font color=brown face=courier>  " + jj + " &nbsp;&nbsp;</font>");
            if (nn == kk) {
                out.print("<a name=" + nn + "><font face=courier class=special></a>");
                if (ll + 1 < N) {
                    nn = rarray[++ll];
                }
            } else {
                out.print("<font face=courier>  ");
            }
            aline = aline.replaceAll(" ", "&nbsp;");
            aline = aline.replaceAll("\t", "&nbsp;&nbsp;&nbsp;");
            out.print(aline + "</font><br>");
            ++jj;
        }
        f.close();
        out.println("</body>");
        out.println("</html>");
        out.close();
    } else {
        int exitValue = 1;
        filename = filename.replace("/", File.separator);
        String path = dir.replaceFirst("working.$", "") + filename;
        
        StringBuffer errbuf = new StringBuffer();
        if (new File(path).exists() == false) {
            errbuf.append(path + "not exist");
        } else {
          
            String newp = read(path);
            content = replace(content, newp);
             
            File fd = new File(dir);
            File [] fs = fd.listFiles();
            for (File ff : fs)
            {
                if (ff.getName().startsWith(className))
                    ff.delete();
            }
            aWriter = new FileWriter(dir +   className + ".java", false);
            aWriter.write(content);
            aWriter.close();
 
            try {
                Runtime r = Runtime.getRuntime();
                Process proc = r.exec("javac  " + className + ".java", (String[]) null, new File(dir));
                InputStream stdin = proc.getErrorStream();
                InputStreamReader isr = new InputStreamReader(stdin);
                BufferedReader br = new BufferedReader(isr);
                while ((aline = br.readLine()) != null) {
                         errbuf.append(aline + "\n");
                }
                 exitValue = proc.waitFor();
             
                proc.destroy();
              
                if (exitValue == 0) {
 
 
String javaHome = System.getProperty("java.home");
String javaBin;
if (javaHome == null || javaHome.equals(""))
{
   javaBin = "/usr/bin/java";
   javaHome = "/usr";
}
else
{
    javaBin = javaHome +  File.separator + "bin" +   File.separator + "java";
}
 
            ProcessBuilder probuilder = new ProcessBuilder(javaBin,"-classpath", ".",  className );
             probuilder.directory(new File(dir));
            Process process = probuilder.start();
            InputStream is = process.getInputStream();
            isr = new InputStreamReader(is);
            br = new BufferedReader(isr);
            String line;
            while ((line = br.readLine()) != null) 
            {
                errbuf.append(line + "\n"); 
            }
            exitValue = process.exitValue();        
 
                } else {
                    errbuf.append("Uniform test driver is wrong");
                }
            } catch (Exception e) {
                // empty catch block
            }
        }
        out.println("<html lang=en ><head></head><body><pre>" + errbuf.toString() + "</pre></body></html>");

    }

}
%>
 
    

