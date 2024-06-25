package telaman;

import java.io.*;
import java.util.*;
import javax.servlet.*;
import javax.servlet.http.*;
import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;
import java.awt.*;
import javax.servlet.annotation.WebServlet;
@WebServlet(name = "UploadChangePic", urlPatterns = {"/UploadChangePic"}, asyncSupported = false) 
public class UploadChangePic extends UploadFile
{
    public void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException
    {
        HttpSession session = request.getSession(true);
        int orgnum = Toolbox.setcharset(request, response);
        if (orgnum == -1) return;
CachedStyle cachedstyle = new CachedStyle(request, orgnum);
        User user = User.authorize(orgnum, Systemroles.TOTAL, 
                getServletConfig().getServletContext(), 
                session, 
                request,
                response,
                "UploadChangePic",
                true);
  
        if (user == null) 
        {
              try 
                {
                    RequestDispatcher dispat = request.getServletContext().getRequestDispatcher("/login.jsp?error=generic&orgnum=" +orgnum +"&follow=R");
                    dispat.forward( request,  response);
                }
                catch (Exception e) 
                {
                }
            return;
        }
 
        orgnum = user.orgnum; 
        Encode6b encoder = new Encode6b(orgnum); 
        String msg = "";
        boolean welldone = false;
 
        String dellist = Toolbox.defaultParam(orgnum,request, "dellist", null, "#$-_,@", 2000);
        String pathcode = null;
        String tcode = null;
        Vector<String> pathcodes = new Vector<String>();
        Vector<String> tcodes = new Vector<String>();
        if (dellist == null) {
            pathcode = Toolbox.defaultParam(orgnum,request, "pathcode", null, "$-_", 200);
            tcode = Toolbox.defaultParam(orgnum,request, "tcode", null, "$-_", 14);
            if (pathcode != null) 
            {
                pathcodes.addElement(pathcode);
                tcodes.addElement(tcode);
            }
        } else {
            String[] xs = dellist.replaceFirst(",$", "").split(",");
            for (int k = 0; k < xs.length; k++) {
                String[] ys = xs[k].split("@");
                pathcodes.addElement(ys[2]);
                tcodes.addElement(ys[1]);
            }
        }
  
        for (int k = 0; k < pathcodes.size(); k++) 
        {
            pathcode = pathcodes.elementAt(k);
            tcode = tcodes.elementAt(k);
            
            int j = -1;
            String tstmps = "1";
            long tstmp = 0L;
            String dir = "";
            String filename = null;
            long tt = 0;
            String decoded = "";
            try 
            {
                decoded = encoder.rto6b(pathcode);
                j = decoded.lastIndexOf(File.separator );
                if (j > 0) 
                {
                    dir = decoded.substring(0, j);
                    filename = decoded.substring(j + 1);
                }
                tt = Long.parseLong(tcode);
            } catch (Exception e) {
                
            }
            String rdap = Toolbox.defaultParam(orgnum,request, "rdap", null, null, 25);
            String width = Toolbox.defaultParam(orgnum,request, "rwidth", null, null, 4);
            String height = Toolbox.defaultParam(orgnum,request, "rheight", null, null, 4);
            String cwidth = Toolbox.defaultParam(orgnum,request, "cwidth", null, null, 4);
            String cheight = Toolbox.defaultParam(orgnum,request, "cheight", null, null, 4);
            String cropx = Toolbox.defaultParam(orgnum,request, "cropx", null, null, 4);
            String cropy = Toolbox.defaultParam(orgnum,request, "cropy", null, null, 4);
            String whiteblack =  Toolbox.defaultParam(orgnum,request, "whiteblack", null, null, 1);
 
            File f = null;
            long jj = 0;
            if (filename != null) 
            {
                f = new File(dir, filename);
                jj = f.lastModified() / 1000;
            }
  
            String tmp = filename;
            if (f==null && (cwidth == null) && (cheight == null) && (cropx == null) && (cropy == null) && (width == null) && (height == null) && (whiteblack == null)) 
            {
                msg = "<script>if (typeof(parent.syn)=='function')parent.syn('del','" + pathcode + "'); else if (opener!=null&&typeof(opener.syn)!='undefined')opener.syn('del','" + pathcode + "');</script>";
            } 
            else if ((pathcode == null) || (filename == null) || Math.abs(tt - jj) < 2 
               && (File.separator + dir  + File.separator).contains(File.separator + user.id + File.separator) == false
               &&   (File.separator + dir  + File.separator).contains(Toolbox.installpath + File.separator + "image" + File.separator + "bgimage") == false
               && !dir.contains(user.webFileFolder) && dir.indexOf("wfattach")<0) 
            {
                msg = "<script>if (parent.failupload) parent.failupload('<!--"   + decoded + "|" +  tt + "=" + jj + "|" +  dir + "|" + user.id +  "-->" + Toolbox.emsgs(orgnum,107) + "');</script>";
            } 
            else if ((cwidth == null) && (cheight == null) && (cropx == null) && (cropy == null) && (width == null) && (height == null) && (whiteblack == null)) 
            {
                f.delete();
                String f1 = f.getAbsolutePath();
                int k1 = f1.lastIndexOf(File.separator );
                String fnn = f1.substring(k1+1);
                if (FolderMaintain.isimage(fnn))
                {
                     String dir1 = f1.substring(0, k); 
                    (new Thread(new FolderMaintain(orgnum, dir1,  fnn, "delete"))).start(); 
                }
                msg = "<script>if (typeof(parent.syn)=='function')parent.syn('del','" + pathcode + "'); else if (opener!=null&&typeof(opener.syn)!='undefined')opener.syn('del','" + pathcode + "');</script>";
            } 
            else 
            {
                String source = filename;
                File newfile = null;
                String target = UploadFile.getId().substring(4) + filename.replaceFirst("[^\\.]+", "");
                boolean good = true;
                if (  whiteblack!=null && whiteblack.equals("1"))
                {
                    //target = target.replaceFirst("\\..*", ".png");
                    if (grey(dir, source, target))
                    {
                        synchronized (renamefilelock) 
                        {
                            new File(dir, source).delete();
                        }
                        String xx = source;//.replaceFirst("\\..*", ".png");
                        source = target;
                        target = xx;
                        
                    }
                    else
                    {
                        msg = "<script>if (parent.failupload) parent.failupload('Grey failed');</script>";
                    }
 
                }
       
                else if (  whiteblack!=null && whiteblack.equals("2"))
                {
 
                    if (bw(dir, source, target))
                    {
                        synchronized (renamefilelock) 
                        {
                            new File(dir, source).delete();
                        }
                        String xx = source;//.replaceFirst("\\..*", ".png");
                        source = target;
                        target = xx;
                        
                    }
                    else
                    {
                        msg = "<script>if (parent.failupload) parent.failupload('Black white failed');</script>";
                    }
                }
                
                if (msg.equals("")  && width != null  &&  height != null)
                {
                    if (width.equals("-1"))
                    {
                        double angle = 0;
                        try{ 
                            angle = -Double.parseDouble(height);
                        } 
                        catch(Exception e)
                        {
                            msg = "<script>parent.myprompt('Rotation failed.NaN:" + height +"');</script>";
                        }
                         
                        if (angle!=0 && false == rotate(dir, source, target, angle/180.0*Math.PI)) 
                        {
                            synchronized (renamefilelock) 
                            {
                                if (!source.equals(filename))
                                     new File(dir, source).renameTo(new File(dir, filename));
                            }
                            msg = "<script>parent.myprompt('Rotation failed');</script>";
                        } 
                        else if (angle!=0 )
                        {
                            synchronized (renamefilelock) 
                            {
                                File newfile1 = new File(dir, source);
                                newfile1.delete();
                                new File(dir, target).renameTo(newfile1);
                            }
                            msg = "<img src=FileOperation?did=" + pathcode + "><script>parent.ResizeUploaded.attachman(parent.ResizeUploaded.attachref);</script>";
                        } 
                    }
                    else
                    {
                        if (false == resize(dir, source, target, width, height)) 
                        {
                            synchronized (renamefilelock) 
                            {
                                if (!source.equals(filename))
                                     new File(dir, source).renameTo(new File(dir, filename));
                            }
                            msg = "<script>if (parent.failupload) parent.failupload('Resize failed');</script>";
                        } 
                        else 
                        {
                            synchronized (renamefilelock) 
                            {
                                new File(dir, source).delete();
                            }
                            String xx = source;
                            source = target;
                            target = xx;
                        } 
                    }
                }
                        
                if ( msg.equals("")  && (cwidth != null) && (cheight != null) && (cropx != null) && (cropy != null)) 
                {
                    if (false == crop(dir, source, target, cropx, cropy, cwidth, cheight)) 
                    {
                        synchronized (renamefilelock) 
                        {
                            if (!source.equals(filename))
                                new File(dir, source).renameTo(new File(dir, filename));
                        }
                        msg = "<script>if (parent.failupload) parent.failupload('Crop failed');</script>";
                    } 
                    else 
                    {
                        synchronized (renamefilelock) 
                        {
                            new File(dir, source).delete();
                        }
                        String xx = source;
                        source = target;
                        target = xx;
                    }
                } 
                if ( msg.equals(""))     
                {
 
                    if (  whiteblack!=null && whiteblack.equals("4"))
                    {
                        String t = grey1(dir, source, target);
                        new File(dir, source).delete();
                        msg = "<script>if (parent.idblackwhite) parent.idblackwhite('" + t + "');</script>";
                    }
                    else {
                    synchronized (renamefilelock) 
                    {
                        if (!source.equals(filename))
                            new File(dir, source).renameTo(new File(dir, filename));
                    }
                    newfile = new File(dir, filename);
                    String js = newfile.getAbsolutePath();
                    encoder = new Encode6b(orgnum);
                    js = encoder.to6b(newfile.getAbsolutePath());
                    msg = "<script>if (parent.failupload) parent.failupload(" + (newfile.lastModified() / 1000) + "," + newfile.length() + ",'" + filename + "','" + js + "');</script>";
                    }
                } 
            }
        }
        PrintWriter out = response.getWriter();
        try {
            out.println("<!DOCTYPE html>");
            out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" >");
            out.println("<head>");
            out.println(Toolbox.getMeta(orgnum));
            out.println("<title>Attachment</title>");
            out.println("</head>");
            out.println("<body>" + msg);
            out.println("</body>");
            out.println("</html>");
        } finally {
            out.close();
        }
    }
  
   

  private static int colorToRGB(int alpha, int red, int green, int blue) {

        int newPixel = 0;
        newPixel += alpha;
        newPixel = newPixel << 8;
        newPixel += red; newPixel = newPixel << 8;
        newPixel += green; newPixel = newPixel << 8;
        newPixel += blue;

        return newPixel;

    }
    boolean  bw(String dir, String old, String temp ) 
   {
        try
       {
             BufferedImage image = ImageIO.read(new  File(dir, old));
             int W = (int)image.getWidth();
             int H = (int)image.getHeight();
             BufferedImage  bimg = new BufferedImage(W, H, BufferedImage.TYPE_BYTE_GRAY);
             boolean [][] b = new boolean[W+3][]; 
             b[0] = new boolean[H+3];
             b[1] = new boolean[H+3];
             b[2] = new boolean[H+3];
             int red, green, blue;
             int newPixel;
             int threshold =210;
          
            for(int i=0; i<image.getWidth(); i++) 
            {
                b[i+3] = new boolean[H+3];
                for(int j=0; j<image.getHeight(); j++)
                {
                  red = new Color(image.getRGB(i, j)).getRed();
                  green = new Color(image.getRGB(i, j)).getGreen();
                  blue = new Color(image.getRGB(i, j)).getBlue();
                  int alpha = new Color(image.getRGB(i, j)).getAlpha();
                  newPixel = (int)Math.round(red*.4  + blue*.4  + green*.2);
                  if (newPixel<40 && red <40 && green < 40 && blue <40) b[i+1][j+1] = true;
                }
            }
            int bl = (new Color(0,0,0)).getRGB();
            int wt = (new Color(255,255,255)).getRGB();
            int gr = (new Color(125,125,125)).getRGB();
            for(int i=0; i<image.getWidth(); i++) 
            {
                for(int j=0; j<image.getHeight(); j++)
                {
                    if (b[i][j]|| b[i][j+1] || b[i][j+2] || b[i+1][j]||b[i+1][j+1]|| b[i+1][j+2] || b[i+2][j]|| b[i+2][j+1] || b[i+2][j+2])
                       bimg.setRGB(i, j, bl);
                    else
                       bimg.setRGB(i, j, wt); 
                }
            }
             
          File fi = new File(dir,temp);
          String target = temp.replaceFirst("^[^\\.]+.", "");
          ImageIO.write(bimg, target, fi);
          return true;
     
       }
       catch (Exception e)
       {
             return false;
       }
   }
   
  boolean  grey(String dir, String old, String temp ) 
   {
        try
       {
             BufferedImage image = ImageIO.read(new  File(dir, old));
             double image_width = image.getWidth();
             double image_height = image.getHeight();
             BufferedImage bimg = null;
             ///BufferedImage img = image;
             bimg = new BufferedImage((int)image_width, (int)image_height,  BufferedImage.TYPE_BYTE_GRAY);
          
         int red, green, blue;
         int newPixel;
         int threshold =210;
            Vector<Integer> v = new Vector<>();
            for(int i=0; i<image.getWidth(); i++) 
            {
                for(int j=0; j<image.getHeight(); j++)
                {
                  red = new Color(image.getRGB(i, j)).getRed();
                  green = new Color(image.getRGB(i, j)).getGreen();
                  blue = new Color(image.getRGB(i, j)).getBlue();
                  int alpha = new Color(image.getRGB(i, j)).getAlpha();

                  newPixel = (int)Math.round(red*.2 + blue*.1 + green*.7);
                  newPixel = colorToRGB(alpha, newPixel, newPixel, newPixel);
                    bimg.setRGB(i, j, newPixel);
                 /* newPixel = (int)Math.round(red*.3 + blue*.3 + green*.4);
                  if (newPixel>= v.size())
                  for (int k=v.size(); k <= newPixel; k++)
                  {
                      v.addElement(new Integer(0));
                  }
                  v.setElementAt(new Integer(v.elementAt(newPixel).intValue()+1), newPixel);
                */    

                }
            }  
          /*  FileWriter fw = new FileWriter("C:\\project\\tealeaman\\zz.txt",false);
            for (int i=0; i < v.size(); i++)
                fw.append(i + "  " + v.elementAt(i).intValue() + "\n");
            fw.close(); */ 
             //Graphics2D gg = bimg.createGraphics();
             //gg.drawImage(img, 0, 0, img.getWidth(null), img.getHeight(null), null);
             File fi = new File(dir,temp);
             String target = temp.replaceFirst("^[^\\.]+.", "");
             ImageIO.write(bimg, target, fi);
             return true;
       }
       catch (Exception e)
       {
             return false;
       }
   }
    
  String  grey1(String dir, String old, String temp ) 
   {
      
       try{
      
            BufferedImage image = ImageIO.read(new File(dir, old));
          
      
           //  BufferedImage image = ImageIO.read(new  File(dir, old));
             double image_width = image.getWidth();
             double image_height = image.getHeight();
             //BufferedImage  bimg = new BufferedImage((int)image_width, (int)image_height,  BufferedImage.TYPE_BYTE_GRAY);
             int red, green, blue;
         int y;
         int threshold =210;
             int W = (int)Math.floor(image_width);
             int H = (int)Math.floor(image_height);
             int [][] u =new int[W][] ,v =new int[W][];
             for (int i=0; i < W; i++)
             {u[i] = new int[H]; v[i] = new int[H]; for (int j=0; j < H;j++) u[i][j]=v[i][j]=0;}
            int w = W/19; int h = H/19;
            String t = ",";
            for(int i=0; i<W; i++) 
                for(int j=0; j<H; j++)
                {
                  red = new Color(image.getRGB(i, j)).getRed();
                  green = new Color(image.getRGB(i, j)).getGreen();
                  blue = new Color(image.getRGB(i, j)).getBlue();
                  y = (int)Math.round(red*.4 + blue*.3 + green*.3)-128;
                   
                      int x = (int)Math.round((i )/w);
                      int y1 = (int)Math.round((j )/h);
                     if ( (i-w/2-x*w)*(i-w/2-x*w) + (j-h/2-y1*h)*(j-h/2-y1*h) < (w*w+h*h)/9  ) 
                              u[x][y1] += y;
                 
                }
              int min=10000000,max=-10000000,sum=0,k=0;
               for (int i=0; i < 19; i++)   
                   for (int j=0; j < 19; j++)
                   {
                      if (u[i][j]>=0){k++; sum+= u[i][j];}
                      if (u[i][j]  >  max )  max = u[i][j]; 
                      else if (u[i][j] < min) min = u[i][j];
                     
                   }
               sum /= k;
             
              for (int i=0; i < 19; i++)   for (int j=0; j < 19; j++){
                
                   if ( u[i][j] < 0 )    t +=  "0_" + j + "_" + i + ",";
                   else  if ( u[i][j] > sum )   t +=  "1_" + j + "_" + i + ",";
            } 
            return t.replaceFirst("^,", "").replaceFirst(",$", "");
       }
       catch (Exception e)
       {
             return "";
       }
       
   }
    
   boolean  resize(String dir, String old, String newf,  String w, String h) 
   {
        try
        {
            int scaledWidth = Integer.parseInt(w);
            int scaledHeight = Integer.parseInt(h);
            BufferedImage originalImage = ImageIO.read(new File(dir, old));
            BufferedImage scaledBI = new BufferedImage(scaledWidth, scaledHeight, BufferedImage.TYPE_INT_RGB);
            Graphics2D g = scaledBI.createGraphics();
            g.setComposite(AlphaComposite.Src);
            g.drawImage(originalImage, 0, 0, scaledWidth, scaledHeight, null);
            g.dispose();
            File newfile = new File(dir, newf);
            String ext = old.replaceFirst("[^\\.]+\\.", "");
            ImageIO.write(scaledBI, ext, newfile);
            return true;
        }
        catch(Exception e){}
        return false; 
   }
   boolean  rotate(String dir, String old, String newf,  double angle) 
   {
        try
        {
           
            BufferedImage originalImage = ImageIO.read(new File(dir, old));
            BufferedImage scaledBI = tilt(originalImage, angle);
            File newfile = new File(dir, newf);
            String ext = old.replaceFirst("[^\\.]+\\.", "");
            ImageIO.write(scaledBI, ext, newfile);
            return true;
        }
        catch(Exception e){}
        return false; 
   }
   
   public static BufferedImage tilt(BufferedImage image, double angle ) { 
        GraphicsEnvironment ge = GraphicsEnvironment.getLocalGraphicsEnvironment();
        GraphicsDevice gd = ge.getDefaultScreenDevice();
        GraphicsConfiguration gc = gd.getDefaultConfiguration();
        double sin = Math.abs(Math.sin(angle)), cos = Math.abs(Math.cos(angle));
        int w = image.getWidth(), h = image.getHeight();
        int neww = (int) Math.floor(w * cos + h * sin), newh = (int) Math.floor(h
            * cos + w * sin);
        int transparency = image.getColorModel().getTransparency();
        BufferedImage result = gc.createCompatibleImage(neww, newh, transparency);
        Graphics2D g = result.createGraphics();
        g.translate((neww - w) / 2, (newh - h) / 2);
        g.rotate(angle, w / 2, h / 2);
        g.drawRenderedImage(image, null);
        return result;
         
    }  
  
   boolean crop (String dir, String old, String newf, String cropx,  String  cropy, String cwidth, String cheight)
   {
       try
       {
            BufferedImage outImage=ImageIO.read(new File(dir, old));
            int x, y,w, h;
            x = Integer.parseInt(cropx);
            y = Integer.parseInt(cropy);
            w = Integer.parseInt(cwidth);
            h = Integer.parseInt(cheight);
            BufferedImage cropped=outImage.getSubimage( x,  y, w, h);
            String ext = old.replaceFirst("[^\\.]+\\.", "");
            ImageIO.write(cropped, ext, new File(dir, newf)); // save the file with crop dimensions
            return true;
        }
        catch(Exception e){}        
        return false;         
   }  
  // UploadChangePic(int orgnum)
  {
   // encoder = new Encode6b(orgnum); 
  }
 
  public void doPost(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException
  {
  }
}