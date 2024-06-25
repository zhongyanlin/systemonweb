package telaman;
import java.util.regex.*;
import java.util.*;


public class Webform implements java.io.Serializable 
{
     public String title = "";
     public String name="";
     public String format = "";
     public String query = "";
     public String insertQuery = "";
     public String updateQuery = "";
     public String deleteQuery = "";
     public String webService = "";
     public String help = "";
     public String jscript = "";
     public String preop = "";
     public String postop = "";
     public long roles = 0;
     public long insertroles = 0;
     public long updateroles = 0;
     public long deleteroles = 0;
     public String [] quanty = null;
     public String [] fields = null;
     public String [] labels = null;
     public String [] ctypes = null;
     public String [] attrs  = null;
     public String  positions = null;
     public String [] defaultv  = null;
     public HashMap<String,String> fieldOrders = new HashMap<>();
     public boolean valid = true;
     public String err = "";
     public String permits = "";
     public String selectsql[]  = null;
     public String [] regexs  = null;
     private String details = "";
     
    public boolean permit(int i, User user)
    {
       long which = roles; 
       if (i==2)
            which = insertroles;
       else if (i==3)
            which = updateroles;
       else if (i==4)
            which = deleteroles;
       if (user == null || user.id.equals(""))
       {
           return which == -1 && permits.contains(i+"+*");
       }
        
       long b  = which & user.roles;
       if (permits == null) 
       {
           return (b != 0);
       }
       return
            (b != 0 || which == -1 && permits.contains(i+"+*")  ) 
            && (permits +",").contains(i +"-"+user.id +",") == false
            || (permits +",").contains(i +"+"+user.id +",");

    }
    public String idpermit(int i)
    {
       int j = permits.indexOf("" + i + "+#");
       if (j < 0) return null;
       permits = permits.substring(0,j) + i + "+#" +  permits.substring(j+3).replaceFirst("^[^0-9]+","");
       String xx = permits.substring(j+3).replaceFirst("[^0-9].*$","");
       return xx;
    }

    // CONCAT(')
    // '   A S , w
    byte st[][] = {{5,1,0,0,0,0},
                   {5,1,2,0,0,0},
                   {5,1,0,3,0,0},
                   {6,4,0,0,6,0},
                   {6,4,4,4,0,4},
                   {0,5,5,5,5,5},
                   {6,6,6,6,6,6}};
    byte ot[][] = {{1,0,1,1,1,1},
                   {2,2,0,2,2,2},
                   {2,2,2,0,2,2},
                   {0,0,2,2,0,2},
                   {0,0,0,0,1,0},
                   {1,1,1,1,1,1},
                   {0,0,0,0,0,0}};
    int char2int(char c)
    {
        switch(  c )
        {
            case '\'': return 0;
            case ' ': case '\n': return 1;
            case 'a': case 'A': return 2;
            case 's': case 'S': return 3;
            case ',': return 4;
            default:  return 5;
        }
    }
    public String toString1()
    {
        return  "NAME:" + name 
                +"\nFORMAT:" + format 
                +"\nFIELDS:" +  formstr(fields) 
                +"\nLABELS:" + formstr(labels) 
                +"\nCTYPE:" + formstr(ctypes)
                +"\nATTRS:" + formstr(attrs) 
                +"\nPOSITIONS:" +  (positions)
                +"\nDEFAULT VALUES:" + formstr(defaultv) 
                ;
    }
    public String formstr(int [] s)
    {
        if (s==null) return "NULL";
        StringBuffer bf= new StringBuffer();
        
        for (int i=0; i < s.length; i++)
        {
            if (i>0) bf.append(",");
            bf.append( s[i]);
        }
        return bf.toString();
    }
    public String formstr(String [] s)
    {
        if (s==null) return "NULL";
        StringBuffer bf= new StringBuffer();
       
        for (int i=0; i < s.length; i++)
        {
            if (i>0) bf.append(",");
            bf.append( s[i]);
        }
        return bf.toString();
    }
    public String labelstr()
    {
        return formstr(labels);
    } 
    public String fieldstr()
    {
        return formstr(fields);
    }
    public static final Pattern setp = Pattern.compile("[,| |\n][c|C][o|O][n|N][c|C][a|A][t|T][ ]*\\(");
    public static final String separator = "\n[\r|\n| |\t]*\n";
    public static String mysql2t(char a, char b, String query)
    {
       int N = query.length();
       StringBuffer ans = new StringBuffer(N);
       java.util.Vector v = new java.util.Vector(10);
       boolean inq = false; 
       int kk = 0, k=0;
       for (int i=0; i < N; i++)
       {
           if (query.charAt(i)=='\'')
           {
               inq = !inq;
               if (inq) 
                   k = i;
               else
               {
                   v.addElement(query.substring(k,i+1));
                   ans.append("$");
               }
           }
           else if (!inq)
               ans.append(query.charAt(i));
       }
           
       String tt = ans.toString();
       ans.setLength(0); 
       int n=0;
       while (true)  
       {
               Matcher m = setp.matcher(tt.substring(n));
               if (!m.find())
               {
                   ans.append(tt.substring(n));
                   break;
               }
              
               int l = n + m.end();
               ans.append(tt.substring(n, l));
               
               while (l < N && tt.charAt(l) != ')')
               {
                   if (tt.charAt(l)==a) 
                       ans.append(b);
                   else 
                       ans.append(tt.charAt(l));
                   l++;
               }
               n = l; 
               if (n>=N) break;
       }
       tt = ans.toString(); 
       ans.setLength(0); 
       k=0;
       for (int i=0; i < tt.length(); i++)
       {
              if (tt.charAt(i)=='$')
                  ans.append((String)(v.elementAt(k++)));
              else 
                  ans.append(tt.charAt(i));
       }
       return ans.toString();   
    }
    public static String mysql2c(String dbms, String query)
    {
        if (dbms==null||dbms.equals("oracle")||dbms.equals("mysql"))  
        {
            return query;
        }
        else if (dbms.equals("access")) 
        {
            return mysql2c1("&",  query);
        }
        else if (dbms.equals("h2") )
        {
            return query.replaceAll(" mod ","%");
        }
        else if (dbms.equals("sqlserver") )
        {
            return mysql2c1("+",  query).replaceAll(" mod ","%");
        }
        else if (dbms.equals("derby") || dbms.equals("postgres"))
        {
            return mysql2c1("||",  query);
        }
         
        return query;
    }
    
