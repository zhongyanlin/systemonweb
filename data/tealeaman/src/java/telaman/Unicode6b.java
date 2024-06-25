/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package telaman;
import org.apache.tomcat.util.codec.binary.Base64; 
/**
 *
 * @author zhong
 */
public class Unicode6b {
    public static String encode(String str) 
    {
        byte[] bytesEncoded = Base64.encodeBase64(str.getBytes());
        return (new String(bytesEncoded)).replace("=", "-");
    }
    public static String decode(String str)
    {
        str = str.replace("-", "=");
        byte bytesEncoded[] = str.getBytes();
        byte[] valueDecoded = Base64.decodeBase64(bytesEncoded);
        return (new String(valueDecoded));
    }
    public static void main(String [] args)
    {
         
    }
}
