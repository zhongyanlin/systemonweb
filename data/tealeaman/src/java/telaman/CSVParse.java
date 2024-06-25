/*
 * Decompiled with CFR 0_87.
 */
package telaman;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintStream;
import java.io.Reader;
import java.util.Vector;
import java.util.zip.GZIPInputStream;

public class CSVParse {
    
    public String nextElement() 
    {
         if (state == FILEEND || state == ERROR) 
        {
            return null;
        }
        char c =  ' ';
        int j;
        int k;
        int i = previousOffset;
        short charCode;
        short previousState;
        buf.setLength(0);
        this.quoted = false;
        
        while (true) 
        {
            if (str != null) 
            {
                i++;
                if (i < str.length()) 
                {
                    c = str.charAt(i);
                    charCode = code(c);
                } 
                else
                {
                     charCode = 3;
                }
            } 
            else if (buffer != null)
            {
                
                try 
                {
                    j = buffer.read();
                    if (j > -1)
                    {
                        c = (char) (j);
                        charCode = code(c);
                    }
                    else
                    {
                        charCode = 3;
                    }
                } 
                catch (IOException e) 
                {
                    charCode = 3;
                }
            } 
            else 
            {
                return null;
            }
            
            if ( (state == PREQUOTE || state > (ERROR + 1) ) && charCode > 4) 
            {
                continue;
            }
            previousState = state;
            if(!quoted && charCode == 1)
                quoted = true;
            transit(charCode);

            switch (state) 
            {
                case PREQUOTE:
                case NAKED:
                    buf.append(c);
                    break;
                case QUOTE:
                    if (previousState == QUOTE || previousState == UNQUOTE) 
                    {
                        buf.append(c);
                    } 
                    else  
                    {
                        buf.setLength(0);
                    }
                    
                    break;
                case UNQUOTE:
                case POSTQUOTE:
                     
                    break;
                case ERROR:
                    return null;
                default:
                    
                    previousOffset = i;
                    k = state - 7;
                    if (k < 0)
                    {
                        k = numSeparates  - 1;
                    }
                    for (int l = 0; l < k; l++)
                           index[l] = 0;
                    if (k>=0)
                    index[k]++;
                    return buf.toString();  
            }
        }

    }
    public String nextSql()
    {
        int j, charCode; char c;
        buf.setLength(0);
        boolean intext = false;
        while (true)
        {
            try 
                {
                    j = buffer.read();
                    if (j > -1)
                    {
                        c = (char) (j);
                        charCode = code(c);
                        
                        if (c == '\'')
                        {
                            buf.append(c);
                            intext = !intext;
                        }
                        else   if (c == ';')
                        {
                            if (intext == false)
                            return buf.toString();
                            else
                                buf.append(c);
                        }
                        else 
                        {
                            buf.append(c);
                        }
                    }
                    else
                    {
                        charCode = 3;
                        if (buf.length()>0)
                        return buf.toString();
                        else return null;
                    }
                } 
                catch (IOException e) 
                {
                    charCode = 3;
                }
              if (charCode == 3) return null;
           
        }
        
    }
    public static final short PREQUOTE = 0;
    public static final short QUOTE = 1;
    public static final short UNQUOTE = 2;
    public static final short POSTQUOTE = 3;
    public static final short NAKED = 4;
    public static final short FILEEND = 5;
    public static final short ERROR = 6;
    public static short[] DIMENSIONEND = new short[]{7, 8};
    protected short[][] states = new short[][]{{0, 1, 4, 5, 7}, {1, 2, 1, 6, 1}, {3, 1, 6, 5, 7}, {3, 6, 6, 5, 7}, {4, 4, 4, 5, 7}, {5, 5, 5, 5, 5}, {6, 6, 6, 6, 6}, {0, 1, 4, 5, 7}};
    protected short state = 0;
    protected char quote = 34;
    protected String[] separates = new String[]{",", "\r\n"};
    protected int numSeparates = 2;
    protected String str = null;
    protected int previousOffset = -1;
    protected BufferedReader buffer = null;
    protected StringBuffer buf = new StringBuffer();
    public int separateIndex = -1;
    private int rn = 0;
    private int[] index = new int[2];
    public boolean quoted;
    public StringBuffer quoteds = new StringBuffer();
     
