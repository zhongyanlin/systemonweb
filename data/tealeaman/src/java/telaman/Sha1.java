
package telaman;
 
import java.security.*;
import java.io.*;
import java.util.*;
import java.util.regex.*;

public final class Sha1 
{
    private static final int h1 = 1732584193;
    private static final int h2 = -271733879;
    private static final int h3 = -1732584194;
    private static final int h4 = 271733878;
    private static final int h5 = -1009589776;
    private static final int y1 = 1518500249;
    private static final int y2 = 1859775393;
    private static final int y3 = -1894007588;
    private static final int y4 = -899497514;
     
    public static String sha1dir(final File file, StringBuffer v) 
    {
        fc = "WEB-INF.zip,license.txt,.png,.jpg,.jpeg,.gif,.bak,dbhost.crp,maintain.js,funblock,comentity,styleb,style.css,stylea.css,rou.crp,msg.crp,dwldurks.crp".split(",");
        if (v == null)
        {
            v = new StringBuffer();
            
            sha1dir(file, v);
            return hash(v.toString());
        }
        
        if (file.isFile()) return "";
        String fp = file.getAbsolutePath().replaceFirst("\\.$", "");
        if (fp.charAt(fp.length()-1) == File.separatorChar)
            fp = fp.substring(0, fp.length()-1);
        String [] fs = file.list() ;
        if (fs == null) return "";
        Arrays.sort(fs);
        for (String fn : fs)
        {
            File f = new File(fp, fn);
           
            if (f.isDirectory())
            {
                if (fn.equals("mathjax") == false && fn.equals("image") == false)
                sha1dir(f, v);
            }
            else 
            {
                boolean init = false;
                for (String x : fc)
                {
                    if (fn.replaceFirst("[0-9]+\\.","").toLowerCase().indexOf(x) >= 0)
                    {
                        init = true;
                       
                        break;
                    }
                }
                
                if (init == false) 
                {
                    try{
                    String xx = sha1file(f);
                    v.append(xx);
                    
                    }catch(Exception e){}
                }
            }
        }
        return "";
    }
    private static String doSha1(int[] Message) {
        int H1 = 1732584193;
        int H2 = -271733879;
        int H3 = -1732584194;
        int H4 = 271733878;
        int H5 = -1009589776;
        int integer_count = Message.length;
        int[] X = new int[80];
        for (int block_start = 0; block_start < integer_count; block_start+=16) {
            int t;
            int j;
            for (j = 0; j < 16; ++j) {
                X[j] = Message[block_start + j];
            }
            for (j = 16; j < 80; ++j) {
                X[j] = Sha1.rol(X[j - 3] ^ X[j - 8] ^ X[j - 14] ^ X[j - 16], 1);
            }
            int A = H1;
            int B = H2;
            int C = H3;
            int D = H4;
            int E = H5;
            for (j = 0; j < 20; ++j) {
                t = Sha1.rol(A, 5) + (B & C | ~ B & D) + E + X[j] + 1518500249;
                E = D;
                D = C;
                C = Sha1.rol(B, 30);
                B = A;
                A = t;
            }
            for (j = 20; j < 40; ++j) {
                t = Sha1.rol(A, 5) + (B ^ C ^ D) + E + X[j] + 1859775393;
                E = D;
                D = C;
                C = Sha1.rol(B, 30);
                B = A;
                A = t;
            }
            for (j = 40; j < 60; ++j) {
                t = Sha1.rol(A, 5) + (B & C | B & D | C & D) + E + X[j] + -1894007588;
                E = D;
                D = C;
                C = Sha1.rol(B, 30);
                B = A;
                A = t;
            }
            for (j = 60; j < 80; ++j) {
                t = Sha1.rol(A, 5) + (B ^ C ^ D) + E + X[j] + -899497514;
                E = D;
                D = C;
                C = Sha1.rol(B, 30);
                B = A;
                A = t;
            }
            H1+=A;
            H2+=B;
            H3+=C;
            H4+=D;
            H5+=E;
        }
        return Sha1.padhex(H1) + Sha1.padhex(H2) + Sha1.padhex(H3) + Sha1.padhex(H4) + Sha1.padhex(H5);
    }
    private Sha1() {
    }

    public static String hash1(String plain) {
        StringBuffer x = new StringBuffer();
        for (int i = 0; i < plain.length(); ++i) {
            char y;
            if ((y = plain.charAt(i)) <= ' ') continue;
            if (y == '\u00ff') continue;
            x.append(Character.toLowerCase(plain.charAt(i)));
        }
        return Sha1.hash(x.toString());
    }

    public static String hash(String plain) {
        int bit_length = plain.length() * 16;
        int total_bit_length = bit_length + 1 + 64 + 511 & -512;
        int msg_length = total_bit_length / 32;
        int[] Message = new int[msg_length];
        for (int pos = 0; pos < msg_length; ++pos) {
            if (pos * 32 < bit_length) {
                char unicode = plain.charAt(pos * 2);
                Message[pos] = unicode << 16;
            } else if (pos * 32 == bit_length) {
                Message[pos] = Integer.MIN_VALUE;
            }
            if (pos * 32 + 16 < bit_length) {
                char unicode2 = plain.charAt(pos * 2 + 1);
                Message[pos] = Message[pos] | unicode2 & 65535;
                continue;
            }
            if (pos * 32 + 16 != bit_length) continue;
            Message[pos] = Message[pos] | 32768;
        }
        Message[msg_length - 1] = bit_length;
        return Sha1.doSha1(Message);
    }

    private static int rol(int x, int shift) {
        return x << shift | x >>> 32 - shift;
    }

    private static String padhex(int H) {
        String x = String.format("%x", H);
        while (x.length() < 8) {
            x = "0" + x;
        }
        return x;
    }
    static String[] fc = null;
    

    public static String sha1file(final File file) throws NoSuchAlgorithmException, IOException 
    {
         
        MessageDigest sha1 = MessageDigest.getInstance("SHA1");
        FileInputStream fis = new FileInputStream(file);
  
        byte[] data = new byte[1024];
        int read = 0; 
        while ((read = fis.read(data)) != -1) {
            sha1.update(data, 0, read);
        };
        byte[] hashBytes = sha1.digest();
        fis.close();
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < hashBytes.length; i++) {
          sb.append(Integer.toString((hashBytes[i] & 0xff) + 0x100, 16).substring(1));
        }
        FileWriter fw = new FileWriter("C:\\project\\tealeaman\\aaa.txt", true);
        String fileHash = sb.toString();
        fw.append(file.getAbsolutePath() + "=" + fileHash + "\n");
        fw.close();
        return fileHash;
   }
     
}
