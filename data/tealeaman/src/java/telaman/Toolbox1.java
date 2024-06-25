
package telaman;

import java.io.*;
import java.util.*;
import java.util.regex.*;
import java.security.*; 
import javax.imageio.ImageIO;
import com.google.zxing.*;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.common.HybridBinarizer;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import java.util.Scanner;
import java.net.*;
import javax.servlet.*;
import javax.servlet.http.*;
 
 
/**
 *
 * @author Zhongyan Lin
 */
public class Toolbox1 
{
    static public String filebytes(String path, String encode)
    {
        StringBuilder contents = new StringBuilder();
        try{
        FileInputStream fin = new FileInputStream(Toolbox.installpath + File.separator + path);
        InputStreamReader esr = new InputStreamReader(fin, encode);
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
        }catch(Exception e){return null;}
         
        return contents.toString();
    }
    static public String writebytes(String path, String str)
    {
        String x = null;
        try
        {
           File f = new File(Toolbox.installpath + File.separator + path);
           f.delete();
           FileWriter s =  new FileWriter(Toolbox.installpath + File.separator + path, false);
           s.append(str);
           s.close();
        }catch(Exception e1) {}
        return x;
    }
    public static String url = "";
    static void createQRCode(String qrCodeData, OutputStream os, String charset, Map hintMap, int qrCodeheight, int qrCodewidth)
	throws WriterException, IOException 
    {
         
        String str =  new String(qrCodeData.getBytes(charset), charset);
        
		BitMatrix matrix = new MultiFormatWriter().encode(str, BarcodeFormat.QR_CODE, qrCodewidth, qrCodeheight, hintMap);
		MatrixToImageWriter.writeToStream(matrix, "jpg", os);
	} 
    static void createQRCode(String qrCodeData, String filePath, String charset, Map hintMap, int qrCodeheight, int qrCodewidth)
	throws WriterException, IOException 
    {
        String str =  new String(qrCodeData.getBytes(charset), charset);
        String ext = filePath.substring(filePath.lastIndexOf('.') + 1);
        
		BitMatrix matrix = new MultiFormatWriter().encode(str, BarcodeFormat.QR_CODE, qrCodewidth, qrCodeheight, hintMap);
		MatrixToImageWriter.writeToFile(matrix, ext, new File(filePath));
	} 
    public static void makeqrcode(String url,String filename)
    {    
        Toolbox1.url = url;
      
        String filePath = Toolbox.installpath + File.separator +  "image"+ File.separator + filename;
        //Toolbox.msgqueueput("D10030303",filePath);
        if ( (new File(filePath)).exists()  )
        {
            (new File(filePath)).delete();
        }
        try
        {
            String charset = "UTF-8";  
            
            Map<EncodeHintType, ErrorCorrectionLevel> hintMap = new HashMap<EncodeHintType, ErrorCorrectionLevel>();
            
           // hintMap.put(EncodeHintType.MARGIN, ErrorCorrectionLevel.L);
            
              
            hintMap.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.L);
            if (url.indexOf("qrqlpin=") >= 0)
               createQRCode(url, filePath, charset, hintMap, 250, 250);
            else
               createQRCode(url, filePath, charset, hintMap, 500, 500);
           // Toolbox.msgqueueput("D10030303","big one create");
           // filePath = filePath.replaceFirst("qrcode", "qrcode0");
           // createQRCode(url, filePath, charset, hintMap, 90, 90);
        }catch(Exception e)
        {
            Toolbox.println(0,e.toString());
        }
    }
    
    public static void makeqrcode(String url, OutputStream os)
    {    
        Toolbox1.url = url;
          
        try
        {
            String charset = "UTF-8";  
            
            Map<EncodeHintType, ErrorCorrectionLevel> hintMap = new HashMap<EncodeHintType, ErrorCorrectionLevel>();
            
           // hintMap.put(EncodeHintType.MARGIN, ErrorCorrectionLevel.L);
            
              
            hintMap.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.L);
            if (url.indexOf("qrqlpin=") >= 0)
               createQRCode(url, os, charset, hintMap, 250, 250);
            else
               createQRCode(url, os, charset, hintMap, 500, 500); 
           // Toolbox.msgqueueput("D10030303","big one create");
           // filePath = filePath.replaceFirst("qrcode", "qrcode0");
           // createQRCode(url, filePath, charset, hintMap, 90, 90);
        }catch(Exception e)
        {
            Toolbox.println(0,e.toString());
        }
    }
    
    

    public static String zip(String str)
    {
    if (str == null) return str;    
    String [] s = str.replaceFirst(",$","").split(",");
    if (str.indexOf("|") > 0 || s.length ==1) 
        return str;
    int i=0;
    int l = s[0].lastIndexOf("@");
    while (true)
    {
        int j = 1;
        for (; j < s.length; j++)
        {
            int k = s[j].lastIndexOf("@");
            if (i+l+1 == s[0].length()  || i+k+1 == s[j].length() || s[j].charAt(i+k+1) != s[0].charAt(i+l+1)) 
              break;  
        }
        if (j < s.length )
        {
             break;
        }
        else  i++;
    }
    String  y = s[0] + ",";
    for (int j=1; j < s.length; j++)
    {
        int k = s[j].lastIndexOf("@");
        i=0;
        while ( i+l+1 < s[0].length()  &&  i+k+1 < s[j].length() && s[j].charAt(i+k+1) == s[0].charAt(i+l+1)) 
            i++;
        if (i > 0)
            y += s[j].substring(0,k+1) +  i + "|" + s[j].substring(i+k+1) + ",";  
        else
            y += s[j] + ",";
    }
    return y;
}
     
