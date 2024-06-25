 
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
import javax.servlet.annotation.WebServlet;
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
  
@WebServlet(name = "CaptchaServlet", urlPatterns = {"/patchca.png"},   asyncSupported = false)  
public class CaptchaServlet extends HttpServlet { 
    static public boolean passed(HttpServletRequest request)
    {
       boolean an = true;
       HttpSession session = request.getSession(false);
       int orgnum = Toolbox.setcharset( request, null);
       String challenge = (String)session.getAttribute("validationCode");
       String uresponse = (String) Toolbox.defaultParam(orgnum,request, ("patchcafield"), null);
      
       if (challenge != null && uresponse != null) 
       {
        session.removeAttribute("validationCode");
        an = challenge.equalsIgnoreCase(uresponse); 
       }
       
       return an;
    }
    private static final long serialVersionUID = 5126616339795936447L;  
      
    private ConfigurableCaptchaService configurableCaptchaService = null;  
    private ColorFactory colorFactory = null;  
    private RandomFontFactory fontFactory = null;  
    private RandomWordFactory wordFactory = null;  
    private TextRenderer textRenderer = null;  
      
    public CaptchaServlet() {  
        super();  
    }  
  
      
    public void destroy() {  
        wordFactory = null;  
        colorFactory = null;  
        fontFactory = null;  
        textRenderer = null;  
        configurableCaptchaService = null;  
        super.destroy(); // Just puts "destroy" string in log  
    }  
  
    public void doGet(HttpServletRequest request, HttpServletResponse response)  
            throws ServletException, IOException {  
        doPost(request, response);  
    }  
  
    public void doPost(HttpServletRequest request, HttpServletResponse response)  
            throws ServletException, IOException {  
        response.setContentType("image/png");  
        response.setHeader("cache", "no-cache");  
          
        HttpSession session = request.getSession(true);  
        OutputStream outputStream = response.getOutputStream();  
          
        
        Captcha captcha = configurableCaptchaService.getCaptcha();  
        
        String validationCode = captcha.getChallenge();  
        session.setAttribute("validationCode", validationCode);  
       
        BufferedImage bufferedImage = captcha.getImage();  
        ImageIO.write(bufferedImage, "png", outputStream);  
          
        outputStream.flush();  
        outputStream.close();  
    }  
    
    public void init() throws ServletException {  
        configurableCaptchaService = new ConfigurableCaptchaService();  
          
        
        colorFactory = new RandomColorFactory();  
        configurableCaptchaService.setColorFactory(colorFactory);  
          
        
        fontFactory = new RandomFontFactory();  
        fontFactory.setMaxSize(32);  
        fontFactory.setMinSize(28);  
        configurableCaptchaService.setFontFactory(fontFactory);  
          
      
        wordFactory = new RandomWordFactory();  
        wordFactory.setCharacters("abcdefghkmnpqstwxyz23456789");  
        wordFactory.setMaxLength(5);  
        wordFactory.setMinLength(4);  
        configurableCaptchaService.setWordFactory(wordFactory);  
          
        
        MyBackground backgroundFactory = new MyBackground();  
        configurableCaptchaService.setBackgroundFactory(backgroundFactory);  
          
          
        ConfigurableFilterFactory filterFactory = new ConfigurableFilterFactory();  
          
        List<BufferedImageOp> filters = new ArrayList<BufferedImageOp>();  
        WobbleImageOp wobbleImageOp = new WobbleImageOp();  
        wobbleImageOp.setEdgeMode(AbstractImageOp.EDGE_MIRROR);  
        wobbleImageOp.setxAmplitude(2.0);  
        wobbleImageOp.setyAmplitude(1.0);  
        filters.add(wobbleImageOp);  
        filterFactory.setFilters(filters);  
          
        configurableCaptchaService.setFilterFactory(filterFactory);  
          
        
        textRenderer = new BestFitTextRenderer();  
        textRenderer.setBottomMargin(3);  
        textRenderer.setTopMargin(3);  
        configurableCaptchaService.setTextRenderer(textRenderer);  
          
         
        configurableCaptchaService.setWidth(82);  
        configurableCaptchaService.setHeight(32);  
    }  
      
     
}  