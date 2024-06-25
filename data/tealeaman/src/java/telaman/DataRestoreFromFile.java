 
package telaman;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.zip.GZIPInputStream;
import javax.servlet.ServletException;
import telaman.CSVParse;
import telaman.DBAdmin;
import telaman.DBConnectInfo;
import telaman.DataExe;
import telaman.DataRestore;
import telaman.Encode6b;
import telaman.Toolbox;

public class DataRestoreFromFile extends DataRestore 
{
    String filepath;
    FileInputStream fileinputstream = null;
    PrintWriter out;
    String msgfilepath = null;
    User user;
    int isupload = 3;
    int fileorder = 0;
    String filenames[];
    public DataRestoreFromFile(String filepath, User user, String overlap, String totable, /*String encoding,*/ DBConnectInfo c, String sek) {
        super(overlap, totable,c);// encoding, c);
        this.sek = sek;
        this.user = user;
        if (filepath.charAt(0) == '1' || filepath.charAt(0) == '0'|| filepath.charAt(0) == '2')
        {
          isupload =  (int)(filepath.charAt(0))- (int)('0');
          filepath = filepath.substring(1);
        }
        
        if (filepath.indexOf(";") > 0)
        {
           filenames = filepath.split(";");
           if (user!=null)
           filepath = user.webFileFolder + File.separator + filenames[0];
        }
        else
        {
           filenames = new String[]{filepath};
           if (isupload == 3)
               filepath = filenames[0];
           else if (user!=null)
               filepath = user.webFileFolder + File.separator + filenames[0];

        }
        file2stream(filepath);
    }

void file2stream(String filepath)
{
        this.filepath = filepath;
        int j = filepath.lastIndexOf(".");
        File f = new  File(filepath); 
        try 
        {
            if (j > 0 && filepath.substring(j + 1).equals("zip"))
            {
                this.fileinputstream = new FileInputStream(f);
                this.csvparse = new CSVParse(new GZIPInputStream(this.fileinputstream), DBAdmin.CSVquote, DBAdmin.CSVseparator);
            } else if (j > 0 && filepath.substring(j + 1).equals("bak")) 
            {
                this.fileinputstream = new FileInputStream(f);
                this.csvparse = new CSVParse(this.fileinputstream, DBAdmin.CSVquote, DBAdmin.CSVseparator);
            }
            else if (j > 0 && filepath.substring(j + 1).equals("sql")) 
            {
                this.fileinputstream = new FileInputStream(f);
                this.csvparse = new CSVParse(this.fileinputstream, '\'', new String[]{",",";"});
            }
            if (user!=null)
            {
                msgfilepath = user.webFileFolder + File.separator + "dbroutine" + File.separator + f.getName().replaceFirst("\\.[^\\.]+$", ".html");
                this.out = new PrintWriter(new File(msgfilepath));
            } 
             
        }
        catch(Exception e){}
    }

      
    public void close() 
    {
        try 
        {
            if (this.fileinputstream != null) 
            {
                this.fileinputstream.close();
            }
            out.close();
        }
        catch (Exception e) 
        {
           
        }
    }
    String emsg(int j)
    {
        return Toolbox.emsgs(orgnum,j);
    }
    public int process(int orgnum, CachedStyle cachedstyle) throws ServletException, IOException 
    {
        
        this.orgnum = orgnum;
        int j;
        do 
        {
            if (fileorder>0 && user!=null) 
                file2stream(user.webFileFolder + File.separator + filenames[fileorder]);
            if (out!=null) 
            {
                this.outerr("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" >");
                this.outerr("<head>");
                this.outerr(Toolbox.getMeta(orgnum));
                this.outerr("<title>" + emsg(441) + "</title>");
                this.outerr(cachedstyle.toString() + "<link rel=\"stylesheet\" type=\"text/css\" href=\"styleb" + (orgnum) + ".css\" />");
                this.outerr("<script type=text/javascript>" + Toolbox.someconsts(orgnum) + "</script><script type=text/javascript  src=" + Toolbox.getUserLang(orgnum) + " ></script><script type=text/javascript  src=cookie.js></script>");
                this.outerr("<script type=text/javascript>var orgnum=" + orgnum + ";document.write(unifontstyle(" + Toolbox.defaultFontSize + "));</script>");
                this.outerr("</head>");
                this.outerr("<body><br>");
                this.outerr(Toolbox.title(emsg(441)));
            } 
            int k = filepath.lastIndexOf(".");
            
            if (k > 0 && filepath.substring(k + 1).equals("sql"))
            {
                j = process1(orgnum);
            }
            else
                j = super.process(orgnum);
            
     
            File fn0 = new  File(filepath);
            File fn = new  File(msgfilepath); 
            msg += "<br>"+ emsg(448) + ":" +  fn0.getName() + "<br>" +  emsg(1473);
            try 
            {
                if (this.fileinputstream != null) 
                {
                    this.fileinputstream.close();
                }

            }
            catch (Exception e) 
            {

            }
 
            if (out!=null)
            {
                Encode6b encoder = new Encode6b(orgnum);
                String str0 = encoder.to6b(filepath);
                String str = encoder.to6b(msgfilepath);
                this.outerr("<br><center>");
                if (isupload == 1 || isupload == 2 )
                {
                    fn0.delete();
                }
                else
                {
                     this.outerr("<a href=\"UploadChangePic?pathcode=" + str0 + "&tcode=" + fn0.lastModified() +  "\" target=tiny1 >" + emsg(1543) + fn0.getName()  +"</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
                }
                this.outerr("<a href=\"UploadChangePic?pathcode=" + str + "&tcode=" + fn0.lastModified() + "\" target=tiny1 >" + emsg(1544)    +"</a></center>");
                this.outerr("<iframe name=tiny1 width=1 height=1 /></body></html>");
                msg +=   " <a href=FileOperation?did=" + str + "&t=" + (new java.util.Date()).getTime() + "   target=_blank > "
                 + user.id + msgfilepath.substring(user.webFileFolder.length())+ "</a>";
            } 
            try 
            {
                if (out!=null) out.close();
            }
            catch (Exception e) 
            {

            }
  
            fileorder++;
            
        }   
        while( fileorder < filenames.length);
        if (isupload == 2)
        {
            int i = filenames[0].indexOf(File.separator);
            if (user!=null)
            new File(user.webFileFolder + File.separator + filenames[0].substring(0,i)).delete();
        }
   
        return j;
    }

    @Override
    boolean outerr(String err) 
    {
        if (out!=null)
        try
        {
           out.print(err);
           return true;
        }
        catch(Exception e){}
        return false;
    }

    public String error() 
    {
        
        return "";
    }
    
   
}
