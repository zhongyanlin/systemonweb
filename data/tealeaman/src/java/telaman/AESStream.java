/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package telaman;
import java.io.*;
/**
 * @author Zhongyan Lin
 */
public class AESStream extends InputStream
{
    byte bout[] = null;
    int pout = -1;
    int Leng = -1;
    boolean valid = false;
    int orgnum = 0;
    public AESStream(InputStream b, MyRSA x )
    {
        AES a = new AES();
        String ky = a.keystr();
        ky = x.encryptString(ky,orgnum>>16);
        byte [] yy = ky.getBytes();
        int l = yy.length;
        int l0 = l/256;
        int l1 = l%256;
        byte bin[] = new byte[1024*250];
        bin[0] = (byte)(l0 - 128);
        bin[1] = (byte)(l1 - 128);
        int pin = 2;
        for (; pin < l+2; pin++)
           bin[pin] = (byte)(yy[pin-2]); 
        int k = -1;

        while (true)
        {
            try
            {
                k = b.read();
            }
            catch(Exception e)
            { 
                k = -1;
            }
            if (k == -1)
            {
                break;
            }
            bin[pin++] = (byte)(k - 128);
        }
        if ( pin > l + 2 ) 
        try
        {
            a.cipher.init(1,a.skeySpec);
            bout = a.cipher.doFinal(bin,0,pin);
            pout = 0;
            Leng = bout.length;
            valid = true;
        }
        catch(Exception e){}
    }

    public int read()
    {
        if (valid == false || pout == Leng) return -1;
        int k = bout[pout++] + 128;
        return k;
    }

}
