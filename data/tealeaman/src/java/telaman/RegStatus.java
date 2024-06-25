/*
 * Decompiled with CFR 0_87.
 */
package telaman;

import telaman.JDBCAdapter;
import telaman.Toolbox;
import telaman.User;

public class RegStatus {
    public static String goodstatus(JDBCAdapter adapter, User user, String course, String sid, String subdb) {
        boolean status = user.id.equals(subdb);
        String statusstr = Toolbox.emsg(user.orgnum>>16,63);
        String tt1 = "";
        return "";
    }
}
