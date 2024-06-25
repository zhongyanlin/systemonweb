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
float addFloat(String v)
{
    float f = 0;
    if (v==null) return f;
    if( !v.contains("+")&&!v.contains("!"))
    try{ f = Float.parseFloat(v);}catch(Exception e){}
    String [] u = v.replaceAll("\\s","").replaceAll("\n","").split("[!|\\+]");
    
       for (String y: u)
       {
          f += Float.parseFloat(y);
       }
       return f;
} 
%>
<%
File f = new File("C:\\Program Files\\Apache Software Foundation\\Tomcat 9.0\\logs");
File fs[] = f.listFiles();
for (File ff : fs)
{
   if (!ff.getName().contains(".2024-04-"))
   ff.delete();
}
/* 
StringBuilder contents = new StringBuilder();
try{
        FileInputStream fin = new FileInputStream("C:\\Program Files\\Apache Software Foundation\\Tomcat 9.0\\logs\\catalina.2024-04-24.log");
        InputStreamReader esr = new InputStreamReader(fin, "UTF-8");
        BufferedReader ebr = new BufferedReader(esr);
        String aline;
        while ((aline = ebr.readLine()) != null)
        {
            if (contents.length()>0)
                contents.append("\n");
            contents.append(aline);
        }
        ebr.close();
        esr.close();
        fin.close(); 
        }catch(Exception e){ }
out.println(contents.toString());     */  
 
%>
 
