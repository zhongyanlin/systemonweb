/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package telaman;
import java.awt.Color;  
import java.awt.Graphics;  
import java.awt.image.BufferedImage;  
import java.awt.image.BufferedImageOp;  
import java.io.IOException;  
import java.io.OutputStream;  
import java.util.ArrayList;  
import java.util.List;  
import java.util.Random;  
  
import javax.imageio.ImageIO;  
import javax.servlet.ServletException;  
import javax.servlet.http.HttpServlet;  
import javax.servlet.http.HttpServletRequest;  
import javax.servlet.http.HttpServletResponse;  
import javax.servlet.http.HttpSession;  
  
import org.patchca.background.BackgroundFactory;  
import org.patchca.color.ColorFactory;  
import org.patchca.color.RandomColorFactory;  
import org.patchca.filter.ConfigurableFilterFactory;  
import org.patchca.filter.library.AbstractImageOp;  
import org.patchca.filter.library.WobbleImageOp;  
import org.patchca.font.RandomFontFactory;  
import org.patchca.service.Captcha;  
import org.patchca.service.ConfigurableCaptchaService;  
import org.patchca.text.renderer.BestFitTextRenderer;  
import org.patchca.text.renderer.TextRenderer;  
import org.patchca.word.RandomWordFactory; 
 
public class MyBackground  implements BackgroundFactory 
{  
    private Random random = new Random();  

    public void fillBackground(BufferedImage image) {  
        Graphics graphics = image.getGraphics();  


        int imgWidth = image.getWidth();  
        int imgHeight = image.getHeight();  


        graphics.setColor(Color.WHITE);  
        graphics.fillRect(0, 0, imgWidth, imgHeight);  


        for(int i = 0; i < 100; i++) {  

            int rInt = random.nextInt(255);  
            int gInt = random.nextInt(255);  
            int bInt = random.nextInt(255);  

            graphics.setColor(new Color(rInt, gInt, bInt));  

            int xInt = random.nextInt(imgWidth - 3);  
            int yInt = random.nextInt(imgHeight - 2);  


            int sAngleInt = random.nextInt(360);  
            int eAngleInt = random.nextInt(360);  


            int wInt = random.nextInt(6);  
            int hInt = random.nextInt(6);  

            graphics.fillArc(xInt, yInt, wInt, hInt, sAngleInt, eAngleInt);  


            if (i % 20 == 0) {  
                int xInt2 = random.nextInt(imgWidth);  
                int yInt2 = random.nextInt(imgHeight);  
                graphics.drawLine(xInt, yInt, xInt2, yInt2);  
            }  
        }  
    }  
     
    
}