    private void transit(int charCode) {
        if (this.state == 5 || this.state == 6 || this.state == 1 && charCode >= 4) {
            return;
        }
        if (this.state >= 7) {
            this.state = 0;
        }
        int diff = 0;
        if (charCode >= 4) {
            diff = charCode - 4;
            charCode = 4;
        }
        this.state = (short)(this.states[this.state][charCode] + diff);
    }

    public void checkError(boolean b) {
        if (b) {
            this.states[3][2] = 6;
            this.states[3][1] = 6;
            this.states[2][2] = 6;
            this.states[1][3] = 6;
        } else {
            this.states[1][3] = 5;
            this.states[3][2] = 3;
            this.states[3][1] = 3;
            this.states[2][2] = 3;
        }
    }

    private void getrn() {
        int n = 0;
        for (int i = 0; i < this.numSeparates; ++i) {
            if (this.separates[i].indexOf("\n") < 0) continue;
            n = 1;
            break;
        }
        int r = 0;
        for (int i2 = 0; i2 < this.numSeparates; ++i2) {
            if (this.separates[i2].indexOf("\r") < 0) continue;
            r = 1;
            break;
        }
        this.rn = r + 2 * n;
    }

    protected short code(char c) {
        if (c == ' ' || c == '\n' && this.rn <= 1 || c == '\r' && this.rn % 2 == 0) {
            return 0;
        }
        if (c == this.quote) {
            return 1;
        }
        for (int i = 0; i < this.numSeparates; ++i) 
        {
            if (this.separates[i].indexOf("" + c) < 0) 
                continue;
            this.separateIndex = i;
            return (short)(i + 4);
        }
        return 2;
    }

    public int[] getIndex() {
        return this.index;
    }

    
    private boolean hasSeparate(String v) {
        for (int i = 0; i < this.numSeparates; ++i) {
            for (int j = 0; j < this.separates[i].length(); ++j) {
                if (v.indexOf(this.separates[i].substring(j, j + 1)) < 0) continue;
                return true;
            }
        }
        return false;
    }

    private boolean beyong(int[] x) {
        if (x == null || x.length != this.index.length) {
            return false;
        }
        for (int k = x.length - 1; k >= 0; --k) {
            if (this.index[k] >= x[k]) continue;
            return true;
        }
        return false;
    }

    public String elementAt(int[] x) {
        while (this.beyong(x)) {
            this.nextElement();
        }
        return this.nextElement();
    }

    public void setStr(int[] x, String v, boolean add) {
        if (x == null || x.length != this.index.length || this.str == null) {
            return;
        }
        this.reset();
        while (this.beyong(x)) {
            this.nextElement();
        }
        if (v == null) {
            v = "";
        } else if (this.hasSeparate(v)) {
            v = "" + this.quote + v.replaceAll(new StringBuilder().append("").append(this.quote).toString(), new StringBuilder().append("").append(this.quote).append(this.quote).toString()) + this.quote;
        }
        if (!add) {
            int ll = this.previousOffset + 1;
            this.str = this.str.substring(0, ll) + v + this.str.substring(this.previousOffset);
        } else {
            this.str = this.previousOffset > -1 ? this.str.substring(0, this.previousOffset + 1) + v + this.separates[0].charAt(0) + this.str.substring(this.previousOffset + 1) : v + this.separates[0].charAt(0) + this.str;
        }
    }
    
    public CSVParse(File file) throws  Exception {
        FileInputStream in = new FileInputStream(file);
        InputStreamReader reader = new InputStreamReader(in);
        this.buffer = new BufferedReader(reader);
        this.setzero();
    }

    private void initStates(String[] sep) {
        if (sep != null) {
            CSVParse.DIMENSIONEND = new short[sep.length];
            for (int i = 0; i < sep.length; ++i) {
                CSVParse.DIMENSIONEND[i] = (short)(7 + i);
            }
        }
    }

    public CSVParse(GZIPInputStream gzis, char quote, String[] sep) throws Exception {
        this.buffer = new BufferedReader(new InputStreamReader(gzis));
        this.separates = sep;
        this.quote = quote;
        this.initStates(sep);
        if (sep != null) {
            this.numSeparates = sep.length;
            this.index = new int[this.numSeparates];
        } else {
            this.index = null;
            this.numSeparates = 0;
        }
        this.setzero();
    }

