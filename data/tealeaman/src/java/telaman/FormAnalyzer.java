package telaman;


import java.awt.AlphaComposite;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;
import javax.imageio.ImageIO;
import java.util.*;
import org.apache.pdfbox.pdmodel.*; 
import org.apache.pdfbox.rendering.PDFRenderer; 
 
public class FormAnalyzer 
{
     int threshold = 190;
     final byte BLACK = 1;
     final byte GREY =  4;
     final byte WHITE = 7;
     float whiteRate = 0.85f;
     float blackRate = 0.95f;
     int boxHeight = 20;
     int minHeight = 8;
     int maxHeight = 35;
     int chkboxWidth = 6;
     int linethick = 3;
     int minboxwidth = 30;
     File f;
     String dir;
     BufferedImage image=null;
     int W, H;
     byte [][] b, g;
     public  FormAnalyzer(String dir, String old) 
    {
        try
        {
             f = new  File(dir, old);
             if (!f.exists())
             {
               
             }
             else
             {
             if (old.indexOf(".pdf")> 0)
                 tojpg();
             this.dir = dir;
             image = ImageIO.read(f);
             W = (int)image.getWidth();
             H = (int)image.getHeight();
           
             if (W>1000 || W < 600)
             {
                  int h = H*(1000/W); 
                  int scaledWidth = 1000;
                  int scaledHeight = H*1000/W;
                  BufferedImage scaledBI = new BufferedImage(scaledWidth, scaledHeight, BufferedImage.TYPE_INT_RGB);
                  Graphics2D g = scaledBI.createGraphics();
                  g.setComposite(AlphaComposite.Src);
                  g.drawImage(image, 0, 0, scaledWidth, scaledHeight, null);
                  g.dispose();
                  String ext = f.getName().replaceFirst("[^\\.]+\\.", "");
                  ImageIO.write(scaledBI, ext, f);
                  image = scaledBI ;
                  W = scaledWidth;
                  H = scaledHeight;
             }
             
             b = new byte[W][]; 
             g = new byte[W][];
            
             int red, green, blue;
             int newPixel;
             int threshold =210;
             int histogram[] = new int[256];
             
             for(int i=0; i< W; i++) 
            {
               // g[i] = new byte[H];
                b[i] = new byte[H];
              for(int j=0; j< H; j++)
                {
                  int k = image.getRGB(i, j);
                  
                  newPixel = (int)Math.round(((k >> 16) & 0x000000FF)*.34  + ((k >> 8) & 0x000000FF)*.33  + (k & 0x000000FF)*.33);
                  
                  histogram[newPixel]++;
                 // g[i][j] = (byte)(newPixel-128);
                }
            }
           
            int [] x = new int[2];
            for(int i=0; i< W-1; i++) 
            {
                diffcolor(new int[]{i,200}, new int[]{i+1,200},x);
            }
         
           }
        }
        catch (Exception e)
       {
            
       }
        
      }
      public void bw(String temp)  
      {
         try{
            int bl = (new Color(0,0,0)).getRGB();
            int wt = (new Color(255,255,255)).getRGB();
            int gr = (new Color(125,125,125)).getRGB();
            BufferedImage  bimg = new BufferedImage(W, H, BufferedImage.TYPE_BYTE_GRAY); 
            byte bb[][] = new byte[2][];
            for(int j=0; j < H; j++)
            {
                bb[0] = new byte[H]; 
                bb[1] = new byte[H];
            }
            for(int i=0; i< W; i++) 
            {
                for(int j=0; j < H; j++)
                {
                    if (b[i][j]==0
                     || i>0 && j>0 && i < W-1 && j < H-1 && b[i-1][j-1] +  b[i-1][j] + b[i-1][j+1] + b[i][j-1] + b[i][j] + b[i][j+1] +b[i+1][j-1] + b[i+1][j] + b[i+1][j+1] <= (WHITE*7)
                     || i>0 && j>0 && i < W-1   && b[i-1][j-1] +  b[i-1][j] +   b[i][j-1] + b[i][j] + b[i+1][j-1] + b[i+1][j]  <= (WHITE*4)
                     || i>0 && j>0 && j < H-1   && b[i-1][j-1] +  b[i-1][j] + b[i-1][j+1] + b[i][j-1] + b[i][j] + b[i][j+1]  <= WHITE*4
                     || i>0 && j>0 && b[i-1][j-1] +  b[i-1][j] +  b[i][j-1] + b[i][j] <= 2*WHITE
                     || j>0 && i < W-1 && j < H-1 &&  b[i][j-1] + b[i][j] + b[i][j+1] +b[i+1][j-1] + b[i+1][j] + b[i+1][j+1] <= (WHITE*4)
                     || i>0 && i < W-1 && j < H-1 &&   b[i-1][j] + b[i-1][j+1]   + b[i][j] + b[i][j+1]   + b[i+1][j] + b[i+1][j+1] <= (WHITE*4)
                     || i < W-1 && j < H-1 &&     b[i][j] + b[i][j+1]   + b[i+1][j] + b[i+1][j+1] <= 2*WHITE
                    )
                    {
                        bimg.setRGB(i, j, bl);
                        bb[i%2][j] = BLACK;
                    }
                    else
                    {
                        bimg.setRGB(i, j, wt);
                        bb[i%2][j] = WHITE;
                    } 
                }
                
                if (i > 0)
                {
                    for(int j=0; j < H; j++)
                    {
                        b[i-1][j] = bb[(i-1)%2][j]; 
                    }
                }
            }
            for(int j=0; j < H; j++)
            {
                 b[W-1][j] = bb[(W-1)%2][j]; 
            }
            
            
          File fi = new File(dir,temp);
          String target = temp.replaceFirst("^[^\\.]+.", "");
          ImageIO.write(bimg, target, fi);
       
       }
       catch (Exception e)
       {
            
       }
   }
   int min(int a, int b)
   {
       return a>b? b: a;
   }
   void harmony(int i, int j)
   {
       if (i==0 || i == W-1  ) return;
       int m = image.getRGB(i-1, j);
       int n = image.getRGB(i+1, j);
       image.setRGB(i, j,  ((((m >> 24) + (n >> 24))/2) << 24) + 
           min((m >> 16) & 0x000000FF, (n >> 16) & 0x000000FF) << 16
           + min((m >> 8) & 0x000000FF ,(n >> 8) & 0x000000FF) << 8
           + min(m& 0x000000FF,n& 0x000000FF)  );
   }
   int testrect(LinkedList<int []> border, int mini, int maxi, int minj, int maxj)
   {
       int distance = 0, n=0;
       int z [] = new int[]{0,0};
       for (int [] y: border)
       {
           if (n > 0 && Math.abs(z[0] - y[0]) + Math.abs(z[1] - y[1])>1) 
           {
               break;
           }
           z = y;
           n++;
           int h = y[0] - mini; if (h<0) h = -h;
           int h1= y[0] - maxi; if (h1<0) h1 = -h1;
           if (h > h1) h = h1;
           int w = y[1] - minj; if (w<0) w = -w;
           int w1= y[1] - maxj; if (w1<0) w1 = -w1;
           if (w > w1) w = w1;
           if (h > w) h = w;
           distance += h;
            
       }
        
       return distance/n;
   }
   
