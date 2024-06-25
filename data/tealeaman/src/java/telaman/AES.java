 
package telaman;

import java.security.Key;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
 
public class AES {
    KeyGenerator kgen = null;
    Cipher cipher = null;
    SecretKeySpec skeySpec = null;
    public byte[] raw = null;
    boolean good = false;
    static char[] allhexdigits = new char[]{'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'};
     
    public AES(String key) 
    {
        raw = new byte[key.length()/2];
        for (int i=0; i < raw.length; i++)
        {
            char a = key.charAt(2*i);
            char b = key.charAt(2*i + 1);
            int k = -1;
            if (a >= '0' && a <='9')
                k = a - '0';
            else
                k = a - 'a';
            int l = -1;
            if (b >= '0' && b <='9')
                l = b - '0';
            else
                l = a - 'a';
            raw[i] = (byte)(16*k + l - 128);
        }
        try {
            this.skeySpec = new SecretKeySpec(raw, "AES");
            this.good = true;
        }
        catch (Exception e) {
            // empty catch block
        }
    }
    public AES() {
        try {
            this.kgen = KeyGenerator.getInstance("AES");
            this.kgen.init(128);
            SecretKey skey = this.kgen.generateKey();
            this.cipher = Cipher.getInstance("AES");
            raw = skey.getEncoded();
            this.skeySpec = new SecretKeySpec(raw, "AES");
            this.good = true;
        }
        catch (Exception e) {
            // empty catch block
        }
    }
    public String keystr()
    {
        String s = "";
        for (int i=0; i < raw.length; i++)
        {
            int j = (int)raw[i] + 128;
            int k = j/16;
            int l = j%16;
            s += allhexdigits[k] + allhexdigits[l];
        }
        return s;
    }
    
    

    static String char2hex(int y) {
        char[] x = new char[]{'0', '0'};
        int w = y >> 4;
        x[0] = AES.allhexdigits[w];
        x[1] = AES.allhexdigits[y&15];
        return new String(x);
    }

    public static byte[] hex2s(String s) {
        byte[] buf = new byte[s.length() / 2];
        for (int i = 0; i < buf.length; ++i) {
            buf[i] = (byte)(Integer.parseInt(s.substring(2 * i, 2 * i + 2), 16) - 128);
        }
        return buf;
    }

    public static String asHex(byte[] buf) {
        StringBuffer strbuf = new StringBuffer(buf.length * 2);
        for (int i = 0; i < buf.length; ++i) {
            String c = AES.char2hex(buf[i] + 128);
            strbuf.append(c);
        }
        return strbuf.toString();
    }

    public String encrypt(String x) {
        try {
            this.cipher.init(1, this.skeySpec);
            byte[] encrypted = this.cipher.doFinal(x.getBytes("utf-8"));
            return AES.asHex(encrypted);
        }
        catch (Exception e) {
            return x;
        }
    }

    public String decrypt(String x) {
        try {
            byte[] encrypted = AES.hex2s(x);
            this.cipher.init(2, this.skeySpec);
            byte[] original = this.cipher.doFinal(encrypted);
            return new String(original,"utf-8");
        }
        catch (Exception e) {
            return x;
        }
    }
}