public static String  validdate(String x, int orgnum )
{
     if (  x == null || x.equals("") ) return "";
     Encode6b encoder = new Encode6b(orgnum);
     
     String [] ats = Toolbox1.unzip(x).split(","); 
     String atstr = "";
     for (int i=0;  i < ats.length; i++)
     {
         String xs[] = ats[i].split("@");
         if (xs.length!=3) continue;
         
         String path = ""; 
         long j;
         try
         {
             path = encoder.rto6b(xs[2]);
             j = Long.parseLong(xs[1]);
             if (path.indexOf(xs[0]) <= 0)
                 continue;
            
             atstr += ats[i] + ",";
         }
         catch(Exception e){}
     }
     if (atstr.equals("")) return "";
     atstr =  Toolbox1.zip(atstr);
     return atstr;
}
    
    public static String unzip(String str)
   {
    if (str ==null || str.equals("")) return "";
    String s[] = str.replaceFirst(",$", "").split(",");
    if (str.indexOf("|") < 0 || s.length  ==1) 
        return str;
    
    str = s[0] + ",";
    int l = s[0].lastIndexOf("@");
    for (int j=1; j < s.length; j++)
    {
         int k = s[j].indexOf("|");
         if (k < 0)
            str += s[j] + ","; 
         else
         {
            int m = s[j].lastIndexOf("@");
            int n = Integer.parseInt(s[j].substring(m+1,k));
            str += s[j].substring(0,m+1) + s[0].substring(l+1,l+n+1) + s[j].substring(k+1) + ",";
         }
    }
    return str;
    } 
    
    public static String GetCookie(HttpServletRequest request, String cookiename)
    {
        Cookie cookies [] = request.getCookies();
        String myCookie = null;
        if (cookies != null)
        {
            for (int i = 0; i < cookies.length; i++) 
            {
                if (cookies [i].getName().equals (cookiename))
                {
                    myCookie = cookies[i].getValue();
                    break;
                }
                
            }
        }
        return myCookie;
    }
    public static void SetCookie(HttpServletResponse response, String cookiename, String value)
    {
        Cookie cookie = new Cookie (cookiename, value);
        cookie.setMaxAge(183 * 24 * 60 * 60);
        response.addCookie(cookie); 
    }
    
    static private String goodopenurl(String codepath)
{
    if (codepath.indexOf("http://") == 0 || codepath.indexOf("https://") == 0)
    return codepath;
    return "FileOperation?did=" + codepath;   
} 
    
    static public String[] attach( String x, String subdb, String course, boolean question, int orgnum)
{
     
     if (  x == null || x.equals("") ) return new String[]{"",""};
     Encode6b encoder = new Encode6b(orgnum);
     HashMap<String,String> fn2code = new HashMap(3);  
     String [] ats = Toolbox1.unzip(x.replaceFirst(",$","")).split(","); 
     String atstr = "";
     String q = "";
     for (int i=0;  i < ats.length; i++)
     {
         String xs[] = ats[i].split("@");
         String code = xs[xs.length-1];
         
         if ( xs[0].replaceAll("[0-9]","").equals("")  && code.replaceAll("[0-9]", "").equals("___"))
         {
            String xx = fn2code.get(xs[1]); if (xx==null) continue;
            String ns[] = code.split("_");
            if (ns.length!=4) continue;
            q += "div.imagelet" +  xs[0] 
              + "{background-image:url(" 
              + goodopenurl(xx) + ");background-position:-" + ns[0] + "px -" + ns[1] + "px;width:" + ns[2] + "px !important;height:" + ns[3] + "px !important;}\n"; 
            int jj = atstr.indexOf(xx);
            if (jj > 0)
            {
                int kk = atstr.indexOf("</span>",jj) + 7;
                int ll = atstr.substring(0,jj).lastIndexOf("<span ");
                atstr = atstr.substring(0,ll) + atstr.substring(kk);
            }
            
            continue;
         }
         
         String path = "";
         if (code.toLowerCase().indexOf("http")== 0)
         {
             atstr += " <span style=color:blue;cursor:pointer onclick=\"openproper('" + code + "','" + xs[0] + "',this)\" >" + xs[0] + "</span> "; 
             fn2code.put(xs[0], code);
         }
         else
         try
         {
             path = encoder.rto6b(code);
             path = path.replace('/', File.separatorChar ); 
             if (course==null || course.equals(""))
             {
                 atstr += " <span style=color:blue;cursor:pointer onclick=\"openproper('" + code + "','" + xs[0] + "',this)\" >" + xs[0] + "</span> "; 
                 fn2code.put(xs[0], code);
             }
             else if ( question == false && code.indexOf("_") == 0 ) 
             {
                 atstr += " <span style=color:blue;cursor:pointer onclick=\"openproper('" + code + "','" + xs[0] + "',this)\" >" + xs[0] + "</span> "; 
                 fn2code.put(xs[0], code);
             }
             else if ( question && (path.toLowerCase().contains((File.separator +  "assignment"+  File.separator).toLowerCase()  ) ||  path.toLowerCase().contains((File.separator +  Toolbox.emsg(1398).split(",")[1]+  File.separator).toLowerCase() ) ))
             {
                 atstr += " <span style=color:blue;cursor:pointer onclick=\"openproper('" + code + "','" + xs[0] + "',this)\" >" + xs[0] + "</span> "; 
                 fn2code.put(xs[0], code);
             }
             else 
                 fn2code.put(xs[0], code);
         }catch(Exception e){}
          
     }
     if (!atstr.equals(""))
         atstr  = Toolbox.emsgs(orgnum,355)+":  "  + atstr;
     return new String[] {atstr,   q  };
      
}
  
