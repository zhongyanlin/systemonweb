/*
 * Decompiled with CFR 0_87.
 */
package telaman;

class SharedInt {
    int value = 2;

    SharedInt() {
    }

    public synchronized void done() {
        --this.value;
        if (this.value == 0) {
            this.notify();
        }
    }
}
