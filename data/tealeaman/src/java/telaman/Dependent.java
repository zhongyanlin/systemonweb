/*
 * Decompiled with CFR 0_87.
 */
package telaman;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.Vector;

public class Dependent {
    Vector alls = new Vector(100);
    Vector depends = new Vector(50);
    String[] starts = null;
    String dir = "C:\\tealeaman\\src\\Java\\telaman";

    public Dependent() {
        File f = new File("");
        String[] fs = f.list();
        for (int i = 0; i < fs.length; ++i) {
            this.alls.addElement(fs[i]);
        }
    }

    void extract1(String str) {
        int i = 0;
        String cls = null;
        i = str.indexOf(" extends ");
        if (!(i <= 0 || this.depends.contains(cls = str.substring(i + 9).trim().replaceFirst(" .*", "")))) {
            this.depends.addElement(cls);
        }
    }

    void extract(String aline) {
        boolean b = false;
        int i = 0;
        boolean t = true;
        for (int j = 0; j < aline.length(); ++j) {
            if (aline.charAt(j) != '\"') continue;
            if (t) {
                t = false;
                this.extract1(aline.substring(i, j));
                continue;
            }
            if (j <= 1 || aline.charAt(j - 1) == '\\') continue;
            i = j + 1;
            t = true;
        }
    }

    
}
