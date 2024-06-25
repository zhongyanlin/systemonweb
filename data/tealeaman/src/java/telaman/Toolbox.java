

package telaman;

import java.io.*;
import java.net.*;
import java.util.*;
import java.util.regex.*;
import java.util.zip.*;
import javax.servlet.http.*;
import java.util.concurrent.atomic.*; 
import javax.net.ssl.*;
import java.security.*;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import static telaman.Generic.storedProc;
import static telaman.Toolbox1.codestab;
 

public class Toolbox 
{
    public static String appname = "tealeaman";  
    public static String edition =   /*"Enterprise+; Personal"; */ "Institution+";// Institution; Enterprise+;
    public static String encoding = "utf-8"; // gb2312;
    public static String lang = "en"; // zh-CN;
    public static String version = "2.2";
    public static boolean sessiondebug = false;;
    public static String bgimage = "linear-gradient(10deg,#FFFFCC,#FFFFED 10%, #FFFFFF)";
    public static String apphashgene = "121334211234341231231324354546765765sdffhgfjhgasczerrtredsv1312344dfdw3rhdsgQWERETEASA";
    public static final String WINDOWSTYLE = "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=300,height=300";
    public static String meta0 =  "<meta http-equiv=\"Pragma\" content=\"no-cache\" ><meta http-equiv=\"content-type\" content=\"text/html; charset=";
    public static HashMap<String,String> shorturls = new HashMap<>();
    public static HashMap<String,String> packurl(String str)
    {
        HashMap<String,String> a = new  HashMap<>();
        if (str == null) return a;
        String x = shorturls.get(str);
        if (x == null || x.equals("")) return a;


        String [] y = new CSVParse(x, '"', new String[]{"&"}).nextRow();
        for (String z:y)
        {
           int i = z.indexOf("=");
           if (i == -1) continue;
           a.put(z.substring(0,i), z.substring(i).replace("%26", "&"));
        }
        return a;
    }
 
    //public static byte charsize[] = null;
    private static String crosssitestr = "";
    public static String jaxhead = "<script type=\"text/x-mathjax-config\">\n  MathJax.Hub.Config({\n    extensions: [\"tex2jax.js\"],\n    jax: [\"input/TeX\", \"output/HTML-CSS\"],\n    tex2jax: {\n      inlineMath: [ ['$','$'], [\"\\\\(\",\"\\\\)\"] ],\n      displayMath: [ ['$$','$$'], [\"\\\\[\",\"\\\\]\"] ],\n      processEscapes: true\n    },\n    \"HTML-CSS\": { availableFonts: [\"TeX\"] }\n  });\n</script>";
    public static String signuplink [] = null;
    public static String instruction[] = null;
    public static int maximumAreaSize = 200000;
    private static HashMap hackers = new HashMap<>();
    //public static String redbutton = "input.RedButton {border:0px;background:url(image/GreenButton.gif);background-color:#00BBBB;color:antiquewhite;font-weight:700;width:65px}\n";
    private static Date timeobj = new Date();
    public static String timeformat[] = new String[]{"MM/DD/YY hh:mm"};
    private static String[] monthNames = new String[]{"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
    static int counter = 0;
    public static MyRSA decrsa[] = new MyRSA[2];
    public static String installpath = "";
    public static String adhost = "temp";
    public static String[] msg = null;
    public static boolean uifopen = false;
    static final String[][] dbdatatype = new String[][]{{"access", "SMALLINT", "INT", "LONG", "INTEGER", "FLOAT", "DOUBLE", "CHAR", "VARCHAR", "MEMO", "LONGCHAR"}, {"mysql", "SMALLINT", "INT", "BIGINT", "INTEGER", "FLOAT", "DOUBLE", "CHAR", "VARCHAR", "TEXT", "TEXT"}, {"mariadb", "SMALLINT", "INT", "BIGINT", "INTEGER", "FLOAT", "DOUBLE", "CHAR", "VARCHAR", "TEXT", "TEXT"}, {"oracle", "NUMBER(2)", "NUMBER(6)", "NUMBER(10)", "NUMBER(6)", "FLOAT", "DOUBLE", "CHAR", "VARCHAR", "LONG", "LONG"}, {"postgres", "INT2", "INT4", "INT8", "INT4", "FLOAT4", "FLOAT8", "CHAR", "VARCHAR", "TEXT", "TEXT"}, {"sqlserver", "SMALLINT", "INT", "BIGINT", "INTEGER", "FLOAT", "DOUBLE", "CHAR", "VARCHAR", "TEXT", "TEXT"}, {"derby", "SMALLINT", "INTEGER", "BIGINT", "INTEGER", "REAL", "DOUBLE", "CHAR", "VARCHAR", "LONG VARCHAR", "LONG VARCHAR"}, {"h2", "SMALLINT", "INT", "BIGINT", "INTEGER", "FLOAT", "DOUBLE", "CHAR", "VARCHAR", "TEXT", "TEXT"}};
     
    public static String currentSemester[] = null;//"Spring 2015";
    public static int gradeSystem[] = null;// 1;
    
    public static HashMap<String,TreeSet<String>> msgqueue = new HashMap<>(10);
    private static String tokenseeds = Toolbox.genrandomstr();
    private static AES fortoken = new AES();
    public static String fontsname[] = null;
    public static String dfserver = null;
    public static String webserver = null;
    public static int debuglevel = 1;
    public static int defaultFontSize = 16;
    
    public static int activeidletime = 1700;
    private static String[] allparams = new String[]{"rdap", "subdb", "cdrdap", "extraline", "numrows", "rsacode", "exbut", "dim", "existing", "which", "onbegin", "cellonfocus", "cellonblur", "onsave", "onsaved", "onclose", "colsfed", "sessionname", "course", "coursetitle", "grader", "assignname", "orgnum", "semester", "Semester"};
    private static final char[] puntuations = new char[]{'~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '+', ',', '?', '/', '|', '\\', '{', '}', '[', ']', '{', '}', ';', '\'', ':', '>', '<', '\"', '='};
    static final Pattern beginscript = Pattern.compile("<script[^>]*>", 2);
    static final Pattern endscript = Pattern.compile("</script>", 2);
    public static TreeSet<String> filepathinuse = new TreeSet<String>();
    public static String buildnumber = "";
    //public static String alertTime = "";
    //public static String chaptprikey = "6LcXMPkSAAAAALXkWzVNVV0thqGJ8skLKHb9uIS4";
    static public String license = ""; 
      
    static public String filehash = "";
    public static String macs = "";
    public static HashMap<String,String> tabledef = null;
    public static int initstatus = 0;
    static public String urls[];
    static public Languag locales[] = null;
    public static String downloadroutines(String language) 
    {
       urls  = new String[]{"https://edqaa.com/t/Sboot","https://zhongyanlin.github.io/site/tealeaman"+version,""};
      // urls  = new String[]{"http://localhost/tealeaman/Sboot","http://localhost/subsites/zlin/tealeaman"+version,""};
       
       //String urls[] = new String[]{"https://tealeaman.desu.edu/tealeaman/Kernel","https://tealeaman.desu.edu/subsites/zlin/tealeaman"+version};
       String str =  Toolbox.installpath +  File.separator +  "WEB-INF" +  File.separator +  "conf" +  File.separator +  "dwldurks.crp";
       if ((new File(str)).exists())
        try
        {
            File file = new File(str);
            FileInputStream sin = new FileInputStream(file);
            GZIPInputStream gzis = new GZIPInputStream(sin);
            ObjectInputStream in = new ObjectInputStream(gzis);
            Vector<String> v = (Vector<String>)in.readObject();
            sin.close();
            gzis.close();
        }catch(Exception e){}
        
       String codes = "";
       String here = "";
       try
       {
            here = InetAddress.getLocalHost().getHostAddress();
       } 
       catch(Exception e){}
       
       
       
       String z =  Toolbox.installpath;
       boolean myserver = (new File(z + File.separator + "WEB-INF" + File.separator + "conf" + File.separator + Toolbox.langs[Toolbox.langnum] + ".txt")).exists();
       
       if (myserver)
        {
            initstatus = 0;
            openuif(Toolbox.installpath, null);
            return "";
        }
       else if ( (new File(  Toolbox.installpath + File.separator + "WEB-INF" + File.separator + "routine" + File.separator  + Toolbox.appname + Toolbox.version +  "msg.crp") ).exists())
       {
            try
            {
            String   folder = Toolbox.installpath + File.separator + "WEB-INF" + File.separator + "routine" + File.separator;
            File file = new File(folder +  Toolbox.appname + Toolbox.version +    "msg.crp");
            FileInputStream sin = new FileInputStream(file);
            GZIPInputStream gzis = new GZIPInputStream(sin);
            ObjectInputStream in = new ObjectInputStream(gzis);
            String [][] msgs0 = (String [][])in.readObject();
            in.close();
            sin.close(); 
            msgs = new String[encodings.length][];
            for (int i=0; i < msgs0.length; i++)
            {
                String encoding = msgs0[i][0];
                int k=0;
                for(; k < encodings.length; k++)
                {
                    if (encodings[k].equals(encoding))break;
                }
                if (k < encodings.length)
                {
                    msgs[k] =  msgs0[i]; 
                }
            }
            int k = 0;
            for(; k < encodings.length; k++)
            {
                if (msgs[k] != null) break;
            }
            if ( k < encodings.length)
            {
                for(int j=0; j < encodings.length; j++)
                {
                    if (msgs[j] == null) msgs[j] = msgs[k];
                }
            }
            Toolbox.uifopen = true;
            msg = msgs[langnum];
           }catch(Exception e){}
            return "";
       }
        else if (license==null || license.equals(""))
        {
            println(0, "\n\nGet a license from " + urls[0].replaceFirst("Sboot", "DataForm?rdap=slicense&product="+appname + "&version=" + version +"&edition=" + edition.replaceFirst("\\+","%2B") + "&platform=" + System.getProperty("os.name").replaceAll(" .*$","").toLowerCase() + "&language=" + language));
            println(0, "Get a license from " + urls[0].replaceFirst("Sboot", "DataForm?rdap=slicense&product="+appname + "&version=" + version +"&edition=" + edition.replaceFirst("\\+","%2B") + "&platform=" + System.getProperty("os.name").replaceAll(" .*$","").toLowerCase() + "&language=" + language));
            println(0, "Get a license from " + urls[0].replaceFirst("Sboot", "DataForm?rdap=slicense&product="+appname + "&version=" + version +"&edition=" + edition.replaceFirst("\\+","%2B") + "&platform=" + System.getProperty("os.name").replaceAll(" .*$","").toLowerCase() + "&language=" + language));
            println(0, "Get a license from " + urls[0].replaceFirst("Sboot", "DataForm?rdap=slicense&product="+appname + "&version=" + version +"&edition=" + edition.replaceFirst("\\+","%2B") + "&platform=" + System.getProperty("os.name").replaceAll(" .*$","").toLowerCase() + "&language=" + language));
            println(0, "Get a license from " + urls[0].replaceFirst("Sboot", "DataForm?rdap=slicense&product="+appname + "&version=" + version +"&edition=" + edition.replaceFirst("\\+","%2B") + "&platform=" + System.getProperty("os.name").replaceAll(" .*$","").toLowerCase() + "&language=" + language));
            return "";
        }
       
       try
        {
             File f = new File(Toolbox.installpath);
             codes = Sha1.sha1dir(f, null);
             filehash = codes;
             urls[2] = filehash;
        }
        catch (Exception e)
        {
           println(0,"Collapsed Files"); return "";  
        }
        
     
        javax.net.ssl.HttpsURLConnection.setDefaultHostnameVerifier
        ( 
                new javax.net.ssl.HostnameVerifier()
                { 
                    public boolean verify(String hostname, javax.net.ssl.SSLSession sslSession) 
                    { 
                        //if (hostname.equals("localhost") || hostname.equals("tealeaman.desu.edu")) 
                        { return true; 
                        } 
                         
                    }
               }
        ) ;
        macs = Sha1.hash(Toolbox.macs);
        String str1 = "";
        String t = "" + System.currentTimeMillis();
        String hash = t + Sha1.hash(t + codes);// + rsa.toPublicString();
        String err =    "No system routine has been downloaded. Check Internet connection";
        String urlist[] =  new String[2]; 
        String dir = Toolbox.installpath + File.separator + "WEB-INF" + File.separator + "conf" + File.separator;
        File fdir = new File(dir);
        String[] list = fdir.list();
        String objs[] = new String[]{ "msg", "rou", "tbl", "upd"};
        for (int k = 0; k < 3; k++) 
        {
            String object = objs[k];
            String [] yy = new String[2];
            yy[0] = urls[0] + "?act=routine&object=" + object +  "&license=" + license + "&product=" + appname + "&language=" + language + "&hash=" + hash + "&com=" + macs + "&version=" + version + "&build=" + Toolbox.buildnumber + "&url=" + here + "&edition=" + edition.replaceFirst("\\+","%2B");
            yy[1] = urls[1] +  object + ".zip";
            int i = 0; //(here.equals(""))?4:0;
            int j = 0;
            boolean isfile = false;
            while ( i < 3) 
            {
                HttpURLConnection con = null;
                HttpsURLConnection cons = null;
                try 
                {
                    InputStream sin = null;
                    if (i < 2 ) 
                    {
                        int TIMEOUT_VALUE = 4000;
                        java.net.URL url = new java.net.URL(yy[i]);
                        String there = url.getHost();
                        if (urls[i].indexOf("https:")>=0)
                        {
                            cons = (HttpsURLConnection) url.openConnection();
                            cons.setConnectTimeout(TIMEOUT_VALUE);
                            cons.setReadTimeout(TIMEOUT_VALUE);
                            cons.setRequestMethod("GET");
                            cons.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US; rv:1.9.1.2) Gecko/20090729 Firefox/3.5.2 (.NET CLR 3.5.30729)");
                            cons.setDoInput(true);
                            cons.setDoOutput(true);
                            cons.setReadTimeout(0);
                            cons.connect();
                
                            int cd = cons.getResponseCode();
  
                            if (cd == HttpsURLConnection.HTTP_OK) 
                            {
                                sin = url.openStream();
                                initstatus = 1;
                            } 
                            else 
                            {
                                err += cd;
                            }
                        }
                        else
                        {
                            con = (HttpURLConnection) url.openConnection();
                            con.setConnectTimeout(TIMEOUT_VALUE);
                            con.setReadTimeout(TIMEOUT_VALUE);
                            con.setRequestMethod("GET");
                            con.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US; rv:1.9.1.2) Gecko/20090729 Firefox/3.5.2 (.NET CLR 3.5.30729)");
                            con.setDoInput(true);
                            con.setDoOutput(true);
                            con.setReadTimeout(0);
                            con.connect();
                            int cd = con.getResponseCode();
                            if (cd == HttpURLConnection.HTTP_OK) 
                            {
                                sin = url.openStream();
                                initstatus = 1;
                            } 
                            else 
                            {
                                err += cd;
                            }
                        }
                         
                    } 
                    else if (i>1 && !urls[2].equals(filehash)) 
                    {
                        initstatus = 4;
                        sin = null;
                        
                    }
                    else if (i>1 && urls[2].equals(filehash)) 
                    {
                        initstatus = 3;
                        isfile = true;
                        sin = null;
                        if (!object.equals("tbl"))
                        try 
                        {
                            sin = new FileInputStream(new File(dir, object + ".crp"));
                           
                        } catch (Exception e) 
                        {
                            initstatus = 4;
                        }
                    }
                 
                    if (sin == null && object.equals("tbl"))
                    {
                         if (con != null) {  con.disconnect();  }
                         if (cons != null) {  cons.disconnect();  }
                         break;
                    }
                    else if (sin != null) 
                    {
                         
                        GZIPInputStream gzis = new GZIPInputStream(sin);
                        ObjectInputStream in = new ObjectInputStream(gzis);
                        if (object.equals("msg")) 
                        {
                            String [][] vmsg;
                            if ((vmsg = (String[][]) in.readObject()) == null) 
                            {
                                Toolbox.println(0, "No interface phrases");
                            } 
                            else if (vmsg.length == 1) 
                            {
                                String er = ((String[]) vmsg[0]) [0];
                                long l = -1;
                                try 
                                {
                                    l = Long.parseLong(er);
                                    Toolbox.println(0, "The system clock time on your server is far from right. Please correct it or the software will not run. Stop this process, correct clock and restart the process.  It is now " + (new java.util.Date(l)).toString());
                                } catch (Exception e) 
                                {
                                    Toolbox.println(0, "Error:" + er);
                                }
                            } 
                            else 
                            {
                                if (Toolbox.msgs == null) 
                                {
                                    Toolbox.msgs = vmsg;
                                }
                                println(0, "Read  interface phrases, length=" + Toolbox.msgs[0].length);
                            }
                        } 
                        else  if (object.equals("tbl") && isfile == false) 
                        {
                                HashMap<String,String> h0  = (HashMap<String,String>) in.readObject();
                                String x;
                                if (h0!=null && (x = (String) h0.get("0")) != null) 
                                {
                                    h0.remove("0");
                                    Toolbox.println(0, x);
                                }
                                else if (h0!=null)
                                    tabledef = h0;
                        } 
                        else if (object.equals("rou"))
                        {
                            if (Generic.storedProc == null)
                            {
                                HashMap h0  = (HashMap) in.readObject();
                                String x;
                                if ((x = (String) h0.get("0")) != null) 
                                {
                                    h0.remove("0");
                                    Toolbox.println(0, x);
                                    long l = -1;
                                    try 
                                    {
                                        l = Long.parseLong(x);
                                        Toolbox.println(0, "The system clock time on your server is far from right. Please correct it or the software will not run. Stop this process, correct clock and restart the process.  It is now " + (new java.util.Date(l)).toString());
                                    } catch (Exception e) 
                                    {
                                        Toolbox.println(0, "Error:" + x);
                                    }
                                }
                                else 
                                    Generic.storedProc = h0;
                            } 
                            else 
                            {
                                 
                                HashMap ht = (HashMap) in.readObject();
                               Set<String> e = ht.keySet();
                               for (String nm: e) 
                                {
                                    String x = (String) ht.get(nm);
                                    if (x.equals("0")) 
                                    {
                                        x = (String) ht.get(x);
                                        long l = -1;
                                        try {
                                            l = Long.parseLong(x);
                                            Toolbox.println(0, "The system clock time on your server is far from right. Please correct it or the software will not run. Stop this process, correct clock and restart the process.  It is now " + (new java.util.Date(l)).toString());
                                        } catch (Exception e1) {
                                            Toolbox.println(0, "Error:" + x);
                                        }
                                        break;
                                    }
                                    Webform d = (Webform)(ht.get(x));
                                   // if (d.query != null && !d.format.equals("Update") && !d.format.equals("Web"))
                                   // d.simplify(false);
                                    Generic.storedProc.put(x, d);
                                }

                                ht.clear();
                            }
                            Toolbox.println(0, "Read routines, size=" + Generic.storedProc.size());
                        }
                        sin.close();
                        if (con != null) {  con.disconnect();  }
                        if (cons != null) {  cons.disconnect();  }
                        break;
                    }
                  
                } 
                catch(Exception e){  }
                finally 
                {
                    if (con != null) {  con.disconnect();  }
                    if (cons != null) {  cons.disconnect();  }
                }
                 
                i++;
                
                
            }
        }
       