    public static String removep(String query,java.util.Vector v)
    {
       if(query==null) return null;
       int N = query.length();
       StringBuffer ans = new StringBuffer(N);
       boolean inq = false; 
       int k=0;
       for (int i=0; i < N; i++)
       {
           if (query.charAt(i)=='\'')
           {
               if (inq == false)
               {
                   k = i;
                   inq = true;
               }
               else if ( i==N-1 || query.charAt(i+1)!='\'')
               {
                   v.addElement(query.substring(k,i+1));
                   ans.append("@");
                   inq = false;
               }
               else i++;
           }
           else if (!inq)
               ans.append(query.charAt(i));
       }
       
       if (inq==false) return ans.toString();   
       return ans.toString() + query.substring(k);
     }
     public static String putbackp(String tt, Vector v)
     {
       int N = tt.length();
       StringBuffer ans = new StringBuffer(N+30);
       int   k=0;
       for (int i=0; i < N; i++)
       {
              if (tt.charAt(i)=='@')
              {
                  if (k < v.size())
                      ans.append((String)(v.elementAt(k++)));
              }
              else 
                  ans.append(tt.charAt(i));
       }
       return ans.toString();
     }
    public static String mysql2c1(String b, String query)
    {
 
       int N = query.length();
       StringBuffer ans = new StringBuffer(N);
       java.util.Vector v = new java.util.Vector(10);
       int  k=0;
       String tt = removep(query,v);
       N = tt.length();
       int n=0;
       while (true)  
       {
               Matcher m = setp.matcher(tt.substring(n));
               if (!m.find())
               {
                   ans.append(tt.substring(n));
                   break;
               }
               k = n + m.start();
               int l = n+m.end();
               ans.append( tt.substring(n,k+1));
               while (l < N && tt.charAt(l) != ')')
               {
                   if (tt.charAt(l)==',') 
                       ans.append(b);
                   else 
                       ans.append(tt.charAt(l));
                   l++;
               }
               if (l>=N-1) break;
               n = l+1;
       }
       return putbackp(ans.toString(),v); 
       
    }
    Pattern whereas = Pattern.compile("[\\W]as[\\W]");
    public boolean validate()
    {
        if (fields==null) return true;
        for (int i=0; i < fields.length; i++) 
            if (fields[i]==null||fields[i].equals("")) return false;
        return true;
    }
     
    public void extractDefaultv(boolean doit)
    {
        /*
        if (defaultv != null) return;
        defaultv = new String[fields.length];
        for (int j=0; j < fields.length; j++)
            defaultv[j] ="";
        if (insertQuery==null)return;
        insertQuery = insertQuery.replaceFirst("^[\n|\r| ]+", "");
        Matcher matc  = Generic.twoblank.matcher(insertQuery);
        boolean hasblank = matc.find();
        String defaultstr = "";
        if (hasblank)
        {
             defaultstr = insertQuery.substring(matc.end());
             int posi = matc.start();
             insertQuery = insertQuery.substring(0,posi);
        }
        else
             defaultstr  = insertQuery;
        if (hasblank  || doit)
        {
           err = str2def(defaultstr);
        }
        */
    } 
    public String str2def(String tt)
    {
        Pattern p = Pattern.compile("\n[^=]+=");
        int k = 0, l=0;
        tt = "\n" + tt;
        Matcher mt = p.matcher(tt); 
        Vector<String> vv = new Vector<>();
        while ( mt.find(k))
        {
            int s = mt.start();
            if (k>0) 
            {  if (k < s)
                vv.addElement(trim(tt.substring(k,s))); 
               else
                vv.addElement("");
            }
            int e = mt.end();
            vv.addElement(trim(tt.substring(s,e).replace('=',' ')));
            k = e;
        }
        vv.addElement(trim(tt.substring(k)));
         int j;
            for (j=0; j < fields.length; j++)
            {
                int jj = 0;
                for (; jj < vv.size()/2 && !fields[j].equals(vv.elementAt(2*jj)) && !labels[j].equals(vv.elementAt(2*jj)); jj++){}
                if (jj < vv.size()/2 && vv.elementAt(2*jj+1).length()>0)
                {
                    String ex = ""; if (defaultv[j]!=null && defaultv[j].length()>0 && defaultv[j].charAt(0)=='!') ex = "!";
                    defaultv[j] = (ex + vv.elementAt(2*jj+1)).replaceFirst("!!","!");
                }
            }
           
            return "";
    }
    public HashMap<String,String> parsehelp(String tt)
    {
        if (tt==null || tt.equals("")) return null;
        Pattern p = Pattern.compile("\n[^(:=)]+[:|=]");
        int k = 0, l=0;
        tt = "\n" + tt.trim();
        Matcher mt = p.matcher(tt); 
        HashMap<String,String> vv = new HashMap<>();
        String fd = null;
        while ( mt.find(k))
        {
            int s = mt.start();
            if (k>0) 
            { 
               if (k < s)
                vv.put(fd, tt.substring(k,s).trim()); 
            }
            int e = mt.end();
            fd =  tt.substring(s,e).replace('=',' ').replace(':',' ').trim().toUpperCase();
            k = e;
        }
        
        if (fd!=null)
            vv.put(fd, tt.substring(k).trim());
        else 
            vv.put("No field?",tt.trim());
        return vv;
    }
    public String str2help(String tt)
    {
         HashMap<String,String> newh = parsehelp(tt);
         
         if (newh==null) return "" ;
         HashMap<String,String> oldh = parsehelp(help);
          
         StringBuffer s = new StringBuffer();
         for (int j=0; j < fields.length; j++)
         {
             String a = newh.get(fields[j].toUpperCase());
             if (a!=null)
             {
                 s.append(fields[j] + ":" + a+ "\n");
                 newh.remove(fields[j].toUpperCase());
                 continue;
             }
             a =  newh.get(labels[j].toUpperCase());
             if (a!=null)
             {
                 s.append(fields[j] + ":" + a+ "\n");
                 newh.remove(labels[j].toUpperCase());
                 continue;
             } 
             a =  oldh.get(fields[j].toUpperCase());
             if (a!=null)
             {
                 s.append(fields[j] + ":" + a + "\n");
                 continue;
             } 
             a =  oldh.get(labels[j]);
             if (a!=null)
             {
                 s.append(fields[j] + ":" + a + "\n");
             } 
         }
         help = s.toString();
         if (newh.size()==0) return "";
         return newh.toString().replaceAll("\\?","");
    }
    
