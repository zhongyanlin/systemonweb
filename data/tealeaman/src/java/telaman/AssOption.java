 
package telaman;

public class AssOption {
    public boolean openbook = false;
    public boolean reviewable = true;
    public boolean norepeat = true;
    public boolean usetimequota = false;
    public boolean recordactivity = false;
    public boolean allowNoLogin = false;
    public String delimiter = "."; // . :]) 
    public boolean mbs = false; // multiple-chioce 1st, filling blanks 2nd, rest last
    public String et = "0";
    public String ff = "Arial";
    public String fs = "15";
    public String fw = "650";
    public String f = "S";
    public String forceorder = ""; 
    public int orgnum = Toolbox.langnum<<16;
    public String code = "";
    public String ip = "";
    public String maxtime = "";
    public String assoptions;
    public boolean anonymousgrade = false;
    String maps2(String x)
    {
        String y[] = Toolbox.emsgs(orgnum,1497).split(";");
         
        int i=0; 
        while( i < y.length && y[i].indexOf(x) != 0) i++;
        if (i == y.length)return x;
        String t = x;
        if (y[i].length() - x.length() - 1 > 0)
            t =  y[i].substring(x.length()+1).trim();
        if (t.length() > 0) return t;
        return x;
        
    }
    public String toString(){return assoptions;}
    
    public AssOption(String assoptions, int orgnum) 
    {
        this.orgnum = orgnum;
        this.assoptions = ";" + assoptions;
        if (!(assoptions == null || assoptions.equals("")))
        {
            String fs1;
            String f1;
            String ip1;
            String fw1;
            String ff1;
            String code1;
            String et1;
            
            this.allowNoLogin = this.extract("n") != null;
            this.usetimequota = this.extract("q") != null;
            this.openbook = this.extract("o") != null;
            this.reviewable = this.extract("r") != null;
            this.maxtime = this.extract("d");
            this.norepeat = this.extract("p") != null;
            this.recordactivity = this.extract("w") != null;
            this.mbs = this.extract("m") != null;
            this.anonymousgrade = this.extract("g") != null;
            if (!((ff1 = this.extract("ff")) == null || (ff1 = this.extract("ff")).equals(""))) {
                this.ff = maps2(ff1);
            }
            if (!((fs1 = this.extract("fs")) == null || fs1.equals(""))) {
                this.fs = fs1;
            }
            if (!((fw1 = this.extract("fw")) == null || fw1.equals(""))) {
                this.fw = fw1;
            }
            if (!((f1 = this.extract("f")) == null || f1.equals(""))) {
                this.f = f1;
            }
            String fo1;
            if (!((fo1 = this.extract("fo")) == null || fo1.equals(""))) {
                this.forceorder = fo1;
            }
            
            if (!((ip1 = this.extract("ip")) == null || ip1.equals(""))) {
                this.ip = ip1;
            }
            if (!((code1 = this.extract("cd")) == null || code1.equals(""))) {
                this.code = code1;
            }
            if (!((et1 = this.extract("et")) == null || et1.equals(""))) {
                this.et = et1;
            }
        }
    }
    public String shorter()
    {
        String x = "";
        if (allowNoLogin)x += "n:;";
        if (code!=null && !code.equals(""))
            x += "cd:" + code;
        return x;
    }
    private String extract(String nm) {
        int ii;
        int jj;
        int k;
        if (this.assoptions == null) 
        {
            return null;
        }
        if ((ii = this.assoptions.indexOf(";" + nm + ":")) == -1 
                || (ii = this.assoptions.indexOf(";" + nm + ":")) > (k = this.assoptions.indexOf(";cd:")) && (k = this.assoptions.indexOf(";cd:")) >= 0) {
            if (!(nm.length() != 1 || nm.equals("f"))) {
                return null;
            }
            return null;
        }
        if ((jj = this.assoptions.indexOf(";", ii + 2)) == -1 || nm.equals("cd")) {
            return this.assoptions.substring(ii + 2 + nm.length());
        }
        return this.assoptions.substring(ii + 2 + nm.length(), jj);
    }
}
