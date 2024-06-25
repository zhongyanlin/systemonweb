/*
 * Decompiled with CFR 0_87.
 */
package telaman;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import telaman.SharedInt;

class StreamThread
extends Thread {
    InputStream is;
    String type;
    FileOutputStream fou = null;
    SharedInt shared = null;

    StreamThread(InputStream is, String fn, SharedInt s) {
        this.shared = s;
        this.is = is;
        try {
            this.fou = new FileOutputStream(new File(fn));
        }
        catch (Exception e) {
            this.fou = null;
        }
    }

    @Override
    public void run() {
        if (this.fou == null) {
            return;
        }
        try {
            InputStreamReader isr = new InputStreamReader(this.is);
            BufferedReader br = new BufferedReader(isr);
            String line = null;
            while ((line = br.readLine()) != null) {
                line = line + "\n";
                this.fou.write(line.getBytes());
            }
            this.fou.close();
            this.shared.done();
        }
        catch (IOException ioe) {
            // empty catch block
        }
    }
}
