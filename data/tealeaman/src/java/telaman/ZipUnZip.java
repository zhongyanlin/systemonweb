 
package telaman;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

public class ZipUnZip
{
    List<String> fileList;
    String sourcefolder;
    long start =-1, end = -1;
    long sourcelength = 0, zippedlength=0;
    public LongFilePro lf = null;
    String samefile = null;
    public static String  zip(String sourcefolder, long s, long e,long t[])
    {
        if (sourcefolder == null)
        {
            return null;
        }
         
        sourcefolder =  sourcefolder.trim().replaceFirst("[\\\\|/]$", "");
        if (new File(sourcefolder).exists() == false)
        {
                        return null;
        }
        String zipfile  = sourcefolder  +   ".zip";
        if ( (new  File(zipfile)).exists()  ) 
        {
           int j = 0;
           while ((new  File(sourcefolder    + j + ".zip")).exists())
           {
               j++;
           } 
           zipfile  = sourcefolder    + j + ".zip"; 
        }
        
        ZipUnZip appZip = new ZipUnZip( s,   e );
        appZip.sourcefolder = sourcefolder;
        appZip.generateFileList(new File(sourcefolder));
        appZip.zipIt(zipfile);
        if (t!=null)
        {
        t[0] =  appZip.fileList.size(); 
        t[1] =  appZip.sourcelength; 
        t[2] = appZip.zippedlength;
        }
        return zipfile; 
    }
    public static String  unzip(String sourcezip, String gotofolder, long t[], LongFilePro lf, int orgnum)
    {
        String zippedfolder  = gotofolder;
        
        if (gotofolder == null)
        {
            zippedfolder  = sourcezip.replaceFirst(".zip$", "");
            if ( (new  File(zippedfolder)).exists()  ) 
            {
               int j = 0;
               while (true)
               {
                   zippedfolder  = sourcezip.replaceFirst(".zip$", "" + j)  ;
                   if ( (new  File(zippedfolder)).exists() == false ) 
                       break;
                   j++;
               } 
            }
        }
        ZipUnZip appZip = new ZipUnZip(-1,-1);
        appZip.lf = lf;
        if (lf!=null)
        {
            appZip.samefile = lf.samefile;
        }
        long l = appZip.unZipIt(sourcezip, zippedfolder,orgnum); 
        if (t!=null) t[0] = l;
        return zippedfolder; 
         
    }	


    public ZipUnZip(long s, long e )
    {
	    fileList = new ArrayList<String>();
        this.start = s;
        this.end = e;
    }

    public static void main( String[] args )
    {
        String SOURCE_FOLDER = "C:\\Users\\zhong\\Downloads\\wubing"; 
        String x = zip(SOURCE_FOLDER,-1,-1,null); 
         Toolbox.println(0,"x=" + x);
    	String y = null;
        if (x !=null) y = unzip(x,null, null,null,0);
        Toolbox.println(0,"y=" + y);
    }

    
    public void zipIt(String zipFile){
     sourcelength = 0;
     zippedlength=0;
     byte[] buffer = new byte[1024];
    
     try
     {
        FileOutputStream fos = new FileOutputStream(zipFile);
    	ZipOutputStream zos = new ZipOutputStream(fos);
 
    	for(String file : this.fileList)
        {
            ZipEntry ze= new ZipEntry(file);
        	zos.putNextEntry(ze);
            File ff = new File(sourcefolder + File.separator + file);
            sourcelength += ff.length();
            FileInputStream in =  new FileInputStream(ff);
            ze.setTime(ff.lastModified());
        	int len;
        	while ((len = in.read(buffer)) > 0) {
        		zos.write(buffer, 0, len);
                zippedlength += len;
        	}

        	in.close();
    	}
        zos.closeEntry();
    	zos.close();
 
    }catch(IOException ex){
       ex.printStackTrace();
    }
    
   }
    
