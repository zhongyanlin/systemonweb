package telaman;

import java.io.*;
import java.net.*;

import javax.servlet.*;
import javax.servlet.http.*;

 
class MyCellHandle 
{
    FileOutputStream out;
    telaman.JDBCAdapter adapter;
    String [] querys = null;
    String [] subquerys  = null;
    String [] fields = null;
    int subNum;
    String userid;
    
    public void setRowNum(int k)
    {
       for (int m = 0; m < querys.length-1; m++)
       {
         String s = querys[m+1];
         boolean sq = false;
       
       int state = 0;
       int i = 0;
       int N = s.length();
       String field = "", field1 = null;
       StringBuffer ans = new StringBuffer(querys.length);
       for (;i < N; i++)
       {
          if (s.charAt(i) == '#')
          {
               if (state == 3)
               {
                   if (field.equals(""))
                        field1 = "####";
                   else   if (field.matches("[0-9]+"))
                        field1 = "##" + field +"##";
                   else if (field.equals("CURRENT_TIME"))
                   {    
                       field1 = ""+(System.currentTimeMillis()/1000);
                   }
                   
                   else  
                   {
                       
                       int j = fields.length -1;
                       for (; j >=0  && !field.equals(fields[j]); j--); 
                       if (j >=0) 
                           field1 =  adapter.getValueAt(k, j); 
                       else
                           field1 = "##" + field +"##";
                   } 
                 
                   if (sq) 
                          field1 = field1.replaceAll("'","''");
                   ans.append(field1); 
                    
                   field = "";
               }
               state = (state + 1)%4;
               if (state == 2 && i>=2) sq = (s.charAt(i-2) == '\'');
          }    
          else
          {
              if (state == 1)
              {
                  state = 0;
                  ans.append("#" + s.charAt(i));
              }
              else if (state == 0)
                  ans.append(s.charAt(i));
              else if (state == 2)
              {
                  field += s.charAt(i);
              }
              else if (state == 3)
              {
                  ans.append("##" + field + "#" + s.charAt(i));
                  field = "";
                  state = 0;
              }
          }
       }
       if (state == 1) ans.append("#");
       else if (state == 2) ans.append("##" + field);
       else if (state == 3) ans.append("##" + field + "#"); 
       subquerys[m] = ans.toString();
       }
       subfields = null;
       subNum = 0;
    }
     