static public String formatstr( String des, String format, int i, int orgnum)
{
   des = dothetable(des);  
   String s = ""; if (i >= 0) s = "_" + i;
    
   des = des
  .replaceAll("\\[[ ]*Imagelet[ ]*([0-9]+)[ ]*:[ ]*1\\]","<table style=display:inline;float:left><tr><td><div  class=imagelet$1" + s + "></div></td></tr></table>") 
  .replaceAll("\\[[ ]*Imagelet[ ]*([0-9]+)[ ]*:2[ ]*\\]","<table style=display:inline;float:right><tr><td><div class=imagelet$1" + s + "></div></td></tr></table>")   
  .replaceAll("\\[[ ]*Imagelet[ ]*([0-9]+)[ ]*[:]?[ ]*[0-9]*[ ]*\\]","<table align=center><tr><td><div class=imagelet$1" + s + "></div></td></tr></table>");
  return des; 
}
static public String todiv(int orgnum, String des, int i)
{
   des = dothetable(des);  
   String s = ""; if (i >= 0) s = "_" + i;
   des = des
  .replaceAll("\\[[ ]*Imagelet[ ]*([0-9]+)[ ]*:[ ]*1\\]","<table style=display:inline;float:left><tr><td><div  class=imagelet$1" + s + "></div></td></tr></table>") 
  .replaceAll("\\[[ ]*Imagelet[ ]*([0-9]+)[ ]*:2[ ]*\\]","<table style=display:inline;float:right><tr><td><div class=imagelet$1" + s + "></div></td></tr></table>")   
  .replaceAll("\\[[ ]*Imagelet[ ]*([0-9]+)[ ]*[:]?[ ]*[0-9]*[ ]*\\]","<table align=center><tr><td><div class=imagelet$1" + s + "></div></td></tr></table>");
  return des; 
}
static public String addImagelet(int orgnum, String des, int i)
{
     HashMap<String, String> temp = new HashMap<>(); 
     while (true)
     {
         if (des.indexOf("[Imagelet")< 0) break; 
         String nstr = des.replaceFirst(".*\\[Imagelet([0-9]+)\\].*", "$1");
         if (!nstr.replaceFirst("[0-9]+","").equals("")) break;
      
         String p = temp.get(i + "_" + nstr);
         
         if (p == null)
         {
             temp.put(i + "_" + nstr, " ");
         }
         else
         {
             temp.put(i + "_" + nstr, p + " "); 
         }
         int pp = (temp.get(i + "_" + nstr).length()-1);
         des =des.replaceFirst("\\[Imagelet" +   nstr + "\\]", "<div id=\"" + i + "_" + nstr +"_" + pp + "\"></div>");
     }
     return des;
}
static public String [] atta( String x, int ii, String pathhas, int orgnum)
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
         if ( xs[0].replaceAll("[0-9]","").equals("")  && code.replaceAll("[0-9]", "").length() > 2)
         {
            String xx = fn2code.get(xs[1]);
            if (xx==null) continue;
            q += "Imagelet.addImagelet('"  + xs[0] + '@' + xs[1] + '@' + xs[2] + "'," + ii + ");\n";
            //q += "fns2order['" + xs[0] + "@" +  xs[1] + "'] = " + ii + ";\nfns2dim['" + xs[0] + "@" +  xs[1] + "'] = '"  + code + "';\nvar f=fn2s['" + xs[1] + "'];if (f==null)fn2s['" + xs[1] + "']='" + xs[0] + "_';else if (('_'+f).indexOf('_"+xs[0]+"_')<0) fn2s['" + xs[1] + "']+='" + xs[0] + "_';\n";
            int jj = atstr.indexOf(xx);
            if (jj > 0)
            {
                int kk = atstr.indexOf("</span>",jj) + 7;
                int ll = atstr.substring(0,jj).lastIndexOf("<span ");
                atstr = atstr.substring(0,ll) + atstr.substring(kk);
            } 
            continue;
         }
         
         String path = "";
         try
         {
             path = encoder.rto6b(code);
             path = path.replace('/', java.io.File.separatorChar ); 
             if (pathhas==null || path.toLowerCase().contains((pathhas).toLowerCase() ) ) 
             {
                 fn2code.put(xs[0], code); 
                 if (atstr.equals("")) 
                     atstr = Toolbox.emsgs(orgnum,355)+": ";
                 atstr += " <span style=color:blue;cursor:pointer onclick=\"openpicorfile('"+ code + "','"+xs[0] + "',this);Imagelet.filldiv('"+ code + "','"+xs[0] + "')\"   >" +  xs[0] + "</span> (" + Toolbox.emsgs(orgnum,1503) + ")";  
             }
         }catch(Exception e){}
     }
     return new String[]{atstr,q}; 
}

 
    
