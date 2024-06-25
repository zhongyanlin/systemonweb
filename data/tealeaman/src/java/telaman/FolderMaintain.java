/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package telaman;
import java.awt.image.*;
import javax.imageio.*;
import java.awt.*;
import java.io.*;
import javax.servlet.RequestDispatcher;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpSession;
import org.apache.poi.poifs.filesystem.*;
import java.util.*;
import javax.imageio.stream.*;
 
/**
 *
 * @author zhong
 */
public class FolderMaintain implements Runnable {
    
    static public String imgindex = "_f_icons";
    static public int size = 80;
    static public int high = 0;
    static public boolean isimage(String fn)
    {
        String ext = fn.replaceFirst("[^\\.]+\\.","").toLowerCase();
        if (fn.startsWith(imgindex)) return false;
        if (!ext.equals("jpg") && !ext.equals("gif") && !ext.equals("png") && !ext.equals("tiff") && !ext.equals("jpeg"))
            return false;
        return true;
    }
    public static String filebytes(String x)
    {
        StringBuffer contents = new StringBuffer();
        try
        {
            FileInputStream fin = new FileInputStream(x); 
            InputStreamReader esr = new InputStreamReader(fin);
            BufferedReader ebr = new BufferedReader(esr);
            String aline;
            while ((aline = ebr.readLine()) != null)
            {
                if (contents.length()>0)
                    contents.append("\n");
                contents.append(aline);
            }
            ebr.close();
            esr.close();
            fin.close(); 
        }catch(Exception e){ }
        return contents.toString();
    }
    String folder, filename, act;
    int orgnum;
    public FolderMaintain(int orgnum,String fd, String fn, String act)
    {
        super();
        folder = fd;
        filename = fn;
        this.act = act;
        this.orgnum = orgnum;
    }
     
