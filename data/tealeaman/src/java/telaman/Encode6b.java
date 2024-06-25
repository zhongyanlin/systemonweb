package telaman;

import java.util.*;
import java.io.*;
import java.util.zip.*;

 
public class Encode6b 
{
    int orgnum = 0;
    public String rto6b(String s) throws Exception 
    {
       String checksum = s.substring(s.length() - 15);
       if (checksum.toLowerCase()==checksum && checksum.replaceAll("[0-9]", "").replaceAll("[a-z]", "").equals(""))
       {
           s = s.substring(0, s.length() - 15); 
           if (Sha1.hash(Esign.signrsastr + s).substring(0,15).equals(checksum) == false)
               throw new Exception();
       }
       if (s.indexOf("_") == 0) 
           s = s.substring(1);
       int k = 0;
       int left = 0;
       int j = 0;
      
       Vector<Byte> buf = new Vector<Byte>();
       while (k < s.length())
      {
         char c = s.charAt(k);
         int i = rchar6(c);
         if (i==-1)throw (new Exception("i=" +i +",c=" + c));
         
         if (left == 0) 
         {
             if (k==s.length()-1) throw (new Exception("broken"));
             k++;
             char d = s.charAt(k);
             j = rchar6(d);
             if (j==-1)throw (new Exception("j="+ j +",d=" + d));
             i = (i * 4) + (j >> 4);
             buf.addElement(new Byte( (byte)(i-128) ) );
             left = 4;
         }
         else if (left == 4)
         {
             int m = (j % 16) * 16 + (i >> 2) ;
             buf.addElement(new Byte( (byte)(m-128) ) );
             j = i;
             left = 2;
         }
         else if (left == 2)
         {
            int m = ( j % 4)* 64  + i;
            buf.addElement(new Byte( (byte)(m-128) ) );
            j = i;
            left = 0;
         }
         k++;
     }  
     if (left == 4 &&  (j%16) !=0 ) throw new Exception();
     if (left == 2 &&  (j%4)!= 0  )throw new Exception();
     byte bytes[] = new byte[buf.size()];
     for (int i=0; i < buf.size(); i++)
     {
          Byte ob = buf.elementAt(i);
          bytes[i] = ob.byteValue();
     }
     String xx = new String(bytes);
     
     return refolder(xx);        
    }
    
    
    static int shuffle[]={48,43,40,14,2,19,9,23,18,63,0,7,12,35,44,39,56,59,52,45,58,21,22,47,49,38,31,26,15,8,30,25,50,33,34,62,5,37,27,51,36,61,41,16,3,57,4,53,11,24,54,42,20,29,32,28,1,46,13,17,60,6,55,10
}; 
    static int rshuffle[] = {10,56,4,44,46,36,61,11,29,6,63,48,12,58,3,28,43,59,8,5,52,21,22,7,49,31,27,38,55,53,30,26,54,33,34,13,40,37,25,15,2,42,51,1,14,19,57,23,0,24,32,39,18,47,50,62,16,45,20,17,60,41,35,9
};
    static String folders[][]  = null;//{DBAdmin.webFileFolder, DBAdmin.webFileFolder1, DBAdmin.dbFileFolder, Toolbox.installpath, ServerAgent.workingFolder};
    