        return err;
    }
    
    public static boolean hasiconnection()
    {
        
        HttpURLConnection con  = null;
        boolean b= false;
    try {
        
        URL u = new URL("http://www.udel.edu/");
        con = (HttpURLConnection) u.openConnection();
        con.setConnectTimeout(5000);
        con.setRequestMethod("GET");
        con.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US; rv:1.9.1.2) Gecko/20090729 Firefox/3.5.2 (.NET CLR 3.5.30729)");
        con.setDoInput(true);
        con.setDoOutput(true);
        con.setReadTimeout(5000);
        con.connect();
        int code = con.getResponseCode();
       
        b = (code==HttpURLConnection.HTTP_OK);
    } catch (MalformedURLException e) {
       
    } catch (IOException e) {
        
    } 
    finally {
        if (con != null) {
            con.disconnect();
        }
    }
    return b;
    
    }
    
    public static void hacker(String sid, String addr, String uid) {
        Toolbox.hackers.put(sid, addr + uid);
    }

    public static String dimloc(int width, int height) {
        return "var orgnum0=0;";
    }

    public static String dimloc1(int width, int height) {
        return "function sz(){\n var winW = document.body.offsetWidth; var winH = document.body.offsetHeight; if (" + width + "< winW && " + height + "< winH ) return;\n    var tabhei=" + height + ";\nvar tablen = " + width + ";\nvar sheight = screen.height;\nvar swidth = screen.width;\nif (tabhei > sheight || tabhei == -1) tabhei = sheight;\n" + "var wd = (swidth - tablen)/2;\nif (wd < 0) wd = 0;\nvar het = (sheight - tabhei)/2;\nwindow.moveTo( wd, het);\nwindow.resizeTo( tablen, tabhei);\n}\n";
    }

    public static Date parseDate(String ds) {
        int i;
        String[] ms = new String[]{"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
        String mnstr = ds.substring(0, 3);
        for (i = 0; !(i >= 12 || ms[i].equals(mnstr)); ++i) {
        }
        if (i == 12) {
            String[] dt;
            if ((dt = ds.split("[ ]+")).length != 2) {
                return null;
            }
            String da = dt[0];
            String ts = dt[1];
            String[] mdy = da.split("/");
            String[] hms = ts.split(":");
            try {
                int month = Integer.parseInt(mdy[0].replaceFirst("^0", "")) - 1;
                int day = Integer.parseInt(mdy[1].replaceFirst("^0", ""));
                int year = Integer.parseInt(mdy[2].replaceFirst("^0", ""));
                int hr = Integer.parseInt(hms[0].replaceFirst("^0", ""));
                int mn = Integer.parseInt(hms[1].replaceFirst("^0", ""));
                int sec = Integer.parseInt(hms[2].replaceFirst("^0", ""));
                if (year > 2000) {
                    year-=1900;
                } else if (year < 100) {
                    year+=100;
                }
                return new Date(year, month, day, hr, mn, sec);
            }
            catch (Exception e) {}
        } else {
            String[] dt;
            int month = i;
            if ((dt = ds.split("[ |,]+")).length < 4) {
                return null;
            }
            try {
                int day = Integer.parseInt(dt[1].replaceFirst("^0", ""));
                int year = Integer.parseInt(dt[2].replaceFirst("^0", ""));
                if (year > 2000) {
                    year-=1900;
                } else if (year < 100) {
                    year+=100;
                }
                String[] hms = dt[3].split(":");
                int hr = Integer.parseInt(hms[0].replaceFirst("^0", ""));
                int mn = Integer.parseInt(hms[1].replaceFirst("^0", ""));
                int sec = Integer.parseInt(hms[2].replaceFirst("^0", ""));
                return new Date(year, month, day, hr, mn, sec);
            }
            catch (Exception e) {
                // empty catch block
            }
        }
        return null;
    }

    public static String dimloc() {
        return "var tabhei=screen.height;\nvar tablen = screen.width;\nvar sheight = screen.height;\nvar swidth = screen.width;\nwindow.moveTo( 0, 0);  \nwindow.resizeTo( tablen, tabhei);\n";
    }
    public static String timestr(long l, String tf) 
    {
        if (l == -1) 
        {
            return "";
        }
        Date timeobj = new Date(l * 1000);
        return tf.replaceFirst("MMM", Toolbox.monthNames[timeobj.getMonth()]).replaceFirst("MM", Toolbox.padd(timeobj.getMonth() + 1)).replaceFirst("DD", Toolbox.padd(timeobj.getDate())).replaceFirst("YYYY", "" + (timeobj.getYear() + 1900)).replaceFirst("YY", Toolbox.padd(timeobj.getYear() % 100)).replaceFirst("hh", Toolbox.padd(timeobj.getHours())).replaceFirst("mm", Toolbox.padd(timeobj.getMinutes())).replaceFirst("ss", Toolbox.padd(timeobj.getSeconds()));
    }
    public static String timestr(long l) 
    {
        return Toolbox.timestr(l, Toolbox.timeformat[0]);
    }
    public static String timestr() 
    {
        return Toolbox.timestr(System.currentTimeMillis() / 1000);
    }

    public static String timestr(String tf) 
    {
        return Toolbox.timestr(System.currentTimeMillis() / 1000, tf);
    }
     

   

    public static String padd(int l) {
        if (l < 10) {
            return "0" + l;
        }
        return "" + l;
    }

    

    private static int parseMonth(String str) {
        int j;
        for (j = 0; !(j >= 12 || Toolbox.monthNames[j].equals(str)); ++j) {
        }
        return j + 1;
    }

    public static long parseTime(String str) {
        return Toolbox.parseTime(str, Toolbox.timeformat[0]);
    }

    public static long parseTime(String str, String tf) {
        if (tf == null) {
            return -1;
        }
        if (str == null) {
            return -1;
        }
        str = str.replaceFirst("^[ ]+", "").replaceFirst("[ ]+$", "");
        String[] strs = str.split("[^a-zA-Z0-9]");
        String[] timeparts = tf.split("[^a-zA-Z]");
        Date timeobj = new Date();
        if (timeparts.length != strs.length) {
            return -1;
        }
        boolean hasm = false;
        boolean hasd = false;
        boolean hasy = false;
        boolean hasmi = false;
        boolean hass = false;
        boolean hash = false;
        for (int i = 0; i < strs.length; ++i) {
            int m;
            if (timeparts[i].equals("MMM")) {
                if ((m = Toolbox.parseMonth(strs[i])) == 13) {
                    return -1;
                }
                 
                timeobj.setMonth(m);
                hasm = true;
                continue;
            }
            if (timeparts[i].equals("MMDD")) {
                try {
                    m = Integer.parseInt(strs[i].substring(0,2).replaceFirst("^0",""));
                     
                    timeobj.setMonth(m - 1);
                    m = Integer.parseInt(strs[i].substring(2).replaceFirst("^0",""));
                   
                    timeobj.setDate(m);
                    hasm = true;
                    hasd = true;
                    continue;
                }
                catch (Exception e) {
                    return -1;
                }
            }
            if (timeparts[i].equals("MM")) {
                try {
                    m = Integer.parseInt(strs[i]);
                    timeobj.setMonth(m - 1);
                    
                    hasm = true;
                    continue;
                }
                catch (Exception e) {
                    return -1;
                }
            }
            if (timeparts[i].equals("DD")) {
                try {
                    m = Integer.parseInt(strs[i]);
                    timeobj.setDate(m);
                    hasd = true;
                    continue;
                }
                catch (Exception e) {
                    return -1;
                }
            }
            if (timeparts[i].equals("YY")) {
                try {
                    m = Integer.parseInt(strs[i]);
                    if (m < 100) {
                        m+=2000;
                    }
                     timeobj.setYear(m - 1900);
                    hasy = true;
                    continue;
                }
                catch (Exception e) {
                    return -1;
                }
            }
            if (timeparts[i].equals("YYYY")) {
                try {
                    m = Integer.parseInt(strs[i]);
                    timeobj.setYear(m - 1900);
                    hasy = true;
                    continue;
                }
                catch (Exception e) {
                    return -1;
                }
            }
            if (timeparts[i].equals("hh")) {
                try {
                    m = Integer.parseInt(strs[i]);
                    timeobj.setHours(m);
                    hash = true;
                    continue;
                }
                catch (Exception e) {
                    return -1;
                }
            }
            if (timeparts[i].equals("mm")) {
                try {
                    m = Integer.parseInt(strs[i]);
                     timeobj.setMinutes(m);
                    hasmi = true;
                    continue;
                }
                catch (Exception e) {
                    return -1;
                }
            }
            if (!timeparts[i].equals("ss")) continue;
            try {
                m = Integer.parseInt(strs[i]);
                timeobj.setSeconds(m);
                hass = true;
                continue;
            }
            catch (Exception e) {
                return -1;
            }
        }
        if (!hasmi) {
            timeobj.setMinutes(0);
        }
        if (!hash) {
            timeobj. setHours(0);
        }
        if (!hass) {
            timeobj. setSeconds(0);
        }
        return  timeobj.getTime() / 1000;
    }

    public static synchronized int getCounter() {
        int i = Toolbox.counter;
        Toolbox.counter = (Toolbox.counter + 1) % 10000;
        return i;
    }

    public static String errorcolor(String err) {
        int i = 0;
        String color = "yellow";
        String error = err;
        if (err != null && (i = err.indexOf(":")) > 0) {
            color = err.substring(0, i);
            error = err.substring(i + 1);
        }
        return "<font color=" + color + ">" + error + "</font>";
    }

    public static String assignTitle(String str, int orgnum, CachedStyle cachedstyle) {
        return "<center><table BORDER=0 COLS=1 WIDTH=100% BGCOLOR=" + cachedstyle.IBGCOLOR + "><tr ><td  ALIGN=CENTER style=\"font-size:24px;font-weight:bold;color:white\"><font  face=\"" + (Toolbox.emsgs(orgnum, 1497).split(";")[3]) +  "\">" + str + "</font></td></tr></table></center>\n";
    }

    public static String logtitle(String str, int len) {
        return "<link rel=StyleSheet type=text/css href=style.css>" + Toolbox.titlehelp(str, "outset").replaceFirst("&vellip;","");
    }

    public static String titlehelp(String str, String cls) {
        String xx = "<div id=\"google_translate_element\" style=\"margin:0px 0px 0px 0px\"></div>";
        return "<table cellspacing=0 cellpadding=0 width=100% border=0 align=center class=" + cls + " ><tr height=48><td valign=middle align=center><table width=100%  align=center><tr>" + (cls.equals("outset1") ? "" : "<td  id=homeico width=36 valign=middle align=center  onclick=gohome()></td>") + "<td  align=center><div class=forcurve1 style=width:" +(cls.equals("outset1")?216:180) + "px;font-family:inherit;overflow:hidden;white-space:nowrap;hyphens:none;  id=titlediv  onclick=qrlink()>" + str + "</div></td><td  onclick=actionmenu(this) align=center valign=middle style=\"font-size:20px;color:white;padding:0px\"  id=dotmen0>"
                + "&vellip;</td></tr></table></td></tr></table>";
    }

    public static String title(String str) {
        String xx = "<div id=\"google_translate_element\" style=\"margin:0px 0px 0px 0px\"></div>";
        return "<table  cellspacing=0 cellpadding=0 width=100%    align=center ><tr><td width=\"2px\"></td><td class=outset2 valign=middle align=center style=\"border:1px outset\"><table width=100%  class=outset2 ><tr><td  id=homeico  width=36 valign=middle   onclick=gohome()></td><td  align=center><div class=forcurve1  onclick=qrlink()  id=titlediv><NOBR>" + str + "</NOBR></div></td><td  onclick=actionmenu(this) valign=middle  align=center  width=20  style=\"font-size:20px;color:white;padding:0px\" id=dotmen0>&vellip;</td></tr></table></td><td width=\"3px\"></td></tr></table>";
    }

    public static String title(String str, int col) {
        String xx = "<div id=\"google_translate_element\" style=\"margin:0px 0px 0px 0px\"></div>";
        return "<tr align=center ><td colspan=" + col + " width=100% valign=middle style=\"border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;\"><table  width=100% cellspacing=0 cellpadding=0><tr align=center  ><td width=2px></td><td  class=outset2 style=\"border-width:1px\" valign=middle align=center><table width=100% ><tr><td  id=homeico width=36 valign=middle  onclick=gohome()></td><td align=center><div class=forcurve1 onclick=qrlink() id=titlediv><NOBR>" + str + "</NOBR></div></td><td width=4px></td><td  onclick=actionmenu(this) valign=middle width=20  align=center  style=\"font-size:20px;color:white;padding:0px\"  id=dotmen0>&vellip;</td></tr></table></td></tr></table></td></tr>";
    }

    public static String addlink(String str, boolean show) {
        String a = str.replaceAll("<", "&lt;");
        a = a.replaceAll(">", "&gt;");
        a = a.replaceAll(" ", "&nbsp;");
        a = a.replaceAll("\n", "<br>");
        a = !show ? a.replaceAll("http:\\S+\\s?", "<a href=$1 target=\"blank\">...<\\/a>") : a.replaceAll("http:\\S+\\s?", "<a href=$1 target=\"blank\">$1<\\/a>");
        return a;
    }

    public static String delnull(String s) {
        if (s == null || s.equals("")) {
            return "&nbsp;";
        }
        return s.toString();
    }

    public static String boolstr(int i) {
        if (i == 0) {
            return "No";
        }
        return "Yes";
    }

    public static String HTMLfilter(String message) {
        if (message == null) {
            return null;
        }
        char[] content = new char[message.length()];
        message.getChars(0, message.length(), content, 0);
        StringBuffer result = new StringBuffer(content.length + 50);
        StringBuffer buf = new StringBuffer(50);
        boolean sp = false;
        int N = 7;
        int s = 0;
        int v;
        String http = "";
        buf.setLength(0);
        for (int i = 0; i < content.length; ++i) {
            switch (content[i]) {
               
                case ' ': {
                    if (sp) {
                        result.append("&nbsp;");
                        break;
                    }
                    if (s > 0 && s < N) {
                        result.append(http.substring(0, s));
                    } else if (s == N) {
                        result.append("<a href=\"" + http + buf + "\" target=_blank>" + http + buf + "</a>");
                        buf.setLength(0);
                    }
                    s = 0;
                    result.append(" ");
                    sp = true;
                    break;
                }
                case '\n': {
                    if (s > 0 && s < N) {
                        result.append(http.substring(0, s));
                    } else if (s == N) {
                        result.append("<a href=\"" + http + buf + "\" target=_blank>" + http + buf + "</a>");
                        buf.setLength(0);
                    }
                    s = 0;
                    result.append("<br>");
                    break;
                }
                case '<': {
                    if (s > 0 && s < N) {
                        result.append(http.substring(0, s));
                    } else if (s == N) {
                        result.append("<a href=\"" + http + buf + "\" target=_blank>" + http + buf + "</a>");
                        buf.setLength(0);
                    }
                    s = 0;
                    result.append("&lt;");
                    break;
                }
                case '>': {
                    if (s > 0 && s < N) {
                        result.append(http.substring(0, s));
                    } else if (s == N) {
                        result.append("<a href=\"");
                        result.append(http);
                        result.append(buf);
                        result.append("\" target=_blank>");
                        result.append(http);
                        result.append(buf);
                        result.append("</a>");
                        buf.setLength(0);
                    }
                    s = 0;
                    result.append("&gt;");
                    break;
                }
                case '&': {
                    if (s == 0) {
                        result.append("&amp;");
                    }
                    if (s > 0 && s < N) {
                        result.append(http.substring(0, s));
                        result.append("&amp;");
                        s = 0;
                        break;
                    }
                    buf.append('&');
                    break;
                }
                case '\"': {
                    if (s > 0 && s < N) {
                        result.append(http.substring(0, s));
                    } else if (s == N) {
                        result.append("<a href=\"");
                        result.append(http);
                        result.append(buf);
                        result.append("\" target=_blank>");
                        result.append(http);
                        result.append(buf);
                        result.append("</a>");
                        buf.setLength(0);
                    }
                    s = 0;
                    result.append("&quot;");
                    break;
                }
                case 'h': {
                    if (s == 0) {
                        s = 1;
                        break;
                    }
                    if (s > 0 && s < N) {
                        result.append(http.substring(0, s));
                        s = 1;
                        break;
                    }
                    buf.append('h');
                    break;
                }
                case '/': 
                case 't': {
                    v = (content[i] == '/') ? 5 : 1;
                    if (s == 0) {
                        result.append(content[i]);
                    }
                    if (s == v || s == v + 1) {
                        if (++s != 7) break;
                        buf.setLength(0);
                        break;
                    }
                    if (s > 0 && s < N) {
                        result.append(http.substring(0, s));
                        result.append(content[i]);
                        s = 0;
                        break;
                    }
                    buf.append(content[i]);
                    break;
                }
                case ':': 
                case 'p': {
                    v = content[i] == ':' ? 4 : 3;
                    if (s == 0) {
                        result.append(content[i]);
                        break;
                    }
                    if (s == v) {
                        ++s;
                        break;
                    }
                    if (s > 0 && s < N) {
                        result.append(http.substring(0, s));
                        result.append(content[i]);
                        s = 0;
                        break;
                    }
                    buf.append(content[i]);
                    break;
                }
                default: {
                    if (s == 0) {
                        result.append(content[i]);
                        break;
                    }
                    if (s > 0 && s < N) {
                        result.append(http.substring(0, s));
                        result.append(content[i]);
                        s = 0;
                        break;
                    }
                    buf.append(content[i]);
                }
            }
            if (content[i] == ' ') continue;
            sp = false;
        }
        if (s > 0 && s < N) {
            result.append(http.substring(0, s));
        } else if (s == N) {
            result.append("<a href=\"" + http + buf + "\" target=_blank>" + http + buf + "</a>");
        }
        return result.toString();
    }

    public static boolean isParam(String str) {
        str = str.trim();
        double dd = 0.0;
        if (str.equals("this")) {
            return false;
        }
        try {
            dd = Double.parseDouble(str);
            return false;
        }
        catch (Exception e) {
            if (str.charAt(0) == '\'' || str.charAt(0) == '\"') {
                return false;
            }
            return true;
        }
    }

    public static String encrypt(String text, String keys,int encodingorder) {
        return MyRSA.encryptString(text, keys,encodingorder);
    }

    public static String decrypt(String text,int orgnum) {
        return Toolbox.decrsa[Toolbox.locales[orgnum>>16].charsize-1].decryptString(text,orgnum>>16);
    }
    static public MyRSA initrsa =  new MyRSA("121696436539504732923421454038842595463,86926026099646237785791231446564457143,7,7890425673999491713,15423304339652863751,121696436539504732900107724025190240000,128,7",(byte)1);
           
    public static String getInstallPath() {
        if (Toolbox.installpath.equals("")) {
            File f = new File("a");
            Toolbox.installpath = f.getAbsolutePath();
        }
        return Toolbox.installpath;
    }
    public static String copyright[] = null;// "Systems on Web, Inc. All rights reserved";
    public static String sponsor(int orgnum, int row, int width) 
    {
        return "<table  id=cpright width=100% align=center cellspacing=0 cellpadding=2 class=outset ><tr><td align=center width=100% ><img src=image/tm.png width=210px name=trademark onclick=\"open('http://www.systemsonweb.com')\"></td></tr><tr><td><div style=font-size:12px;color:#DDCC11;white-space:nowrap;hyphens:none; align=center>" + copyright[orgnum>>16] + "</div></td></tr></table>";
    }

    public static String fields(String str, int orgnum, CachedStyle cachedstyle) {
        return "<td valign=top style=\"border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;\"><table width=100% ><tr  with=100% ><td width=100% style=\"background:linear-gradient(" + cachedstyle.IBGCOLOR + "," + Toolbox.headercl(cachedstyle.BBGCOLOR) + ")\" ><font color=#DDCC11><b><NOBR>" + str + "</NOBR></b></font></td></tr></table></td>";
    }

    public static void main(String[] args) {
        String s = " dsfsdfs s http://aa ";
        s = Toolbox.HTMLfilter(s);
    }

    public static synchronized String setCoding(String language, String approot) {
        
        //Toolbox.encoding = encode;
        //Toolbox.uifopen = false;
        //Toolbox.println(0, "Set Encoding=" + Toolbox.encoding + ", encoding#=" + encodings.length);
        //String err = Toolbox.makejs(null);
       
        /*
        for (int kk=0; kk < encodings.length; kk++)
        {
            
             if (msgs[kk]!=null)
             for (int i = 0; i <  msgs[kk].length; ++i) 
             {
                if ( msgs[kk][i] == null) continue; 
                try {
                    String tmp = new String(msgs[kk][i].getBytes(), Toolbox.encodings[kk]);
                    if (tmp.charAt(0) <= '\u0100') continue;
                     charsize[kk] = 2;
                     break;
                }catch (Exception e) {}
             }
        }
        */
        Calendar calendar = Calendar.getInstance();
        int y = calendar.get(Calendar.YEAR);
        for (int kk=0; kk < msgs.length; ++kk) 
        {
            copyright[kk] = "2004-" + y + " " + emsgs(kk<<16,1236);
        }
        return "";
    }

    static boolean isNumericType(String dbms, String type) {
        int i;
        int j;
        if (dbms == null) {
            return false;
        }
        for (j = 0; j < Toolbox.dbdatatype.length && dbms.toUpperCase().indexOf(Toolbox.dbdatatype[j][0]) < 0; ++j) {
        }
        if (j == Toolbox.dbdatatype.length) {
            return false;
        }
        for (i = 1; !(i >= 8 || type.toUpperCase().equals(Toolbox.dbdatatype[j][i])); ++i) {
        }
        return i < 8;
    }

    public static String allDatatypes(String dbms) {
        int j;
        if (dbms == null) {
            return "";
        }
        String ans = "";
        for (j = 0; j < Toolbox.dbdatatype.length && dbms.toLowerCase().indexOf(Toolbox.dbdatatype[j][0]) < 0; ++j) {
        }
        if (j == Toolbox.dbdatatype.length) {
            return "";
        }
        for (int i = 1; i < Toolbox.dbdatatype[j].length; ++i) {
            if (!ans.equals("")) {
                ans = ans + ",";
            }
            ans = ans + Toolbox.dbdatatype[j][i];
        }
        return ans;
    }

    public static int begintranslate(JDBCAdapter source) {
        return Toolbox.begintranslate(source.dbms);
    }

    public static int begintranslate(String sourcedbms) {
        int sourcedbmsindex;
        if (sourcedbms == null) {
            return -1;
        }
        for (sourcedbmsindex = 0; !(sourcedbmsindex >= Toolbox.dbdatatype.length || sourcedbms.toLowerCase().equals(Toolbox.dbdatatype[sourcedbmsindex][0].toLowerCase())); ++sourcedbmsindex) {
        }
        if (sourcedbmsindex == Toolbox.dbdatatype.length) {
            sourcedbmsindex = -1;
        }
        return sourcedbmsindex;
    }

    public static String translate(String source, int sourcedbmsindex, int targetdbmsindex) {
        int j;
        if (sourcedbmsindex == targetdbmsindex || sourcedbmsindex == -1 || targetdbmsindex == -1 || source == null) {
            return source;
        }
        for (j = 1; !(j >= Toolbox.dbdatatype[0].length || source.toLowerCase().equals(Toolbox.dbdatatype[sourcedbmsindex][j].toLowerCase())); ++j) {
        }
        if (j == Toolbox.dbdatatype[0].length) {
            return source;
        }
        return Toolbox.dbdatatype[targetdbmsindex][j];
    }

    public static String translateStr(String source, int sourcedbmsindex, int targetdbmsindex) {
        int j;
        if (sourcedbmsindex == targetdbmsindex || sourcedbmsindex == -1 || targetdbmsindex == -1 || source == null) {
            return source;
        }
        String t = "";
        String word = "";
        boolean ab = source.charAt(j = 0) <= 'Z' && source.charAt(j) >= 'A' || source.charAt(j) <= 'z' && source.charAt(j) >= 'a';
        for (j = 0; j < source.length(); ++j) {
            if (ab) {
                if (source.charAt(j) <= 'Z' && source.charAt(j) >= 'A' || source.charAt(j) <= 'z' && source.charAt(j) >= 'a') {
                    word = word + source.charAt(j);
                    continue;
                }
                t = t + Toolbox.translate(word, sourcedbmsindex, targetdbmsindex);
                word = "" + source.charAt(j);
                ab = false;
                continue;
            }
            if (source.charAt(j) <= 'Z' && source.charAt(j) >= 'A' || source.charAt(j) <= 'z' && source.charAt(j) >= 'a') {
                t = t + word;
                word = "" + source.charAt(j);
                ab = true;
                continue;
            }
            word = word + source.charAt(j);
        }
        return t + word;
    }

    public static boolean isnumeric(String dt, String dbms) {
        int j;
        int sind;
        for (sind = 0; !(sind >= Toolbox.dbdatatype.length || dbms.toLowerCase().equals(Toolbox.dbdatatype[sind][0].toLowerCase())); ++sind) {
        }
        for (j = 1; !(j >= Toolbox.dbdatatype[0].length || dt.toLowerCase().equals(Toolbox.dbdatatype[sind][j].toLowerCase())); ++j) {
        }
        return j <= 6;
    }

    
    public static String c2c(String str, int orgnum) {
        if (str == null || Toolbox.encodings[orgnum>>16].equals("utf-8")) {
            return str;
        }
        try {
            str = new String(str.getBytes("utf-8"), Toolbox.encodings[orgnum>>16]);
        }
        catch (Exception e) {
            // empty catch block
        }
        return str;
    }

    public static String defaultParam(int orgnum,HttpServletRequest request, String vn, String defaultv) {
        
        String x = request.getParameter(vn);
        if (x == null)
        {
            if ( (x = request.getParameter("code6b"))!=null  )
            {
                try
                { 
                    x = Unicode6b.decode(x);
                    String [] y = (new CSVParse(x, '\'', new String[]{"&"})).nextRow();
                    for (String z:y)
                    {
                         if (z.indexOf(vn + "=") == 0)
                         {
                             return z.substring(vn.length()+1);
                         }
                    }
                }catch(Exception e){}
            } 
            if (vn.equals("wcds") && defaultv == null) {
                return "";
            }
            return defaultv;
        }
        if (request.getMethod().equals("GET")) 
        {
            x = vn.equals("wcds") ? "" : Toolbox.c2c(x,orgnum);
        }
       
        return x;
    }

    public static String defaultParam(int orgnum,HttpServletRequest request, String vn, String defaultv, String allowpunt, int length) {
        String x = Toolbox.defaultParam(orgnum,request, vn, defaultv);
        return Toolbox.validate(x, allowpunt, length);
    }

    public static String makeFullName(String family, String middle, String given) {
        String blank;
        if (middle == null || middle.equals("null")) {
            middle = "";
        }
        if (family == null || family.equals("null")) {
            family = "";
        }
        if (given == null || given.equals("null")) {
            given = "";
        }
        String string = blank = middle.equals("") ? "" : " ";
        if (given.equals("")) {
            blank = "";
        }
        if (Toolbox.encoding.equals("gbk")||Toolbox.encoding.equals("big5")) {
            return family + given;
        }
        return given + " " + middle + blank + family;
    }

    public static String urlencode(String s) {
        try {
            s = URLEncoder.encode(s, Toolbox.encoding);
        }
        catch (Exception e) {
            // empty catch block
        }
        return s;
    }
    public static TreeSet<String> remoteaddr = new TreeSet<>();
    public static int setcharset(HttpServletRequest request, HttpServletResponse response) {
    
        if (edition.equals("Personal")) return 0;
        
        HttpSession session;
        if (request!=null) session = request.getSession();
        else return -1; 
        String orgnum = "";
        int org = 0;
        boolean needorg = false;
        try {
            if (request != null) 
            {
                orgnum = Toolbox1.GetCookie(request,"orgnum");
                int orgnumk = -1;
                if (orgnum!=null)
                {
                    try{orgnumk = Integer.parseInt(orgnum);
                    orgnumk = Toolbox1.checkorgnum(orgnumk);
                    }catch(Exception er){}
                    if (orgnumk>=0) 
                    {
                        int kk=0; kk = orgnumk >> 16;
                        if ( kk >= encodings.length)
                            kk = langnum;
                        request.setCharacterEncoding( Toolbox.encodings[kk]);
                    }
                    else
                        request.setCharacterEncoding( Toolbox.encoding);
                }
                else
                {
                    request.setCharacterEncoding( Toolbox.encoding);
                }
                String orgnumstr =  request.getParameter("orgnum");
                int orgnum2 = 0;
 
                if (orgnumstr == null && orgnum == null)
                {
                    if (Toolbox.langnum>=Toolbox.langs.length) 
                        Toolbox.langnum = 0;
                    orgnum = "" + (Toolbox.langnum << 16);
                    if (Toolbox.dbadmin.length>1)
                    needorg = true;
                }
                else if (orgnumstr != null && orgnum == null)
                {
                     try{
                    orgnum2 = Integer.parseInt(orgnumstr)%65536;
                    orgnum2 = Toolbox1.checkorgnum(orgnum2);
                    }catch(Exception e1){}
                    orgnum = "" + ((Toolbox.langnum<<16) + (orgnum2%65536)); 
                }
                else if (orgnumstr == null && orgnum != null)
                {
                    
                }
                else if (orgnumstr != null && orgnum != null)
                {
                    int low = 0, high = 0; 
                    try{
                        high = Integer.parseInt(orgnum);
                        
                    }catch(Exception e){high =  (Toolbox.langnum<<16);}
                    try{
                         low = Integer.parseInt(orgnumstr);
                    }catch(Exception e){}
                    int kk = (high - (high % 65536));
                    if ( (kk>>16) >= encodings.length)
                        kk = langnum << 16;
                    high = kk + low%65536;
                    orgnum = "" + high;
                }
                try{
                     org = Integer.parseInt(orgnum);
                }catch(Exception e){} 
                int encnum = org >> 16;
                request.setCharacterEncoding("utf8");//Toolbox.encodings[encnum]);
                String y = request.getQueryString();
                String pin= request.getParameter("qrqlpin");
                boolean b1 = DBAdmin.localnopass;
                User user = (User)(session.getAttribute("User"));
                if (user!=null) user.orgnum = org;
                boolean b2 = (user== null);
                boolean b3 = request.getRequestURI().indexOf("/index.jsp") < 0;
                 
                if (b1 && b2 && b3)
                {
                    User.freelogin(request);
                } 
                if (b2 && null!=orgnum  && null!=pin)
                {
                   
                    int i=0;for ( ; i < pins.size(); i++)
                    {
                        String q = Toolbox.pins.elementAt(i);
                        if (q != null && q.equals(pin)){pins.setElementAt(null, i); break;}
                        
                    }
                    if (i < pins.size())
                    {
                        String uid = pin.replaceFirst("[0-9]+\\.","").replaceFirst("\\..*$","");
                        
                        try{ orgnumk = Integer.parseInt(orgnumstr);}catch(Exception e){}
                        orgnumk = Toolbox1.checkorgnum(orgnumk);
                        user = new User(orgnumk);
                        user.id = uid; 
                        user.orgnum = (user.orgnum%65536) + ((orgnumk>>16)<<16);
                        if (user.retr())
                        {
                            session.setAttribute("User", user);
                        }
                        
                        needorg = false;
                    }
                }
                else if (!b2)
                {
                    if (orgnumstr != null )
                    {   
                        int  orgnum1 =   Integer.parseInt(orgnumstr) ;
                        if ( (user.orgnum % 65536) != (orgnum1%65536))
                        {
                            request.removeAttribute("User");
                            needorg = true;
                            user =  null;
                            
                        }
                    }
                }
                 
                if (response!=null)
                    response.setCharacterEncoding(Toolbox.encodings[encnum]);
                
            }
            
        }
        catch (Exception e) {
            // empty catch block
        }
        
        if (needorg && request.getRequestURI().indexOf("index.jsp")<0)
        {
            try
            {
                request.getSession().removeAttribute("User");
                RequestDispatcher requestdispatcher1 = request.getServletContext().getRequestDispatcher("/index.jsp?orgnum=0" );
                requestdispatcher1.forward( request,  response);
            }catch(Exception e){}
            return -1;
        }
        if (edition.startsWith("Institution")) 
        {
            org = (org >> 16) << 16;
        }
        return org; 
        
    }

    public static int locatefrom(String s, int jj, String tar) {
        if (s == null) {
            return 0;
        }
        s = s.toLowerCase();
        tar = tar.toLowerCase();
        int state = -1;
        boolean pstate = true;
        int N = tar.length();
        for (int j = 0; j < jj; ++j) {
            char c = s.charAt(j);
            if (pstate && c == '\'') {
                state = -1;
                pstate = false;
            } else if (!(pstate || c != '\'')) {
                state = -1;
                pstate = true;
            }
            if (!pstate) continue;
            if (c == ' ' || c == '\n' || c == '\r') {
                if (j > 0 && s.charAt(j - 1) == '\n' && s.charAt(j) == '\n') {
                    return j - 1;
                }
                if (state == N) {
                    return j - N - 1;
                }
                state = 0;
                continue;
            }
            if (state >= 0 && state < N && tar.charAt(state) == c) {
                ++state;
                continue;
            }
            state = -1;
        }
        return jj;
    }

    public static String roundto(double num, int j) {
        if (j <= 0) {
            return "" + Math.round(num);
        }
        String s = "" + Math.round(num * Math.pow(10.0, j));
        while (s.length() < j + 1) {
            s = "0" + s;
        }
        return s.substring(0, s.length() - j) + "." + s.substring(s.length() - j);
    }

    

    public static synchronized void msgqueueput(String ky, String mg) {
        String x;
        if (ky == null) {
            return;
        }
        TreeSet<String> mymsg = msgqueue.get(ky);
        if (mymsg == null)
        {
           mymsg = new TreeSet<String>(); 
        }
        mymsg.add(mg);
        msgqueue.put(ky, mymsg);
        
    }

    public static String msgqueueget(String ky) {
        
        TreeSet<String> queued = Toolbox.msgqueue.get(ky);
        
        if (queued != null) 
        {
           
            StringBuffer b = new StringBuffer();
            int i = 0;
            for (String x : queued)
            {
                if (b.length() > 0)
                    b.append("<br>");
                if (x.startsWith("!!"))
                {
                    x = "<div id=qumsg"+ i + "><a href=\"javascript:retrivequestion(" + (i++) + ",'"+x.substring(2) +"')\">textmsg[178]: " + 
                            x.replaceFirst("[^:]+:","").replace(":", " ") + "</a></div>";
                }
                b.append(x);
            }
            queued.clear();
            msgqueue.remove(ky);
            return b.toString();
        }
         
        return null;
    }
    public static String msgqueueget(String ky,String prefix) {
        if (prefix == null) return "";
        TreeSet<String> queued = Toolbox.msgqueue.get(ky);
        if (queued != null) 
        {
            StringBuffer b = new StringBuffer();
            int i = 0; if (prefix!=null) i=prefix.length();
            for (String x : queued)
            {
                if (b.length() > 0)
                    b.append("<br>");
                if (i==0 || x.startsWith(prefix))
                {
                    b.append(x.substring(i));
                    queued.remove(x);
                }
            }
            if (queued.size() == 0)
            msgqueue.remove(ky);
            return b.toString();
        }
        return "";
    }

    public static void msgjspout(String ky, PrintWriter out, boolean withinjs) {
        String mg = Toolbox.msgqueueget(ky);
        if (mg != null) {
            //mg = mg.replaceAll("(textmsg.[0-9| ]+.)", "\" + $1 + \"");
            try {
                if (!withinjs) {
                    out.println("<script>");
                }
                String y = Generic.handle(mg).replaceAll("(textmsg.[0-9| ]+.)", "\" + $1 + \"");
                out.println("var ugentmsg=\"" + y + "\";");
                if (!withinjs) {
                    out.println("</script>");
                }
            }
            catch (Exception e) {
                // empty catch block
            }
        }
    }

    public static String msgjspout(String ky, boolean withinjs) 
    {
       
        String mg = Toolbox.msgqueueget(ky);
        if (mg == null) return "";
       
        StringBuffer out = new StringBuffer();
        if (mg != null) 
        {
            try 
            {
                if (!withinjs) 
                {
                    out.append("<script>\n");
                }
                out.append("var ugentmsg=\"" + Generic.handle(mg).replaceAll("(textmsg.[0-9| ]+.)", "\" + $1 + \"") + "\";\n");
                if (!withinjs) 
                {
                    out.append("</script>\n");
                }
            }
            catch (Exception e) 
            {
                // empty catch block
            }
        }
        return out.toString();
    }

    public static String gentoken(String filename, String formname) 
    {
        return Toolbox.fortoken.encrypt("" + (System.currentTimeMillis() % 10000) + filename + formname + Toolbox.tokenseeds);
    }

    public static boolean verifytoken(HttpServletRequest request) 
    {
        if (1==1) return true;
        HttpSession session = request.getSession();
        int orgnum = setcharset(request,null);
        String token = Toolbox.defaultParam(orgnum,request, ("securitytoken"), null);
        if (request.getMethod() == "POST") 
        {
            boolean b;
            if (!(b = Toolbox.verifytoken(token))) 
            {
                
                Enumeration e = session.getAttributeNames();
                while (e.hasMoreElements()) 
                {
                    String na = (String)e.nextElement();
                    session.removeAttribute(na);
                }
            }
            return b;
        }
        return true;
    }

    public static boolean verifytoken(String token) {
        if (token == null || token.equals("")) {
            return false;
        }
        String x = Toolbox.fortoken.decrypt(token);
        int N = x.length();
        int l = Toolbox.tokenseeds.length();
        boolean b = x.substring(N - l).equals(Toolbox.tokenseeds);
        return b;
    }

    private static String genrandomstr() {
        Random rng = new Random();
        String characters = "1234567890-=!@#$%^&*()_+qwertyuiop[]\\QWERTYIOP{}|asdfghjkl;'ASDFGHJKL:\"zxcvbnm,./ZXCVBNM<>?";
        int length = 10;
        char[] text = new char[length];
        for (int i = 0; i < length; ++i) {
            text[i] = characters.charAt(rng.nextInt(characters.length()));
        }
        return new String(text);
    }
    
    
    public static void writeToFile(String css, String fn) {
        try {
            Object forLock1;
            FileWriter aWriter = new FileWriter(Toolbox.installpath + File.separator + "newstyle", false);
            aWriter.write(css);
            aWriter.close();
            Object object = forLock1 = new Object();
            synchronized (object) {
                File file1 = new File(Toolbox.installpath, fn);
                try {
                    if (file1 != null && file1.isFile()) {
                        file1.delete();
                        System.gc();
                    }
                }
                catch (Exception exception1) {
                    // empty catch block
                }
                File file = new File(Toolbox.installpath, "newstyle");
                file.renameTo(file1);
            }
        }
        catch (Exception e) {
            // empty catch block
        }
    }

    public static void print(int dl, String s) 
    {
        if (dl <= Toolbox.debuglevel) {
            System.out.print(s);
        }
    }

    public static void println(int dl, String s) {
        Toolbox.print(dl, s + "\n");
    }

    public static String browser(HttpServletRequest request) {
        String browser = "Netscape";
        if (request.getHeader("User-Agent").indexOf("Safari") >= 0) {
            browser = "Safari";
        } else if (request.getHeader("User-Agent").indexOf("Firefox") >= 0) {
            browser = "Firefox";
        } else if (request.getHeader("User-Agent").indexOf("Netscape") >= 0) {
            browser = "Netscape";
        } else if (request.getHeader("User-Agent").indexOf("MSIE") >= 0) {
            browser = "Microsoft";
        }
        return browser;
    }

    private static String abutton(String bname, String bc) {
        String v=headerc2(bc);
        int roundci = Toolbox.defaultFontSize / 5;
        String roundc = "cursor:pointer;border-radius:" + roundci + "px;-webkit-border-radius:" + roundci + "px;-moz-border-radius:" + roundci + "px;";
        return "." + bname + "{" + roundc + ";margin:0px;padding-top:3px;padding-bottom:3px;width:auto;overflow:visible;background-color:" + bc + ";background:linear-gradient("+bc+ "," + v + ") " + bc + ";color:antiquewhite;font-family:inherit;font-size:inherit;font-weight:bold;border:1px #b0b0b0 outset;text-shadow:#606060 -1px -1px;}\n";
    }
    public static void changecss(String safe, String cau, String dan, String longtime, int orgnum) 
    { 
        String hIBGCOLOR = "var(--hibgcolor)";
        String hBBGCOLOR = "var(--hbbgcolor)";
        String hDBGCOLOR = "var(--hdbgcolor)";
        String eDBGCOLOR = "var(--edbgcolor)";
        String BBGCOLOR = "var(--bbgcolor)";
        String IBGCOLOR = "var(--ibgcolor)";
        String DBGCOLOR = "var(--dbgcolor)";
        String TBGCOLOR = "var(--tbgcolor)";
        String fontname = "var(--fontname)";
        String fontsize = "var(--fontsize)";
       
        int roundci = (int)Math.ceil((double)Toolbox.defaultFontSize / 5.0);
        String roundc = "border-radius:" + roundci + "px;-webkit-border-radius:" + roundci + "px;-moz-border-radius:" + roundci + "px;";
        for (int j=0; j < encodings.length; j++)
        {
        String css = "#progress p{\ndisplay: block;\nwidth: 240px;\npadding: 2px 5px;\nmargin: 2px 0;\nborder: 1px inset #446;\nborder-radius: 5px;}\n" +
                "#progress p.success{\nbackground: #0c0 none 0 0 no-repeat;\n}\n" + 
                "#progress p.failed{\nbackground: #c00 none 0 0 no-repeat;\n}\n"  +
                "A:link {COLOR: #0000AA;TEXT-DECORATION: none}\nA:visited {COLOR: #0000AA;TEXT-DECORATION: none}\n" 
                + Toolbox.abutton("GreenButton", safe) 
                + Toolbox.abutton("RedButton", dan) 
                + Toolbox.abutton("YellowButton", "#FFD700") 
                + Toolbox.abutton("PurpleButton", "#8B008B") 
                + Toolbox.abutton("BlueButton", longtime) 
                + Toolbox.abutton("OrangeButton", cau) 
                + Toolbox.abutton("BlackButton", "#000000")
                + Toolbox.abutton("B00BBB", "#00BBBB") 
                + "input.B22BB00 {background-color:#22BB00;color:#000000;font-weight:300;font-family:" + fontname + "}\n"
                + ".selectoption{background-color:" + IBGCOLOR + ";color:white;}"
                + "\n.selectsel{background-color:transparent;color:white;border:1px #c0c0c0 solid}"
                + "\ninput.leftd {background-color:" + DBGCOLOR + ";color:black;border:0px;text-align:left;vertical-align:middle;font-family:" 
                + fontname + "}\n" + "input.left {background-color:" + TBGCOLOR 
                + ";color:black;border:0px;text-align:left;vertical-align:middle;font-family:" 
                + fontname + "}\n" + "input.right {background-color:" 
                + TBGCOLOR + ";color:black;border:0px;text-align:right;vertical-align:middle;font-family:"
                + fontname + "}\n" + "input.underline {background-color:" 
                + TBGCOLOR + ";color:blue;text-decoration:underline; border:0; text-align:left;vertical-align:middle;font-family:" 
                + fontname + "}\n" + "input.flat {background-color:" 
                + TBGCOLOR + ";color:blue;border:0px;vertical-align:middle;font-family:"
                + fontname + "}\n" + "input.dunderline {background-color:" 
                + DBGCOLOR + ";color:blue;text-decoration:underline; border:0; text-align:left;vertical-align:middle;font-family:" 
                + fontname + "}\n" + "input.samebg {background-color:transparent;border:0;text-align:left;vertical-align:middle;font-family:" 
                + fontname + "}\n" + "input.dflat {background-color:" 
                + DBGCOLOR + ";color:blue;border:0px;vertical-align:middle;font-family:"
                + fontname + "}\n" + "select {background-color:" 
                + TBGCOLOR + ";color:black;border-width:0px;font-family:" 
                + fontname + "}\n" + "select.selectclass {" + roundc + "background-color:" 
                + TBGCOLOR + ";color: black; border-width:0px;vertical-align:middle;font-family:" 
                + fontname + "}\n" + "textarea {" + roundc + "background-color:" 
                + TBGCOLOR + ";color:black;font-family:" 
                + fontname + "}\n" + "input{background-color:" 
                + TBGCOLOR + ";color:black;font-family:" 
                + fontname + "; vertical-align:middle}\n" 
                + "input.radchk{background-color:transparent}\n" + "body{background:" + bgimage + " " 
                + DBGCOLOR + ";margin:5px 5px 0px 5px;font-family:" + fontname + ";font-weight:680}\n" + ".outset{" + roundc + ";background:linear-gradient(to right," + IBGCOLOR  + "," + hIBGCOLOR + ","+ hBBGCOLOR + ");font-family:" + fontname + "}\n" + ".outset2{" + roundc + "background:linear-gradient(" + IBGCOLOR + "," +  BBGCOLOR + ");border:2px " + hIBGCOLOR + " outset;font-family:" + fontname + "}\n" + 
                ".forcurve1{text-shadow:#060606 -1px -1px;text-align:center;font-weight:bold;color:#DDCC11;font-size:25px;font-family:" + fontname + "}\n" 
                + ".forcurve2{text-shadow:#060606 -1px -1px;text-align:center;font-weight:bold;color:#DDCC11;font-size:21px}\n" + ".outset1{" + roundc + "background-color:" + hDBGCOLOR + ";border:1px " + hDBGCOLOR + " outset;font-family:" + fontname + "}\n" + ".outset3{" + roundc + "background-image:linear-gradient(180deg," + hDBGCOLOR + ","+ eDBGCOLOR + ");background-color:" + DBGCOLOR + ";border:1px " + hIBGCOLOR + " solid;font-family:" + fontname + "}\n" + ".shadow1 {float:left;background: url(image/trans-shadow.png) no-repeat bottom right;}" + ".shadow1 table {display: block;  position: relative;  padding: 5px; background-color: #fff;  border: 1px solid #cecece; margin: 0px 6px 6px 0px;}" + ".shadow1 div {display: block;  position: relative;  padding: 5px; background-color: #fff;  border: 1px solid #cecece; margin: 0px 6px 6px 0px;}" + ".shadow1 img {display: block;  position: relative;  padding: 5px; background-color: #fff;  border: 1px solid #cecece; margin: 0px 6px 6px 0px;}\n"
                +".trig{width:0;height:0;border-top:10px solid transparent;border-bottom:10px solid transparent;border-left:10px solid white}\n.MathJax nobr>span.math>span{border-left-width:0 !important};\n@keyframes rotatepic{from {tranform:rotate(0deg)}\nto {tranform:rotate(359deg)}}";
                //String xx = "\n.forcurveie1 { zoom: 1; font-size:25px; background-color: #cccccc;\nfilter: progid:DXImageTransform.Microsoft.Chroma(Color=#cccccc)\nprogid:DXImageTransform.Microsoft.DropShadow(OffX=-1, OffY=-1, Color=#606060);}";
                Toolbox.writeToFile(css, "styleb" +  (orgnum%65536 + (j<<16))  + ".css");
        }
        String css = "@keyframes rotatepic{from {tranform:rotate(0deg)}\nto {tranform:rotate(359deg)}}\nA:link {COLOR: #FFFFFF;TEXT-DECORATION: none}\nA:visited {COLOR: #FFFFFF;TEXT-DECORATION: none}\nA:hover{COLOR: #DDCC11;TEXT-DECORATION: underline}\nBODY {background-color:" 
                + IBGCOLOR + ";font-family:" 
                + fontname + ";font-weight:680}\n" + "select {margin:0px;padding:0px;background-color:" + TBGCOLOR + ";color:black;border-width:0px;font-family:" + fontname + "}\n" + "input{margin:0px;padding:0px;background-color:" + TBGCOLOR + ";color:black;font-family:" + fontname + ";vertical-align:middle;}\n";
        Toolbox.writeToFile(css , "styleu.css");
         
        if ( orgnum > 0) return;
        String dir = Toolbox.installpath + File.separator + "image";
        String image = bgimage;
        if (image.indexOf("/") >= 0)
            image = image.replaceFirst("url\\(image/","").replaceFirst("\\)","").replace('/', File.separatorChar);
        else
            image = "xxx5.gif";
        String option = "\"" + dir + File.separator + "makeclock.bat\" " + hIBGCOLOR + " " + hDBGCOLOR + " " + BBGCOLOR + " " +  image  + " " + safe + " " + cau + " " + dan + " " + longtime ;
         
        Toolbox.processimage(Toolbox.installpath + File.separator + "image", option);
    }
    
    public static void changecss0(String safe, String cau, String dan, String longtime, int orgnum) 
    {
        String hBBGCOLOR = Toolbox.headercl(Toolbox.dbadmin[orgnum%65536].BBGCOLOR); 
        String hIBGCOLOR = Toolbox.headercl(Toolbox.dbadmin[orgnum%65536].IBGCOLOR);
        String hDBGCOLOR = Toolbox.headercl(Toolbox.dbadmin[orgnum%65536].DBGCOLOR);
        String eDBGCOLOR = Toolbox.headerc2(hDBGCOLOR);
        int roundci = (int)Math.ceil((double)Toolbox.defaultFontSize / 5.0);
        String roundc = "border-radius:" + roundci + "px;-webkit-border-radius:" + roundci + "px;-moz-border-radius:" + roundci + "px;";
        for (int j=0; j < encodings.length; j++)
        {
        String css = "#progress p{\ndisplay: block;\nwidth: 240px;\npadding: 2px 5px;\nmargin: 2px 0;\nborder: 1px inset #446;\nborder-radius: 5px;}\n" +
                "#progress p.success{\nbackground: #0c0 none 0 0 no-repeat;\n}\n" + 
                "#progress p.failed{\nbackground: #c00 none 0 0 no-repeat;\n}\n"  +
                "A:link {COLOR: #0000AA;TEXT-DECORATION: none}\nA:visited {COLOR: #0000AA;TEXT-DECORATION: none}\n" 
                + Toolbox.abutton("GreenButton", safe) 
                + Toolbox.abutton("RedButton", dan) 
                + Toolbox.abutton("YellowButton", "#FFD700") 
                + Toolbox.abutton("PurpleButton", "#8B008B") 
                 
                + Toolbox.abutton("BlueButton", longtime) 
                + Toolbox.abutton("OrangeButton", cau) 
                + Toolbox.abutton("BlackButton", "#000000")
                + Toolbox.abutton("B00BBB", "#00BBBB") 
                + "input.B22BB00 {background-color:#22BB00;color:#000000;font-weight:300;font-family:" + Toolbox.fontsnamestr(j) + "}\n"
                + ".selectoption{background-color:" + Toolbox.dbadmin[orgnum%65536].IBGCOLOR + ";color:white;}"
                + "\n.selectsel{background-color:transparent;color:white;border:1px #c0c0c0 solid}"
                + "\ninput.leftd {background-color:" + Toolbox.dbadmin[orgnum%65536].DBGCOLOR + ";color:black;border:0px;text-align:left;vertical-align:middle;font-family:" 
                + Toolbox.fontsnamestr(j) + "}\n" + "input.left {background-color:" + Toolbox.dbadmin[orgnum%65536].TBGCOLOR 
                + ";color:black;border:0px;text-align:left;vertical-align:middle;font-family:" 
                + Toolbox.fontsnamestr(j) + "}\n" + "input.right {background-color:" 
                + Toolbox.dbadmin[orgnum%65536].TBGCOLOR + ";color:black;border:0px;text-align:right;vertical-align:middle;font-family:"
                + Toolbox.fontsnamestr(j) + "}\n" + "input.underline {background-color:" 
                + Toolbox.dbadmin[orgnum%65536].TBGCOLOR + ";color:blue;text-decoration:underline; border:0; text-align:left;vertical-align:middle;font-family:" 
                + Toolbox.fontsnamestr(j) + "}\n" + "input.flat {background-color:" 
                + Toolbox.dbadmin[orgnum%65536].TBGCOLOR + ";color:blue;border:0px;vertical-align:middle;font-family:"
                + Toolbox.fontsnamestr(j) + "}\n" + "input.dunderline {background-color:" 
                + Toolbox.dbadmin[orgnum%65536].DBGCOLOR + ";color:blue;text-decoration:underline; border:0; text-align:left;vertical-align:middle;font-family:" 
                + Toolbox.fontsnamestr(j) + "}\n" + "input.samebg {background-color:transparent;border:0;text-align:left;vertical-align:middle;font-family:" 
                + Toolbox.fontsnamestr(j) + "}\n" + "input.dflat {background-color:" 
                + Toolbox.dbadmin[orgnum%65536].DBGCOLOR + ";color:blue;border:0px;vertical-align:middle;font-family:"
                + Toolbox.fontsnamestr(j) + "}\n" + "select {background-color:" 
                + Toolbox.dbadmin[orgnum%65536].TBGCOLOR + ";color:black;border-width:0px;font-family:" 
                + Toolbox.fontsnamestr(j) + "}\n" + "select.selectclass {" + roundc + "background-color:" 
                + Toolbox.dbadmin[orgnum%65536].TBGCOLOR + ";color: black; border-width:0px;vertical-align:middle;font-family:" 
                + Toolbox.fontsnamestr(j) + "}\n" + "textarea {" + roundc + "background-color:" 
                + Toolbox.dbadmin[orgnum%65536].TBGCOLOR + ";color:black;font-family:" 
                + Toolbox.fontsnamestr(j) + "}\n" + "input{background-color:" 
                + Toolbox.dbadmin[orgnum%65536].TBGCOLOR + ";color:black;font-family:" 
                + Toolbox.fontsnamestr(j) + "; vertical-align:middle}\n" 
                + "input.radchk{background-color:transparent}\n" + "body{background:" + bgimage + " " 
                + Toolbox.dbadmin[orgnum%65536].DBGCOLOR + ";margin:5px 5px 0px 5px;font-family:" + Toolbox.fontsnamestr(j) + ";font-weight:680}\n" + ".outset{" + roundc + ";background:linear-gradient(to right," + Toolbox.dbadmin[orgnum%65536].IBGCOLOR  + "," + Toolbox.headercl(Toolbox.dbadmin[orgnum%65536].IBGCOLOR) + ","+ Toolbox.headercl(Toolbox.dbadmin[orgnum%65536].BBGCOLOR) + ");font-family:" + Toolbox.fontsnamestr(j) + "}\n" + ".outset2{" + roundc + "background:linear-gradient(" + Toolbox.dbadmin[orgnum%65536].IBGCOLOR + "," +  Toolbox.dbadmin[orgnum%65536].BBGCOLOR + ");border:2px " + hIBGCOLOR + " outset;font-family:" + Toolbox.fontsnamestr(j) + "}\n" + 
                ".forcurve1{text-shadow:#060606 -1px -1px;text-align:center;font-weight:bold;color:#DDCC11;font-size:25px;font-family:" + Toolbox.fontsnamestr(j) + "}\n" 
                + ".forcurve2{text-shadow:#060606 -1px -1px;text-align:center;font-weight:bold;color:#DDCC11;font-size:21px}\n" + ".outset1{" + roundc + "background-color:" + hDBGCOLOR + ";border:1px " + hDBGCOLOR + " outset;font-family:" + Toolbox.fontsnamestr(j) + "}\n" + ".outset3{" + roundc + "background-image:linear-gradient(180deg," + hDBGCOLOR + ","+ eDBGCOLOR + ");background-color:" + Toolbox.dbadmin[orgnum%65536].DBGCOLOR + ";border:1px " + hIBGCOLOR + " solid;font-family:" + Toolbox.fontsnamestr(j) + "}\n" + ".shadow1 {float:left;background: url(image/trans-shadow.png) no-repeat bottom right;}" + ".shadow1 table {display: block;  position: relative;  padding: 5px; background-color: #fff;  border: 1px solid #cecece; margin: 0px 6px 6px 0px;}" + ".shadow1 div {display: block;  position: relative;  padding: 5px; background-color: #fff;  border: 1px solid #cecece; margin: 0px 6px 6px 0px;}" + ".shadow1 img {display: block;  position: relative;  padding: 5px; background-color: #fff;  border: 1px solid #cecece; margin: 0px 6px 6px 0px;}\n"
                +".trig{width:0;height:0;border-top:10px solid transparent;border-bottom:10px solid transparent;border-left:10px solid white}\n.MathJax nobr>span.math>span{border-left-width:0 !important};\n@keyframes rotatepic{from {tranform:rotate(0deg)}\nto {tranform:rotate(359deg)}}";
        //String xx = "\n.forcurveie1 { zoom: 1; font-size:25px; background-color: #cccccc;\nfilter: progid:DXImageTransform.Microsoft.Chroma(Color=#cccccc)\nprogid:DXImageTransform.Microsoft.DropShadow(OffX=-1, OffY=-1, Color=#606060);}";
        Toolbox.writeToFile(css, "styleb" + ((orgnum%65536) + (j<<16)) + ".css");
        css = "@keyframes rotatepic{from {tranform:rotate(0deg)}\nto {tranform:rotate(359deg)}}\nA:link {COLOR: #FFFFFF;TEXT-DECORATION: none}\nA:visited {COLOR: #FFFFFF;TEXT-DECORATION: none}\nA:hover{COLOR: #DDCC11;TEXT-DECORATION: underline}\nBODY {background-color:" 
                + Toolbox.dbadmin[orgnum%65536].IBGCOLOR + ";font-family:" 
                + Toolbox.fontsnamestr(j) + ";font-weight:680}\n" + "select {margin:0px;padding:0px;background-color:" + Toolbox.dbadmin[orgnum%65536].TBGCOLOR + ";color:black;border-width:0px;font-family:" + Toolbox.fontsnamestr(j) + "}\n" + "input{margin:0px;padding:0px;background-color:" + Toolbox.dbadmin[orgnum%65536].TBGCOLOR + ";color:black;font-family:" + Toolbox.fontsnamestr(j) + ";vertical-align:middle;}\n";
        
        Toolbox.writeToFile(css , "style" + ((orgnum%65536) + (j<<16))  + ".css");
        }
        if ( orgnum > 0) return;
        String dir = Toolbox.installpath + File.separator + "image";
        String image = bgimage;
        if (image.indexOf("/") >= 0)
            image = image.replaceFirst("url\\(image/","").replaceFirst("\\)","").replace('/', File.separatorChar);
        else
            image = "xxx5.gif";
        String option = "\"" + dir + File.separator + "makeclock.bat\" " + hIBGCOLOR + " " + hDBGCOLOR + " " + Toolbox.dbadmin[orgnum%65536].BBGCOLOR + " " +  image  + " " + safe + " " + cau + " " + dan + " " + longtime ;
         
        Toolbox.processimage(Toolbox.installpath + File.separator + "image", option);
    }

    public static boolean processimage(String dir, String option) {
        File folder = new File(dir);
        String option1 = dir + File.separator + "convert.exe";
        File cfile = new File(option1);
        File f = null;
        boolean hasf = cfile.exists();
        String convertpath = null;
        if (!hasf) 
        {
            convertpath = ServerAgent.getPath("convert",0);
             f = new File(convertpath);
            if ( convertpath == null || f.exists() == false) 
            {
                convertpath = Toolbox.installpath + File.separator + "WEB-INF"  + File.separator + "conf" + File.separator + "convert.exe";
                f = new File(convertpath);
                if (f.exists() == false)
                {
                    Toolbox.println(0, "No ImageMagick program convert.  Enter such a line 'convert path_of_convert.exe' in Commandline/System Server table");
                    return false;
                }
            }
            f.renameTo(cfile);
        }
        try 
        {
            Runtime r = Runtime.getRuntime();
            Process proc = r.exec(option, (String[])null, folder);
            int exitVal = proc.waitFor();
            if (!hasf) 
            {
                cfile.renameTo(f);
            }
            return exitVal == 0;
        }
        catch (Exception e) 
        {
            Toolbox.println(0, dir + e.toString());
            if (!hasf) 
            {
                cfile.renameTo(f);
            }
            return false;
        }
    }

    public static String unifontstyle(int font_size, int orgnum) {
        int weight = 500;
        if (font_size > 15) {
            weight = (int)Math.floor((double)weight * Math.sqrt(font_size / 15));
        }
        weight = 680;
        return "<style  type=text/css>input{font-size:" + font_size + "px;padding:0px;margin:0px;font-weight:" + weight + ";font-family:" + Toolbox.fontsnamestr(langnum) + "}\n" + "select{font-size:" + font_size + "px;padding:0px;margin:0px;font-weight:" + weight + ";font-family:" + Toolbox.fontsnamestr(langnum) + "}\n" + "textarea{padding:2px 1px 2px 1px;font-size:" + font_size + "px;font-weight:" + weight + ";font-family:" + Toolbox.fontsnamestr(langnum) + "}\n" + "body{font-size:" + font_size + "px;font-weight:" + weight + ";font-family:" + Toolbox.fontsnamestr(langnum) + "}\n" + "div{font-size:" + font_size + "px;font-weight:" + weight + ";font-family:" + Toolbox.fontsnamestr(langnum) + "}\n" + ".thehint{background:#DDDDAA;border:1px solid #991020;color:green;font-size:" + (font_size + 1) + "px;font-family:" + Toolbox.fontsnamestr(langnum) + "}\n" + "table,tr,td,TABLE,TR,TD{font-size:" + font_size + "px;font-weight:" + weight + ";font-family:" + Toolbox.fontsnamestr(langnum) + "}\n" + "table,tr,td,TABLE,TR,TD,table,tr,td,TABLE,TR,TD{font-size:" + font_size + "px;font-weight:" + weight + ";font-family:" + Toolbox.fontsnamestr(langnum) + "}\n" + "table,tr,td,TABLE,TR,TD,table,tr,td{font-size:" + font_size + "px;font-weight:" + weight + ";font-family:" + Toolbox.fontsnamestr(langnum) + "}</style>";
    }

    public static String butstyle(int font_size) {
        return "style=\"width:" + (int)Math.floor(4 * font_size) + "px;\"";
    }
     public static String headerc2(String clx) {
        String cl = "#45626a";
        if (clx.equals("red")) {
            clx = "#ff0000";
        } else if (clx.equals("orange")) {
            clx = "#ffa500";
        } else if (clx.equals("blue")) {
            clx = "#0000ff";
        } else if (clx.equals("green")) {
            clx = "#00ff00";
        } else if (clx == null || clx.equals("") || clx.charAt(0) != '#' || clx.length() < 7) {
            clx = "#45626a";
        }
        else if (clx.equals("black")) {
            clx = "#000000";
        }  
        String hs = "0123456789ABCDEF";
        int j = Integer.parseInt(clx.substring(1, 3), 16)+29;
        if (j > 255) j = 255;
        int k = Integer.parseInt(clx.substring(3, 5), 16)+18;
        if (k > 255) k = 255;
        int l = Integer.parseInt(clx.substring(5), 16)+18;
        if (l > 255) l = 255;
        cl = "#" + hs.charAt(j / 16) + hs.charAt(j % 16);
        int k1 = k / 16;
        int k2 = k % 16;
        int l1 = l / 16;
        int l2 = l % 16;
        cl = cl + hs.charAt(k1);
        cl = cl + hs.charAt(k2);
        cl = cl + hs.charAt(l1);
        cl = cl + hs.charAt(l2);
        return cl;
    }

    public static String headercl(String clx) {
        String cl = "#45626a";
        if (clx.equals("red")) {
            clx = "#ff0000";
        } else if (clx.equals("blue")) {
            clx = "#0000ff";
        } else if (clx.equals("green")) {
            clx = "#00ff00";
        } else if (clx == null || clx.equals("") || clx.charAt(0) != '#' || clx.length() < 7) {
            clx = "#45626a";
        }
        String hs = "0123456789ABCDEF";
        int j = Integer.parseInt(clx.substring(1, 3), 16);
        if (j >= 128) {
            j-=10;
        } else if (j < 128) {
            j+=10;
        }
        int k = Integer.parseInt(clx.substring(3, 5), 16);
        if (k >= 128) {
            k-=10;
        } else if (k < 128) {
            k+=10;
        }
        int l = Integer.parseInt(clx.substring(5), 16);
        if (l >= 128) {
            l-=10;
        } else if (l < 128) {
            l+=10;
        }
        cl = "#" + hs.charAt(j / 16) + hs.charAt(j % 16);
        int k1 = k / 16;
        int k2 = k % 16;
        int l1 = l / 16;
        int l2 = l % 16;
        cl = cl + hs.charAt(k1);
        cl = cl + hs.charAt(k2);
        cl = cl + hs.charAt(l1);
        cl = cl + hs.charAt(l2);
        return cl;
    }

    private static void fromstream1(InputStream sin, String object) throws Exception {
        int z;
        String x = Toolbox.installpath + File.separator + "WEB-INF" + File.separator + "conf" + File.separator + object;
        FileOutputStream fout = new FileOutputStream(new File(x));
         
        while ((z = sin.read()) != -1) {
            fout.write(z);
        }
        fout.close();
        sin.close();
    }
 
    
    public static String makejs(String inst)
    {
        String err = "";
        for (int i=0; i < encodings.length; i++)
        {
            err += makejs(inst, langs[i]); 
        }
        return err;
    }
    
    public static String makejs(String inst, String lang) {
        File file;
        String str = Toolbox.installpath + File.separator + "WEB-INF" + File.separator + "conf" + File.separator +  lang + "s.txt";
        if (inst != null) {
            str = inst + File.separator + "WEB-INF" + File.separator + "conf" + File.separator +  lang + "s.txt";
        }
        
        String j = "";
        if (!(file = new File(str)).exists()) {
            return str + " does not exist";
        }
        try {
            FileInputStream fin = new FileInputStream(file);
            InputStreamReader esr = new InputStreamReader(fin,"UTF-8");
            BufferedReader ebr = new BufferedReader(esr);
            String masterFile = Toolbox.installpath + File.separator + lang + ".js";
            
            String rmasterFile = Toolbox.installpath + File.separator +  "textmsgr.js";
            FileWriter fout = new FileWriter(masterFile, false);
            FileWriter rfout = new FileWriter(rmasterFile, false);
            
            if (lang.equals("en")) 
            {
                rfout.write("var c1to1 = new Array();\n");
            }  
            fout.write("var textmsg = [\n");
            String aline = null;
            int oldnum = -1;
            while ((aline = ebr.readLine()) != null) {
                if ((aline = aline.trim()).length() < 2) continue;
               
                aline = aline.replaceFirst("^[ |\t|\n|\r]+", "");
                int l = aline.indexOf(" ");
                String num = aline;
                if (l > 0) {
                    num = aline.substring(0, l).trim();
                    aline = aline.substring(l + 1);
                } else {
                    aline = "";
                }
                if (num.equals("+")) {
                    fout.write("+\"\\n" + Generic.handle(aline) + "\"");
                    continue;
                }
                if (num.matches("[0-9]+")) {
                    if (!(j = num).equals("0")) {
                        fout.write(",\n");
                    }
                    if (!num.equals("" + (oldnum+1)))
                    println(0, num + " is not continuous");
                    oldnum = Integer.parseInt(num);
                    fout.write("/*" + num + "*/\"" + Generic.handle(aline) + "\"");
                    if (! lang.equals("en") || aline.length() >= 30) continue;
                    rfout.write("c1to1[\"" + Generic.handle(aline).toLowerCase().replaceAll(" ", "") + "\"]=" + num + ";\n");
                    continue;
                }
                fout.write("+\"\\n" + Generic.handle(num) + Generic.handle(aline) + "\"");
            }
            fin.close();
            fout.write("];\nfunction getTextmsg(i){return textmsg[i];}");
            fout.close();
            rfout.close();
            return masterFile + "  " + rmasterFile;
        }
        catch (Exception e) {
            return "User Interface File " + str + " Callpsed " + j + "\n" + e.toString();
        }
    }
    
    public static String someconsts(int orgnum)
    {
        int k = langnum; if (orgnum>=0) k = (orgnum>>16);
        if ( k >= encodings.length) k = langnum;
        String encoding = Toolbox.encodings[k];
        String langcode = Toolbox.langs[k];
        StringBuffer s = new StringBuffer();
        s.append("var someconsts=['" + Toolbox.meta0.replaceAll("\n", "\\n") +  encoding + "\" />',");
            s.append("'" + Toolbox.fontsnamestr(orgnum>>16) + "',");
            String latexpath = Toolbox.installpath + File.separator + "mathjax" + File.separator + "MathJax.js";
            s.append("'" + Toolbox.apphashgene + "',");
            s.append(  (new File(latexpath)).exists()?"'1',":"'0',");
            s.append( "'" + (Toolbox.activeidletime * 1000) +  "','" + langcode + "'];\n"); 
            s.append("function unititle(str,cls){if (cls!='outset2') return '" + Toolbox.titlehelp("' + str + '", "' + cls + '") + "'; return '" + Toolbox.title("' + str + '") + "';}");
         return s.toString();
    }
    public static String getMeta(int orgnum)
    {
        int i = orgnum%65536;
        int j = orgnum>>16;
        if (i >= dbadmin.length) i = dbadmin.length-1;
        if (j==encodings.length) j = langnum;
        return dbadmin[i].meta(encodings[j]);
        
    }
    public static String getMeta(User user)
    {
        if (user==null)
            return dbadmin[0].meta(encodings[0]);
        return dbadmin[user.orgnum%65536].meta(encodings[user.orgnum>>16]);
    }
    public static synchronized String openuif(String installFolder, String str) 
    {
      
        for (int i=0; i < langs.length; i++)
        {
            if (locales[i].hasmsg)
            {
               msgs[i] = openuif( installFolder, str, langs[i]);
               msgs[i][0] = langs[i];
               if (i == langnum)
                   msg = msgs[i];
            }
            else
            {
                msgs[i] = null;
                
            }
        }
        Toolbox.uifopen = true;
        return "";
    }
    public static String resolveCode(String path) throws Exception {
//		String filePath = "D:/article.txt";	//[-76, -85, -71]  ANSI
//		String filePath = "D:/article111.txt";	//[-2, -1, 79] unicode big endian
//		String filePath = "D:/article222.txt";	//[-1, -2, 32]	unicode
//		String filePath = "D:/article333.txt";	//[-17, -69, -65] UTF-8
		InputStream inputStream = new FileInputStream(path);  
        byte[] head = new byte[3];  
        inputStream.read(head);    
                 String code = "gbk"; //or GBK
        if (head[0] == -1 && head[1] == -2 )  
            code = "UTF-16";  
        else if (head[0] == -2 && head[1] == -1 )  
            code = "Unicode";  
        else if(head[0]==-17 && head[1]==-69 && head[2] ==-65)  
            code = "UTF-8";  
          
        inputStream.close();
         
        return code;
	}

    public static synchronized String[] openuif(String installFolder, String str, String langcode) 
    {
        if (str == null) 
        {
            str = installFolder + File.separator + "WEB-INF" + File.separator + "conf" + File.separator +  langcode  + ".txt";
        }
         
        int j = 0;
        boolean ziped = false;
        try {
            File file = new File(str);
            if (!file.exists()) {
                ziped = true;
                if (!(file = new File(str.replaceFirst("\\.txt", ".crp"))).exists()) {
                    return null;
                }
            }
            String code = resolveCode(str);
           
            String [] msgx = new String[1700];
            FileInputStream fin = new FileInputStream(file);
            BufferedReader ebr = null;
            
            ebr = !ziped ? new BufferedReader(new InputStreamReader(fin,"UTF-8")) : new BufferedReader(new InputStreamReader(new GZIPInputStream(fin)));
            String aline = null;
            while ((aline = ebr.readLine()) != null) {
                if ((aline = aline.replaceFirst("^[ ]+", "").replaceFirst("[\r]*[\n]*$", "")).length() < 2) continue;
                int l = aline.indexOf(" ");
                String num = aline;
                if (l > 0) {
                    num = aline.substring(0, l).trim();
                    aline = aline.substring(l + 1);
                } else {
                    aline = "";
                }
                if (num.equals("+")) {
                    msgx[j] = msgx[j] + "\n" + aline;
                    continue;
                }
                j = Integer.parseInt(num);
                msgx[j] = aline;
           
            }
            fin.close();
            
            return msgx;
        }
        catch (Exception e) {
            return null;
        }
        
    }

    public static String gzipFile(String filepath) {
        try {
            int bytesRead;
            FileInputStream in = new FileInputStream(filepath);
            FileOutputStream fout = new FileOutputStream(filepath.replaceFirst("\\..*", ".crp"));
            GZIPOutputStream out = new GZIPOutputStream(fout);
            byte[] buffer = new byte[256];
            while ((bytesRead = in.read(buffer)) != -1) {
                out.write(buffer, 0, bytesRead);
            }
            out.close();
            in.close();
            return filepath;
        }
        catch (IOException e) {
            return "<font color=red>" + e.toString() + "</font>";
        }
    }

    public static String validateparam(String x, String y) {
        if (x.equals("rdap")) {
            return Toolbox.validate(y, "|#", 30);
        }
        if (x.equals("subdb")) {
            return Toolbox.validate(y, null, 30);
        }
        if (x.equals("cdrdap")) {
            return Toolbox.validate(y, null, 1);
        }
        if (x.equals("subdb")) {
            return Toolbox.validate(y, null, 30);
        }
        if (x.equals("cdrdap")) {
            return Toolbox.validate(y, null, 1);
        }
        if (x.equals("extraline")) {
            return Toolbox.validate(y, null, 5);
        }
        if (x.equals("numrows")) {
            return Toolbox.validate(y, null, 5);
        }
        if (x.equals("exbut")) {
            return Toolbox.validate(y, null, 6);
        }
        if (x.equals("dim")) {
            return Toolbox.validate(y, null, 10);
        }
        if (x.equals("rsacode")) {
            return Toolbox.validate(y, "$", -1);
        }
        if (x.equals("which")) {
            return Toolbox.validate(y, null, 20);
        }
        if (x.equals("semester") && y.length() > 20) {
            return y.substring(0,20);
        }
        if (x.equals("Semester") && y.length() > 20) {
            return y.substring(0,20);
        }
        return y;
    }

    public static void unpack(HashMap saved, String code) {
        try {
            String uncode = Encode6b.rzip64(code);
           
            int s = 0;
            int e = 0;
            if (uncode.charAt(0) == '?') {
                uncode = uncode.replace('?', '&');
            } else if (uncode.charAt(0) != '&') {
                uncode = "" + '&' + uncode;
            }
            for (int i = 0; i < Toolbox.allparams.length; ++i) 
            {
                if ((s = uncode.indexOf("&" + Toolbox.allparams[i] + "=")) < 0) continue;
                if (saved.containsKey(Toolbox.allparams[i])) 
                {
                    saved.remove(Toolbox.allparams[i]);
                }
                String vl;
                e = uncode.indexOf("&", s + 1);
                if (e>0) 
                    vl = uncode.substring(s + 2 + Toolbox.allparams[i].length(), e);
                else
                    vl = uncode.substring(s + 2 + Toolbox.allparams[i].length());
              
                saved.put(Toolbox.allparams[i], Toolbox.validateparam(Toolbox.allparams[i],  (vl)));
            }
        }
        catch (Exception e) {
            // empty catch block
        }
    }

    public static boolean isaparam(String s) {
        int i;
        for (i = 0; i < Toolbox.allparams.length && Toolbox.allparams[i].equals(s); ++i) {
        }
        return i < Toolbox.allparams.length;
    }

    public static int indexframewidth(int uf) {
        int ii = 0;
        ii = Toolbox.encoding.equals("gbk") ? 50 + 8 * uf : 60 + 9 * uf;
        return ii;
    }

    public static float charwidthrate() {
        float f = 4.5f;
        if (Toolbox.encoding.equals("gbk")) {
            f = 4.1f;
        }
        return f;
    }

    public static int[] readtd(String source, int pos) {
        String xx;
        if (source == null) {
            return null;
        }
        int j = pos + 1;
        for (; pos < source.length() && source.charAt(pos) != '|'; ++pos) {
        }
        if (pos == source.length()) {
            return null;
        }
        int state = 0;
        int[] r = new int[5];
        r[0] = pos + 1;
        r[4] = 0;
        r[3] = 0;
        if (!(pos <= j || (xx = source.substring(j, pos).replaceAll(",", " ").trim()).equals(""))) {
            String[] xxs = xx.split("[ ]+");
            r[3] = Integer.parseInt(xxs[0]);
            r[4] = Integer.parseInt(xxs[1]);
        }
        for (; pos < source.length(); ++pos) {
            if (source.charAt(pos) == '|') {
                state = 1 - state;
                r[1] = pos;
                continue;
            }
            if (source.charAt(pos) == ',') {
                if (state != 0) continue;
                r[2] = 0;
                break;
            }
            if (source.charAt(pos) != ';' || state != 0) continue;
            r[2] = 1;
            break;
        }
        if (pos == source.length()) {
            if (source.charAt(pos - 1) != '|') {
                r[1] = pos;
            }
            r[2] = 1;
        }
        return r;
    }
    public static String formatstrt(String str)
    {
        try{
        String [] ss = str.replaceAll("\r\n","\n").replaceAll("\r","\n").replaceAll("\n", " \n").split("\n");
        StringBuilder s = new StringBuilder(str.length()+100);
        for (int i=0; i < ss.length; i++)
        {
         
            String x = ss[i]; 
            
            if (i < ss.length-1) 
            {
                x = x.replaceFirst(" $","");
            }   
            if (x.equals("")) 
            { s.append("<br>"); }
            else if (x.length() < 80 && ss[i].indexOf("$")<0)
               s.append("<pre style=\"display:inline;padding:0px 0px 0px 0px;font-family:inherit\">" + ss[i].replaceAll("<", "&lt;").replaceAll(">", "&gt;") + "</pre><br>"); 
            else if (ss[i].indexOf("$")>=0)
            {
               
                int j=0; while (j<50 && x.charAt(j)==' ') {s.append("&nbsp;"); j++;}
                s.append(x.substring(j).replaceAll("<", "&lt;").replaceAll(">", "&gt;"))  ;
            }
            else
            {
            
                int j=0; while (j<50 && x.charAt(j)==' ') {s.append("&nbsp;"); j++;}
                s.append(x.substring(j).replaceAll("<", "&lt;").replaceAll(">", "&gt;") + "<br>");
            }
        } 
      
        return doll(s.toString());
        }catch(Exception e){ }
        return str;
    }

     static String dol(String x)
    {
        String str = "";
        int k = 0;
        while ( k < x.length())
        {
            int j = x.indexOf("$", k);
            String out;
            String ins = "";
            if (j == -1)
            {
                out = x.substring(k);
                k = x.length();
            }
            else 
            {
                 out = x.substring(k,j);
                 k = j+1;
                 ins = "$";
            }
            str +=  out; 
            if (j == 0 || j > 1 && x.charAt(j-1) !='\\')
                ins = "<pre  style=\"display:inline;padding:0px 0px 0px 0px;font-family:inherit\">$</pre>" ;
            str += ins;
                
        }
        return str;
    }
    static String doll(String x)
    {
        Pattern r = Pattern.compile("(?i)<pre[^>]*>");
        Pattern r1 = Pattern.compile("(?i)<.pre>");
        int k = 0;
        Matcher m = r.matcher(x);
        StringBuffer str = new StringBuffer();
        while (k < x.length())
       {
            boolean b = m.find(k); 
            String out, ins;
            if (b) 
            {
                int j = m.start();
                out = x.substring(k, j);
                k = m.end();
                ins = x.substring(j, k); 
            }
            else
            {
                out = x.substring(k);
                ins = "";
                k = x.length();
            }
            Matcher n = r1.matcher(out);
           
            if (!n.find())
            {  
                if (str.length() == 0)
                   str.append(dol(out)); 
                else
                   str.append(out);
            }
            else
            {  
                int ll = n.start();
                if (ll+6 < out.length())
                {
                    String y = out.substring(0,ll+6);
                    str.append(y);
                    str.append(dol(out.substring(ll+6)));
                }
                else
                {
                    str.append(out);
                }
                
            }
            str.append(ins); 
        }
 
        return str.toString();
    }
    
    public static String formatstr(String format,String v)
    {
        String v1 = v.replaceAll("\n[ |\t]+","");  
        int k1 = v1.indexOf("\t");
        if (k1 == -1 ) return formatstr0(format,v);
        int j;
        String x[][] =(new CSVParse(v, '"', new String[]{"\t", "\r\n"})).nextMatrix(false);

        StringBuilder str =  new StringBuilder();
        int start = -1;
        StringBuilder z = new StringBuilder();
 
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
                   str.append(formatstr(format,z.toString()));
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
                           if (x[i][k]==null|| x[i][k].length()==0)
                           {

                           }
                           else  if (x[i][k].charAt(0) == ' ' && x[i][k].charAt(x[i][k].length()-1)!=' ')
                               str.append(" align=right ");
                           else  if (x[i][k].charAt(0) != ' ' && x[i][k].charAt(x[i][k].length()-1)==' ')
                               str.append(" align=leftt ");
                           else if (x[i][k].charAt(0) == ' ' && x[i][k].charAt(x[i][k].length()-1)==' ')
                               str.append(" align=center ");
                           str.append(">");
                           str.append( formatstr0(format, x[i][k]) + "</td>");
                       }
                   }
                   str.append("</tr>");
               }
               str.append("</table>");
               start = r;
           }

        }

        return str.toString().replaceAll("@#@;","\t"); 

        
    
    }
    
    
    
    public static String formatstr0(String format, String str) {
        if (format == null || str ==null) 
        {
            return str;
        }
        else if (format.equals("0") || format.equals("PlainText")) 
        {
            return  formatstrt(str );
        }
        else if (format.equals("1") || format.equals("HTML")) 
        {
            return doll(str );
        }
        else if (format.equals("2") || format.equals("LaTeXML")) 
        {
            return Toolbox.dollars(str).replaceAll("\n[\r]*\n", "<br>");
        }
        else if (format.equals(Toolbox.emsg(890)) || format.equals("3")) 
        {
            if (str == null) 
            {
                return "";
            }
            String[] strs = str.split("\n");
            String ans = "";
            for (int i = 0; i < strs.length; ++i) {
                String framename;
                String ext;
                int leng;
                if ((framename = (str = strs[i].trim()).replaceAll("[^a-z]", "")).length() > 8) {
                    framename = framename.substring(0, 8);
                }
                if ((leng = str.length()) < 4) continue;
                ans = (ext = str.substring(leng - 4).toLowerCase()).equals(".jpg") || ext.equals(".gif") ? ans + "<img src=\"" + str + "\"><br>" : (ext.equals(".txt") || ext.equals(".jsp") || ext.equals(".doc") || ext.equals(".pdf") || ext.equals("html") ? ans + "<iframe src=\"" + str + "\" width=580 height=400 frameborder=0 name=" + framename + "></iframe><br>" : ans + "<a href=\"" + str + "\" target=\"" + framename + "\">" + str + "</a><br>");
            }
            return ans;
        }
        return str;
    }

    public static String dollars(String str) {
        int[][] trans = new int[][]{{1, 5, 0}, {2, 3, 3}, {4, 2, 2}, {0, 3, 3}, {0, 0, 0}, {0, 5, 0}};
        StringBuffer y = new StringBuffer();
        int s = 0;
        boolean nls = false;
        for (int i = 0; i < str.length(); ++i) {
            char z = str.charAt(i);
            int c = 2;
            if (z == '\\') {
                c = 1;
            } else if (z == '$') {
                c = 0;
            }
            if (!nls) {
                if (z == '\n') {
                    nls = true;
                }
            } else if (z == '\n') {
                y.append("<br>");
                nls = false;
            } else if (z != '\r' && z != ' ') {
                nls = false;
            }
            int t = trans[s][c];
            if (s == 1) {
                if (c == 0) {
                    y.append("<div>$");
                } else {
                    y.append("<span>$");
                    y.append(z);
                }
            } else if (s == 2) {
                if (c != 0) {
                    y.append(z);
                }
            } else if (s == 3) {
                if (c == 0) {
                    y.append("$</span>");
                } else {
                    y.append(z);
                }
            } else if (s == 4) {
                y.append("$</div>");
                if (c != 0) {
                    y.append(z);
                }
            } else if (c != 0) {
                y.append(z);
            }
            s = t;
        }
        return y.toString();
    }

    public static String removescript(String str) {
        if (str == null) {
            return null;
        }
        return str.replaceAll("(?i)<(script[^>]*)>", "&lt;$1&gt;").replaceAll("(?i)</(script)[ ]*>", "&lt;/$1&gt;");
    }

    public static String validate(String x, String allowpun, int maxlength) {
        if (x == null) {
            return null;
        }
        StringBuffer y = new StringBuffer();
        for (int i = 0; i < x.length() && y.length() != maxlength; ++i) {
            int j = 0;
            if (allowpun != null) {
                int k;
                for (k = 0; k < allowpun.length() && allowpun.charAt(k) != x.charAt(i); ++k) {
                }
                if (k < allowpun.length()) {
                    y.append(x.charAt(i));
                    continue;
                }
            }
            for (; j < Toolbox.puntuations.length && x.charAt(i) != Toolbox.puntuations[j]; ++j) {
            }
            if (j != Toolbox.puntuations.length) continue;
            y.append(x.charAt(i));
        }
        return y.toString();
    }
    public static Vector<String> pins = new Vector<String>();
    public static synchronized boolean checkFileInUse(String filepath, boolean add) {
        if (add) {
            if (Toolbox.filepathinuse.contains(filepath)) {
                return false;
            }
            Toolbox.filepathinuse.add(filepath);
        } else {
            Toolbox.filepathinuse.remove(filepath);
        }
        return true;
    }
    
    
    public static AtomicInteger pagekeys = new AtomicInteger(0);
    public static String distname = null;
    public static boolean hasface = true;
    public static DBAdmin [] dbadmin = null;
    public static String encodings[] = null;
    public static String langs[] = null;
    public static int langnum = 0;
    public static String getUserLang(int orgnum)
    {
       int k= 0; if (orgnum>=0) k = (orgnum>>16);
       if (k >= Toolbox.locales.length || !Toolbox.locales[k].hasjs) 
           k = langnum;
       if (Toolbox.locales[k].hasjs)
           return langs[k] + ".js";
       return langs[0] + ".js";
    }
    public static String getUserEncoding(int orgnum)
    {
       int k= 0; if (orgnum>=0) k = (orgnum>>16);
       if (k >= msgs.length) k = langnum;
       return encodings[k] + ".js";
    }
    static public String msgs[][] = null; 
    public static String emsg(int j,int i)
    {
        if (j < msgs.length && msgs[j]!=null && i < msgs[j].length)
           return msgs[j][i];
        if (langnum < msgs.length && msgs[langnum]!=null && i < msgs[langnum].length)
           return msgs[langnum][i];
        return msgs[0][i];
    }
    public static String emsg(User user,int i)
    {
       if (user!=null) 
       {
           int j = user.orgnum>>16;
           if (j < msgs.length && msgs[j]!=null && i < msgs[j].length)
              return msgs[j][i];
       } 
       if (langnum < msgs.length && msgs[langnum]!=null && i < msgs[langnum].length)
           return msgs[langnum][i];
        return msgs[0][i];
    }
     
    public static String fontsnamestr(int j)
    {
        if (j<0 || j >= encodings.length) j = langnum;
        if (j < fontsname.length) return fontsname[j];
        return "times";
    }
    public static String emsgs(int j,int i)
    {
       if (i == 1398) return "lecture,assignment,answer,submission,notes,email,announcement,chat,discussion,communication";
       int  k = langnum; 
       if (j>=0) k = (j>>16);
       if (k >= msgs.length) k = langnum;
       if (msgs[k] != null && msgs[k]!=null && i < msgs[k].length )
          return msgs[k][i];
       if (langnum < msgs.length && msgs[langnum]!=null && i < msgs[langnum].length)
           return msgs[langnum][i];
        return msgs[0][i];
    }
    public static String emsg(int i)
    {
       if (i == 1398) return "lecture,assignment,answer,submission,notes,email,announcement,chat,discussion,communication";
       if (langnum < msgs.length && msgs[langnum]!=null && i < msgs[langnum].length)
           return msgs[langnum][i];
        return msgs[0][i];
    }
    public static JDBCAdapter getUserAdapter(DBConnectInfo dc,int orgnum)
    {
        JDBCAdapter j = new JDBCAdapter(dc,orgnum);
        j.enq();
        return j;
    }
    public static JDBCAdapter getUserAdapter(User user,int orgnum)
    {
        if (user==null) return null; 
        DBConnectInfo dc = user.getDBConnectInfo();
        if (edition.equals("Personal"))
           dc = dbadmin[0].sysDBConnectInfo();
        JDBCAdapter j = new JDBCAdapter(dc,orgnum);
        j.enq();
        return j;
    }
    public static JDBCAdapter getSysAdapter(int orgnum)
    {
        DBConnectInfo dc = dbadmin[orgnum%65536].sysDBConnectInfo();
        JDBCAdapter j = new JDBCAdapter(dc,orgnum);
        j.enq();
        return j;
    }
    static public int addDBAdmin(String schoolname)
    {
        DBAdmin [] x = new DBAdmin[dbadmin.length+1];
        for(int i=0; i < dbadmin.length; i++)
            x[i] = dbadmin[i];
        int j = dbadmin.length;
        x[j] = new DBAdmin(dbadmin.length);
        dbadmin = x;
         
        dbadmin[j].adminornumber = j;
        dbadmin[j].readdbs();
        dbadmin[j].initFolder();
        int p = dbadmin[j].hasSysDB();
        Toolbox.changecss("green","orange","red","blue",j);
        UploadFile.createfolder(j);
        if (Toolbox.tabledef != null) 
        {
            DbTable.syntable(Toolbox.dbadmin[j],Toolbox.tabledef);
        }
        dbadmin[j].run();
        long ll = System.currentTimeMillis();
        for (int k=0; k < Toolbox.langs.length; k++)  
        {
           String sql1 = "Update DomainValue SET lastupdate=" + ll+ ", domainValue='" + schoolname.replaceAll("'","''") + "' WHERE domain='Site Name' and code=0 AND language='" + langs[k] + "'";
           
            dbadmin[j].exesql(sql1);
          //  sql  = "insert into DomainValue(lastupdate,code,description,domain,domainvalue,encoding) VALUES( " + ll + ",1 ,'Site Name','Site Name','" + msgs[k][906].replaceAll("'","''")+ "','" + Toolbox.encodings[k] + "')";
            sql1 = "Update DomainValue SET  lastupdate=" + ll+ ", domainValue='" + emsg(k,906).replaceAll("'","''") + "' WHERE domain='Site Name' and code=1 AND language='" + langs[k] + "'";
           // dbadmin[j].exesql(sql);
            dbadmin[j].exesql(sql1);
            dbadmin[j].unitname[k] = schoolname + "/" + emsg(k, 906);
           
        }
        Set<String> e =  Generic.storedProc.keySet();
        int orgnum = (Toolbox.langnum<<16) + j;
        JDBCAdapter adapter = Toolbox.getSysAdapter(orgnum);
        for (String rdapn : e)
        {
           if (rdapn.indexOf("$") > 0) continue;
           Webform w = (Webform)(Generic.storedProc.get(rdapn));
           w.simplify(adapter, orgnum);
        }
        File fj = new File(installpath + File.separator + j);
        fj.mkdir();
        String str = "<meta http-equiv=\"refresh\" content=\"0; url=../index.jsp?orgnum0=" + j + "\" />";
        try{ 
            FileWriter aWriter = new FileWriter(Toolbox.installpath + File.separator + j + File.separator + "index.html", false);
            aWriter.write(str);
            aWriter.close();
        }catch(Exception e1){}
        return j; 
    }
}