static public String [] attaget(String x, int ii, String pathhas, int orgnum)
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
            String xx = fn2code.get(xs[1]);
            if (xx==null) continue;
            String ns[] = code.split("_");
            if (ns.length!=4) continue;
             q += "div.imagelet" +  xs[0] + "_" + ii 
              + "{background-image:url(" 
              + goodopenurl(xx) + ");background-position:-" + ns[0] + "px -" + ns[1] + "px;width:" + ns[2] + "px !important;height:" + ns[3] + "px !important;}\n"; 
            int jj = atstr.indexOf(xx);
            if (jj > 0)
            {
                int kk = atstr.indexOf("</span>",jj) + 7;
                int ll = atstr.substring(0,jj).lastIndexOf("<span ");
                atstr = atstr.substring(0,ll) + atstr.substring(kk);
            }
            continue;
         }
         
         String path = "";
         try
         {
             path = encoder.rto6b(code);
             path = path.replace('/', java.io.File.separatorChar ); 
             if (pathhas==null || path.toLowerCase().contains((pathhas).toLowerCase() ) ) 
             {
                 fn2code.put(xs[0], code); 
                 
                 atstr += " <span style=color:blue;cursor:pointer onclick=\"openpicorfile('"+ code + "','"+xs[0] + "',this)\"   >" +  xs[0] + "</span>";  
             }
         }catch(Exception e){}
     }
     atstr = atstr.trim();
    // if (!atstr.equals("")) atstr = Toolbox.emsgs(orgnum,355)+": " + atstr;
     return new String[]{atstr,q}; 
}
static char safechars[] = null;
public static void initsafechars(){
    String x = "0123456789!@#$%^~`*-_.,:;|";
    safechars = new char[52+x.length()];
    for (int i=0; i < 26; i++)
    {
       safechars[i] = (char)('A' + i); 
    }
    for (int i=0; i < 26; i++)
    {
       safechars[i+26] = (char)('a' + i); 
    }
    
    for (int i=0; i < x.length(); i++)
    {
       safechars[i+52] = x.charAt(i); 
    }
    Arrays.sort(safechars);
    
}
 