    public void run()
    {
        
        StringBuffer str = new StringBuffer();
         
        if ( (act.equals("init")||act.equals("add")) && !(new File(folder + File.separator + imgindex+ ".jpg")).exists())
        { 
            File fall = new File(folder);
            File [] fes = fall.listFiles();
            int [] arr = new int[fes.length];
            ArrayList<String> narr = new ArrayList();
            for (int i=0; i < fes.length; i++)
            {
                String fn = fes[i].getName();
                if ( fes[i].isFile() && !fn.startsWith(imgindex) && isimage(fn))
                {
                    arr[narr.size()] = i;
                    narr.add(fn);
                }
            }
           
            int N = narr.size();
            
            if ( N > 0) 
            {
                int q = size;
                int m = 5;
                int W =  m*q;
                int H = (int)Math.ceil((float)(N+0.0)/(float)m)*(q + high);
                BufferedImage scaledBI = new BufferedImage(W, H, BufferedImage.TYPE_INT_RGB);
                Graphics2D g = scaledBI.createGraphics();
                g.setPaint ( new Color (255,255,255) );
                g.fillRect ( 0, 0, W, H);
                g.setComposite(AlphaComposite.Src);
                StringBuffer s = new StringBuffer();
                for (int i=0; i < N; i++)
                {
                    String fn = narr.get(i);
                    BufferedImage x = null;
                    try{
                        x = ImageIO.read(fes[arr[i]]);
                    }catch(Exception e){continue;}
                    
                    int w = x.getWidth();
                    int h = x.getHeight();
                    if (i>0) str.append(","); str.append(narr.get(i));
                    if (i>0) s.append(",");  s.append( w + "x" + h);
                    int r = i/m;
                    int c = i%m;
                    int w1 = q, h1=q, x1=0, y1=0, x2=w, y2=h;
                    int cn = 0; 
                    if (w >= 400 && h>=400)
                    {
                        x1 = w/2-200;
                        y1 = h/2-200;
                        x2 = w/2+200;
                        y2 = h/2+200;
                        cn = 1;
                    }
                    else if (w >= h && h>=q)
                    {
                        cn = 2;
                        x1 = w/2-h/2;
                        y1 = 0;
                        x2 = w/2+h/2;
                        y2 = h;
                    }
                    else if (h >= w && w>=q)
                    {
                        x1 = 0;
                        y1 = h/2-w/2;
                        x2 = w;
                        y2 = h/2+w/2;
                        cn = 3;
                    }
                    else if (w < q && h >= q)
                    {
                        x1 = 0;
                        y1 = h/2-q/2;
                        x2 = w;
                        y2 = h/2+q/2;
                        w1 = w;
                        h1 = q;
                        cn = 4;
                    }
                    else if (h <= q && w >= q)
                    {
                        x1 = w/2-q/2;
                        y1 = 0;
                        x2 = w/2+q/2;
                        y2 = h;
                        w1 = q;
                        h1 = h;
                        cn=5;
                    }
                    else if ( h <=q && w <= q)
                    {
                        x1 = 0;
                        y1 = 0;
                        x2 = w;
                        y2 = h;
                        w1 = w;
                        h1 = h;
                        cn= 6;
                    }
                    g.drawImage(x, c*q + (q-w1)/2, r*(q+high)+(q-h1)/2, c*q + (q+w1)/2, r*(q+high) + (q+h1)/2, x1, y1, x2, y2, null);        
                }
                g.dispose();
                File newfile = new File(folder, imgindex+".jpg");
                if (newfile.exists()) newfile.delete();
                try{
                    ImageIO.write(scaledBI, "jpg", newfile);
                } catch(Exception e){}
                
                 
                if (str.length()>0)
                {
                    try{FileWriter aWriter = new FileWriter(folder + File.separator + imgindex, false);
                    aWriter.append(str.toString());
                    aWriter.append("'; var dim='");
                    aWriter.append(s.toString()); 
                    aWriter.close();
                    } catch(Exception e){}
                }
            }
        }
        else if (act.equals("add") )
        {
            String contents = filebytes(folder + File.separator + imgindex);
            contents = contents.replaceFirst("'","," + filename + "'");
            String xs[] = contents.replaceFirst("'.*","").split(",");
            int N = xs.length;
            int NF = filename.replaceAll("[^,]","").length()+1;
            int jj = N - NF;
            int q = size;
            int m = 5;
            int W=m*q, H = (int)Math.ceil((float)(N+0.0)/(float)m)*(q + high);
            BufferedImage y = null;
            Graphics2D g;
            try
            {
                BufferedImage z =  ImageIO.read(new File(folder,imgindex+".jpg"));
                int H0 = z.getHeight();
                int W0 = z.getWidth();
                y =  new BufferedImage(W, H+high+q, BufferedImage.TYPE_INT_RGB);
                g = y.createGraphics();
                g.setPaint ( new Color (255,255,255) );
                g.fillRect ( 0, 0, W, H+high+q);
                g.drawImage(z, 0, 0, W0, H0, 0, 0, W0, H0, null); 
                for(jj=N-NF; jj < N; jj++)
                {
                    int c = jj%m;
                    int r = jj/m;
                    BufferedImage x = ImageIO.read(new File(folder,xs[jj]));
                    int w = x.getWidth();
                    int h = x.getHeight();
                    contents += "," + w + "x" + h;
                    int w1 = q, h1=q, x1=0, y1=0, x2=w, y2=h;
                    if (w >= 400 && h>=400)
                    {
                        x1 = w/2-200;
                        y1 = h/2-200;
                        x2 = w/2+200;
                        y2 = h/2+200;
                    }
                    else if (w >= h && h>=q)
                    {
                        x1 = w/2-h/2;
                        y1 = 0;
                        x2 = w/2+h/2;
                        y2 = h;
                    }
                    else if (h >= w && w>=q)
                    {
                        x1 = 0;
                        y1 = h/2-w/2;
                        x2 = w;
                        y2 = h/2+w/2;
                    }
                    else if (w < q && h >= q)
                    {
                        x1 = 0;
                        y1 = h/2-q/2;
                        x2 = w;
                        y2 = h/2+q/2;
                        w1 = w;
                        h1 = q;
                    }
                    else if (h <= q && w >= q)
                    {
                        x1 = w/2-q/2;
                        y1 = 0;
                        x2 = w/2+q/2;
                        y2 = h;
                        w1 = q;
                        h1 = h;
                    }
                    else if ( h <=q && w <= q)
                    {
                        x1 = 0;
                        y1 = 0;
                        x2 = w;
                        y2 = h;
                        w1 = w;
                        h1 = h;
                    }
                    g.drawImage(x, c*q+(q-w1)/2, r*(q+high)+(q-h1)/2, c*q+(q+w1)/2, r*(q+high)+(q+h1)/2, x1, y1, x2, y2, null); 
                }    
                g.dispose();
                File newfile = new File(folder, imgindex+".jpg");
                if (newfile.exists()) newfile.delete();
                ImageIO.write(y, "jpg", newfile);
                FileWriter aWriter = new FileWriter(folder + File.separator + imgindex, false);
                aWriter.append(contents);
                aWriter.close();
            } catch(Exception e){}
        }
        else if (act.equals("delete") )
        {
            String contents = filebytes(folder + File.separator + imgindex);
            if (contents.equals("")) return;
            String xy[] = contents.split("';[^']+'");
            String [] fns = xy[0].split(",");
            String [] szs = xy[1].split(",");
            String a = "", b=""; int i=-1;
            String delnums = "";
            int N = 0;
            for ( i=0; i < fns.length; i++)
            {
               // if (fns[i].equals(filename)) break;
                if ( ("," + filename + ",").indexOf("," + fns[i] + ",") >=0)
                {
                    delnums += "," +  i;
                }
                else
                {
                    a += "," + fns[i];
                    b += "," + szs[i];
                    N++;
                }
            }
            
            if ( delnums.equals("")) return;
            delnums +=","; 
            if (a.equals(""))
            {
                (new File(folder + File.separator + imgindex)).delete();
                (new File(folder + File.separator + imgindex + ".jpg")).delete();
                return;
            }
             
            contents = a.substring(1) + "';var dim='" + b.substring(1);
             
            try
            {
                FileWriter aWriter = new FileWriter(folder + File.separator + imgindex, false);
                aWriter.append(contents);
                aWriter.close();
                int q = size;
                int m = 5;
                int c ;
                int r  ;
                Graphics2D g;
                int H, W;
                W =  m*q;
                H = (int)Math.ceil((float)(N+0.0)/(float)m)*(q + high);
                BufferedImage y =  ImageIO.read(new File(folder,imgindex+".jpg"));
                W = y.getWidth();
                BufferedImage z =  new BufferedImage(W, H , BufferedImage.TYPE_INT_RGB);
                int c1=0,r1=0;
                g = z.createGraphics();
                g.setPaint ( new Color (255,255,255) );
                g.fillRect ( 0, 0, W, H);
                int j = 0 ; 
                i = -1;
                
                for (j=0; j < fns.length; j++)
                {
                    if (delnums.indexOf("," + j + ",")>=0)continue;
                    ++i;
                    c = i%m;
                    r = i/m;
                    c1 = (j)%m;
                    r1 = (j)/m;
                    g.drawImage(y, c*q, r*(q+high), (c+1)*q, (r+1)*(q+high), c1*q, r1*(q+high), (c1+1)*q, (r1+1)*(q+high), null); 
                }
                g.dispose();
                File newfile = new File(folder, imgindex+".jpg");
                if (newfile.exists()) newfile.delete();
                ImageIO.write(z, "jpg", newfile);
            } catch(Exception e){}
        }
    }
}