    public void parseQuery()
    {
        
       if (format==null){return;}
       if (format.equals("Update"))
       {
           Pattern r = Pattern.compile("\\?\\?[a-z|A-Z]+\\?\\?");
           int k = 0;
           String x = "";
           try{
          Matcher m = r.matcher( query );
          int s, e = 0;
          String y = "";
          while (m.find(e))
           {
                
                s =   m.start();
                e  =  m.end();
                 
               if (e == query.length())
                   y = query.substring(s).replaceAll("\\?", "");
               else
                   y = query.substring(s, e).replaceAll("\\?", "");
               
               if ((","+x + ",").indexOf("," + y + ",") < 0)
               {
                   if (!x.equals("")) 
                       x +=',';
                    
                   x += y;
               }
                
           }
           }catch(Exception e){ }
           if (!x.equals(""))
           {
               fields = x.split(",");
               labels = new String[fields.length];
               quanty = new String[fields.length];
               ctypes = new String[fields.length];
           }
           err = "";
           return;
       }
       if (format.equals("Search"))
       {
          parseSearch();
          //extractDefaultv(true);
          return;
       }
     
       Vector<String> vf = new Vector<String>(); 
       int kk = selectsep(query, vf);
       if (kk == -1)
       {
           err = "In " + name + ", ' or ( not match: " + vf.elementAt(0);
           return;
       }
       String leftover = query.substring(kk);
       int N = vf.size();
       if (N == 1 && vf.elementAt(0).indexOf("*") >= 0)
       {
           return;
       }
       quanty = new String[N];
       fields = new String[N];
       labels = new String[N];
       ctypes = new String[N];
       
       StringBuffer bf = new StringBuffer();
       
       for (int i=0; i <N; i++)
       {
          if (i>0) bf.append(",");
          String heading = trim(vf.elementAt(i));
          
          if (i == 0)
          {
              String xx = heading;
              heading = heading.trim().replaceFirst("(?i)select[\r|\n|\t| ]+","");
              if(!xx.equals(heading))
                  bf.append("SELECT ");
              xx = heading;
              heading = heading.replaceFirst("(?i)distinct[\r|\n|\t| ]+","");
              if (!xx.equals(heading))
                  bf.append("DISTINCT ");
              
          }
          String lheading  = heading.replaceAll("(?i)[ |\n|\r|\t]as[ |\r|\n|\t]", " as ");
          int starti = lheading.lastIndexOf(" as ");
          
          String punct = "!@#$%^&*()-+={[}]|\\:;\"'<,>.?/";
          if ( starti > 0)
          {
              if (starti + 4 < lheading.length())
              {
                  lheading = lheading.substring(starti + 4);
              
                  for (int j = 0; j < punct.length(); j++)
                  if (lheading.indexOf(punct.charAt(j))>=0)
                  {
                      starti = -1;
                      break;
                  }
              }
          }
          
          if ( starti > 0)
          {
              bf.append(heading.substring(0,starti));
              quanty[i] = heading.substring(0,starti);
              if (starti + 4 < heading.length())
                  heading = heading.substring(starti+4);
              else
                  heading =  Toolbox.emsg(1226) + i;
          }
          else
          {
              quanty[i] = heading;
              bf.append(heading);
              int j = 0;
              for (j = 0; j < punct.length(); j++)
              if (heading.indexOf(punct.charAt(j))>=0)
              {
                  break;
              }
              if ( j <  punct.length())
                 heading = Toolbox.emsg(1226) + i;
          }
             
          quanty[i] = trim(quanty[i]);
          int ln = quanty[i].lastIndexOf(" ");
          quanty[i] = quanty[i].substring(ln+1);
          
          int kl = heading.indexOf("_");
          if (kl==0)
          {
              fields[i]="nolabel";       
              fieldOrders.put("nolabel",""+i);
              ctypes[i] = heading.substring(1);
          }
          else if (kl==-1)
          {
              int ll = heading.lastIndexOf(".");
              heading = heading.substring(ll+1);
              if (heading.matches("[0-9]+")) 
                  heading = Toolbox.emsg(1226) + i;
              heading = heading.trim();
              fields[i] = heading;
              fieldOrders.put(heading,""+i);
              ctypes[i] = "T_10";
          }
          else 
          {
              ctypes[i] = heading.substring(kl+1);
              heading = heading.substring(0,kl).trim();
              fieldOrders.put(heading,""+i);
              fields[i] = heading;
          }
          
          labels[i] = fields[i];
       }
        
         if (regexs == null || N >  regexs.length)
         {
             regexs = new String[N];
             for (int q=0; q < N; q++) regexs[q] = "";
         }
         if (defaultv == null || N >  defaultv.length)
         {
             defaultv = new String[N];
             for (int q=0; q < N; q++) defaultv[q] = "";
         }
             
        reorghelp(N);
           
         
        selectsql = trim(query).split(separator);
        for (int j=0; j < selectsql.length; j++)
           selectsql[j] = fixorderby(selectsql[j]);
        //extractDefaultv(false);
    }
    
    String fixorderby(String query)
    {
       Vector<String> vf = new Vector<String>(); 
       int kk = selectsep(query, vf);
       if (kk == -1)
       {
           return query;
       }
       String leftover = query.substring(kk);
       int N = vf.size();
       String hasorderby = leftover;
       int j1 = hasorderby.toLowerCase().indexOf("order by");
       if (j1 == -1) return query;
       String orderstr[] = null;
       if (j1>0) orderstr  = leftover.substring(j1+8).trim().replaceFirst("DESC$","").split("[ ]*,[ ]*"); 
       if (N == 1 && vf.elementAt(0).indexOf("*") >= 0)
       {
           return query;
       }
       String [] fields = new String[N];
        
       StringBuffer bf = new StringBuffer();
       
       for (int i=0; i <N; i++)
       {
          if (i>0) bf.append(",");
          String heading = trim(vf.elementAt(i));
          
          if (i == 0)
          {
              String xx = heading;
              heading = heading.trim().replaceFirst("(?i)select[\r|\n|\t| ]+","");
              if(!xx.equals(heading))
                  bf.append("SELECT ");
              xx = heading;
              heading = heading.replaceFirst("(?i)distinct[\r|\n|\t| ]+","");
              if (!xx.equals(heading))
                  bf.append("DISTINCT ");
              
          }
          String lheading  = heading.replaceAll("(?i)[ |\n|\r|\t]as[ |\r|\n|\t]", " as ");
          int starti = lheading.lastIndexOf(" as ");
          
          String punct = "!@#$%^&*()-+={[}]|\\:;\"'<,>.?/";
          if ( starti > 0)
          {
              if (starti + 4 < lheading.length())
              {
                  lheading = lheading.substring(starti + 4);
              
                  for (int j = 0; j < punct.length(); j++)
                  if (lheading.indexOf(punct.charAt(j))>=0)
                  {
                      starti = -1;
                      break;
                  }
              }
          }
          
          if ( starti > 0)
          {
              bf.append(heading.substring(0,starti));
              fields[i] = heading.substring(0,starti);
               
          }
          else
          {
              fields[i] = heading;
              bf.append(heading);
               
          }
             
          fields[i] = trim(fields[i]);
          int ln = fields[i].lastIndexOf(" ");
          fields[i] = fields[i].substring(ln+1);
           
       }
       String nousefield = "";
       if (orderstr!=null)
       for (int l=0; l < orderstr.length; l++)
       {
           if (orderstr[l].replaceAll("[0-9]","").equals("")) 
               continue;
           orderstr[l] = orderstr[l].replaceFirst("^\\-","").trim();
           boolean in = false; int i;
           for (i=0; i <N; i++)
               if (fields[i].replaceFirst(".*\\.","").equalsIgnoreCase(orderstr[l])||fields[i].equalsIgnoreCase(orderstr[l]))
                   break;
           if (i == N) 
           nousefield += "," + orderstr[l];
       }
       query = bf.toString() + nousefield + leftover;
       if (!nousefield.equals(""))
       {
          
       }
       return query;
    }
    
    
    String trim1(String x)
    {
       if (x==null) return ""; int i, j=0;
       for (i=x.length()-1; i >=0; i--)
       {
          if (x.charAt(i)!='\r' && x.charAt(i)!='\n' && x.charAt(i)!=' ')
             break;
       }
 
       for (j=0; j < i; j++)
       {
          if (x.charAt(j)!='\r' && x.charAt(j)!='\n' && x.charAt(j)!=' ')
             break;
       }
       return x.substring(j,i+1);
    }
    static public String trim(String x)
    {
        if (x==null) return "";
        return x.replaceFirst("^[ |\t|\n|\r]+", "").replaceFirst("[ |\t|\n|\r]+$", "");
    }
    
