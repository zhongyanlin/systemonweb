 
package telaman;
import javax.servlet.http.*;
import java.util.concurrent.atomic.*; 
import javax.net.ssl.*;
import java.security.*;
import javax.servlet.*;
 
public class CachedStyle 
{
    public String IBGCOLOR,DBGCOLOR,TBGCOLOR,BBGCOLOR,fontname,timeformat=null;
    public int fontsize =17;
    public CachedStyle(HttpServletRequest request, int orgnum)
    {
        String s = null;
        if (request!=null) s = Toolbox1.GetCookie(request, "colorsfont");
        
        String [] ss = null;
        try{
            if (s!=null) ss = Msgsend.back(s).split("\\.");
           
        }catch(Exception e){
       
        }
        
        if (ss!=null && ss.length == 6)
        {
            IBGCOLOR = (ss[0]);
            DBGCOLOR = (ss[1]);
            TBGCOLOR = (ss[2]);
            BBGCOLOR = (ss[3]);
            fontname = (ss[4]);
 
            if (fontname.matches("[0-9]+"))
            try{
                int k = Integer.parseInt(fontname);
                String x[]= Toolbox.emsgs(orgnum,1497).split(";");
                if (k < x.length)
                    fontname = x[k];
                else
                    fontname = x[0];
               
            }catch(Exception e){}
            try{fontsize = Integer.parseInt(ss[5]);}catch(Exception e){}
            if (request!=null)
                s = Toolbox1.GetCookie(request, "timeformat"+orgnum );
            else s = null;
            if (s != null) 
                timeformat = Msgsend.back(s);
            else
                timeformat = Toolbox.timeformat[orgnum>>16];
        }
        else
        {
            DBAdmin x = Toolbox.dbadmin[orgnum%65536];
            IBGCOLOR = x.IBGCOLOR;
            DBGCOLOR = x.DBGCOLOR;
            TBGCOLOR = x.TBGCOLOR;
            BBGCOLOR = x.BBGCOLOR;
            fontname = Toolbox.fontsnamestr(orgnum>>16);
            timeformat = Toolbox.timeformat[orgnum>>16];
        }
    }
    public String toString()
    {
         String hDBGCOLOR = Toolbox.headercl(DBGCOLOR);
         return  "<style>:root{--hibgcolor:"+ IBGCOLOR
                 +";--hdbgcolor:"+ hDBGCOLOR
                 +";--hbbgcolor:"+ Toolbox.headercl(BBGCOLOR)
                 +";--edbgcolor:" + Toolbox.headerc2(hDBGCOLOR)
                 +";--ibgcolor:" + IBGCOLOR
                 +";--dbgcolor:" + DBGCOLOR
                 +";--tbgcolor:" + TBGCOLOR
                 +";--bbgcolor:" + BBGCOLOR 
                 +";--fontname:" + fontname
                 +";--fontsize:" + fontsize 
                 +"px}\n</style>";
                
    }
}