    public CSVParse(InputStream in, char quote, String[] sep) throws Exception {
        InputStreamReader reader = new InputStreamReader(in,"UTF-8");
        this.buffer = new BufferedReader(reader); 
        this.separates = sep;
        this.quote = quote;
        this.initStates(sep);
        if (sep != null) {
            this.numSeparates = sep.length;
            this.index = new int[this.numSeparates];
        } else {
            this.index = null;
            this.numSeparates = 0;
        }
        this.setzero();
    }

    public CSVParse(File file, char quote, String[] sep) throws Exception {
        FileInputStream in = new FileInputStream(file);
        InputStreamReader reader = new InputStreamReader(in,"UTF-8");
        this.buffer = new BufferedReader(reader);
        this.separates = sep;
        this.quote = quote;
        this.initStates(sep);
        if (sep != null) {
            this.numSeparates = sep.length;
            this.index = new int[this.numSeparates];
        } else {
            this.index = null;
            this.numSeparates = 0;
        }
        this.setzero();
    }

    public CSVParse(String str) {
        this.str = str;
        this.setzero();
    }

    public CSVParse(String str, char quote, String[] sep) {
        this.str = str;
        this.separates = sep;
        this.quote = quote;
        this.initStates(sep);
        if (sep != null) {
            this.numSeparates = sep.length;
            this.index = new int[this.numSeparates];
        } else {
            this.index = null;
            this.numSeparates = 0;
        }
        this.setzero();
    }

    private void setzero() {
        for (int i = 0; i < this.numSeparates; ++i) {
            this.index[i] = 0;
        }
        this.getrn();
    }

    public void reset() {
        this.state = 0;
        if (this.numSeparates > 0) {
            this.index = new int[this.numSeparates];
        }
        this.setzero();
        if (this.str != null) {
            this.previousOffset = -1;
        } else {
            try {
                this.buffer.reset();
            }
            catch (IOException e) {
                this.buffer = null;
            }
        }
    }

    public void close() {
        if (this.buffer != null) {
            try {
                this.buffer.close();
            }
            catch (IOException e) {
                // empty catch block
            }
        }
    }

    public String getStr() {
        return this.str;
    }

    public short getState() {
        return this.state;
    }

    public void setString(String str) {
        this.str = str;
        this.state = 0;
        this.previousOffset = -1;
    }

    public void setSeparates(String[] sep) {
        this.separates = sep;
        this.initStates(sep);
        if (sep != null) {
            this.numSeparates = sep.length;
            this.index = new int[this.numSeparates];
        } else {
            this.index = null;
            this.numSeparates = 0;
        }
        this.setzero();
    }

    public void setSeparates(int i, String sep) {
        if (i < this.numSeparates) {
            this.separates[i] = sep;
        }
    }

    public void setQuote(char c) {
        this.quote = c;
    }
    public float nextFloat() throws NumberFormatException {
        String x = this.nextElement().trim();
        return Float.parseFloat(x);
    }

    public double nextDouble() throws NumberFormatException {
        String x = this.nextElement().trim();
        return Double.parseDouble(x);
    }

    public int nextInteger() throws NumberFormatException {
        String x = this.nextElement().trim();
        return Integer.parseInt(x);
    }

    public String[] nextRow() {
        if (this.state == 5 || this.state == 6) {
            return null;
        }
        Vector<String> v = new Vector<String>();
        this.quoteds.setLength(0);
        do {
            String e = this.nextElement();
            if (v.size() == 0 && e == null) 
            {
                this.quoteds.append(this.quoted ? 1 : 0);
                return null;
            }
            v.addElement(e);
            this.quoteds.append(this.quoted ? 1 : 0);
        } while (this.state == CSVParse.DIMENSIONEND[0]);
        String[] x = new String[v.size()];
        for (int i = 0; i < x.length; ++i) {
            x[i] = (String)v.elementAt(i);
        }
        return x;
    }

    public static String[] csvToArray1(String v, char c, String s) {
        String[] sep = new String[]{s};
        return new CSVParse(v, c, sep).nextRow();
    }

