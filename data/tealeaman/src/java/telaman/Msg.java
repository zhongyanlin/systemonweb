 
package telaman; 

import java.util.concurrent.atomic.AtomicInteger;


public class Msg 
{
    public long serial=0;
    public int tid;
    public String sek;
    public String sname = "";
    public String rid;
    public String code;
    public String msg;
    public long time;
    public int scount = 0;
    public int rcount = 0;
    public int num =0;
    public Msg prev=null,next=null;
    private static final AtomicInteger distincts = new AtomicInteger(0);
    public boolean keeplong = false;
    public Msg(int t, String s, String sn, String r, String c, String m, long tm, int rcount) 
    {
        this.tid = t;  //topic id
        this.sek = s;  //send id
        this.msg = m;  // msg
        this.code = c; // code 
        this.sname = sn == null ? this.sek : sn; //send name
        this.rid = r;  // received its, or null
        this.time = tm; // time stamp
        this.scount = 0;
        this.rcount = rcount;
        this.serial = distincts.getAndIncrement();
    }

    public String toString() {
        if (this.sname == null) {
            this.sname = this.sek;
        }
        String rstr = rid;
        if ( (code.equals("draw") || code.equals("plain") || code.equals("html") || code.equals("latex")))
            rstr = "";       
        return   this.serial + "@" +  this.rcount + "@" + this.tid + "@" + this.sek + "@" + this.sname.replaceAll("@", "_") + "@" + rstr + "@" + this.code + "@" + (this.time/1000) + "@" + this.msg;
    }
     
    public String htmlmsg(int orgnum)  
    {
        String y = this.toString();
        String s = "<!DOCTYPE html>\n<html lang=\""+Toolbox.langs[orgnum>>16]+"\" >\n<head>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=" + Toolbox.encodings[orgnum>>16] + "\"></head>\n<body>\n";
        s = s + "<script type=text/javascript> parent.Msg.handlepost(\"" + Generic.handle(y) + "\");</script></body></html>";
        return s;
    }
}
