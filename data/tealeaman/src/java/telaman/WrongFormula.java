/*
 * Decompiled with CFR 0_87.
 */
package telaman;

class WrongFormula
extends Exception {
    String err;

    public WrongFormula(String str) {
        this.err = str;
    }

    @Override
    public String toString() {
        return this.err;
    }
}
