/*
 * Decompiled with CFR 0_87.
 */
package telaman;

class MsgPair implements Comparable<MsgPair> {
    public String str = null;
    public int serial = 0;

    public MsgPair(String u, int s) {
        this.str = u;
        this.serial = s;
    }

    @Override
    public int compareTo(MsgPair p) {
        return p.str.compareTo(this.str);
    }

    public String toString() {
        return this.str + "#" + this.serial;
    }
}
