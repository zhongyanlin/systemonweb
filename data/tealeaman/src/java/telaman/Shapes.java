/*
 * Decompiled with CFR 0_87.
 */
package telaman;

import java.applet.Applet;
import java.awt.Color;
import java.awt.Graphics;

public class Shapes extends Applet {
    int[] xPoints = null;
    int[] yPoints = null;
    int W = 240;
    int H = 150;
    int NP;
    boolean status = true;
    String nss = "";
    int xx;
    int max;
    int min;
    double vfact;
    double mean;
    double dev;
    int mg = 10;

    @Override
    public void init() {
        int i;
        int i2;
        int i3;
        try {
            Color backgroundColor = new Color(255, 255, 220);
            this.setBackground(backgroundColor);
        }
        catch (Exception exception) {
            // empty catch block
        }
        String numstr = this.getParameter("nums");
        this.H = this.getHeight() - 2 * this.mg;
        this.W = this.getWidth() - 2 * this.mg;
        if (numstr == null) {
            numstr = "65@78.56@87.34@89@45@78@90";
        }
        String[] nums = numstr.split("@");
        int N = nums.length;
        int[] ns = new int[N];
        this.max = 0;
        this.min = 100000;
        int tt = 0;
        for (i3 = 0; i3 < N; ++i3) {
            ns[i3] = (int)Double.parseDouble(nums[i3]);
            tt+=ns[i3];
            if (this.max < ns[i3]) {
                this.max = ns[i3];
            }
            if (this.min <= ns[i3]) continue;
            this.min = ns[i3];
        }
        this.mean = (double)tt / ((double)N + 0.0);
        tt = 0;
        for (i3 = 0; i3 < N; ++i3) {
            tt = (int)((double)tt + ((double)ns[i3] - this.mean) * ((double)ns[i3] - this.mean));
        }
        this.dev = Math.sqrt(tt / N);
        int ran = this.max - this.min + 1;
        int[] freq = new int[ran];
        for (i2 = 0; i2 < ran; ++i2) {
            freq[i2] = 0;
        }
        for (i2 = 0; i2 < N; ++i2) {
            int k = ns[i2] - this.min;
            int[] arrn = freq;
            int n = k;
            arrn[n] = arrn[n] + 1;
        }
        double factor = (double)this.W / (double)ran;
        this.xx = 0;
        for (i = 0; i < ran; ++i) {
            if (freq[i] <= this.xx) continue;
            this.xx = freq[i];
        }
        if (this.xx == 0) {
            this.xPoints = new int[2];
            this.yPoints = new int[2];
            this.xPoints[0] = 0;
            this.xPoints[1] = ran;
            this.yPoints[0] = 0;
            this.yPoints[1] = 0;
            this.NP = 2;
            return;
        }
        this.vfact = (double)this.H / (double)this.xx;
        this.xPoints = new int[4 * ran];
        this.yPoints = new int[4 * ran];
        for (i = 0; i < ran; ++i) {
            this.xPoints[4 * i] = this.mg + (int)((double)i * factor);
            this.yPoints[4 * i] = this.H + this.mg;
            this.xPoints[4 * i + 1] = this.mg + (int)((double)i * factor);
            this.yPoints[4 * i + 1] = this.H + this.mg - (int)((double)freq[i] * this.vfact);
            this.xPoints[4 * i + 2] = this.mg + (int)((double)(i + 1) * factor);
            this.yPoints[4 * i + 2] = this.H + this.mg - (int)((double)freq[i] * this.vfact);
            this.xPoints[4 * i + 3] = this.mg + (int)((double)(i + 1) * factor);
            this.yPoints[4 * i + 3] = this.H + this.mg;
        }
        this.NP = 4 * ran;
    }

    @Override
    public void paint(Graphics g) {
        Color red = new Color(210, 0, 0);
        Color black = new Color(0, 0, 0);
        super.paint(g);
        g.setColor(red);
        g.fillPolygon(this.xPoints, this.yPoints, this.NP);
        g.setColor(black);
        g.drawString("" + this.min, this.mg, this.H + 2 * this.mg);
        g.drawString("" + ((this.min + this.max) / 2), (this.mg + this.W) / 2, this.H + 2 * this.mg);
        g.drawString("" + this.max, this.W, this.H + 2 * this.mg);
        g.drawString("mean=" + (int)this.mean, this.mg + 2, this.mg);
        g.drawString("stddev=" + (int)this.dev, this.mg + 80, this.mg);
        for (int i = 0; i <= this.xx; ++i) {
            g.drawString("" + i, 0, this.H + this.mg - (int)(this.vfact * (double)i));
        }
        Color grey = new Color(125, 125, 125);
        g.setColor(grey);
        for (int i2 = 0; i2 <= this.xx; ++i2) {
            g.drawLine(this.mg, this.mg + (int)((double)i2 * this.vfact), this.mg + this.W, this.mg + (int)((double)i2 * this.vfact));
        }
    }
}
