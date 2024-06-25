/*
 * Decompiled with CFR 0_87.
 */
package telaman;

class Triple {
    public int p;
    public int r;
    public int s;

    public Triple() {
        this.p = 0;
        this.r = 0;
        this.s = 0;
    }
    public boolean equalsTo(Triple y)
    {
        return p == y.p && r==y.r && s == y.s;
    }
    public Triple(Triple x) {
        if (x != null) {
            this.p = x.p;
            this.r = x.r;
            this.s = x.s;
        }
    }

    public Triple(int p1, int r1, int s1) {
        this.p = p1;
        this.r = r1;
        this.s = s1;
    }

    public String toString() {
        return "p=" + this.p + ", r=" + this.r + ", s=" + this.s;
    }
}