    public void simplify(JDBCAdapter adapter, int orgnum)//, String encoding)
    {
           if (selectsql==null ) 
           {
               return;
           }
           String [] querystr = query.split("\n\n");
           query = selectsql[0];
           
           for (int j=1; j < selectsql.length; j++)
           {
              query +="\n\n";
              int n = -1;
              String s =  trim(selectsql[j]);
               
              boolean notsql = (s.length() < 7 || s.substring(0,7).toLowerCase().indexOf("select ")!=0);
              boolean domainvalue = (notsql==false) && (s.toLowerCase().indexOf(" from domainvalue ") > 0);

              if(notsql || !domainvalue)
              {
                  query +=  s;
              }
              else
              {
                  String yy = (j<querystr.length&&querystr[j].indexOf("@#")==0)?querystr[j]:null;
                  query +=  "@#"+ accumulate(modquery(adapter,s),orgnum%65536,yy);
              }
           }
           
    }
    String accumulate(int n, int org, String x)
    {
        if (x!=null) x = x.substring(2);
        if (x==null|| x.equals(""))
        {
            return ";0:" + n + ";"; 
        }
        if (x.contains(";" + org + ":")) 
        {
            x = x.replaceFirst(";" + org + ":[0-9]+","");
        }
        if (x.contains(";0:" + n + ";")) return x;
        return x +  org + ":" + n + ";";
    }
    
    int modquery(JDBCAdapter adapter, String s )
    {
          if (s == null  ) return 0;
          
          int optsnum = 0;
          for (int k=0; k < Toolbox.langs.length; k++)
          {
             String newsql = s.replaceFirst("(?i) where ", " WHERE language='" +  Toolbox.langs[k] + "' AND ");
             
             boolean b = adapter.executeQuery2(newsql,true);
             if (!b || adapter.getValueAt(0,0)==null) 
             {
                 err = "Simplify " + name + ": " + newsql;
                
                 continue;
             }
             String caption = "";
             String option = "";
             String str = "";
            
           for (int i=0; adapter.getValueAt(i,0)!=null; i++)
           {
              if (adapter.getColumnCount()>1 && adapter.getValueAt(i,1)!=null)
              {
                  String zz = adapter.getValueAt(i,1);
                  if (zz==null) zz = "";
                  else zz =  trim(zz);
                  caption += "," + zz;
              }
             
              String zz = adapter.getValueAt(i,0);
              if (zz==null) zz = "";
              else zz =  trim(zz);
              option += "," + zz;
           }
           
           if (caption.equals("") && caption.equals(option))
           {
                str += Toolbox.emsg(k,604) + ";0";
           }
           else if (caption.equals("") || caption.equals(option))
           {
                str += option.substring(1);
           }
           else  
           {
                str += caption.substring(1) + ";" + option.substring(1);
           }
          if (k==0)
           {
               for (optsnum=0; optsnum < Generic.storedProcOpts[k].size(); optsnum++)
                   if (Generic.storedProcOpts[k].get(optsnum).equals(str)) break;
               if (optsnum == Generic.storedProcOpts[k].size()) 
               Generic.storedProcOpts[k].add(str);
               
           }
           else
           {
                for (int l=Generic.storedProcOpts[k].size(); l <= optsnum; l++)
                {
                    Generic.storedProcOpts[k].add("");
                } 
                Generic.storedProcOpts[k].set(optsnum,str);
                
           }
           
        }
        return optsnum;
           
    }
    
    public Webform(){}
    public Webform(String n, String t, String q, String i,  String u, String d, String w, String h,  String f, long r,long insertr,long updater,long deleter,String st,String pre, String post, String perm)
    {
         name=n; 
         title =t; 
         format = f; 
         query = q; 
         insertQuery=i; 
         updateQuery = u; 
         deleteQuery = d; 
         webService = w; 
         help = h; 
         roles=r; 
         insertroles=insertr;
         updateroles=updater;
         deleteroles=deleter;
         jscript = st; 
         preop=pre; 
         postop = post;
         permits = perm;
         if (query!=null) query=query.replaceAll("\\r","");
         if (insertQuery!=null) insertQuery=insertQuery.replaceAll("\\r","");
         if (updateQuery!=null) updateQuery=updateQuery.replaceAll("\\r","");
         if (jscript!=null) jscript=jscript.replaceAll("\\r","");
    }
    public static final Pattern ss = Pattern.compile(" ");
    public static final String lm = "%20";
    public static final Pattern nl = Pattern.compile("\\n");
    public static final Pattern qu = Pattern.compile("\"");
    public static final String qu1 = "\\\\\"";
    
    String merge(String a, String b)
    {
        
        String [] as = null;
        if (a!=null) as = a.split("\n");
        String [] bs = null;
        if (b!=null) bs = b.split("\n");
        String h = "";
        for (int i=0; i < as.length; i++)
        {
            int k = as[i].indexOf("=");
            if (k ==-1 || k==as[i].length()-1) continue;
            String fd = as[i].substring(0,k);
            String iv = as[i].substring(k+1);
            String md = "";
            if (iv.length()>0 && iv.charAt(0) == '!')
            {
                md = "1";
                iv = iv.substring(1);
            }
            boolean hit = false;
            if (b!=null)
            for (int j=0; j< bs.length; j++)
            {
               k = bs[j].indexOf(":");
               if (k ==-1 || k==bs[j].length()-1) continue;
               if (fd.equals(bs[j].substring(0,k)))
               {
                   as[i] = fd + "," + md + ",'" + iv.replaceAll("'", "''") + "','','" + bs[j].substring(k+1) + "'\n";
                   bs[j] = null;
                   hit= true;
                   break;
               }
            }
            if (hit==false)
                as[i] = fd + "," + md + ",'" + iv.replaceAll("'", "''") + "','',''\n";
            h += as[i];
        }
        if (b!=null)
        for (int j=0; j< bs.length; j++)
        {
            if (bs[j]!= null)
            {
                int k = bs[j].indexOf(":");
                if (k ==-1 || k==bs[j].length()-1) continue;
                h += bs[j].substring(0,k) + ",,,,'" + bs[j].substring(k+1) + "'\n";
            }
        }
        return h.replaceFirst("\n$","");
    }
     
