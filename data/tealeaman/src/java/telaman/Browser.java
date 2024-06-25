/*
 * Decompiled with CFR 0_87.
 */
package telaman;

public class Browser {
    public String name = "Microsoft";
    public String version = "5.0";
    public int width = 800;
    public int height = 600;

    public Browser() {
    }

    public Browser(String s) {
        this.parse(s);
    }

    public void parse(String s) {
        
        String[] sa = s.split(":");
        if (sa.length > 0) {
            try {
                this.width = Integer.parseInt(sa[0]);
            }
            catch (Exception e) {
                // empty catch block
            }
        }
        if (sa.length > 1) {
            try {
                this.width = Integer.parseInt(sa[1]);
            }
            catch (Exception e) {
                // empty catch block
            }
        }
        if (sa.length > 2) {
            this.name = sa[2];
        }
        if (sa.length > 3) {
            this.name = sa[3];
        }
    }
}
