 
package telaman;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.concurrent.atomic.AtomicBoolean;
import javax.servlet.AsyncContext;
import javax.servlet.http.HttpServletRequest;

class Schrun implements Runnable
{
   Scheduler sch;
   String semester;
   String semesterName;
   String uid;
   String dept;
   int orgnum = Toolbox.langnum<<16;
   boolean fix,candidate,goodtime,exclusion,timeshare;
   AsyncContext asyncCtx;
   AtomicBoolean running;
   JDBCAdapter adapter = null;
   int fontsize;
   String sek;
   Msgboxrun mq;  
   int tid = -1;
   CachedStyle cachedstyle;
   public Schrun(AsyncContext asyncCtx, int fontsize, int orgnum, String sek, String uid, String dept,String  semester,String  semesterName, boolean fix, boolean candidate, boolean goodtime, boolean exclusion, boolean timeshare,  AtomicBoolean running )
   {
       //adapter = new JDBCAdapter(Toolbox.dbadmin[orgnum%65536].sysDBConnectInfo(),orgnum);
       this.cachedstyle = new CachedStyle((HttpServletRequest)(asyncCtx.getRequest()),orgnum);
       this.asyncCtx = asyncCtx;
       this.sch = new Scheduler(dept,orgnum);
       this.semester = semester;
       this.semesterName = semesterName;
       this.fontsize = fontsize;
       this.dept = dept;
       this.orgnum = orgnum;
       this.uid = uid;
       this.fix =  fix;
       this.candidate =  candidate;
       this.goodtime =  goodtime;
       this.exclusion =  exclusion;
       this.timeshare =  timeshare;
       running = this.running;
       mq = Msgboxrun.get(sek + Scheduler.runscheduling(orgnum));
            
   }  
   String err = "";
   String emsg(int j)
   {
       return Toolbox.emsgs(orgnum,j);
   }
   void sendback(String e)
   {
       if (tid!=-1)
          {
            Msg m= new Msg(tid, "Schrun", emsg(1548), sek, "plain", e, System.currentTimeMillis(), 1);
            mq.dropmsg(m.toString());
          } 
   }
   public void run()
   {
       adapter = Toolbox.getSysAdapter(orgnum); 
       adapter.orgnum = orgnum;
       boolean partial = true;
      
       if (sch.initfromdb(semester, semesterName,  fix, candidate,  goodtime,  exclusion,  timeshare, adapter) == false ) 
       {
          err = (adapter.error()) + sch.error();
          adapter.close();
          return;
       }
       int b = sch.init();
       if (b!=1)
        {
            err += emsg(990) + "<br>";
            err += "&bull; " + sch.error().replaceFirst("\n$", "").replaceAll("\n", "<br>&bull; ");
            out2File(true );
            sendback("sch.init");
            adapter.close();
            return;
        }
        sendback("* ");
       if (sch.run(mq, sek)) 
       {
           partial = false;
           sch.save1(adapter);
           sch.save(adapter);
           
           if (sch.error().equals("")) 
           {
               
               err += emsg(911) + " " + semesterName + " " +  emsg(71) + "." +"<a href=javascript:postopen1() >"
                       +    emsg(1393) + "</a>"; 
           } 
           else
           { 
                
               err = emsg(1037) 
               + ". <br>&bull; " +  sch.error().replaceFirst("\n$","").replaceAll("\n","<br>&bull; ") 
               + "<br><a href=javascript:postopen1() >" + emsg(977)+"</a>";
           }  
      }
      else
      {
            sch.save1(adapter);
            err = emsg(990) + ":<br>" + sch.error();
      } 
      sendback("!");
      out2File( partial );
      
        try 
        {
            PrintWriter out = this.asyncCtx.getResponse().getWriter();
            out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><head>\n" + Toolbox.getMeta(orgnum) + "</head><body><script>var err=\"" + Generic.handle(err.replaceAll("\n", "<br>"))  + "\";parent.parent.frames[1].puterr1(err);</script></body></html>");
        } 
        catch (IOException e) 
        {
 
        }
      adapter.close();
      Toolbox.msgqueueput((orgnum%65536) + uid, emsg(1235) + emsg(1234));
      this.asyncCtx.complete();
 }
 
