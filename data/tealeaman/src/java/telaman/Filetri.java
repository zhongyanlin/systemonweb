package telaman;

import java.io.File;
import java.util.Iterator;
import java.util.TreeSet;
import telaman.FileHas;

public class Filetri implements Comparable {

   public String name;
   public long lastupdate;
   public char isdir;
   boolean good = true;


   

   public Filetri(String line) {
      if(line != null && !line.equals("")) {
         this.isdir = line.charAt(0);
         int i = line.indexOf(" ", 3);
         if(i == -1) {
            this.good = false;
         } else {
            try {
               this.lastupdate = Long.parseLong(line.substring(2, i));
               this.name = line.substring(i + 1).trim();
            } catch (Exception var4) {
               this.good = false;
            }
         }
      } else {
         this.good = false;
      }

   }
   
   public Filetri(String n, long l, char s, boolean g) {
      this.name = n;
      this.lastupdate = l;
      this.isdir = s;
      this.good = g;
   }

   public Filetri(String base, File f) {
      if(!base.equals("")) {
         if(base.substring(base.length() - 1).equals(File.separator)) {
            this.name = base + f.getName();
         } else {
            this.name = base + File.separator + f.getName();
         }
      } else {
         this.name = f.getName();
      }

      this.lastupdate = f.lastModified() / 1000L;
      this.isdir = (char)(f.isDirectory()?49:48);
   }

   public int compareTo(Object f) {
      int z = this.name.compareTo(((Filetri)f).name);
      return z == 0?(((Filetri)f).isdir == 49?1:0) - (this.isdir == 49?1:0):z;
   }

   public String toString() {
      return this.isdir + " " + this.lastupdate + " " + this.name;
   }

   public static void listing(String base, File f, FileHas h, TreeSet tree) {
      File[] l = f.listFiles(h);
      if (l == null) return; 
      for(int i = 0; i < l.length; ++i) {
         if(l[i].isDirectory()) {
            if(!base.equals("") && !base.substring(base.length() - 1).equals(File.separator)) {
               base = base + File.separator;
            }

            listing(base + l[i].getName(), l[i], h, tree);
         } else {
            tree.add(new Filetri(base, l[i]));
         }
      }

   }

   public static void listing(File f, TreeSet tree, TreeSet localtree) {
      Iterator i = localtree.iterator();

      while(i.hasNext()) {
         Filetri x = (Filetri)i.next();
         File g = new File(f.getAbsolutePath() + File.separator + x.name);
         if(g.exists() && g.isDirectory() == (x.isdir == 49)) {
            tree.add(new Filetri(x.name, g.lastModified() / 1000L, x.isdir, x.good));
         }
      }

   }
}
