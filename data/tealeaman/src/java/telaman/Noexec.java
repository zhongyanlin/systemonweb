package telaman;


import java.io.File;
import java.io.IOException;
import java.net.InetAddress;
 
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.*;

@WebFilter("/Noexec")
 
public final class Noexec implements Filter 
{
    static public String tonum(String s)
    {
        String x="";
        for (int i=0; i < s.length(); i++)
        {
            int j = (int)(s.charAt(i)) ;
            if (j < 256)
                x += String.format("%2x", j);
            else
                x += String.format("-%4x",j)  ; 
        }
        return x;
    }
    static public String fromnum(String s)
    {
        int j=0;
        String y = "";
        while (j < s.length())
        {
           char c = s.charAt(j);
           if (c == '-')
           {  y += ((char)(Integer.parseInt(s.substring(j+1, j+5),16) )); j+=5;}
           else
           {  y += ((char)(Integer.parseInt(s.substring(j, j+2),16) )); j+=2;}    
        }
        return y;
    }
    private ServletContext context;
   // static public String install;
    static public String root = null; 
    static boolean myserver = false; 
    
    public void init(FilterConfig fConfig) throws ServletException 
    {
       this.context = fConfig.getServletContext();
       // this.context.log("AuthenticationFilter initialized");
       javax.servlet.ServletContext application = fConfig.getServletContext();
      // install =  DBAdmin.removetwodots(DBAdmin.removetwodots(application.getRealPath("")));
       String here = "";  
       try
       {
            here = InetAddress.getLocalHost().getHostAddress();
       } 
       catch(Exception e){}
       myserver =  (Toolbox.installpath.toLowerCase().indexOf("c:\\project\\tealeaman")==0 || here.equals("172.16.32.77" ));
        
    }
     
    public void destroy() 
    {
        //close any resources here
    }
    public static String filebytes(String perm)
    {
        try
        {
           Scanner s =  new Scanner(new File(perm));
           perm = "," + s.useDelimiter("\\Z").next() +",";
           s.close();
        }catch(Exception e1) {perm = null;}
        return perm;
    }
    public void doFilter(ServletRequest request,  ServletResponse response, FilterChain chain)
    throws IOException, ServletException 
    {
        HttpServletRequest req  = (HttpServletRequest) request;
        HttpServletResponse res  = (HttpServletResponse) response;
         
        String uri = req.getRequestURI();
        if (root==null)
        {
           root = uri.replaceFirst("(/[^/]+/).*","$1");
        }
        
        String f1 = uri.replaceFirst("\\?.*", "");
         
        if (Toolbox.installpath.charAt(Toolbox.installpath.length()-1)!= File.separatorChar)
           f1  = Toolbox.installpath +  File.separator + f1.substring(root.length()-1).replace('/', File.separator.charAt(0));     
        else
           f1  = Toolbox.installpath + f1.substring(root.length()-1).replace('/', File.separator.charAt(0)); 
        f1 = f1.replace('\\', '/').replaceAll("//", "/").replace('/', File.separatorChar);
        int j = f1.replaceFirst(".$","").lastIndexOf(File.separator)+1; 
        String fn = f1.substring(j); 
        if (fn.charAt(fn.length()-1) == File.pathSeparatorChar) 
            fn = fn.substring(0,fn.length()-1);
        String abpath = f1.substring(0,j) + fn;
        abpath = abpath.replace('\\', '/').replaceAll("//", "/").replace('/', File.separatorChar);

        f1 = f1.substring(0,j-1) + "tmlpermi.txt";
      
        String x = filebytes(f1);
       
        if (x!=null)
        {    
            if( ("," + x + ",").contains("," + fn + ",")  )
            {
  
                 res.sendRedirect(root + "Fetchasis" );
                 return;
            }
        }
         
        uri = uri.replaceFirst("/null$", "/");
        j = uri.lastIndexOf("/");
        boolean ab =  (j == uri.length()-1);

        if (ab)
        {
            if (x!=null)
            {
 
                res.sendRedirect(root + "Fetchasis?fid=" + tonum(uri) );
                return;
            }
            else
            {
                 chain.doFilter(request, response);
            }
        }
        else if(  uri.endsWith(".htm")||  uri.endsWith(".jpg") || uri.endsWith(".html") || uri.contains(".html?")
            || uri.endsWith(".gif")|| uri.endsWith(".png")  || uri.endsWith(".svg")|| uri.endsWith(".mp4")
            || uri.endsWith(".js") || uri.endsWith(".txt") || uri.endsWith(".css") 
            || uri.endsWith(".pdf")|| uri.endsWith(".doc") || uri.endsWith(".docx")
            || uri.endsWith(".jpeg")|| uri.endsWith(".xml") || uri.endsWith(".ico"))
          {
              chain.doFilter(request, response);
          }
        else if (uri.endsWith(".jsp") || uri.contains(".jsp?"))
        {
            f1 = abpath.replaceFirst(fn + "$", "") + "WEB-INF" + File.separator + "classes" + File.separator + "telamanjsp" + File.separator + fn.replaceFirst("\\.jsp$","_jsp.class");
            if (myserver && (new File(abpath)).exists() ||  !myserver && new File(f1).exists())
            {
                try{
                chain.doFilter(request, response);
                }catch(Exception e){System.out.println((myserver && (new File(abpath)).exists()) + " " + e.toString());}
            }
            else 
            {
                 res.sendRedirect(root + "Fetchasis?fid=" + tonum(uri) );
            }
        }
        else 
        {
            f1 = abpath.replaceFirst(fn + "$","") +  "WEB-INF" + File.separator + "classes" + File.separator + "telaman" + File.separator + fn + ".class";
            String f2 = abpath.replaceFirst(fn + "$","") +  "WEB-INF" + File.separator + "classes" + File.separator + "facerec" + File.separator + fn + ".class";
            
            
            if ( (new File(f1)).exists()  ||  (new File(f2)).exists())
               chain.doFilter(request, response);
            else
            {
               res.sendRedirect(root + "Fetchasis?fid=" + tonum(uri) );
            }
              
        }
     
    }    
    
    
}