    public Webform(JDBCAdapter adapter, int i)
    {
         name= adapter.getValueAt(i,1);
         title = adapter.getValueAt(i,2);
         query =  adapter.getValueAt(i,3); 
         if (query!=null) query=query.replaceAll("\\r","");
         insertQuery =  adapter.getValueAt(i,4); 
         Pattern p = Pattern.compile("\n[ |\t|\r]*\n");
         Matcher mt = null;
         if (insertQuery!=null) mt = p.matcher(insertQuery);
         help = adapter.getValueAt(i,9);
        /* String help1= "";
         if (mt!=null && mt.find())
         {
             help1 = insertQuery.substring(mt.end());
             try{
             help = merge(help1,help);
             }catch(Exception e){ }
             insertQuery = insertQuery.substring(0,mt.start());
         } */
         if (insertQuery!=null) insertQuery=insertQuery.replaceAll("\\r","");
         updateQuery =  adapter.getValueAt(i,5); 
         if (updateQuery!=null) updateQuery=updateQuery.replaceAll("\\r","");
         deleteQuery = adapter.getValueAt(i,6); 
         webService = adapter.getValueAt(i,7); 
         format = adapter.getValueAt(i,8);
        
         try{  roles =  Long.parseLong(adapter.getValueAt(i,10)); }catch(Exception e){roles = 0;}   
         try{  insertroles =  Long.parseLong(adapter.getValueAt(i,11)); }catch(Exception e){insertroles = 0;}  
         try{  updateroles =  Long.parseLong(adapter.getValueAt(i,12)); }catch(Exception e){updateroles = 0;}  
         try{  deleteroles =  Long.parseLong(adapter.getValueAt(i,13)); }catch(Exception e){deleteroles = 0;}  
         jscript =  adapter.getValueAt(i,14); 
         preop =  adapter.getValueAt(i,15);
         postop =  adapter.getValueAt(i,16);
         permits =  adapter.getValueAt(i,17);
         if (permits == null) permits = "";
         if (jscript!=null) jscript=jscript.replaceAll("\\r","");
         else jscript = "";
         if (preop==null) preop = "";
         if (postop == null) postop = "";
         
    }
    void copy(String [] from, String [] to)
    {
        for (int i=0; i < from.length; i++) to[i]= from[i];
    }
    void copy(int [] from, int [] to)
    {
        for (int i=0; i < from.length; i++) to[i]= from[i];
    }
    public Webform(Webform w)
    {
         name= w.name;
         title = w.title;
         query =  w.query; 
         insertQuery =  w.insertQuery; 
         updateQuery =  w.updateQuery; 
         deleteQuery = w.deleteQuery; 
         webService = w.webService; 
         help = w.help; 
         format = w.format;
         roles =  w.roles;   
         insertroles =  w.insertroles;  
         updateroles =  w.updateroles;  
         deleteroles =  w.deleteroles; 
         if (w.fields!=null){
         fields = new String[w.fields.length];
         copy(w.fields,fields);
         }
         if (w.labels!=null){
         labels = new String[w.labels.length];
         copy(w.labels,labels);
         }
         if (w.attrs!=null){
         attrs = new String[w.attrs.length];
         copy(w.attrs,attrs);
         }
         if (w.ctypes!=null){
         ctypes = new String[w.ctypes.length];
         
         copy(w.ctypes,ctypes);
         
         }
         if (w.positions!=null){
         positions =  w.positions;

         }
         if (w.defaultv!=null){
         defaultv = new String[w.defaultv.length];
         copy(w.defaultv,defaultv);
         }
         if (w.selectsql!=null){
         selectsql = new String[w.selectsql.length];
         copy(w.selectsql,selectsql);
         }
         if (w.regexs!=null){
         regexs = new String[w.regexs.length];
         copy(w.regexs,regexs);
         }
         jscript = w.jscript;
         preop = w.preop;
         postop = w.postop;
         permits = w.permits;
    }
    
    public static String convert(String s)
    {
       if (s == null) return "";
       //Matcher m = ss.matcher(s);
      // s = m.replaceAll(lm);
       Matcher m = nl.matcher(s);
       s = m.replaceAll(" ");
       m = qu.matcher(s);
       s = m.replaceAll(qu1);
       return Generic.handle(s);
    }
    public String url()
    {
       return  format+"?name="+Toolbox.urlencode(name)
       +"&title="+Toolbox.urlencode(title)
       +"&query="+Toolbox.urlencode(query) 
       +"&insertQuery="+Toolbox.urlencode(insertQuery)
       +"&updateQuery="+Toolbox.urlencode(updateQuery)
       +"&deleteQuery="+Toolbox.urlencode(deleteQuery)
       +"&help="+Toolbox.urlencode(help)
       +"&roles="+roles 
       +"&jscript=" + jscript 
       +"&preop="+preop 
       +"&postop=" + postop; 
       
    }
    public String Name(){return convert(name);}
    public String Title(){return convert(title);}
    public String Format(){return convert(format);}
    public String Query(){return convert(query);}
    public String InsertQuery(){return convert(insertQuery);}
    public String UpdateQuery(){return convert(updateQuery);}
    public String DeleteQuery(){return convert(deleteQuery);}

