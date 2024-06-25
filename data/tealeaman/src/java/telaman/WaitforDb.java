/*
 * Decompiled with CFR 0_87.
 */
package telaman;

import telaman.DBAdmin;
import telaman.DBConnectInfo;
import telaman.JDBCAdapter;
import telaman.SharedBool;
import telaman.Toolbox;

class WaitforDb
extends Thread {
    SharedBool t;
    JDBCAdapter adapter = null;
    int orgnum = Toolbox.langnum<<16;
    public WaitforDb(SharedBool t, int orgnum) {
        this.orgnum =  orgnum;
        this.t = t;
        Toolbox.println(0, "Waiting thred created");
    }

    @Override
    public void run() {
        int j = 0;
        while (this.t.access(false, true)) {
            String err;
            this.adapter = Toolbox.getSysAdapter(orgnum);
            if (j % 10 == 0) {
                Toolbox.println(0, "" + j + new StringBuilder().append(" Wait for ").append(this.adapter.dbname()).append(" sever up").toString());
            }
            ++j;
             
            try {
                this.adapter.close();
                Thread.sleep(1000);
            }
            catch (Exception e) {
                // empty catch block
            }
            if (j < 5) continue;
        }
        this.adapter.close();
        Toolbox.dbadmin[orgnum%65536].hasSysDB();
    }
}
