
<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.io.*,java.util.regex.*" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">
   
<html >
    <head><% CachedStyle cachedstyle = new  CachedStyle(request, 0);%>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Make title</title>
    </head>
    <body>
       <% 
           int orgnum = Toolbox.setcharset( request, response);
   String fontname = Toolbox.defaultParam(orgnum,request,"fontname","Ballw",null, 20);
   String fontsizestr = Toolbox.defaultParam(orgnum,request,"fontsize1","34", null, 20);
   String words = Toolbox.defaultParam(orgnum,request,"words","", ",+()'", 300);
   String width = Toolbox.defaultParam(orgnum,request,"wwidth","", null, 4);
   String height = Toolbox.defaultParam(orgnum,request,"wheight","", null, 4);
   String left = Toolbox.defaultParam(orgnum,request,"wleft","4", null, 4);
   String top = Toolbox.defaultParam(orgnum,request,"wtop","4", null, 4);
   
   %><center>
        <h1>Make Title</h1>
        <form rel=opener name="f" method="post" action="makefont.jsp"  ><table>
          <tr><td> Words </td><td> <input name="words" onchange="javascript:width1()" size="60"  value="<%=(words==null)?"":words%>" ></td></tr>
          <tr><td> Font Name </td><td> 
          <select name="fontname" value="<%=(fontname==null)?"":fontname%>" >
          <option name="Candice">Candice</option>
          <option name="BaroqueScript">Baroque Script</option>
          <option name="Ballw" selected>Ballw</option>
          <option name="Arial">Arial</option>
          <option name="Roman">Roman</option>
          </select>
          </td></tr>
          <tr><td> Font Size </td><td> <input size=3 name="fontsize1"  onchange="javascript:width1()" value="<%=(fontsizestr==null)?"":fontsizestr%>" ></td></tr>
          
          <tr><td> Picture Width </td><td> <input  size=3 name="wwidth"   value="<%=(width==null)?"":width%>"></td></tr>
          <tr><td> Picture Height </td><td> <input  size=3 name="wheight"   value="<%=(height==null)?"":height%>"></td></tr>
          <tr><td> Picture Left </td><td> <input  size=3 name="wleft"   value="<%=(left==null)?"": left%>"></td></tr>
          <tr><td> Picture Bottom </td><td> <input  size=3 name="wtop"   value="<%=(top==null)?"":top%>"></td></tr>

          <tr><td colspan=2 align=center>  <input name="submit" type=submit value="Submit" style="background:#CDCDCD;font-weight:700;font-size:20px"></td></tr></table><br><br>
        </form>
        <script type="text/javascript"  > 
           for (var j=0; j < document.f.fontname.options.length; j++)
           {
              if (document.f.fontname.options[j].value == '<%=fontname%>')
                  document.f.fontname.selectedIndex = j;
           }
           function width1()
           {
              var  w = Math.floor( 324.0/728 * document.f.words.value.length
                 * parseInt(document.f.fontsize1.value));
              document.f.wwidth.value = w;
              document.f.wheight.value = parseInt(document.f.fontsize1.value) + 4;
              document.f.wtop.value = 7;
              document.f.wleft.value = 4;
           }
       </script>
        <%
    int j = -1;String c = "";
 
   if (words.replaceAll(" ","").equals("")==false)
   {
       try{
       Runtime r = Runtime.getRuntime();
       int fontsize = Integer.parseInt(fontsizestr);
       int ileft = Integer.parseInt(left);
       int itop = Integer.parseInt(top);
       //int w = (int)(324.0/728*words.length()*fontsize);
       if (fontname.equals("BaroqueScript") || fontname.equals("Candice")||fontname.equals("Ballw"))
          fontname = Toolbox.installpath + "\\WEB-INF\\conf\\fonts\\" + fontname + ".ttf";
       c = "convert -size " + width + "x" +  height
               + " xc:none -font " + fontname +" -pointsize " + fontsize
               + "   -fill black -annotate +" + (ileft-1) + "+" + (fontsize-itop - 1)
               +" \"" + words +"\"  -fill white -annotate +" + (ileft+1) + "+"+ (fontsize-itop+1)
               +" \"" + words +"\"  -fill #DDCC11 -annotate +" + (ileft) + "+"+ (fontsize-itop)
               +" \"" + words +"\" tm.gif";
       (new File(Toolbox.installpath + "\\temp")).mkdir();
       FileWriter f = new FileWriter(Toolbox.installpath + "\\temp\\makefont.bat",false);
       f.write("call " + c);
       f.close();
       Process proc = r.exec(Toolbox.installpath + "\\temp\\makefont.bat", null, new File( Toolbox.installpath + "\\temp") );
       j = proc.waitFor();
       }
       catch(Exception e)
       {
          out.println(e.toString());
       }
       out.println("ImageMagick Commandline<div style=\"width:600px;background-color:lightyellow;border:1px #b0b0b0 solid\">" + c +"</div><br>");
       if (j==0) out.println("<img name=\"pic\" src=\"temp/tm.gif\" border=\"1px purple solid\">");
   }

   %>
   

    </body>
</html>