    public String toString()
    {
        return "name=" + name +"\ntitle=" + title + "\nquery=" + query + "\nupdateQuery="
              + updateQuery + "\ndeleteQuery=" + deleteQuery + "\nformat=" + format +"\nfields="
              + fieldstr()+ "\nlabels=" + formstr(labels) + "\npositions=" +  (positions)+ "\nctypes=" + formstr(ctypes) + "\nattribute=" + formstr(attrs)
              + "\npermits=" + permits;
    }

    
    public String error(){return details;}
    byte cmapi(char c){
        switch(c)
        {
            case '|': return 0;
            case '@': return 1;
            case '?': return 2;
            case '$': return 3;
            default:  return 4;
        }
    }
                         //0, 1, 2, 3, 4, 5,6,7,8,9,10,11,12,13
    byte cpart [][] = {
    {0,    0,    0,    3,   1,   1,    1,    1,    1,    1,   1,    1,   1},
    {0,    1,    1,    1,   0,   0,    3,    1,    1,    1,   1,    1,   1},
    {0,    1,    1,    1,   1,   1,    1,    0,    0,    3,   1,    1,   1},
    {0,    1,    1,    1,   1,   1,    1,    1,    1,    1,   0,    0,   3},
    {2,    2,    0,    2,   2,   0,    2,    2,    0,    2,   2,    0,   2}
    };
    byte cstate [][] = {
    {1,    2,    3,    0,   1,   1,    1,    1,    1,    1,   1,    1,   1},
    {4,    4,    4,    4,   5,   6,    0,    4,    4,    4,   4,    4,   4},
    {7,    7,    7,    7,   7,   7,    7,    8,    9,    0,   7,    7,   7},
    {10,   10,   10,   10,  10,  10,   10,   10,   10,   10,  11,   12,  0},
    {0,    0,    2,    0,   0,   5,    0,    0,    8,    0,   0,    11,  0}
    };
    
    public void reorghelp(int N)
    {
            if (trim(help).equals("") ) return;
            err = "";
            int step = 0;
            String help00 = help;
            try
            {
             CSVParse parse = new CSVParse(help, '\'', new String[]{",:","\r\n"});
             String [][] x = parse.nextMatrix(true);
             boolean good = true; 
             step = 1; 
             for (int i=0; i < x.length; i++)
             {
                 if (x[i] ==null || x[i].length == 0 ||x[i][0].equals("")) continue;
                  
                 if (x[i].length>1 && x[i][1]!=null && !x[i][1].equals("") && !x[i][1].equals("1") && !x[i][1].equals("0"))
                 {
                     x[i][1] = "";
                 }
                 step = 200+i;
             }
          
             help = "";
             for (int i=0; i < x.length; i++)
             {
                 if (x[i] ==null || x[i].length == 0 ||x[i][0].equals("")) continue;
                 String x0 = x[i][0];
                 String x1 = ""; if (x[i].length > 1 && x[i][1] != null) x1 = trim(x[i][1]);
                 String x2 = ""; if (x[i].length > 2 && x[i][2] != null) x2 = trim(x[i][2]);
                 String x3 = ""; if (x[i].length > 3 && x[i][3] != null) x3 = trim(x[i][3]);
                 String x4 = ""; if (x[i].length > 4 && x[i][4] != null) x4 = trim(x[i][4]);
                 step = 300 + i;
                 if (!x4.equals(""))
                     help += x0 + ":" + x4+ "\n";
                
                 int j=0;
                 for (j=0; j < N ; j++)
                 {
                     step = 350 + j ;
                     if (fields!=null && j < fields.length && fields[j]!=null &&  fields[j].toUpperCase().replaceAll(" ", "").equals(x0.toUpperCase().replaceAll(" ", "")) == true)
                         break;
                     step = 360 + j;
                 }
                 step = 400 + i;
                 if (j < N && j < regexs.length && j < defaultv.length)
                 {
                     regexs[j] = x3;
                     defaultv[j] = (x1.equals("1")?"!":"") + x2;
                 } 
                 else
                 {
                    err += x0+"(Not a field)," + help00;
                 }
             }
             step = 500; 
            }
            catch(Exception e){err += (name + step +  e.toString()) ;
            
            }
        
    }
                    
