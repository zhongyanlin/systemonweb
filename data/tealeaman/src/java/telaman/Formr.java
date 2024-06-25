package telaman;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.InputStreamReader;
import java.util.TreeSet;
import java.util.Vector;
import telaman.DBAdmin;
import telaman.JDBCAdapter;
import telaman.PassedData;
import telaman.Toolbox;
import telaman.User;

public class Formr {

   public int i;
   public int df;
   public long roles;
   public String rdap;
   public String title;
   public String cat;
   public String uid;
   public boolean valid = true;
   private static Object forlock = new Object();


   

   public static synchronized String modifyFile(String rdap, String title, String cat, String uid, long roles, User user, int df0 ) {
      Formr r = new Formr(0, rdap, title, cat, uid, roles, df0);
      Vector cats = new Vector(20);
      Vector nums = new Vector(20);
      int i = 0;
      FileInputStream fin = null;
      FileWriter awriter = null;
      boolean newfile = false;
      String ans = "";
      File myfile = path(user.id + "_js", user.orgnum);
      int orgnum = user.orgnum;
      try {
         File e = new File(Toolbox.installpath + File.separator + "formlist" + (user.orgnum%65536) + ".js");
         if(!e.exists()) {
            e.createNewFile();
            newfile = true;
         }

         fin = new FileInputStream(e);
         InputStreamReader esr = new InputStreamReader(fin);
         BufferedReader ebr = new BufferedReader(esr);
         awriter = new FileWriter(myfile, false);
         awriter.write("var z = new Array();\n");
         boolean done = false;
         boolean valid = true;
         boolean doner = false;
         Formr c;
         String aline;
         if(cat != null) {
            while((aline = ebr.readLine()) != null) {
               c = new Formr(aline);
               if(c.valid && c.i != -1) {
                  if(r.compareTo(c) > 0) {
                     if(!r.samer(c)) {
                        awriter.write(c.line(i, cats, nums));
                        ++i;
                     }
                  } else {
                     if(r.compareTo(c) == 0) {
                        if(!r.samer(c)) {
                           ans = cat + " " + title + " " + Toolbox.emsgs(orgnum,1077);
                           valid = false;
                        } else {
                           valid = false;
                        }
                        break;
                     }

                     if(!done) {
                        String state = r.line(i, cats, nums);
                        if(!state.equals("")) {
                           ++i;
                        }

                        awriter.write(state);
                        done = true;
                     }

                     if(!c.samer(r)) {
                        awriter.write(c.line(i++, cats, nums));
                     }
                  }
               }
            }

            if(!done) {
               awriter.write(r.line(i++, cats, nums));
            }

            if(valid) {
               awriter.write("var cats=[\"" + (String)((String)cats.elementAt(0)) + "\"");

               for(i = 1; i < cats.size(); ++i) {
                  awriter.write(",\"" + (String)((String)cats.elementAt(i)) + "\"");
               }

               awriter.write("];\n");
               awriter.write("var nums=[" + (String)((String)nums.elementAt(0)));

               for(i = 1; i < cats.size(); ++i) {
                  awriter.write("," + (String)((String)nums.elementAt(i)));
               }

               awriter.write("];");
               fin.close();
               awriter.close();
               System.gc();
               if(myfile.exists()) {
                  Object var46 = forlock;
                  synchronized(forlock) {
                     File oldfile = new File(e.getAbsolutePath().replaceFirst(".js$", "1.js"));
                     if(oldfile.exists()) {
                        oldfile.delete();
                     }

                     e.renameTo(oldfile);
                     myfile.renameTo(e);
                  }
               }
            } else {
               fin.close();
               awriter.close();
            }
         } else {
            File oldfile1;
            Object var48;
            if(title != null) {
               byte var47 = 0;

               while((aline = ebr.readLine()) != null) {
                  c = new Formr(aline);
                  if(c.i != -1 && var47 == 0) {
                     var47 = 1;
                  } else if(var47 == 1 && c.i == -1) {
                     var47 = 2;
                  }

                  if(var47 == 1 && c.rdap.equals(rdap)) {
                     aline = aline.replaceFirst(",[\\-]?[0-9]+", "," + roles);
                     aline = aline.replaceFirst("^z\\[[0-9]+\\]=", "z[" + i++ + "]=");
                     awriter.write(aline + "\n");
                  } else if(var47 > 0) {
                     aline = aline.replaceFirst("^z\\[[0-9]+\\]=", "z[" + i++ + "]=");
                     awriter.write(aline + "\n");
                  }
               }

               fin.close();
               awriter.close();
               System.gc();
               if(myfile.exists()) {
                  var48 = forlock;
                  synchronized(forlock) {
                     oldfile1 = new File(e.getAbsolutePath().replaceFirst(".js$", "1.js"));
                     if(oldfile1.exists()) {
                        oldfile1.delete();
                     }

                     e.renameTo(oldfile1);
                     myfile.renameTo(e);
                  }
               }
            } else {
               boolean var49 = false;

               while((aline = ebr.readLine()) != null) {
                  c = new Formr(aline);
                  if(c.i != -1 && !c.rdap.equals(rdap)) {
                     awriter.write(c.line(i++, cats, nums));
                  }
               }

               if(cats.size() > 0) {
                  awriter.write("var cats=[\"" + (String)((String)cats.elementAt(0)) + "\"");

                  for(i = 1; i < cats.size(); ++i) {
                     awriter.write(",\"" + (String)((String)cats.elementAt(i)) + "\"");
                  }

                  awriter.write("];\n");
                  awriter.write("var nums=[" + (String)((String)nums.elementAt(0)));

                  for(i = 1; i < cats.size(); ++i) {
                     awriter.write("," + (String)((String)nums.elementAt(i)));
                  }

                  awriter.write("];");
               }

               fin.close();
               awriter.close();
               System.gc();
               if(myfile.exists()) {
                  var48 = forlock;
                  synchronized(forlock) {
                     oldfile1 = new File(e.getAbsolutePath().replaceFirst(".js$", "1.js"));
                     if(oldfile1.exists()) {
                        oldfile1.delete();
                     }

                     e.renameTo(oldfile1);
                     myfile.renameTo(e);
                  }
               }
            }
         }
      } catch (Exception var44) {
         ans = "Error:" + var44.toString();
      } finally {
         try {
            if(fin != null) {
               fin.close();
            }

            if(awriter != null) {
               awriter.close();
            }
         } catch (Exception var40) {
            ;
         }

      }

      return ans;
   }

