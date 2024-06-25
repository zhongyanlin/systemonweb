package telaman;
import java.io.File;
import java.io.PrintWriter;
import java.util.concurrent.atomic.AtomicBoolean;
import javax.servlet.AsyncContext;
public class DBTableRun implements Runnable
{
   User user;
   int orgnum;
   AsyncContext asyncCtx;
   AtomicBoolean running;
   JDBCAdapter adapter;
   String webfile, encoding,  totable, overlap;
   String sek = null;
   CachedStyle cachedstyle;
   public DBTableRun(AsyncContext asyncCtx, User user, int orgnum, String webfile, String  encoding, String  totable, String  overlap, AtomicBoolean running,String sek,CachedStyle cachedstyle ) 
   {
      this.asyncCtx = asyncCtx;
      this.user = user;
      this.orgnum = orgnum;
      this.webfile = webfile;
      this.encoding =encoding;
      this.totable = totable;
      this.overlap = overlap;
      this.running = running;
      this.sek = sek;
      this.cachedstyle = cachedstyle;
      
   }
   void backmsg(String ms)
   {
        if (sek!=null )
        {
            Msg m= new Msg(-1,  "DBTableRun", Toolbox.emsgs(orgnum,1548), sek, "plain", ms, System.currentTimeMillis(), 1); 
            Msgboxrun.dropmsg(sek + "_" +DataRestore.chatcourse,m.toString()); 
        }
   }
   public void run()
   {
      try
      {
      DataRestoreFromFile df = new DataRestoreFromFile(webfile, user, overlap, totable,/* encoding,*/ user.getDBConnectInfo(), sek);
      df.process(orgnum,cachedstyle);
      String err =df.msg;
      if (sek != null)
      {
          backmsg(err); 
          backmsg(null);  
      }
      {
          
          
          PrintWriter out = this.asyncCtx.getResponse().getWriter();
          out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><body style=\"background-color:" + cachedstyle.DBGCOLOR + ";margin:5px 5px 0px 5px\">"  );
          out.println(err);
          out.println("<script>parent.promptdone('" + err.replace(File.separatorChar, '/') + "');</script>");
          out.println("</body></html>");
          out.close();
      }
      
      }catch(Exception e){}
      this.asyncCtx.complete();
   }
}