    public  boolean compile(String s, String x[], boolean isinsert)
    {  
        
        if (s == null || fieldOrders == null || fieldOrders.size()==0) 
        {
            x[0] = x[1] = null;
            return true;
        }
        String extra = "";
       /* if (isinsert)
        {
            Matcher m = Generic.twoblank.matcher(s);
            if (m.find())
            {
                int jj = m.start();
                if (jj >= 0)
                {
                    extra = s.substring(m.end());
                    s = s.substring(0, jj);
                }
            }
         }*/
         
        int NM = s.length();    
        int j = s .indexOf(":");
        String actname="";
        StringBuffer ans = new StringBuffer(100);
        StringBuffer stay = new StringBuffer(NM);
        if ( j!=-1 &&  s.substring(0,j).indexOf(" ") < 0)
        {
            actname = s.substring(0,j+1);
            s  = s.substring(j+1);
        }
        
        int state = 0; 
        char state1='z';
        char state2='q';
        int N = s.length();
        boolean outquota = true;
        boolean brace = false;
        String field = "";
       String order = "0";
       int jj = 0; 
       for (int i = 0;i < N; i++)
       {
          if (s.charAt(i)=='\'')
              outquota = !outquota;
          
          byte k = cmapi(s.charAt(i));
          switch(cpart[k][state])
          {
              case 3:
                        field = field.substring(2,field.length()-1);

                       
                     if (k==2)  
                     { 
                         if (!field.equals("CURRENT_USER") && !field.equals("CURRENT_TIME"))
                         {
                             if (outquota == false)
                                ans.append("'??" + field + "??'");
                             else
                                 ans.append("??" + field + "??"); 
                             stay.append("??" + (jj++) + "??");
                         }
                         else
                             stay.append("??" + field +"??");
                     }   
                     else 
                     {  
                        if (field.matches("[0-9]+"))
                          order = field;
                        else
                          order =  (String)(fieldOrders.get(field));
                         
                        if (order==null)
                        {
                           details +="Can not find field "+ s.charAt(i)+s.charAt(i) + field +s.charAt(i)+s.charAt(i) ;
                            return false;
                        }
                        //j=stay.length()-1; for (; j>=0 && (stay.charAt(j)=='\'' || stay.charAt(j)==' '); j--);
                        //if (j>=0 && stay.charAt(j)=='='&& s.charAt(i)=='@')
                        if (s.charAt(i)=='$')
                        {
                            ans.append('$' + order + '$');
                            stay.append("$$" + (jj++) +"$$");
                        } 
                        else
                        {
                            ans.append(s.charAt(i) + order + s.charAt(i));
                            stay.append("??" + (jj++) +"??");
                        }
                     }
                      field = "";
                     break;
              case 2:
                   stay.append(field + s.charAt(i));
                   field = "";
                   ans.append(",");
                   break;
              case 1:
                   stay.append(field);
                   field = ""+s.charAt(i);
                   ans.append(",");
                   break;
              case 0:
                   field += s.charAt(i);
                     break;
              default: break;
          }
          
          state = cstate[k][state]; 
         
       }
       x[0] =  actname + ans.toString().trim().replaceAll(",+", ",").replaceFirst("^,","").replaceFirst(",$","");
       if (extra.equals("")==false)
           x[0] += "\n\n" + extra;
       x[1] = stay.toString();
      
       return true;
        
    }
    
    
    Pattern fds = Pattern.compile("\\?\\?[^\\?]+\\?\\?");
    public Webform getSearch()
    {
       Webform w = new Webform(this);
       int N = query.length();
       int jj = Toolbox.locatefrom(query, N,"where");
       if (N == jj) return null;
       String x = query.substring(jj+1);
       if (x.indexOf("'%") < 0 || x.indexOf("%'") < 0)
           return null;
       w.roles = roles;
       w.name =  name+"0";
       w.title = title;
 
       w.query = x;
       w.insertQuery = insertQuery;
       w.help = help;
       int k = 0;
       String [] y = w.insertQuery.split("\n");
       String [] z = w.help.split("\n");
       Matcher mt =  fds.matcher(x);
       boolean isparam = false;
       while (mt.find())
       {
              String fd = x.substring(mt.start(), mt.end());
              if (fd.equals("??CURRENT_USER??") || fd.equals("??CURRENT_TIME??"))
                  continue;
              k = fd.indexOf("_");
              
              if (k==-1) k = fd.length();
              else isparam = true;
              fd =fd.substring(0,k);
              for (int i=0; i < y.length; i++)
              {
                  if (y[i].indexOf(fd+"=")==0)
                      w.insertQuery += y[i]+"\n";
                   if (z[i].indexOf(fd+"=")==0)
                      w.help += z[i]+"\n";
              }
              
       }
       if (isparam==false) return null;
       
       title = "Selected " + title;
       query = query.substring(0,jj+1) + "??wcds??";
 
       w.updateQuery = w.format;
       w.format = "Search";
       w.webService ="";
       w.deleteQuery = "";
       w.preop = "";
       w.postop = "";
       return w;
    }
   static final Pattern FUNC = Pattern.compile("[\\W][A-Z|a-z|0-9]+\\(");
   public static void main1(String [] args)
   {
        String t = "01 *CONCAT(' \n \n As dsds_L,dsd) ER.jsp' \n  as dfdf_L"; 
        Pattern FUNC1 = Pattern.compile("[\\W][\\w]+[ |\n]*\\(");
        Matcher m = FUNC1.matcher(t);
        boolean b = m.find(0);int c = -1;
        if (b){c = m.start();}
   }
   static final Pattern linebreak = Pattern.compile("\n[\r|\n| |\t]*\n");
   private void  parseSearch( )  
   {
       String s = trim(query);
       Matcher  m = linebreak.matcher(s);
       String leftover = "";
       if (m.find())
       {
           int at = m.start();
           leftover  = s.substring(at);
           
           s = s.substring(0,at);
       }
       if (s == null) return ;
       Vector ops = new Vector<>();
       StringBuffer ans = new StringBuffer(200);
       StringBuffer attrbf = new StringBuffer(200);
       StringBuffer ctypebf = new StringBuffer(200);
       StringBuffer fieldsbf = new StringBuffer(200);
       //attrbf.append("var pubkeys='"); 
       StringBuffer output = new StringBuffer(200);
       boolean sq = false;
       HashMap<String,String> fdsh = new HashMap<>();
       int state = 0;
       int i = 0, j, jj;
       int N = s.length();
       String heading = "";
       String tt = "";
       int numCols = 0;
       
       int k = 0;
       for (;i < N; i++)
       {
          if (s.charAt(i)=='\'')
          {
              sq = !sq;
          }
           if (s.charAt(i) == '?')
          {
               if (state == 3)
               {
                   if (heading.indexOf("_")==-1 )
                   {
                       ans.append( "??" + heading + "??");
                   }
                   else if ( heading.equals("CURRENT_TIME")) 
                   {
                        ans.append( "??CURRENT_TIME??");
                   }
                   else if(heading.equals("CURRENT_USER"))
                   {
                        ans.append( "??CURRENT_USER??"); 
                   }
                   else if( (tt=(String)(fdsh.get(heading))) !=null)
                   {
                        ans.append( "@" + tt +"@");
                   }
                   else
                   {    
                         attrbf.append(1);
                         attrbf.append((sq)?0:1);
                         attrbf.append(20);
                         attrbf.append(",");
                         int kl = heading.indexOf("_");
                         if (kl==-1)
                         {
                             fieldsbf.append(heading+";");
                             ctypebf.append("t_10,");
                            // labels[numCols] = "T"+heading;
                         }
                         else
                         {
                            //  labels[numCols] = heading.substring(kl+1,kl+2)+heading.substring(0,kl);// heading;
                             fieldsbf.append(heading.substring(0,kl) +";");
                             ctypebf.append(heading.substring(kl+1)+",");
                         }
                         ans.append( "@" + numCols +"@");
                         fdsh.put(heading, ""+numCols);
                         j = i - 4 - heading.length();
                         if (s.charAt(j) == '%')
                             ops.addElement(new String("like"));
                         else
                         {
                            if (s.charAt(j)==' ' ||s.charAt(j)=='\n' || s.charAt(j) =='\r'||s.charAt(j)=='\'')
                            {
                                 while (j>=0 &&  (s.charAt(j)==' ' ||s.charAt(j)=='\n' || s.charAt(j) =='\r'||s.charAt(j)=='\'' || s.charAt(j) =='%' ))j--;
                                jj = j;
                                while (j>=0 && s.charAt(j)!=' ' && s.charAt(j)!='\n' && s.charAt(j) !='\r')j--;
                                ops.addElement(s.substring(j+1,jj+1).toLowerCase());
                            }
                            else
                            {
                                jj = j;
                                while (j>=0 && s.charAt(j)!=' ' && s.charAt(j)!='\n' && s.charAt(j) !='\r')j--;
                                ops.addElement(s.substring(j+1,jj+1).toLowerCase()); 
                            }
                         }
                        
                         numCols++;  
                   }
                   heading = "";
               }
               state = (state + 1)%4;
               if (state == 1) k = i-1;
           }    
          else
          {
              switch(state)
              {
                  case 0: ans.append(s.charAt(i)); break;
                  case 1: ans.append("?"+s.charAt(i)); state = 0; break;
                  case 2: heading += s.charAt(i); break;
                  case 3: ans.append("??" + heading +"?"); heading = ""; state=0; break;
              }
          }
       }
      
      switch(state)
      {
           case 1: ans.append("?"); break;
           case 2: ans.append("??" + heading); break;
           case 3: ans.append("??" + heading +"?");break;
      } 
      output.append("var mat=[[");
      for (  i = 0; i <  numCols; i++) 
      { 
          String q = (String)(ops.elementAt(i));
          if ( q.indexOf(">=") >=0) 
             output.append( "'&ge;'");
          else  if (q.indexOf("<=") >=0) 
             output.append( "'&le;'");
          else  if ( q.indexOf(">") >=0 || q.indexOf("<") >=0) 
             output.append( "'" + q + "'");
          else  if ( q.equals("like") ) 
             output.append("'&supe;'");
          else output.append("'='");
          if (i < numCols-1) 
              output.append(",");
          else output.append("]");
      }
      output.append("];");
    
      //labels[31] = String.valueOf(numCols);
      attrs = attrbf.toString().replaceFirst(",$","").split(",");
      ctypes = ctypebf.toString().replaceFirst(",$","").split(",");
      fields = fieldsbf.toString().replaceFirst(";$","").split(";");
      labels = fieldsbf.toString().replaceFirst(";$","").split(";");
      query =  ans.toString() + "\n\n" + output.toString() +  leftover;
      selectsql = trim(query).split(separator);
     if (regexs == null || N >  regexs.length)
     {
         regexs = new String[N];
         for (int q=0; q < N; q++) regexs[q] = "";
     }
     if (defaultv == null || N >  defaultv.length)
     {
         defaultv = new String[N];
         for (int q=0; q < N; q++) defaultv[q] = "";
     }
    
     reorghelp(N);
     
        
    }
     
 
  public boolean save(JDBCAdapter adapter)
  {
      String sql = "UDAPTE Task SET query='" + query.replaceAll("'","''") +"',"
              + "insertQuery='" + insertQuery.replaceAll("'","''") +"',"
              + "updateQuery='" + updateQuery.replaceAll("'","''") +"',"
              + "deleteQuery='" + deleteQuery.replaceAll("'","''") +"',"
              + "format='" + format.replaceAll("'","''") +"',"
              + "webService='" + webService.replaceAll("'","''") +"',"
              + "help='" + help.replaceAll("'","''") +"',"
              + "jscript='" + jscript.replaceAll("'","''") +"',"
              + "preop='" + preop.replaceAll("'","''") +"',"
              + "postop='" + postop.replaceAll("'","''") +"',"
              + "roles=" + roles  +","
              + "insertroles=" + insertroles  +","
              + "updateroles=" + updateroles  +","
              + "deleteroles=" + deleteroles  +","
              + "title='" + title.replaceAll("'","''")
              + "permits='" + permits.replaceAll("'","''")
              +"' WHERE name='" +title.replaceAll("'","''") +"'";
       return (1==adapter.executeUpdate(sql));
  }
   