   public Formr(String aline) {
      this.i = -1;
      int ii = aline.indexOf("=");
      if(ii > 0) {
         String e = aline.substring(0, ii).replaceAll("[^0-9]", "");
         aline = aline.substring(ii + 1).replaceFirst("[ ]*\\[", "").replaceFirst("\\][ ]*;[ ]*$", "");
         PassedData pd = new PassedData(aline, 's');

         try {
            this.i = Integer.parseInt(e);
            this.rdap = pd.getElement();
            this.title = pd.getElement();
            this.cat = pd.getElement();
            this.uid = pd.getElement();
            e = pd.getElement();
            this.roles = Long.parseLong(e);
            e = pd.getElement();
            this.df = Integer.parseInt(e);
         } catch (Exception var6) {
            this.valid = false;
         }
      }

   }

   public Formr(int ii, String ta, String ti, String ca, String ui, long r, int df0) {
      this.i = ii;
      this.rdap = ta;
      this.title = ti;
      this.cat = ca;
      this.uid = ui;
      this.roles = r;
      this.df = df0;
   }

   public String line(int ii, Vector v, Vector n) {
      if(!this.cat.equals("") && v != null && (v.size() == 0 || !v.elementAt(v.size() - 1).equals(this.cat))) {
         v.addElement(this.cat);
         n.addElement("" + ii);
      }

      if(this.rdap != null && !this.rdap.equals("") && this.title != null && !this.title.equals("") && this.cat != null && !this.cat.equals("")) {
         return "z[" + ii + "]=[\"" + this.rdap + "\",\"" + this.title + "\",\"" + this.cat + "\",\"" + this.uid + "\"," + this.roles + "," + this.df + "];\r\n";
      } else {
         this.valid = false;
         return "";
      }
   }

   public int compareTo(Formr x) {
      return this.cat.compareTo(x.cat) < 0?-1:(this.cat.compareTo(x.cat) > 0?1:(this.title.compareTo(x.title) < 0?-1:(this.title.compareTo(x.title) > 0?1:(this.df - x.df < 0?-1:(this.df - x.df > 0?1:(!this.cat.equals("")?0:this.rdap.compareTo(x.rdap)))))));
   }

   public boolean samer(Formr x) {
      return this.rdap.equals(x.rdap) && this.df == x.df;
   }

   static File path(String filename, int orgnum) {
      return new File(Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator +   "forms" + File.separator + filename + ".htm");
   }

