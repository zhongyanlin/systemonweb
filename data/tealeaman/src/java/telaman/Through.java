/*
 * Decompiled with CFR 0_87.
 */
package telaman;

import telaman.Scheduler;

class Through {
    int L;
    int onlyindex;
    int notindex;
    int navigator;
    int[] only;
    int[] not;
    int fix;
    int lastanswer;
    String name;

    

    public Through(int L1, int onlyindex1, int notindex1, int[] only1, int[] not1, int fix1, String nm) {
        this.L = L1;
        this.only = only1;
        this.not = not1;
        this.onlyindex = onlyindex1;
        this.notindex = notindex1;
        this.fix = fix1;
        this.navigator = -1;
        this.lastanswer = -1;
        this.name = nm;
    }
    
    public Through() {
    }

    int init() {
        int an = -1;
        if (this.fix > -1) {
            an = this.fix;
            this.navigator = this.fix;
        } else if (this.onlyindex > -1) {
            if (this.only != null && this.only.length > 0) {
                this.navigator = 0;
                an = this.only[0];
            }
        } else if (this.notindex > -1) {
            this.navigator = 0;
            if (this.not != null && this.not.length > 0) {
                while (this.navigator < this.L && Scheduler.indexOf(this.not, this.navigator) > -1) {
                    ++this.navigator;
                }
            }
            if (this.navigator < this.L) {
                an = this.navigator;
            }
        } else {
            this.navigator = 0;
            an = 0;
        }
        this.lastanswer = an;
        return an;
    }

    int next() {
        if (this.lastanswer == -1) {
            return -1;
        }
        int an = -1;
        if (this.fix <= -1) {
            if (this.onlyindex > -1) {
                ++this.navigator;
                if (this.only != null && this.navigator < this.only.length) {
                    an = this.only[this.navigator];
                }
            } else if (this.notindex > -1) {
                ++this.navigator;
                if (this.not != null && this.not.length > 0) {
                    while (this.navigator < this.L && Scheduler.indexOf(this.not, this.navigator) > -1) {
                        ++this.navigator;
                    }
                }
                if (this.navigator < this.L) {
                    an = this.navigator;
                }
            } else {
                ++this.navigator;
                if (this.navigator < this.L) {
                    an = this.navigator;
                }
            }
        }
        this.lastanswer = an;
        return an;
    }
}