    static public void makefolder(int i)
    {
        if (folders == null)
        {
            folders = new String[Toolbox.dbadmin.length][];
        }
        else if(i == folders.length)
        {
            String [][] x = new String[folders.length+1][];
            for(int j=0; j < folders.length; j++)
               x[j] = folders[j];
            folders = x;
        }
        folders[i] = new String[]{Toolbox.dbadmin[i%65536].webFileFolder, Toolbox.dbadmin[i%65536].webFileFolder1, Toolbox.dbadmin[i%65536].dbFileFolder, Toolbox.installpath, ServerAgent.workingFolder,Toolbox.dbadmin[i%65536].websiteFolder};
       
    }
   /*  
    static String pfolders[] = {
        "lecture", "assignment", "submission", "answer", "notes",
        "communication" + File.pathSeparator + "email", 
        "communication" + File.pathSeparator + "announcement", 
        "communication" + File.pathSeparator + "chat",
        "communication" + File.pathSeparator + "discussion"}; 
    */
    public Encode6b(int orgnum)
    {
        this.orgnum = orgnum % 65536;
        makefolder(this.orgnum);
    }
   String dofolder(String s) 
    {
           for (int i=0; i < folders[orgnum].length; i++)
           { 
             
               if (s.indexOf(folders[orgnum][i]) == 0)
               {
                   s = i + s.substring(folders[orgnum][i].length());
                   break;
               }
           }
        
        int j;
        if (UploadFile.pfolders == null)  UploadFile.makepfolder();
        for (int i=0; i < UploadFile.pfolders.length; i++)
        {
         
           if ( (j = s.indexOf(File.separator + UploadFile.pfolders[i] + File.separator)) > 0)
           {
               s = s.substring(0, j) + File.separator + i + File.separator + s.substring(j + 2 + UploadFile.pfolders[i].length());
               break;
           }
        }
        return s;
    }
    String refolder(String s) 
    {
        if ('/' == File.pathSeparatorChar)
           s = s.replace('\\', '/');
        else if ('\\' == File.pathSeparatorChar)
           s = s.replace('/','\\'); 
        int j = 0;
        if (UploadFile.pfolders == null)  UploadFile.makepfolder();
        for (int i=0; i < UploadFile.pfolders.length; i++)
           if ( (j = s.indexOf(File.separator + i + File.separator)) > 0)
           {
               s = s.substring(0, j) + File.separator + UploadFile.pfolders[i] + File.separator + s.substring(j + 3);
               break;
           }
      
          for (int i=0; i < folders[orgnum].length; i++)
           if (s.indexOf("" + i) == 0)
           {
               s =  folders[orgnum][i] + s.substring(1);
               break;
           }
       
        return s;
    }
    static public char  char6(int i)
    {
        i = rshuffle[i];
        if (i<10) return (char)('0' + i);
        else if (i < 36) return (char)('A' + (i-10));
        else if (i < 62) return (char)('a' + (i-36));
        else if (i == 62) return '.';
        else if (i == 63) return '-';
        else return ' ';
    }
    static int rchar6(char c)
    {
        int j = 0;
        if ( c =='.') j = 62;
        else if ( c == '$' || c == '-') j = 63;
        else if ( c >= '0' && c <= '9') j = (int)(c - '0');
        else if ( c >= 'A' && c <= 'Z') j = (int)(c - 'A' + 10);
        else if ( c >= 'a' && c <= 'z') j = (int)(c - 'a' + 36);
        else return -1;
        return shuffle[j];
    }
    
    public String to6b(String s)
    {
       s = dofolder(s);
 
       String b = (s.indexOf(File.separator + "2" + File.separator ) > 0)? "_":"";
 
       byte y[] = s.getBytes();
       int x [] = new int[y.length];
 
       for (int i=0; i < x.length; i++)
       {
           x[i] = 128 + y[i];
           int z = x[i];
       }
 
       if (x.length<1) return "";
       int k = 0;
       StringBuffer buf = new StringBuffer();
 
       while (k < x.length)
     {
       int i =  x[k]>>2 ;
       buf.append( char6(i) );
       
       int j = x[k] ;
       j %=4;
       j *=16;
        
       if (k+1==x.length)
       {
          buf.append( char6(j) );
          
          break;  
       }
       i = x[k+1];
       i = i >> 4;
       j += i;
       buf.append( char6(j));
        
       
       int m =  x[k+1] ;
       m %= 16;
       m *= 4;
       if (k+2==x.length)
       {
         buf.append( char6(m) ); 
          
         break;  
       }
       i = x[k+2];
       m += i >> 6;
       
       buf.append( char6(m));
        
       
       int n =  x[k+2] ;
       n %= 64;
       buf.append( char6(n));
        
       k += 3;
     }  
      
     String beforecode =  b + buf.toString()  ; 
     
     String checksum = Sha1.hash(Esign.signrsastr + beforecode );
     return beforecode + checksum.substring(0,15);
     
    }
    public static String to64 (byte x[])
     {
        if (x==null) return null;
        if (x.length==0) return "";
        StringBuffer h = new StringBuffer();
        int k = 0, e = 0, s, y, j = 0;
        int M = (int)(Math.ceil(x.length * 8/6.0));
        
        while (k < x.length && j++ < M)
        {
           s = e;
           e += 6;
           y = 255 & x[k];
           if (e >= 8)
           {
              if (k+1 < x.length)
                 y += (255 & x[++k]) << 8;
              e -= 8;
           }
           y = y >> s;
           y = (63 & y);
           h.append(char6(y));
        }
        return h.toString();
     }



