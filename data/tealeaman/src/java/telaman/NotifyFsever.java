/*
 * Decompiled with CFR 0_87.
 */
package telaman;

import java.net.URL;
import telaman.Toolbox;

public class NotifyFsever
extends Thread 
{
    String fs;
    String uid;

    public NotifyFsever(String fs, String uid) 
    {
        super("notify");
        this.fs = fs;
        this.uid = uid;
    }

    @Override
    public void run() 
    {
        Toolbox.println(1, "started");
        try 
        {
            URL url = new URL("http://" + this.fs + "/register.jsp");
            Object obj = url.getContent();
            if (obj instanceof String) {
                Toolbox.println(1, (String)obj);
            } else {
                Toolbox.println(1, obj.getClass().getName());
            }
        }
        catch (Exception e) {
            Toolbox.println(1, e.toString());
            try {
                URL url = new URL("https://" + this.fs + "/register.jsp");
                Object obj = url.getContent();
                if (obj instanceof String) {
                    Toolbox.println(1, (String)obj);
                } else {
                    Toolbox.println(1, obj.getClass().getName());
                }
            }
            catch (Exception ee) {
                // empty catch block
            }
        }
    }
}