static public boolean safestr(String x)
{
    for (int i=0; i < x.length(); i++)
    {
        char y = x.charAt(i);
        int jj = Arrays.binarySearch(safechars, y);
         
        if (jj < 0)
            return false;
    }
    return true;
}
static public String geturl(HttpServletRequest request)
{
    String url = request.getRequestURL().toString();
 
if (url.indexOf("//localhost")>0 || url.indexOf("//127.0.0.1")>0  ) 
{
   String external = null, internal = null; 
   try{
   Enumeration e = NetworkInterface.getNetworkInterfaces(); 
   String oldurl = url;
   
    while(e.hasMoreElements())
    {
        NetworkInterface n = (NetworkInterface) e.nextElement();
        Enumeration ee = n.getInetAddresses();
        String external1 = null, internal1 = null;
        while (ee.hasMoreElements())
        {
            InetAddress i = (InetAddress) ee.nextElement();
            String x = (i.getHostAddress());
              
            if (x.indexOf("192.168.137.1") == 0)
            {
                internal1 = x;
            }
            else  if (x.indexOf("192.168") == 0 || x.indexOf("10.") ==0)
            {
                internal1 = x;
            }
            else if (x.indexOf("127.0.0.1")!=0 && x.matches("[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]++"))
            {
                external1 = x;
            } 

        }
        if (external1!=null)  external = external1;
        else if (internal1!=null)
        {
              internal = internal1;
              if (internal.equals("192.168.137.1")) break;
        }
        
    } 
   }catch(Exception e){}
    if (external!=null) url = url.replaceFirst("localhost", external).replaceFirst("127.0.0.1", external);
    else if (internal!=null)
          {
              url = url.replaceFirst("localhost", internal).replaceFirst("127.0.0.1", internal);
               
          }
          
}
    StringBuffer good = new StringBuffer();
    StringBuffer  bad = new StringBuffer ();
    boolean hase = false;
    int orgnum = -10000000;
    String existing = request.getParameter("code6b");
    if (existing != null)
        bad.append(Unicode6b.decode(existing));
    for (Enumeration e = request.getParameterNames();e.hasMoreElements();)
    {
        String nm = (String)e.nextElement();
        String v = request.getParameter(nm);
        if ( v.equals("encode6b") ) continue;
        if (orgnum <0 && nm.equals("orgnum"))
        {
            try{ orgnum = Integer.parseInt(v);}catch(Exception e1){}
            good.append("&orgnum=" + v);
            continue;
        }
        
        if (safestr(v) ) 
        {
            good.append("&" + nm + "=" + v);
        }
        else  
        {
            if (bad.length() > 0) bad.append("&");
            if (!v.contains("&") && !v.contains("'"))
            {
                bad.append( nm + "=" + v   );
            }
            else
                bad.append("'" + nm + "=" + v.replace("'", "''") + "'");
         
        }
    }
     
    int j = url.indexOf("?");
    if (j > 0) url = url.substring(0,j);
    char c = '?';
    if (good.length()>0)
    {
        url += good.toString().replaceFirst("&","?");
        c = '&'; 
    }
    if (bad.length()>0) 
    {
        if (orgnum < 0) 
            orgnum = Toolbox.setcharset(request, null);
        url += c + "code6b="+ Unicode6b.encode(bad.toString()); 
    }
    return url;
}
 