   public static  String zipfile(String file)
   {
       String zipFile = file.replaceFirst("(?i).[a-z][a-z]?[a-z]?[a-z]?$", "");
        
        if ( !(new  File(zipFile + ".zip")).exists()  ) 
            zipFile+= ".zip";
        else
        {
           int j = 0;
           while ((new  File(zipFile + j + ".zip")).exists())
           {
               j++;
           } 
           zipFile += j + ".zip";
        }
        byte[] buffer = new byte[1024]; 
       try
       {
        FileOutputStream fos = new FileOutputStream(zipFile);
    	ZipOutputStream zos = new ZipOutputStream(fos);
        File ff = new File(  file);
    	ZipEntry ze= new ZipEntry(ff.getName());
        zos.putNextEntry(ze); 
        FileInputStream in =  new FileInputStream(ff);
        ze.setTime(ff.lastModified());
        int len;
        while ((len = in.read(buffer)) > 0) 
        {
        	zos.write(buffer, 0, len);
        }
        in.close();
    	zos.closeEntry();
    	zos.close();
       }catch(Exception e){}
       return zipFile;
}

    
    public void generateFileList(File node)
    {
        if(node.isFile() && (start >= 0 && node.lastModified()>=start || start==-1 ) 
                         && (end >= 0   && node.lastModified()<=end   || end==-1 ) )
        {
            fileList.add(generateZipEntry(node.getAbsoluteFile().toString()));
        }

        if(node.isDirectory())
        {
            String[] subNote = node.list();
            for(String filename : subNote)
            {
                generateFileList(new File(node, filename));
            }
        }

    }

    
    private String generateZipEntry(String file){
    	return file.substring(sourcefolder.length()+1, file.length());
    }
    
    
    public long unZipIt(String zipFile, String outputFolder, int orgnum)
    {
     byte[] buffer = new byte[1024];
     long leng = 0;
     String [] xs = Toolbox.emsg(1545).split("@");
     try
     {
        //create output directory is not exists
    	File folder = new File(outputFolder);
    	if(!folder.exists()){
    		folder.mkdir();
    	}
        //get the zip file content
    	ZipInputStream zis = new ZipInputStream(new FileInputStream(zipFile));
    	//get the zipped file list entry
    	ZipEntry ze = zis.getNextEntry();
        int l = 0;
        if (lf!=null) l = lf.userdir.length()+1;
        StringBuffer ms = new StringBuffer(512);
    	while(ze!=null){

    	   String fileName = ze.getName();
           File newFile = new File(outputFolder + File.separator + fileName);
 
            new File(newFile.getParent()).mkdirs();
            File oldFile = new File(outputFolder + File.separator + fileName.replaceFirst("(\\.[^\\.]+)$", "_o$1"));
            
            int which = 0;
            if (newFile.exists() && (samefile==null || samefile.equals("override")))
            {
                if (lf!=null)
                ms.append("&nbsp;<nobr>" + xs[0] + " "+ (outputFolder + File.separator + fileName).substring(l) +  "</nobr><br>");
                if(newFile.renameTo(oldFile)) newFile = new File(outputFolder + File.separator + fileName);
                which =1;
            }
            else if (newFile.exists() && (samefile.equals("copy")))
            {
                if (lf!=null)
                ms.append("&nbsp;<nobr>" +  xs[1] + " "+ (oldFile.getAbsolutePath()).substring(l) +  "</nobr><br>");
                if(newFile.renameTo(oldFile)) newFile = new File(outputFolder + File.separator + fileName);
                which =2;
            }
            else if (newFile.exists() && (samefile.equals("ignore")))
            {
                if (lf!=null)
                ms.append("&nbsp;<nobr>"  + xs[2] + " "+ (outputFolder + File.separator + fileName).substring(l) + "</nobr><br>");
                newFile = null;
                 which =3;
            }
            else
            {
                if (lf!=null)
                ms.append("&nbsp;<nobr>"  + xs[3] + " "+ (outputFolder + File.separator + fileName).substring(l) + "</nobr><br>");
                which = 4;
            }
            int len;
            if (newFile!=null)
            {
                FileOutputStream fos =   new FileOutputStream(newFile);
               
                while ((len = zis.read(buffer)) > 0) 
                {
                    fos.write(buffer, 0, len);
                    leng += len;
                }
                fos.close();
                if (which==1) oldFile.delete();
                
            }
            else
            {
                while ((len = zis.read(buffer)) > 0) 
                {
                     
                }
            }
            if (ms.length()>=500 )
            {
                lf.backmessage(ms.toString());
                ms.setLength(0);
            }
            ze = zis.getNextEntry();
    	}

        zis.closeEntry();
    	zis.close();
        if (lf!=null)
        lf.backmessage(ms.toString());
             
    }catch(IOException ex){
       ex.printStackTrace();
    }
      return leng;
   }
}