    public static byte [] from64 (String x ) throws Exception
     {
        if (x==null) return null;
        int N = x.length();

        if (N == 0) return null;
        int M = (int)(Math.floor(N * 6/8.0));

        byte r[] = new byte[M];
        int k=0;
        byte  z, w, u;
        int e=0, s, y,j=0;
        while ( k < N && j < M)
        {
           s = e;
           e += 8;
           y = rchar6(x.charAt(k));
           if (k+1 < N)
           {
              y +=  rchar6(x.charAt(++k)) << 6;
              if (e < 12)
                 e -= 6;
              else
              {
                 if (k+1 < N)
                    y +=  rchar6(x.charAt(++k)) << 12;
                 e -= 12;
              }
           }
           y = y >> s;
           y = y & 255;
           r[j++] = (byte)y;
        }
        return r;
     }
public static byte[] compressByteArray(byte[] input)
     {

        Deflater compressor = new Deflater();
        compressor.setLevel(Deflater.BEST_COMPRESSION);
        compressor.setInput(input);
        compressor.finish();
        ByteArrayOutputStream bos = new ByteArrayOutputStream(input.length);
        byte[] buf = new byte[1024];
        while (!compressor.finished()) {
            int count = compressor.deflate(buf);
            bos.write(buf, 0, count);
        }

        try
        {
            bos.close();
        } catch (IOException e) {}
        byte[] compressedData = bos.toByteArray();

        return compressedData;
    }

    public static byte[] uncompressByteArray(byte[] compressedData) throws Exception
    {
        Inflater decompressor = new Inflater();
        decompressor.setInput(compressedData, 0, compressedData.length);

        ByteArrayOutputStream bos = new ByteArrayOutputStream(compressedData.length);
        byte[] buf = new byte[1024];
        try
        {
           while (!decompressor.finished())
           {
               int count = decompressor.inflate(buf);
               if (count > 0)
               {
                   bos.write(buf, 0, count);
               }
               else
               {
                   throw new Exception();
               }
           }
        }
        catch (DataFormatException e){ }
        try
        {
            bos.close();
        }
        catch (IOException e) {
        }
        byte[] decompressedData = bos.toByteArray();
        return decompressedData;
    }
    static public String zip64(String s)
    {
       try{
          return to64(compressByteArray(s.getBytes()));
       }
       catch(Exception e){ return "";}
    }
    static public String rzip64(String s) throws Exception
    {
       return new String(uncompressByteArray(from64(s)));
    }
public static void main1(String [] arg)
{
    String a = "&rdap=acalender&extraline=0";
    String b = zip64(a);
    try{ //Ggfq12q8EAc5Cjkd6ly86lYqml$g2kd6dy8lMiAA0TM$eA

       
    }catch (Exception e){}
}
public static void main(String [] arg)
{
    String a = "d";
    Encode6b t = new Encode6b(0);
    String b = t.to6b(a);
    String c = "";
    try
    {
      c = t.rto6b(b);
    }catch(Exception e){
         Toolbox.println(1,"exception" + e.toString());
    }
    
     
    java.util.Random r = new java.util.Random();
    int x[] = new int[64];
    for (int i=0; i < 64; i++)
    { x[i] = i;}
   
    for (int i=0; i < 64; i++)
    {
        int j = r.nextInt(64);
        int k = r.nextInt(64);
        int h = x[j];
        x[j] =x[k];
        x[k] = h;
    }
    int y[] = new int[64];
    for (int i=0; i < 64; i++)
    {
        Toolbox.print(1,"," + x[i]);
        y[x[i]] = i;
    }
    
    for (int i=0; i < 64; i++)
    {
        Toolbox.print(1,"," + y[i]);
        
    }
}
}