    String [] subfields = null;
    char [] subtypes = null;
    boolean [] appears = null;
    int numCols;
   // byte [] subrow = null;
    boolean hasmore = false;
    int filledrow= 0;
    public MyCellHandle(FileOutputStream out1, JDBCAdapter adapter1, String [] querys1, String [] fields1, String userid1)  
    {
       out = out1; adapter = adapter1; querys = querys1; fields = fields1; userid = userid1;  
       if (querys != null && querys.length-1 > 0)
         subquerys = new String[querys.length-1];
    }
    public int outstr(String field)
    {
       int ret = 0;
       int col = -1;
       try
       {
       if (field.equals("CURRENT_TIME"))
       {    
           out.write(Toolbox.timestr( (new java.util.Date()).getTime()/1000 ).getBytes());
           return 0;
       }
       else if (field.equals("CURRENT_USER"))
       {    
           out.write(userid.getBytes());
           return 0;
       }
       else if (field.matches("[0-9]+]"))
       {
           col = Integer.parseInt(field);
       }
       
       if (subfields!=null) 
       {
           int i = subfields.length-1; 
           for (; i >=0 && !field.equals(subfields[i]); i--);
           if (i==-1 && col ==-1) subfields = null;
       }
       
       if (subfields == null)
       {
          hasmore = false;
          filledrow = 0;
          if (adapter.executeQuery2(subquerys[subNum++],true)) 
          {
             numCols =  adapter.metaData.getColumnCount();
             subfields = new String[numCols];
             subtypes = new char[numCols];
             appears = new boolean[numCols];
             for(int column = 0; column < numCols; column++) 
             {
               appears[column] = false;
               String heading = adapter.metaData.getColumnLabel(column+1);
               int kl = heading.indexOf("_");
               if (kl>-1)
               {
                  subfields[column] = heading.substring(0,kl);
                  subtypes[column] = heading.charAt(kl+1);
               }
               else
               {
                   subtypes[column] = 'T';
                   subfields[column] = heading;
               }
             }
          }
       }
       
       if (subfields == null)
       {
           out.write(" ".getBytes());
           return -1;
       }
       int j = subfields.length-1; 
       for (; j >=0 && !field.equals(subfields[j]); j--);
       if (j==-1 && (col < 0 || col >= numCols)) 
       {
           out.write(("$$" + field +"$$").getBytes());
           return -1;
       }
       if (col >= 0 && col < numCols) 
           j= col;
          
       if (j==0)
       {
              filledrow++;
              if (filledrow <=2)
                  hasmore = adapter.resultSet.next();
              else 
                  hasmore = true;
             
              if (appears[0] == false)
              {
                  ret = 1;
              }
              else  
              {
                  ret = 3;
              }
       }
       else if (j == numCols-1)
       {
              if (appears[j] == false)
              {
                  ret = 2;
                  
              }
              else  
              {
                  ret = 4;
                 
              }
       }
       appears[j] = true;
          
       if (hasmore) 
              out.write( (adapter.resultSet.getString(j+1)).getBytes());
       else if (filledrow <= 2)
              out.write(" ".getBytes() );
       
       if (ret==4)
       {
          if(adapter.resultSet.next())
             ret = 6;
       }
          return ret;
       }
       catch(Exception e){return -1;}
    }
}


public class  Merge  
{
    protected int numRows, numCols;
    protected String [] fields;
    protected char [] types;
    int orgnum = Toolbox.langnum<<16;
    protected boolean hasdelete = false;
    protected boolean hasupdate = false;
    protected boolean hasnew = false;
    protected boolean status = true;
    public String getformat(){return "DataMerge";}
    final int maxRowBufSize = 600;
    byte subrow[] = new byte[maxRowBufSize];
    int subRowLen = 0;
    int subrowIndex = 0;
    int getOrder(String fd)
    {
       if (fd==null) return -1;
       int i = fields.length-1; 
       if (fd.equals("CURRENT_TIME")) 
           return -2;
       else if (fd.equals("CURRENT_USER"))
           return -3;
       for (; i >=0  && !fd.equals(fields[i]); i--);
       return i;
    }
    public static void main(String [] args)
    {
        Merge merge = new Merge();
        merge.processMerge(0);
    }
    