   void diffcolor(int [] p, int [] q, int [] r)
   {
       int k = image.getRGB(p[0],p[1]);
       int n = image.getRGB(q[0],q[1]);
       int kr = (k >> 16) & 0x000000FF;
       int kg = (k >> 8) & 0x000000FF;
       int kb = k & 0x000000FF;
       int nr = (n >> 16) & 0x000000FF;
       int ng = (n >> 8) & 0x000000FF;
       int nb = n & 0x000000FF;
       int x = kr - nr; if (x < 0) x = -x;
       int y = kg - ng; if (y < 0) y = -y; if (y > x) x = y;
       int z = kb - nb; if (z < 0) z = -z; if (z > x) x = z;
       r[0] = x;
       r[1] = kr + kg + kb - nr - ng - nb;
   }
   boolean within(int n, int [] minc, int []maxc)
   {
       for (int k=0; k < 3; k++)
       {
            int l = ( n >> (k*8)) & 0x000000FF;
            if ( l < minc[k] || l > maxc[k]) 
            {
                return false;
            }
       }
       return true;
   }
   public  String  searchforrect(String temp) 
   {
       ArrayList<int []> rect = new ArrayList();
       int previousmini = 0,previousmaxi = 0,previousminj = 0,previousmaxj = 0;
       int nm = 0;
       int [] minc = new int[]{256,256,256,256};
       int [] maxc = new int[]{-1,-1,-1,-1};
       int sumHeight = 0;
       int numboxes = 0;
       StringBuffer bs = new StringBuffer("[");
       
       for (int gap = minHeight; gap > 0; gap -= minHeight-1)
       {
       for (int j=0; j < H; j+=gap)
       for (int i=0; i < W; i+=gap)
       {
           byte cl = b[i][j];
           int n = image.getRGB(i,j);
           if (cl == 0 && (gap >1 && (nm==0 || within(n, minc, maxc) ) || 
                           gap ==1 && (j > 0 && j < H-1) && (i>0 && i < W-1) && !within(n, minc, maxc)
                          ))
           {
               nm++;
                
               Stack<int []> s = new Stack();
               s.add(new int[]{i,j});
               b[i][j] = GREY;
               int mini = W, minj= H, maxi = -1, maxj = -1, total=0;
               LinkedList<int[]> border = new LinkedList(); 
               int [] old = new int[]{i-1,j};
               int whitecount = 0, blackcount=0;
               while (!s.isEmpty())
               {
                   int [] p = s.pop();
                   int[][] q = new int[][]{{p[0],p[1]+1},{p[0]+1,p[1]},{p[0],p[1]-1},{p[0]-1,p[1]}};
                   boolean onborder = false;
                   
                   int k0 = 0;
                   for (; k0 <4; k0++)
                   {
                       if (q[k0][0] == old[0] && q[k0][1] == old[1])
                           break;
                   }
                   for (int k1=0; k1 < 4; k1++)
                   {  
                       int k = (k1 + k0) % 4;
                       if (q[k][0] <0 || q[k][0] >= W || q[k][1] < 0 || q[k][1] >= H )//|| Math.abs(b[q[k][0]][q[k][1]] - incl)<=2)
                       {
                           onborder = true;
                           continue;
                       }
                       else if (b[q[k][0]][q[k][1]] != 0 )
                       {
                           continue;
                       }
                       diffcolor(q[k],p,old);
                       if (gap > 1)
                       {
 
                           if (old[0] < 15)
                           {
                               s.add(q[k]);
                               b[q[k][0]][q[k][1]] = GREY;
                              // image.setRGB(q[k][0],q[k][1],(image.getRGB(q[k][0],q[k][1])<<24) + (255<<16) + (255<<8) + 255);
                           }
                           else
                           {
                               onborder = true;
                               
 
                           }
                       }
                       else
                       {
                               
                           if ( !within(image.getRGB(q[k][0],q[k][1]),minc, maxc) || old[0] < 15 )
                           {
                                
                                s.add(q[k]);
                                b[q[k][0]][q[k][1]] = GREY;
                               // image.setRGB(q[k][0],q[k][1],(image.getRGB(q[k][0],q[k][1])<<24));
                           }
                           else
                           {
                                onborder = true;
                           }
                       }
                   }
                    
                   if (p[0] > maxi) maxi = p[0];
                   if (p[0] < mini) mini = p[0]; 
                   if (p[1] > maxj) maxj = p[1];
                   if (p[1] < minj) minj = p[1];
                   
                   if (onborder)
                   {
                       border.add(p);
                   }
                   b[p[0]][p[1]] =  (gap>1)?WHITE:BLACK; 
                   old = p;
                   if (nm == 1)
                   {
                       n = image.getRGB(p[0],p[1]);
                       for (int k=0; k < 4; k++)
                       {
                           int l = ( n >> (k*8)) & 0x000000FF;
                           if (l > maxc[k]) maxc[k] = l;
                           if (l < minc[k]) minc[k] = l;
                       }
                   }
                   total++;
               }
    
               int width = maxi - mini + 1;
               int height = maxj - minj + 1;
               boolean isfield = false;
                  
               if ( gap>1 && border.size()==0 || width == W && height==H)
               {
                   continue;
               }
               
               if (gap > 1)
               {
                   float rate = ((float)total)/(width * height);
                   int rr = 1;

                   if (height>=minHeight && (total >= 0.99*width*height || ( rr = testrect(border, mini, maxi, minj, maxj))< 4))
                   {
                       if (rate > whiteRate  &&  width >= chkboxWidth && height >= chkboxWidth)
                       {
                           int top = maxj-1;
                           while (top >= minj)
                           {
                              int sum=0;
                              for (int j1=mini; j1 <= maxi; j1++)
                              {
                                 if(!within(image.getRGB(j1,top), minc, maxc))
                                     sum++;
                              }
                              if (sum > 2)
                              {
                                  top++;
                                  break;
                              }
                              top--;
                           }
                           minj = top;
                           height = maxj - minj + 1;
                           if( height >= minHeight)
                           {
                               isfield = true;
                               sumHeight += height;
                               numboxes++;
                           }
                           else
                           {
                               int right = maxi-1;
                               while (right >= mini)
                               {
                                  int sum=0;
                                  for (int j1=minj; j1 <= maxj; j1++)
                                  {
                                     if(!within(image.getRGB(right,j1), minc, maxc))
                                         sum++;
                                  }
                                  if (sum > 3)
                                  {
                                      right++;
                                      break;
                                  }
                                  right--;
                               }
                               mini = right;
                               width = maxi - mini + 1;
                               if(width > 30 )
                               isfield = true;
                           }
                       }
                   }
               }
               else
               {
                   float r1 = total / ((float)(width * height));
                   if (width < minboxwidth)  
                   {
                       
                   }
                   else if (height > linethick)
                   {
                       
                   }
                   else
                   { 
                       int top = minj-2;
                       while (top >= 0)
                       {
                          int sum=0;
                          for (int j1=mini; j1 <= maxi; j1++)
                          {
                              if(!within(image.getRGB(j1,top), minc, maxc))
                                    sum++;
                          }
                          if (sum > 0.1*width || sum > 7)
                          {
                              top++;
                              break;
                          }
                          top--;
                       }
                       if (minj - top >= minHeight)
                       {
                           if (Math.abs(previousmini - mini) < 3 && Math.abs(previousmaxi - maxi) < 3 
                              && Math.abs(previousmaxj - top) <= minHeight/2)
                           {
                               for (int i1=mini+1; i1 <= maxi-1; i1++)
                               {
                                   b[i1][previousmaxj] = WHITE;
                               }
                               maxj = minj-1;
                               minj = previousminj; 
                           }
                           else
                           {   
                               maxj = minj-1;
                               minj = (top > maxj-boxHeight)? top:(maxj-boxHeight); 
                           }
                           previousmini = mini;
                           previousmaxi = maxi;
                           previousminj = minj;
                           previousmaxj = maxj;
                           isfield = true;
                       }
                       
                   }
                   
               }
               if (isfield)
               {
                   for (int i1=mini; i1 <= maxi; i1++)
                   {
                       b[i1][minj] = b[i1][maxj] = GREY;
                   }
                   for (int j1=minj+1; j1 <= maxj-1; j1++)
                   {
                       b[mini][j1] = b[maxi][j1] = GREY;
                   }
                   bs.append("[" + mini + "," + maxi + "," + minj + "," + maxj + "],");
               }
           }
        }
          if (gap> 1)
          {
              if (numboxes>0 && boxHeight < sumHeight/numboxes) 
              {
                  boxHeight = sumHeight/numboxes;
                  if (boxHeight > maxHeight)
                  boxHeight = maxHeight;
              }
          }
       }
        if (temp!=null){
        try
        {
            int red = (new Color(255, 0,0)).getRGB();
            int green = (new Color(0,255,0)).getRGB();
            int green1 = (new Color(150,150,0)).getRGB();
            int blue = (new Color(0,0,255)).getRGB();
            int blue1 = (new Color(0,125,150)).getRGB();
            BufferedImage  bimg = new BufferedImage(W, H, BufferedImage.TYPE_INT_RGB); 
            for(int i=0; i< W; i++) 
            {
                for(int j=0; j < H; j++)
                {
                   if (b[i][j] == GREY)
                        bimg.setRGB(i,j, red);
                    else
                 /*   if (b[i][j] == (BLACK))
                       bimg.setRGB(i,j, green);
                    else
                    if (b[i][j] == (BLACK+2))
                       bimg.setRGB(i,j, green1);
                    else if (b[i][j] == (WHITE - 1))
                       bimg.setRGB(i,j, blue);
                     else if (b[i][j] == (WHITE - 2))
                       bimg.setRGB(i,j, blue1);
else */
                       bimg.setRGB(i, j, image.getRGB(i, j));
                }
            }
            
          File fi = new File(dir,temp);
          String target = temp.replaceFirst("^[^\\.]+.", "");
          ImageIO.write(bimg, target, fi);
          
         }
         catch(Exception e){}
          return null;
        }
        if (bs.length() == 1) return "[]";
        return bs.toString().replaceFirst(",$","]");
        
   }
   void tojpg()
   {
      int j = 0;
      int width = 0, height = 0;
      PDFRenderer renderer;
      try
      {
          PDDocument document = PDDocument.load(f); 
          renderer = new PDFRenderer(document); 
          while (j < 3)
          try
          {
              BufferedImage image = renderer.renderImage(j++);
              width = image.getWidth();
              height += image.getHeight() + 50;
          }catch(Exception e){break;}
          int N = j;
          BufferedImage  bimg = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
          j = 0;
          int k = 0;
          while ( j < 3 && j < N)
          {
              image = renderer.renderImage(j++);
              for (int n=0; n< image.getHeight(); n++)
              {
                  for (int i=0; i < image.getWidth(); i++)
                      bimg.setRGB(i,k,image.getRGB(i,n));
                  k++;
              }
              for (int n=0; n< 50; n++)
              {
                  for (int i=0; i < image.getWidth(); i++)
                     bimg.setRGB(i,k, (new Color(255, 255, 255)).getRGB());
                  k++;
              }
          }
          File f1 = new File(dir, f.getName().replaceFirst(".pdf", ".jpg"));
          ImageIO.write(bimg, "JPEG", f1); 
        
          f = f1;
          document.close();  
      }catch(Exception e){}
   }
   public static void main(String args[])
   {
       String dir = "C:\\Users\\zhong\\Desktop";
       FormAnalyzer s = new FormAnalyzer(dir, "aa.pdf");
       s.searchforrect("cc.jpg");
   }
}