  static int states(int state, char c)
  {
      int [][] sts = {{3,1,2,4,5},{2,1,2,0,3}};
      int ns = 0;
      if (c == '\'')
      {
          if (state > 1) ns = state;
          else ns = 1 - state;
      }
      else if (c == '(')
      {
          if (state > 4) 
              ns = state + 1;
          else
              ns = sts[0][state];
      }
      else if (c == ')')
      {
          if (state > 4) 
              ns = state - 1;
          else
              ns = sts[1][state];
      }
      else
      {
          ns = state;
      }
      return ns;
  }
  
  static int selectsep(String sel, Vector<String> v)
  {
      int state = 0;
      int ans = -1;
      StringBuffer buf = new StringBuffer();
      int i= 0;
      char c ;
      int k = 0;
      while (sel.charAt(k) == ' ' || sel.charAt(k) == '\n' || sel.charAt(k) == '\r'|| sel.charAt(k) == '\t')
          k++;
      int N = sel.length();
      Pattern p = Pattern.compile("\n[\r]*\n+");
      Matcher m = p.matcher(sel.substring(k));
      if (m.find())
      {
          N = k + m.start();
      }
      
      for (i=0; i <= N; i++)
      {
          
          if (i < N) 
              c = sel.charAt(i);
          else
              c = ',';
          if (state != 0 || c != ',')
          {
              buf.append(c);
          }
          if (state == 0)
          {
              if (c == ',')
              {
                  v.addElement(buf.toString());
                  buf.setLength(0);
                  if (i == N) ans = N;
              }
              else if (c == ' ' || c == '\n' || c == '\r'|| c == '\t')
              {
                  if (buf.length() >= 6)
                  {
                      String x = buf.substring(buf.length()-6, buf.length()).toLowerCase().replaceFirst("^[\r|\n|\t]", " ").replaceFirst("[\r|\n|\t]+$", " ");
                      if (x.equals(" from "))
                      {
                          v.addElement(buf.substring(0,buf.length()-6));
                          ans = i - 5;
                          break;
                      }
                      else if (buf.length() >= 7)
                      {
                          x = buf.substring(buf.length()-7, buf.length()).toLowerCase().replaceFirst("^[\r|\n|\t]", " ").replaceFirst("[\r|\n|\t]$", " ");
                          if (x.equals(" where ") || x.equals(" union "))
                          {
                              v.addElement(buf.substring(0,buf.length()-7));
                              ans = i - 6;
                              break;
                          }
                      }
                  }
              }
          }
         
          state =  states(state, c);
      }
      if (state>0)
      {
          if (v.size()>0)
             v.setElementAt(buf.toString().trim(), 0);
          else
             v.addElement(buf.toString().trim());
          return -1;
      }
      if (v.size()>0)
      {
         // sel = v.elementAt(0).trim().replaceFirst("(?i)select[\r|\n|\t| ]+","").replaceFirst("(?i)distinct[\r|\n|\t| ]+","");
         // v.setElementAt(sel, 0);
      }
      return ans; 
  }
  public static void main2(String [] args)
   {
        String str = "Curriculum.cid as CourseId_T_8,  "
                + "Course.title as Title_T_20, "
                + "Course.category as Area_T_12, "  
                + " Curriculum.groupArea as Group_T_10, "
                + "Curriculum.selective as Selective_T_1, "
                + "Curriculum.notes as PlanTime_T_6, "
                + "'' AS  Session_T_8, "
                + "'' as Select_h,"
                + "'DataPicker?rdap=sessionpick&extraline=0&exbut=cphm' as picker_k, "
                + "'' as  Schedule_T_10, "
                + "'??semester??' as Semester_h,"
                + "0 as CurrentStatus_S,"
                + "Course.prerequisite AS Prerequisite_h, "
                + "0 as Reason_h,"
                + "10 as RequestedStatus_s, "
                + " as status_h FROM ";
        Vector<String> v = new Vector<>();
        int b = selectsep(str, v);
        Toolbox.println(0,v.elementAt(0)); 
    }
  
  static public void main(String[] args)
  {
      //Vector<String> u = new Vector<String>();
      //int i = selectsep("SELECT '' AS Tname_t_20,'' AS Definition_a,0 AS Roles_m", u);
      String x = "SELECT Assignment.name, CONCAT(Assignment.course, '^~', Assignment.sessionname)  FROM Assignment WHERE  Assignment.semester='Fall 2014' AND Assignment.grader LIKE '%h2%'  ORDER BY 2";
      x = mysql2c1("+",x);
      Toolbox.println(0,x);
  }
  
}


