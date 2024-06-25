/*
 * Decompiled with CFR 0_87.
 */
package telaman;

import java.io.File;
import java.io.FileFilter;

public class FileHas
implements FileFilter {
    String str;

    public String getDescription() {
        return "file contains " + this.str;
    }

    public FileHas(String s) {
        this.str = s;
    }

    @Override
    public boolean accept(File f) {
        if (this.str == null || this.str.equals("") || f.isDirectory()) {
            return true;
        }
        return f.getName().matches(".*" + this.str + ".*");
    }
}