    public void processMerge(int orgnum)
    {
       // timeformat = cachedstyle.timeformat; 
        String wquery = "select  id as CourseID, title as Title_t from Course\n\nselect  name as sessionname, semester from Session where courseid='##CourseID##'";
        if (wquery == null || wquery.length() < 5) 
        { 
             
            try{
                PrintStream out = System.out;
            out.println( Toolbox.emsgs(orgnum,88)   );
            out.close();
             }catch(Exception e1){} 
            return;
        }
        wquery  =  wquery.trim();
        String [] querys = wquery.split("\n[\r]*\n+");
        for (int ll=0; ll <  querys.length; ll++) 
              querys[ll] =  querys[ll].trim();
        int numquery =  querys.length;
        JDBCAdapter adapter = new JDBCAdapter("jdbc:odbc:" +Toolbox.appname + "sys","sun.jdbc.odbc.JdbcOdbcDriver","","",0);
        String err = adapter.error();
        if (err != null && err.length() != 0) 
        {
           adapter.close();
          
           try{PrintStream out = System.out;
           out.println(err );
           out.close();
            }catch(Exception e1){} 
           return;
        }
        numRows  = 0;
        boolean b = adapter.executeQuery2(querys[0],false);
        if (b && adapter.getValueAt(0, 0)==null)
        {
           err = "Query returns empty dataset.";
        
           try
           {
               PrintStream out = System.out;
               out.println(err );
               out.close();
           }catch(Exception e1){}  
           adapter.close();
           return;  
       }
       else if (b)
       {
           err = "Incorrect query:<br><font color=red>" + querys[0];
          
           try{
               PrintStream out = System.out;
               out.println(err );
               out.close();
           }catch(Exception e1){} 
           adapter.close();
           return;  
       }
       numCols =  adapter.getColumnCount(); //numberOfColumns;
       fields = adapter.columnNames;
       types = new char[numCols];
       for (int column=0; column < numCols; column++)
       {
          String heading = fields[column];
          int kl = heading.indexOf("_");
          if (kl>-1)
          {
              fields[column] = heading.substring(0,kl);
              types[column] = heading.charAt(kl+1);
          }
          else
              types[column] = 'T';
       }
       int i,j, k, order;
       java.net.URL template = null;
       String tempstr = "";
       InputStream urlinput= null;
       int abyte=0, numBytes;
       int N = 100;
       byte field[] = new byte[2*N]; 
       //, subrow);
       try
       {
            
          String classfile = "";
          File file = new File("C:\\Teleman1\\web\\merged.doc");
          
           
           FileOutputStream biout = new FileOutputStream(file);
           MyCellHandle MyCellHandle = new MyCellHandle(biout, adapter, querys, fields, "");
           template = new java.net.URL("http://127.0.0.1/" + Toolbox.appname +"/temp/sampletemplate.doc");
           urlinput = template.openStream();
         
          for (k = 0; k  < 1; k++)
          {
           if (k > 0)
           { 
               urlinput.close(); 
               urlinput = template.openStream();
           }  
           MyCellHandle.setRowNum(k);
          
           int state = 0; 
           char state1='z';
           char state2='q';
        
           boolean outquota = true;
           boolean brace = false;
           numBytes = 0;
           
           int jj = 0; 
           i = 0;
           char aschar;
           boolean repeat = false;
           while (true)
           {
              if (repeat==false)
              {
                  try
                  {
                  abyte = urlinput.read();
                  if (abyte==-1) break;
                  }
                  catch(Exception e)
                  {break;}
                  if (subRowLen < maxRowBufSize)
                     subrow[subRowLen++] = (byte)(abyte);
              }
              else
              {
                  if (subrowIndex < subRowLen)
                    abyte = subrow[subrowIndex++];
                  else break;
              }
              
              aschar = (char)(abyte);
             
          
             if (aschar == '%')
            {
               switch(state)
               {
                     case 0: 
                     case 1: 
                     case 2:
                        state++;
                        break;
                     
                     case 3:
                        String fieldstr = new String(field, 0, numBytes, Toolbox.encoding);
                        
                        if (fieldstr.matches("[0-9]+"))
                          order = Integer.parseInt(fieldstr);
                        else
                          order =  getOrder(fieldstr);
                        
                        if (order >= 0  && order < numCols)
                        {
                            String vl = adapter.getValueAt(k,order);
                            if (vl == null) break;
                            if (types[order]=='m')
                                vl = Toolbox.timestr(Long.parseLong(vl));
                            else if (types[order]=='c')
                            {
                                if (vl.equals("1")) vl = Toolbox.emsgs(orgnum,415);
                                else vl = Toolbox.emsgs(orgnum,418);
                            }
                            biout.write(vl.getBytes());
                        }
                        else if (order == -2)
                        {
                            biout.write(Toolbox.timestr( (new java.util.Date()).getTime()/1000).getBytes()); 
                        }
                        else if (order == -3) 
                        {
                            biout.write("user".getBytes());
                        }
                        else if (order == -1)
                        {
                             
                           biout.write(abyte);biout.write(abyte);
                           biout.write(field, 0, numBytes);
                           biout.write(abyte);biout.write(abyte);
                       
                        }
                        state = 0;
                        numBytes = 0;
                        
                        break;
                      
                     case 11: 
                       state = 1;
                       biout.write((int)('$'));
                       break;  
                     case 12: 
                       state = 1;
                       biout.write((int)('$'));biout.write((int)('$'));
                       biout.write(field, 0, numBytes);
                       numBytes = 0;
                       break; 
                     case 13:
                       state = 1;
                       biout.write((int)('$'));biout.write((int)('$'));
                       biout.write(field, 0, numBytes);
                       biout.write((int)('$'));
                       numBytes = 0;
                       break;
              } 
          } 
          else if (aschar == '$')
          {
               switch(state)
               {
                   case 0:
                     state=11;
                     break;  
                   case 1:
                     state=11;
                     //ans.append(",");
                     //stay.append("%");
                     biout.write((int)('%'));
                     break;
                   case 2: 
                     state=11;
                     //ans.append(",");
                     //stay.append("%%"+field);
                     //field = "";
                      biout.write((int)('%'));biout.write((int)('%'));
                      biout.write(field, 0, numBytes);
                      numBytes = 0;
                     break;
                   case 3:
                     state=11;
                      biout.write((int)('%'));biout.write((int)('%'));
                      biout.write(field, 0, numBytes);biout.write((int)('%'));
                      numBytes = 0;
                     break;
                
                     
                   case 11: 
                   case 12:
                     state++;
                     break; 
                   case 13:
                        String fieldstr = new String(field, 0, numBytes, Toolbox.encoding);
                        int pos = MyCellHandle.outstr(fieldstr);
                        Toolbox.println(1,"ret=" + pos +", field=" + fieldstr); 
                        if (pos==2)
                            subRowLen = 0;
                        else if (pos == 4)
                        {
                            repeat = false;
                        }
                        else if (pos==6)
                        {
                            repeat = true;
                            subrowIndex = 0;
                        }
                        state = 0;
                        numBytes = 0;
                    break;
                } 
          }
         
          else 
          {
              switch(state)
               {
                  case 0: 
                     state = 0;
                     biout.write((int)(abyte));
                     break;
                  case 1:
                     state = 0;
                     biout.write((int)('%'));
                     biout.write((int)(abyte));
                     break;
                  case 3:
                     state = 0;
                     biout.write((int)('%')); biout.write((int)('%'));
                      biout.write(field, 0, numBytes);
                       biout.write((int)('%'));
                     biout.write((int)(abyte));
                    // stay.append("%%" + field+"%" + abyte);
                     numBytes = 0;
                  
                     break;
                  case 11: 
                     state = 0;
                     biout.write((int)('$'));
                     biout.write((int)(abyte));
                    // stay.append("$" + abyte);
                     
                     break;
                  case 13:
                     state = 0;
                     biout.write((int)('$')); biout.write((int)('$'));
                     biout.write(field, 0, numBytes);
                     biout.write((int)('$'));
                     biout.write((int)(abyte));
                     numBytes = 0;
                     break;
                  
                  case  2:  
                  case  12:
                     field[numBytes++] = (byte)(abyte);
                     break;
              } 
           }
         }
       }
       urlinput.close();
       biout.close();
     }
     catch(Exception e)
     {
         if (abyte != -1)
         {
           err = e.toString(); //"The URL is not an accessible URL";
           
           try
           {
           PrintStream out = System.out;
           out.println(err );
           out.close();
           }
           catch(Exception e1){}
           return; 
         }
     }
    }
    
    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /** Handles the HTTP <code>GET</code> method.
     * $param request servlet request
     * @param response servlet response
     */
    
    
    /** Handles the HTTP <code>POST</code> method.
     * @param request servlet request
     * @param response servlet response
    
    
    /** Returns a short description of the servlet.
     */
   
    // </editor-fold>
}
