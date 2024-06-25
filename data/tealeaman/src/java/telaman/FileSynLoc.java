package telaman;

import java.io.*;
import java.net.URL;
import java.net.URLConnection;
import java.util.Iterator;
import java.util.TreeSet;
import java.util.Vector;
import telaman.FileHas;
import telaman.Filetri;
import telaman.Toolbox;

public class FileSynLoc {

   public static void main(String[] args) {
      if(args.length < 5) {
         Toolbox.println(0, "java telaman.FileSynLoc localdir server dir second  u/d/s filter ");
      } else {
         String localdir = ".";
         String filter = "";
         String second = "1000";
         String direct = "s";
         boolean seconds = true;
         localdir = args[0];
         String server = args[1];
         String dir = args[2];
         if(args.length > 3) {
            try {
               int var31 = Integer.parseInt(args[3]);
               second = args[3];
            } catch (Exception var29) {
               ;
            }
         }

         if(args.length > 4 && (args[4].equals("u") || args[4].equals("d"))) {
            direct = args[4];
         }

         if(args.length > 5) {
            filter = args[5];
         }

         String locallist = "";
         File b = new File(localdir);
         boolean newloc = false;
         if(!b.exists()) {
            b.mkdir();
            newloc = true;
         }

         if(b.exists() && !b.isFile()) {
            TreeSet localtree = new TreeSet();
            TreeSet downtree = new TreeSet();
            Filetri.listing("", b, new FileHas(filter), localtree);
            Iterator i = localtree.iterator();
            locallist = "";
            Filetri x = null;
            if(i.hasNext()) {
               x = (Filetri)i.next();
            }

            while(x != null) {
               locallist = locallist + "0 " + x.lastupdate + " " + x.name + "\n";
               if(i.hasNext()) {
                  x = (Filetri)i.next();
               } else {
                  x = null;
               }
            }

            String fname;
            for(fname = "w"; (new File(fname + ".zip")).exists() || (new File(fname + ".txt")).exists() || (new File(fname)).exists(); fname = fname + "w") {
               ;
            }

            String ftxt = fname + ".txt";

            try {
               FileWriter url0 = new FileWriter(ftxt, false);
               url0.write(locallist);
               url0.close();
            } catch (Exception var28) {
               ;
            }

            String var32 = server + "FileSynweb";
            String[] params = new String[]{dir, filter, second, direct};
            String fd = fname + ".zip";
            File f = new File(fd);
            boolean ret = URLcont(var32, params, new File(ftxt), f);
            (new File(ftxt)).delete();
            if(!ret) {
               printfile(f);
               if(newloc) {
                  del(b);
               }

            } else {
               execcomm("unzip " + fd + " -d " + fname);
               f.delete();
               String prev = "";
               File dirfolder = new File(fname);
               dirfolder = dirfolder.listFiles()[0];
               Filetri.listing("", dirfolder, new FileHas(filter), downtree);
               i = downtree.iterator();
               if(i.hasNext()) {
                  x = (Filetri)i.next();
               }

               while(x != null) {
                  if(!x.name.equals(dirfolder.getName() + ".txt")) {
                     prev = copy(dirfolder.getAbsolutePath(), x, localdir, prev);
                  }

                  if(i.hasNext()) {
                     x = (Filetri)i.next();
                  } else {
                     x = null;
                  }
               }

               if(direct.indexOf("d") >= 0) {
                  del(new File(fname));
               } else {
                  File txt = new File(dirfolder.getAbsolutePath() + File.separator + dirfolder.getName() + ".txt");
                  Vector v = new Vector<>();
                  
                  try {
                     BufferedReader folder = new BufferedReader(new InputStreamReader(new FileInputStream(txt)));
                     String fzip = "";

                     while((fzip = folder.readLine()) != null) {
                        v.addElement(new Filetri(fzip));
                     }

                     folder.close();
                  } catch (Exception var30) {
                     Toolbox.println(0, var30.toString());
                  }

                  f = new File(fname);
                  del(f);
                  mkdir(f.getAbsolutePath());
                  String var35 = "";

                  for(int var33 = 0; var33 < v.size(); ++var33) {
                     var35 = copy(localdir, (Filetri)((Filetri)v.elementAt(var33)), f.getAbsolutePath(), var35);
                  }

                  execcomm("zip -r " + fname + " " + fname);
                  del(f);
                  var32 = server + "FileSynweb1";
                  f = new File(ftxt);
                  File var34 = new File(fname + ".zip");
                  params[1] = fname;
                  URLcont(var32, params, var34, f);
                  var34.delete();
                  printfile(f);
               }
            }
         }
      }
   }