static public String redirect(HttpSession session, int orgnum1,HttpServletResponse response)
    {
        session.removeAttribute("User");
        Cookie c = new Cookie("orgnum", ""+orgnum1);
        c.setMaxAge(3650*24*60*60);
        response.addCookie(c); 
        return "<!DOCTYPE html><html lang=\""+Toolbox.langs[orgnum1>>16]+"\" ><body><script>document.lcaotion.href='index.jsp';</script></body></html>";
    }
 
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
    
    static public String tothetable(String v)
    {
    int j = v.indexOf("\t");
    if (j ==-1) return v;
    while (j>=0 && v.charAt(j)!='\n'&& v.charAt(j)!='\r')
    {
        j--;
    }
    int k = v.lastIndexOf("\t");
    while (k < v.length() && v.charAt(k)!='\n'&& v.charAt(k)!='\r')
    {
        k++;
    } 
    String str = v.substring(j+1,k);
    String x =(new CSVParse(str, '"', new String[]{"\t", "\r\n"})).html().replaceAll("border.collapse:","border:1px #060606 solid;border-collapse:").replaceAll("<td ","<td style=border-color:#cccccc ");
    str = "";
    if (j >0) str = v.substring(0,j);
    str += x;
    if (k+1 < v.length()) str += v.substring(k+1);
    return str;
    }
    
    static Pattern codestab = Pattern.compile("[\r|\n][ ]*\t");
    
    public static String dothetable(String v)
    {
    Matcher m = codestab.matcher(v);
    int e = 0;
    if (m.find(e))
    { 
        e = m.end()+1;
        if (m.find(e))
        {
           e = m.end()+1; 
           if (m.find(e))
           {
               return v;
           }
        }
    }
    
    int j = v.indexOf("\n\t");
    if (j>=0) return v;
    j = v.indexOf("\r\t");
    if (j>=0) return v;
    j = v.indexOf("\t", 1);
    if (j == -1) return v;
     
    String x[][] =(new CSVParse(v, '"', new String[]{"\t", "\r\n"})).nextMatrix(false);
    
    StringBuffer str =  new StringBuffer();
    int start = -1;
    StringBuffer z = new StringBuffer();
    for (int r = 0;  r < x.length; r++)
    {
       
       if ((x[r] == null ||x[r].length == 1) && (r==0 || x[r-1]!=null && x[r-1].length>1))
       {
            z.setLength(0);
       }
       
       if (x[r] == null ||x[r].length == 1)
       {
           if (x[r] ==null )  
           {
               if ( r < x.length-1)z.append('\n');
           }
           else
           {
               if (x[r][0].indexOf('\t')>=0 || x[r][0].indexOf('\r')>=0 || x[r][0].indexOf('\n')>=0)
                   z.append('"');
               z.append(x[r][0]);
               if (x[r][0].indexOf('\t')>=0 || x[r][0].indexOf('\r')>=0 || x[r][0].indexOf('\n')>=0)
                   z.append('"');
               if (r < x.length-1)
                   z.append('\n');
           }
           
           if (r == x.length-1 || x[r+1]!=null && x[r+1].length>1)
           {
               str.append(z.toString());
           }
           
           start = r;
           
       }
       else if (r == x.length-1 || x[r+1]==null || x[r].length!=x[r+1].length  )
       {
           str.append("<table align=center border=1 style=\"border:1px #aaaaaa solid;border-collapse:collapse;border-radius:3px;border-color:#cccccc\">");
           for ( int i= start+1; i <= r; i++)
           {
               str.append("<tr>");
               int startj = 0;
               for ( j=0; j < x[i].length; j++)
               { 
                   int k = -1;
                   int col = 1 ;
                   if (  (x[i][j] != null&&x[i][j].equals("") == false) && ( j == x[i].length-1 || x[i][j+1]!=null&&x[i][j+1].equals("") == false))
                   {
                       k = j;
                   }
                   else if ( (x[i][j] == null||x[i][j].equals("")  ) && ( j == x[i].length-1 || x[i][j+1]!=null&&x[i][j+1].equals("") == false))
                   {
                       k = startj;
                       col = j - startj +1;
                   }
                   else if ( j < x[i].length-1 &&  x[i][j] != null&& x[i][j].equals("") == false && ( x[i][j+1]==null||x[i][j+1].equals("")  )   )
                   {
                       startj = j;
                   }
                   if (k > -1)
                   {
                       str.append("<td   valign=top    ");
                       if (col > 1) {str.append(" colspan=");str.append(col);} 
                       if (x[i][k].charAt(0) == ' ' && x[i][k].charAt(x[i][k].length()-1)!=' ')
                           str.append(" align=right ");
                       else  if (x[i][k].charAt(0) != ' ' && x[i][k].charAt(x[i][k].length()-1)==' ')
                           str.append(" align=leftt ");
                       else if (x[i][k].charAt(0) == ' ' && x[i][k].charAt(x[i][k].length()-1)==' ')
                           str.append(" align=center ");
                       str.append(">");
                       str.append( x[i][k] + "</td>");
                   }
               }
               str.append("</tr>");
           }
           str.append("</table>");
           start = r;
       }
        
    }
     
    return str.toString();
    }
    
    public static String  addbreak( String str, String nora, int orgnum)
    {
        if (nora == null) nora = "[a-z]";
        else nora = "[0-9]+";
        char rorn = (str.indexOf("\n") < 0 && str.indexOf("\r") >= 0)?'\r':'\n';

        int k = 0, l = 0, j;
        String spt = null;
        String langsep = Toolbox.emsgs(orgnum,1556).replaceFirst("\\.","").replaceFirst("\\]","").replaceFirst("\\)","").replaceFirst(":","").replaceFirst("\\[","").replaceFirst("\\(","").replaceFirst("\\\\","").replaceAll("(.)", "|$1") + "]";

        if (rorn == '\n')
            spt =  ("(?i)\n(" + nora + "[ |:|\\.|\\)|\\]" + langsep + ")");
        else
            spt =  ("(?i)\r(" + nora + "[ |:|\\.|\\)|\\]" + langsep +")" );
        str = str.replaceAll(spt,   "@#@,@@,#$1");

        return str;
    }
    public static String  addbreak1(String str)
    {
        return str.replaceAll("@#@,@@,#", "<br>");
    }
    
    public static int checkorgnum(int orgnum)
    {
        int a = orgnum%65536;
        int b = orgnum>>16;
        if (a>=Toolbox.dbadmin.length) a = 0;
        if (b>=Toolbox.langs.length) b = Toolbox.langnum;
        return a + (b<<16);
    }
    public static int indexOf(String x,String y)
    {
        if (x==null || y==null || y.equals(""))return -1;
        int k = y.length(), j = 0, l= x.length();
        for(; j + k <= l; j++)
        {
            if(y.equals(x.substring(j,j+k))) return j;
        }
        return -1;
    }
    
    static public String parameter(int orgnum,  HttpServletRequest   request, String name)
    {
        
        if (name == null) {
            return null;
        }
        if (name.equals("format")) {
            String format = Toolbox.defaultParam(orgnum, request, ("format"), null);
            if (format == null) {
                format = Toolbox.defaultParam(orgnum, request, ("Format"), null);
            }
            if (format == null) {
                format = "0";
            }
            format = Toolbox.validate(format, null, 20);
            return format;
        } else if (name.equals("content")) {

            String des = Toolbox.defaultParam(orgnum, request, ("Content"), null);
            if (des == null) {
                des = Toolbox.defaultParam(orgnum, request, ("source"), null);
            }
            if (des == null) {
                des = Toolbox.defaultParam(orgnum, request, ("content"), null);
            }
            if (des == null) {
                des = Toolbox.defaultParam(orgnum, request, ("Content"), null);
            }
            if (des == null) {
                des = Toolbox.defaultParam(orgnum, request, ("Message"), null);
            }
            if (des == null) {
                des = "";
            }
            return des;
        } else if (name.equals("attach")) {
            String attach = Toolbox.defaultParam(orgnum, request, ("Attach"), null);
            if (attach == null) {
                attach = Toolbox.defaultParam(orgnum, request, ("attach"), null);
            }
            if (attach == null) {
                attach = Toolbox.defaultParam(orgnum, request, ("Attachment"), null);
            }
            if (attach == null) {
                attach = Toolbox.defaultParam(orgnum, request, ("Attached"), null);
            }
            return attach;
        } else if (name.equals("semester")) {

            String semester = Toolbox.defaultParam(orgnum, request, ("semester"), null);
            if (semester == null) {
                semester = Toolbox.defaultParam(orgnum, request, ("Semester"), null);
            }
            return semester;
        } else if (name.equals("coursetitle")) {
            String coursetitle = Toolbox.defaultParam(orgnum, request, ("coursetitle"), null);
            if (coursetitle == null) {
                coursetitle = Toolbox.defaultParam(orgnum, request, ("courseTitle"), null);
            }
            return coursetitle;
        } else if (name.equals("courseid")) {
            String course = Toolbox.defaultParam(orgnum, request, ("Subject"), null);
            if (course == null) {
                course = Toolbox.defaultParam(orgnum, request, ("CourseId"), null);
            }
            if (course == null) {
                course = Toolbox.defaultParam(orgnum, request, ("course"), null);
            }
            if (course == null) {
                course = Toolbox.defaultParam(orgnum, request, ("Course"), null);
            }
            if (course == null) {
                course = Toolbox.defaultParam(orgnum, request, ("courseid"), null);
            }
            course = Toolbox.validate(course, null, 20);
            return course;
        } else if (name.equals("sessionname")) {
            String sessionname = Toolbox.defaultParam(orgnum, request, ("sessionname"), null);
            if (sessionname == null) {
                sessionname = Toolbox.defaultParam(orgnum, request, ("Sessions"), null);
            }
            sessionname = Toolbox.validate(sessionname, null, 30);
            return sessionname;
        } else if (name.equals("assignname")) {
            String assignname = Toolbox.defaultParam(orgnum, request, ("assignname"), null);
            if (assignname == null) {
                assignname = Toolbox.defaultParam(orgnum, request, ("Assignname"), null);
            }
            if (assignname == null) {
                assignname = Toolbox.defaultParam(orgnum, request, ("Assignment"), null);
            }
            if (assignname == null) {
                assignname = Toolbox.defaultParam(orgnum, request, ("AssignTest"), null);
            }
            if (assignname == null) {
                assignname = Toolbox.defaultParam(orgnum, request, ("Name"), null);
            }
            if (assignname == null) {
                return null;
            }
            assignname = Toolbox.validate(assignname, "-_", 50);
            return assignname;
        } else if (name.equals("function")) {
            return Toolbox.defaultParam(orgnum, request, ("function"), null);
        }
        return null;
    }
    
    public static long extent(String latepermit, String uid, long dues[])
    {
        long extension = 0;
        CSVParse p = new CSVParse(latepermit.replaceFirst("^[,|;|\\|| ]+","").replaceFirst("[,|;|\\|| ]+$",""),'|', new String[]{",",";"});
        String [] r;
        while ( (r = p.nextRow()) != null)
        {
             if (r[0].equals(uid))
             {
                 float f = 0.0f;
                 try
                 {
                     f = Float.parseFloat(r[1]);
                 }
                 catch(Exception e){ }
                 if (f > 400 || f < 0) 
                     extension = 0;
                 else
                 {
                     extension = (long)(Math.round(f*3600*24));
                     if (dues[0] + extension < System.currentTimeMillis()/1000 && !latepermit.endsWith(";$"))
                     {
                         extension = 0; 
                     }
                     else
                     {
                         dues[0] = dues[0] + extension;
                     }
                 }
                 break;
             }
         }
         return extension;
    }
}

