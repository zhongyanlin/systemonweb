/*
 * Decompiled with CFR 0_87.
 */
package telaman;

class SharedBool {
    boolean flag = true;

    public synchronized boolean access(boolean g, boolean get) {
        if (get) {
            return this.flag;
        }
        this.flag = g;
        return g;
    }
}
