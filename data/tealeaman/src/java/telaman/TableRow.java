 
package telaman;

public class TableRow 
{
    private int numFields = 0;
    private String[] fieldName;
    private int[] fieldLen;
    private static String filepath = "";
    private int[] sc;
    private int[] dc;

    public TableRow() 
    {
    }

    void zero() 
    {
        for (int i = 0; i < this.numFields; ++i) 
        {
            this.sc[i] = 0;
            this.dc[i] = 0;
        }
    }

    public TableRow(String file, String[] f, int[] l) {
        TableRow.filepath = file;
        this.numFields = f.length;
        this.fieldName = new String[this.numFields];
        this.fieldLen = new int[this.numFields];
        this.sc = new int[this.numFields];
        this.dc = new int[this.numFields];
        for (int i = 0; i < this.numFields; ++i) {
            this.fieldName[i] = new String(f[i]);
            this.fieldLen[i] = l[i];
        }
        this.zero();
    }
}