    public static String[][] csvToArray2(String v, char c, String cols, String rows) {
        String[] sep = new String[]{cols, rows};
        return new CSVParse(v, c, sep).nextMatrix();
    }
    public String[][] nextMatrix(boolean ignoreblank) {
        if (this.state == 5 || this.state == 6) {
            return null;
        }
        Vector<String[]> v = new Vector<String[]>();
        do {
            String[] e = this.nextRow();
            if (v.size() == 0 && e == null) {
                return null;
            }
            if (e==null)
            {
                if (ignoreblank == false) v.addElement(e);
            }
            else
            {  
                if (e.length>1 || e[0]!=null && !e[0].equals("") || ignoreblank == false)
                  v.addElement(e);
            }
        } while (this.state == CSVParse.DIMENSIONEND[1]);
        String[][] x = new String[v.size()][];
        for (int i = 0; i < x.length; ++i) {
            x[i] = (String[])v.elementAt(i);
        }
        return x;
    }

    public String[][] nextMatrix() {
        if (this.state == 5 || this.state == 6) {
            return null;
        }
        Vector<String[]> v = new Vector<String[]>();
        do {
            String[] e = this.nextRow();
            if (v.size() == 0 && e == null) {
                return null;
            }
            v.addElement(e);
        } while (this.state == CSVParse.DIMENSIONEND[1]);
        String[][] x = new String[v.size()][];
        for (int i = 0; i < x.length; ++i) {
            x[i] = (String[])v.elementAt(i);
        }
        return x;
    }
    public String html()
    {
        if (this.str!=null && this.str.equals(""))
            return "";
        String [][] x = nextMatrix(true);
        if (x==null ||  x.length==0 || x[0] ==null )
        {
            return str;
        }
        String y = "<table border=1 style=\"border-collapse:collapse\">";
        boolean []num  = new boolean[10+x[0].length];
        
        
        for (int j=0; j < x[0].length+10; j++)
        {
            num[j] = true;
            if (x.length < 2) num[j] = false;
            for (int i=1; i < x.length; i++)
            {
                if ( j >=x[i].length ) continue;
                if (x[i][j]!=null && !x[i][j].equals("") && !x[i][j].replaceAll("[0-9|\\.]+","").equals(""))
                {
                    num[j] = false; break;
                }
            }
        }
        for (int i=0; i < x.length; i++)
        {
            y += "<tr>";
            for (int j=0; j < x[i].length; j++)
            {
                int sp=1; for (int k=j+sp; k < x[i].length && x[i][k] == null; k++,sp++);
                y  += "<td " + (num[j]?"align=right ":"align=left ") + ((sp==1)?"":"colspan=" + sp) + ">" + x[i][j] + "</td>";
            }
            y += "</tr>";
        }
        return y + "</table>";
    }
    public static void main(String[] args) {
        CSVParse p = new CSVParse("1,2\n3,4", '\'', (String[])null);
        Toolbox.println(1,p.nextElement());
    }
    public String toString(String [] x)
    {
        StringBuffer y = new StringBuffer();
        for (int i=0; i < x.length; i++)
        {
            if (y.length()>0)
                y.append(separates[0]);
            if (x[i] == null) continue;
            boolean b = (x[i].contains(separates[0]) || x[i].equals(""));
            if (b) y.append(quote);
            y.append(x[i].replace(""+quote,quote+""+quote));
            if (b) y.append(quote);
        }
        return y.toString();
    }
    public String toString(String [][] x)
    {
        StringBuffer y = new StringBuffer();
        for (int i=0; i < x.length; i++)
        {
            if (x[i] == null) continue;
            for (int j=0; j < x[i].length; j++)
            {
                if (x[i][j] != null)
                {
                    boolean b = (x[i][j].contains(separates[0]) || x[i][j].contains(separates[1]) || x[i][j].equals(""));
                    if (b) y.append(quote);
                    y.append(x[i][j].replace(""+quote,quote+""+quote));
                    if (b) y.append(quote);
                }
                if (j < x[i].length-1)
                    y.append(separates[0]);
                else if (i < x.length-1)
                    y.append(separates[1]);
            }
        }
        return y.toString();
    }
            
}
