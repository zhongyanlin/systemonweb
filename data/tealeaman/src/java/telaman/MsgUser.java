package telaman;
import java.util.concurrent.*; 

class MsgUser 
{
    public String sname = "";
    public long time = 0;
    public long diff = 0;
    public long  num = -1;
    public long serial=-1;
    public String tids=""; 
    public String app ="";
    public String listento = ""; 
   // public boolean waiting = false;
      
    public MsgUser(long tm, long d) 
    {
        this.time = tm;
        this.diff = d;
        
    }
  
    public String toString() 
    {
        long serial = 0;
        
        return  sname  + ":" + serial + ":" +  num + ":" +   time  + ":"  
        + (listento.replace(',','#')) + ":" + tids.replace(',', '#');
    }
}