   public static synchronized String updateassociate(String extra, String rdap, User user) {
      boolean issave = extra.indexOf("[\"") == 0;
      int orgnum = user.orgnum;
      File f = new File(Toolbox.installpath + File.separator + "formassociated"+ ((orgnum%65536)) + ".js");
      boolean newfile = false;
      FileInputStream fin = null;
      FileWriter awriter = null;
      String ans = "<center>" + Toolbox.emsgs(orgnum,71) + "</center>";

      try {
         if(!f.exists()) {
            newfile = true;
            f.createNewFile();
         }

         fin = new FileInputStream(f);
         InputStreamReader e = new InputStreamReader(fin);
         BufferedReader ebr = new BufferedReader(e);
         String aline = null;
         path(user.id + "_js",user.orgnum).delete();
         File myfile = path(user.id + "_js", user.orgnum);
         awriter = new FileWriter(myfile, false);
         awriter.write("var formassociated=[");
         if(!newfile) {
            aline = ebr.readLine();

            while((aline = ebr.readLine()) != null && !aline.equals("[\'\',\'\',\'\']];")) {
               if(aline.indexOf("\"" + rdap + "\"") != 1) {
                  awriter.write(aline + "\n");
               } else if(!issave) {
                  awriter.write("[\"" + extra + aline.substring(2 + rdap.length()) + "\n");
               }
            }
         }

         if(issave) {
            awriter.write(extra);
         }

         awriter.write("[\'\',\'\',\'\']];");
         fin.close();
         awriter.close();
         System.gc();
         if(myfile.exists()) {
            Object var13 = forlock;
            synchronized(forlock) {
               File oldfile = new File(f.getAbsolutePath().replaceFirst(".js$", "1.js"));
               if(oldfile.exists()) {
                  oldfile.delete();
               }

               f.renameTo(oldfile);
               myfile.renameTo(f);
            }
         }
      } catch (Exception var26) {
         ans = var26.toString();
      } finally {
         try {
            if(fin != null) {
               fin.close();
            }

            if(awriter != null) {
               awriter.close();
            }
         } catch (Exception var24) {
            ;
         }

      }

      return ans;
   }
   public static TreeSet nameTree(User user, JDBCAdapter adapter) {
      Formr c = null;
      FileInputStream fin = null;
      TreeSet tree = new TreeSet();
      boolean b = adapter.executeQuery2("SELECT formname from userform",false);
      int f;
      if(b) 
      {
         for(f = 0; adapter.getValueAt(f, 0)!=null; ++f) 
         {
            tree.add(adapter.getValueAt(f, 0));
         }
      }

      b = adapter.executeQuery2("SELECT name from Task",false);
      if(b) {
         for(f = 0; adapter.getValueAt(f, 0)!=null; ++f) {
            tree.add(adapter.getValueAt(f, 0));
         }
      }

      b = adapter.executeQuery2("SELECT tname from Apptables",false);
      if(b) {
         for(f = 0; adapter.getValueAt(f, 0)!=null; ++f) {
            tree.add(adapter.getValueAt(f, 0));
         }
      }

      File var13 = new File(Toolbox.dbadmin[user.orgnum%65536].webFileFolder +  File.separator + "forms");
      if(!var13.exists() && !var13.mkdir()) {
         Toolbox.println(1, "can not make folder " + var13.getAbsolutePath());
      }

      String[] files = var13.list();

      for(int e = 0; e < files.length; ++e) {
         if(files[e].indexOf(".htm") > 0) {
            tree.add(files[e].replaceFirst("\\.htm", ""));
         }
      }

      try {
         var13 = new File(Toolbox.installpath + File.separator + "formlist" + (user.orgnum%65536) + ".js");
         if(!var13.exists()) {
            var13.createNewFile();
         }

         fin = new FileInputStream(var13);
         InputStreamReader var14 = new InputStreamReader(fin);
         BufferedReader ebr = new BufferedReader(var14);
         String aline = null;
         boolean valid = true;

         while((aline = ebr.readLine()) != null) {
            c = new Formr(aline);
            tree.add(c.rdap);
         }

         fin.close();
      } catch (Exception var12) {
         ;
      }

      return tree;
   }

