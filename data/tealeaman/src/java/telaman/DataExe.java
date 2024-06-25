/*
 * Decompiled with CFR 0_87.
 */
package telaman;

import telaman.DataRestore;
import telaman.Toolbox;

class DataExe
extends Thread {
    DataRestore res;
    String userid;
    int orgnum;
     
    @Override
    public void run() 
    {
        try 
        {
            this.res.process(orgnum);
        }
        catch (Exception e) {
            // empty catch block
        }
        this.res.close();
        if (this.userid != null) {
            Toolbox.msgqueueput((orgnum%65536) + this.userid, res.msg);
        }
    }
    
    public DataExe(DataRestore rs, String id, int orgnum) 
    {
        this.res = rs;
        this.userid = id;
        this.orgnum = orgnum;
       
    }

}