   static void printfile(File f) {
      BufferedReader ds = null;

      try {
         ds =  new BufferedReader(new InputStreamReader(new FileInputStream(f)));
                     
         String e = "";

         while((e = ds.readLine()) != null) {
            Toolbox.println(0, e);
         }

         ds.close();
         f.delete();
      } catch (Exception var11) {
         Toolbox.println(0, var11.toString());
      } finally {
         try {
            if(ds != null) {
               ds.close();
            }
         } catch (Exception var10) {
            ;
         }

         f.delete();
      }

   }

   public static void del(File f) {
      if(f.isDirectory()) {
         File[] l = f.listFiles();

         for(int i = 0; i < l.length; ++i) {
            del(l[i]);
         }
      }

      f.delete();
   }

   public static void mkdir(String path) {
      int j = 0;
      File f = null;

      while((j = path.indexOf(File.separator, j + 1)) > 0) {
         f = new File(path.substring(0, j));
         if(!f.exists()) {
            f.mkdir();
         }
      }

      f = new File(path);
      if(!f.exists()) {
         f.mkdir();
      }

   }

   public static String copy(String dir, Filetri source, String dest, String prev) {
      int i = source.name.lastIndexOf(File.separator );
      String curr = "";
      if(i > 0) {
         curr = source.name.substring(0, i);
      }

      if(!curr.equals(prev)) {
         mkdir(dest + File.separator + curr);
      }

      File f = new File(dir + File.separator + source.name);
      dest = dest + File.separator + source.name;
      if(File.separator.equals("\\")) {
         dest = dest.replace('/', '\\');
      } else {
         dest = dest.replace('\\', '/');
      }

      File t = new File(dest);
      if(f.isFile()) {
         boolean b = false;
         byte[] buf = new byte[1024];

         try {
            FileInputStream e = new FileInputStream(f);
            FileOutputStream fout = new FileOutputStream(t);

            int b1;
            while((b1 = e.read(buf)) > 0) {
               fout.write(buf, 0, b1);
            }

            e.close();
            fout.close();
         } catch (Exception var12) {
            ;
         }
      }

      t.setLastModified(f.lastModified());
      return curr;
   }

   public static boolean URLcont(String url0, String[] params, File fin, File fout) {
      OutputStream bos = null;
      InputStream bis = null;
      FileInputStream fis = null;
      FileOutputStream fos = null;
      byte[] buf = new byte[2048];
      Object len = null;
      boolean ret = true;

      boolean urlc;
      try {
         URL e = new URL(url0);
         URLConnection var37 = e.openConnection();
         var37.setDoOutput(true);
         var37.setDoInput(true);
         var37.setAllowUserInteraction(false);
         var37.setConnectTimeout(1000000);
         bos = var37.getOutputStream();
         int ioe;
         if(params != null) {
            for(ioe = 0; ioe < params.length; ++ioe) {
               byte[] t = (params[ioe] + "\n").getBytes();
               bos.write(t);
            }
         }

         fis = new FileInputStream(fin);

         while((ioe = fis.read(buf)) != -1) {
            bos.write(buf, 0, ioe);
         }

         bos.close();
         fis.close();
         bis = var37.getInputStream();
         fos = new FileOutputStream(fout);
         if(bis.read(buf, 0, 2) != -1) {
            fos.write(buf, 0, 2);
            ret = (new String(buf, 0, 2)).indexOf("!") != 0;
         }

         while((ioe = bis.read(buf)) != -1) {
            fos.write(buf, 0, ioe);
         }

         fos.close();
         bis.close();
         return ret;
      } catch (Exception var35) {
         urlc = false;
      } finally {
         if(bis != null) {
            try {
               bis.close();
            } catch (IOException var34) {
               var34.printStackTrace();
               return false;
            }
         }

         if(bos != null) {
            try {
               bos.close();
            } catch (IOException var33) {
               var33.printStackTrace();
               return false;
            }
         }

         if(fis != null) {
            try {
               fis.close();
            } catch (IOException var32) {
               var32.printStackTrace();
               return false;
            }
         }

         if(fos != null) {
            try {
               fos.close();
            } catch (IOException var31) {
               var31.printStackTrace();
               return false;
            }
         }

      }

      return urlc;
   }

   public static boolean execcomm(String com) {
      Runtime r = Runtime.getRuntime();

      try {
         Process e = r.exec(com);
         InputStream is = e.getInputStream();
         BufferedReader bs = new BufferedReader(new InputStreamReader(is));
                     
         new StringBuffer();
         String str = null;

         while((str = bs.readLine()) != null) {
            Toolbox.println(0, str);
         }

         is.close();
         bs.close();
         int j = e.waitFor();
         return true;
      } catch (Exception var8) {
         return false;
      }
   }
}