void out2File( boolean partial )
{
     StringBuffer buf = new StringBuffer();
     printout(buf,  partial, err , cachedstyle); 
     
     long stmp = (long) (   (new java.util.Date()).getTime()/1000);
     err = buf.toString().replaceAll("'","''");
     String sql0 = "INSERT INTO Scherror(lastupdate, dept, semester, message) values (" + stmp  + ",'" +  dept + "'," +  semester + ",'" + err + "')";
     int n = adapter.executeUpdate(sql0); 
     if (n != 1)
     {
         sql0 = "Update Scherror SET lastupdate=" +    stmp  + ", message='" + err  + "' WHERE dept='"  +  dept + "' AND semester=" +  semester;
         n = adapter.executeUpdate(sql0); 
     }
}
 
 public void printout(StringBuffer buf,    boolean partial, String err, CachedStyle cachedstyle  )  
 { 
     
    buf.append((new java.util.Date()).toString() + "<br><br>");
    if (partial)
    {
      buf.append("\n");
      buf.append(emsg(978));
      buf.append(" ");
      buf.append("<b>");
      buf.append(emsg(959));
      buf.append("</b> ");
      buf.append(emsg(260));
      buf.append(emsg(352));
      buf.append("<b>");
      buf.append(emsg(962));
      buf.append("</b> ");
      buf.append(emsg(979));
      buf.append("\n");
      buf.append("<center>\n");
      buf.append("<h1>");
      buf.append(emsg(980));
      buf.append("</h1>\n");
      buf.append("<style type=text/css>\n table.tr.td.table.tr.td{background-color:");
      buf.append( cachedstyle.TBGCOLOR);
      buf.append("}   \n");
      buf.append("</style>\n");
      if (sch.orders != null){
      buf.append("<TABLE cellpadding=1 cellspacing=0 border=0 bgcolor=#999999>");
      buf.append("<tr>");
      buf.append("<td>\n");
      buf.append("<table align=center cellpadding=1 cellspacing=1 border=0 >\n ");
      buf.append("<tr style=\"background:" + cachedstyle.BBGCOLOR +"\" >");
      buf.append("<td>");
      buf.append(emsg(982));
      buf.append("</td>");
      buf.append("<td>");
      buf.append(emsg(233));
      buf.append("</td>");
      buf.append("<td>");
      buf.append(emsg(983));
      buf.append("</td>");
      buf.append("<td>");
      buf.append(emsg(18));
      buf.append("</td>");
      buf.append("<td>");
      buf.append(emsg(985));
      buf.append("</td>");
      buf.append("<td>");
      buf.append(emsg(986));
      buf.append("</td>");
      buf.append("<td>");
      buf.append(emsg(987));
      buf.append("</tr> \n");

   int k = sch.firstNull1();
   
   for (int m = 0; m < sch.orders.length; m++)
   {
       int i = sch.orders[m];
       if (i !=k)
       buf.append("<tr><td  bgcolor=" + cachedstyle.TBGCOLOR +">" + sch.items(i,0).replaceFirst(" ","</td><td>").replaceFirst(" ","</td><td>").replaceAll("</td><td>","</td><td bgcolor=" + cachedstyle.TBGCOLOR +">") + "</td><td  bgcolor=" + cachedstyle.TBGCOLOR +">" 
               + sch.items(i, 1).replaceFirst("^$","&nbsp;") + "</td><td bgcolor=" + cachedstyle.TBGCOLOR +">" + sch.items(i, 2).replaceFirst("^$","&nbsp;") + "</td><td bgcolor=" + cachedstyle.TBGCOLOR +">" + sch.items(i, 3).replaceFirst("^$","&nbsp;") +"</td><td   bgcolor=" + cachedstyle.TBGCOLOR +">" + sch.vk[i] +"</td></tr>");
       else
           buf.append("<tr><td  bgcolor=red>" + sch.items(i,0).replaceFirst(" ","</td><td>").replaceFirst(" ","</td><td>").replaceAll("</td><td>","</td><td bgcolor=red>") + "</td><td  bgcolor=" + cachedstyle.TBGCOLOR +">" 
               + sch.items(i, 1).replaceFirst("^$","&nbsp;") + "</td><td bgcolor=" + cachedstyle.TBGCOLOR +">" + sch.items(i, 2).replaceFirst("^$","&nbsp;") + "</td><td bgcolor=" + cachedstyle.TBGCOLOR +">" + sch.items(i, 3).replaceFirst("^$","&nbsp;") +"</td><td   bgcolor=" + cachedstyle.TBGCOLOR +">" + sch.vk[i] +"</td></tr>");
       
   }

   if (k>=0) 
    {
        err = sch.error();
        err = err.replaceFirst("\n$","");
        err = err.replaceAll("\n","<br>&bull; ");
        err += "<b>";
        if (sch!=null && sch.sessions!=null && k < sch.sessions.length)
        {
            err += sch.sessions[k];
        }
        else
        {
            err += k;
        }
 
        err += "</b>";
        err += emsg(989) +". "; 
    }
      buf.append("\n");
      buf.append("</td>");
      buf.append("</tr>");
      buf.append("</table> ");
      buf.append("</td>");
      buf.append("</tr>");
      buf.append("</table>");
      }
      buf.append("</center>\n ");
      buf.append("<br>");
 
      buf.append("<script>var url='DataTable?subdb=&rdap=schresult&dept=" + sch.dept
                + "&semester=");
      buf.append("" + semester);
      buf.append("&semesterName='+encodeURIComponent('");
      buf.append((semesterName));
      buf.append("');</script> <a href=\"javascript:postopen(url,'_self')\">");
      buf.append(emsg(988));
      buf.append("</a>");
      buf.append("<br>\n \n");
      buf.append(emsg(990));
      buf.append(":");
      buf.append("<br>\n");
      buf.append("&bull; " + err);
      buf.append("\n\n");

    } 
    else 
    {

      buf.append("\n");
      buf.append(err);
      buf.append("\n");

    }
  }
 
}