   public static synchronized String renameIndex(String rdap, String newrdap, String uid, User user, int df) {
      Formr c = null;
      String title = null;
      String cat = null;
      byte i = 0;
      FileInputStream fin = null;
      long rls = 0L;
      int orgnum = user.orgnum;
      String ans = "<center>" + Toolbox.emsgs(orgnum,71) + "</center>";

      try {
         File e = new File(Toolbox.installpath + File.separator + "formlist" + (user.orgnum%65536) + ".js");
         fin = new FileInputStream(e);
         InputStreamReader esr = new InputStreamReader(fin);
         BufferedReader ebr = new BufferedReader(esr);
         String aline = null;

         while((aline = ebr.readLine()) != null) {
            c = new Formr(aline);
            if(c.i != -1 && rdap.equals(c.rdap)) {
               cat = c.cat;
               title = c.title;
               rls = c.roles;
               i = 1;
               break;
            }
         }
      } catch (Exception var25) {
         ;
      } finally {
         try {
            if(fin != null) {
               fin.close();
            }
         } catch (Exception var24) {
            ;
         }

      }

      if(i > 0) {
         modifyFile(rdap, (String)null, (String)null, uid, -1L, user, df);
         ans = modifyFile(newrdap, title, cat, uid, rls, user, df);
      }

      return ans;
   }

   public static synchronized String unifilename(User user, String filename, JDBCAdapter adapter) {
      TreeSet tree = nameTree(user, adapter);
      if(!tree.contains(filename) && !tree.contains(filename + "i") && !tree.contains(filename + "r") && !tree.contains(filename + "s")) {
         adapter.executeUpdate("INSERT INTO userform(lastupdate,formname,uid,roles,permits) VALUES (-1,\'" + filename + "\',\'" + user.id + "\',-1,\'\')");
         return null;
      } else {
         String fn = "";

         int n;
         for(n = filename.length() - 1; n >= 0 && filename.charAt(n) <= 57 && filename.charAt(n) >= 48; --n) {
            ;
         }

         if(n == -1) {
            fn = "A";
         } else {
            fn = filename.substring(0, n + 1);
         }

         if(n < filename.length() - 1) {
            try {
               n = Integer.parseInt(filename.substring(n + 1));
            } catch (Exception var7) {
               n = 0;
            }
         } else {
            n = 0;
         }

         do {
            do {
               StringBuilder var10000 = (new StringBuilder()).append(fn);
               ++n;
               filename = var10000.append(n).toString();
            } while(tree.contains(filename));
         } while(tree.contains(filename + "i") || tree.contains(filename + "r") || tree.contains(filename + "s"));

         return filename;
      }
   }

   static int isincompleteconvert(String rdap, User user) {
      int orgnum = user.orgnum; 
      File f = new File(Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator + "forms" + File.separator + rdap);
      if(f.exists()) {
         return 1;
      } else {
         f = new File(Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator  + "forms" + File.separator + user.id + "_fm.htm");
         return f.exists()?2:0;
      }
   }

   static boolean isincompletedesign(JDBCAdapter adapter, User user) {
      boolean b = adapter.executeQuery2("select topic from Formmodel where uid=\'" + user.id + "\'",false);
      return b && adapter.getValueAt(0, 0)!=null;
   }

   public static String incomplete(User user, JDBCAdapter adapter, String which) {
      String sql = "SELECT formname from userform WHERE lastupdate=-1 AND uid=\'" + user.id + "\' order by formname";
      boolean b = adapter.executeQuery2(sql,false);
      if(b==false) {
         return null;
      } else if(b && adapter.getValueAt(0, 0)==null) {
         return "";
      } else {
         String ansc = "";
         String ansd = "";
         int n1 = 0;
         java.util.ArrayList<String> sqls = new java.util.ArrayList();
         int j = 0;

         int i;
         for(i = 0; adapter.getValueAt(i, 0)!=null; ++i) {
            sqls.add(adapter.getValueAt(i, 0));
         }
         String [] y = new String[sqls.size()];
         for(i = 0; i < sqls.size(); ++i) {
            String x = sqls.get(i);
            int k = isincompleteconvert(x, user);
            if(ansc.equals("") && k > 0) {
               ansc = x;
            } else if(k != 1) 
            {
               if(!ansd.equals("")) {
                  y[j++] = "DELETE FROM userform where lastupdate=-1 AND uid=\'" + user.id + "\' AND formname=\'" + x + "\'";
               } else if(!isincompletedesign(adapter, user)) {
                  y[j++] = "DELETE FROM userform where lastupdate=-1 AND uid=\'" + user.id + "\' AND formname=\'" + x + "\'";
               } else {
                  ansd = x;
               }
            }
         }

         if(j > 0 && !adapter.transacte1(y, 0, j)) {
            Toolbox.println(1, adapter.error());
         }

         if(which.equals("convert")) {
            return ansc;
         } else if(which.equals("design")) {
            return ansd;
         } else {
            return null;
         }
      }
   }

   public static void main(String[] s) {
      modifyFile("A0", "a", "b", "", -1L, new User(0), 0);
   }

}
