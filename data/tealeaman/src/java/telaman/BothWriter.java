/*
 * Decompiled with CFR 0_87.
 * 
 * Could not load the following classes:
 *  javax.servlet.jsp.JspWriter
 */
package telaman;

import java.io.PrintWriter;
import javax.servlet.jsp.JspWriter;

public class BothWriter {
    JspWriter writer;
    PrintWriter printer;
    byte which = 0;

    public BothWriter(JspWriter writer) {
        this.writer = writer;
        this.which = 1;
    }

    public BothWriter(PrintWriter printer) {
        this.printer = printer;
        this.which = 0;
    }

    public void print(String s) {
        try {
            if (this.which == 1) {
                this.writer.print(s);
            } else {
                this.printer.print(s);
            }
        }
        catch (Exception e) {
            // empty catch block
        }
    }
}
