<%@ page import="java.util.*,java.text.*,java.io.*,telaman.*" %>
 
<%!

String install = "C:\\customer0\\web\\D10059906\\english";
String slang = "";
String encoding = "utf-8";
final String pass = "zhongyan";
final String [] validFileTypes={"wav","m4p","wma"};
final String quts = "#&,@";
final String newline = "#&@&#";
final String squt = "&,#@";
char[] puntuations = {'~','!','@','#','$','%','^','&','*','(',')', '+',',', '?','/','|','\\','{','}','[',']','{','}',';','\'',':','>','<','"','='};
String validate(String x, String allowpun, int maxlength)
 {
     if (x==null) 
     {
         return  null;
     }
     StringBuffer y = new StringBuffer();
     
     for (int i=0; i < x.length() && y.length() != maxlength; i++)
     {
          
         int j = 0;
         int k = 0;
         for (; j < puntuations.length ; j++,k++ )
         {
             if (allowpun!=null && k < allowpun.length() && allowpun.charAt(k) == x.charAt(i))
             {
                 y.append(x.charAt(i));
                 j = puntuations.length;
             }
             else if (x.charAt(i) == puntuations[j])
             {
                 j = puntuations.length;
             }
                 
         }
         if (j < puntuations.length  )
         {
             y.append(x.charAt(i));
         }
          
     }
     return y.toString();
 }
String quotefree(String str)
{
   return str.replaceAll("\n", newline).replaceAll("\"", quts).replaceAll("'",squt);
}
String [] phrase = new String[30];
String [] words = new String[60];
String grades[] = new String[5];

void  makeuif(String lan)
{
      if (slang.equals(lan)) return;
      slang = lan;
      encoding = slang.equals("Chinese")?"gbk":"utf-8";
      String str = install + File.separator + lan + ".txt";
      int j = 0, k;
      try
      {
         File file = new File(str);
         FileInputStream fin = new FileInputStream(file);
         BufferedReader ebr = new BufferedReader(new InputStreamReader(fin));
         int i=0;
         for (  i=0; i < phrase.length; i++)
         {
              phrase[i] = ebr.readLine();
              if (phrase[i].length()==0)
                 break;
             
         }
         for (; i < phrase.length; i++)phrase[i] = "";
         for (  i=0; i < words.length; i++)
         {
              words[i] = ebr.readLine();
              if (words[i].length()==0)
                 break;
         }
         for (  i=0; i < grades.length; i++)
            grades[i] = ebr.readLine();
         fin.close();
      }
      catch (Exception e) {

      }
}
class Srecord
{
   String sname;
   short times, sum, rates;
   public Srecord (Submission ss)
   {
      sname = ss.sname;
      times = 1;
      sum = Short.parseShort(ss.grade);
      rates = Short.parseShort(ss.ups);
   }
   public void cumu(Srecord ss)
   {
      times++;
      sum += ss.sum;
      rates += ss.rates;
   }
   public void tohtml(StringBuffer buf, int j)
   {
      buf.append("<tr><td align=right>");
      buf.append(j);
      buf.append("</td><td align=left>");
      buf.append(sname);
      buf.append("</td><td align=right>");
      buf.append(times);
      buf.append("</td><td  align=right>");
      buf.append(rates);
      buf.append("</td><td  align=right>");
      buf.append(sum);
      buf.append("</td><td  align=right></td></tr>");
   }
   public void inq(HashMap h)
  {
     Object o = h.get(sname);
     if (o==null) h.put(sname, this);
     else
     {
        cumu((Srecord)o);
        h.put(sname, this);
     }
  }
}

class Submission
{
   String  sname, sfile, ups, grade, text;
   boolean valid = true;
   public Submission(String sname, String sfile, String ups, String grade, String text)
   {
       this.sname=sname;
       this.sfile=sfile;
       this.ups=ups;
       this.grade=grade;
       this.text=text;
   }
   public Submission(String str)
   {
      int j=0, i = str.indexOf(" ");
      if (i == -1) valid = false;
      else
      {
         sfile = str.substring(j,i);
       
         j=i+1;
         i = str.indexOf(" ", j);
         if (i == -1) valid = false;
         else
         {
            sname = str.substring(j,i);
           
            j = i+1;
            i = str.indexOf(" ", j);
            if (i == -1) valid = false;
            else
            {
                    ups = str.substring(j,i);
                    if (!ups.replaceFirst("[0-9]+", "").equals(""))
                    {
                       ups = "0";
                       grade = "0";
                       text = str.substring(j);
                    }
                    else
                    {
                     j=i+1;
                     i = str.indexOf(" ", j);
                     if (i == -1) valid = false;
                     else
                     {
                       grade  = str.substring(j,i);
                       if (!grade.replaceFirst("[0-9]+", "").equals(""))
                       {
                          grade = "0";
                       }
                       else
                       {
                           j=i+1;
                       }
                       text = str.substring(j);
                     }
                    }
                 }
            }
        }

  }
  



  public void set(String ups,String grade,String text)
  {
     if (ups!=null) this.ups=ups;
     if (grade!=null) this.grade=grade;
     if (text!=null) this.text=text.replaceAll("\n", newline);
  }
  public String toString()
  {
     return   sfile + " "
           + sname  + " "
           + ups + " "
           + grade + " "
           + text ;
  }
  public void tohtml(StringBuffer buf, int j)
  {
     buf.append("<tr><td align=right>");
     buf.append(j);
     buf.append("</td><td align=left>");
     buf.append(sname);
     buf.append("</td><td><a href=javascript:listen(");
     buf.append(j);
     buf.append(")>");
     buf.append(words[13]);
     buf.append("</a></td><td><a href=javascript:favor(");
     buf.append(j);
     buf.append(")>");
     buf.append(words[14]);
     buf.append("</a></td><td align=right>");
     buf.append(ups);
     buf.append("</td><td><a href=\"javascript:comment(");
     buf.append(j);
     buf.append(",'");
     buf.append(quotefree(text));
     buf.append("')\">");
     buf.append(words[15]);
     buf.append("</a></td><td>");
     int gd = 0;
     try{ gd = Integer.parseInt(grade);}catch(Exception e){}
     if (gd >= grades.length) gd = grades.length-1;
     buf.append(grades[gd]);
     buf.append("</td><td>");
     buf.append(sfile +"</td><td></td></tr>");
  }

}
%>
<%!
synchronized boolean update(char which, String filename, String ups, String grade, String sentence, String sname)
{
   if (which=='a')
      return append(sname,  sentence,  filename);

   else if (which=='s')
      return save(filename,   ups,   grade, sentence);

   else if (which=='d')
      return delet(filename);
   return false;
}
boolean   delet(String filename)
{
    String fd =  install    + File.separator +  "list.txt";
    String f  =  install     + File.separator + unifilename("txt");
    boolean b = false;
    try
    {
        FileWriter fw  = new FileWriter(f,true);

        BufferedReader br = new BufferedReader(new FileReader(fd));
        String aline = null;
        while ( (aline=br.readLine())!=null)
        {
           if (aline.indexOf(filename +" ")!=0)
              fw.write(aline + "\r\n");
        }
        br.close();

        fw.close();
        File f1 = new File(fd);
        System.gc();
        if (f1.exists()) f1.delete();
        File f2 = new File(f);
        f2.renameTo(f1);

    }
    catch(Exception e){return false;}
    return true;
}
boolean save(String n, String ups, String grade, String sentence)
{
    String fd =  install  +  File.separator +  "list.txt";
    String f  =  install  +  File.separator + unifilename("txt");
     
    boolean b = false;
    try
    {
        FileWriter fw  = new FileWriter(f,true);
        BufferedReader br = new BufferedReader(new FileReader(fd));
        String aline = null;
        while ( (aline=br.readLine())!=null)
        {
           if (aline.indexOf(n +" ")==0)
           {
               Submission s = new Submission(aline);
               if (ups!=null && ups.equals("-"))
               {
                  ups = null;
                  sentence = s.text + newline + sentence;
               }
               s.set(ups,grade,sentence);
               fw.write(s.toString() +  "\r\n");
           }
           else
               fw.write(aline + "\r\n");
        }
        br.close();
        fw.close();
        File f1 = new File(fd);
        System.gc();
        if (f1.exists())
         f1.delete();
        File f2 = new File(f);
        f2.renameTo(f1);

    }
    catch(Exception e){ return false;}
    return true;
}
boolean append(String sname, String sentence, String filename)
{
    String fd =  install     + File.separator +  "list.txt";
    String f  =  install     + File.separator +  filename.replaceFirst("\\..*", "");

    try
    {
        FileWriter fw  = new FileWriter(f,true);
        try{
        BufferedReader br = new BufferedReader(new FileReader(fd));
        String aline = null;
        while ( (aline=br.readLine())!=null)
        {
           fw.write(aline + "\r\n");
        }
        br.close();
        }catch(Exception e){}
        Submission ss = new Submission(sname,   filename, "0", "0", sentence);

        fw.write(ss.toString());
        fw.close();
        System.gc();
        File f1 = new File(fd);
        if (f1.exists()) f1.delete();
        File f2 = new File(f);
        f2.renameTo(f1);
        return true;
    }
    catch(Exception e){}
    return false;
}
String pad(int i){if (i < 10) return "0" + i; return "" + i;}
String  unifilename(String str)
{
   Date c = new Date();
   Format f = new SimpleDateFormat("yyMMddHHmmss");
   return  f.format(c)
           + pad((int)(c.getTime()%1000)/10 )
           + "." + str;
}

String  seven(int i)
{
   Date c = new Date(System.currentTimeMillis() - i*24*3600000);
   Format f = new SimpleDateFormat("yy.MM.dd");
   return  f.format(c);
}
int indexOf(String aline)
{
   for (int i=0; i < validFileTypes.length; i++)
   {
      int j = aline.toLowerCase().indexOf("." + validFileTypes[i]);
      if (j>0) return j;
   }
   return 0;
}

 
%>
<%
int orgnum = Toolbox.setcharset( request, response);
String thisurl = request.getRequestURI();
thisurl = thisurl.substring(thisurl.lastIndexOf("/")+1);
String boundary = request.getContentType();
boolean teacher = (session.getAttribute("eng") != null);
String x = validate(Toolbox.defaultParam(orgnum,request, ("x"), null), null, 2);
int i = 0;
if (boundary!=null && (i = boundary.indexOf("boundary=")) != -1)
{
       {
          boundary = boundary.substring(i + 9);
          boundary = "--" + boundary;
       }

       ServletInputStream sin = request.getInputStream();
       byte b[] = new byte[2048];
       int k;
       boolean had = false;
       String filename = null;
       String filename1 = null;
       String sname = "", sentence="";
       int j = 0;
       FileOutputStream binout = null;

       while ((k = sin.readLine(b, 0, 2028)) > 0)
       {

          String aline = new String(b, 0, k);

          if (had == false)
          {

             if (aline.indexOf("sname") >= 0)
             {
                k = sin.readLine(b, 0, 2028);
                aline = new String(b, 0, k);
                while (aline.trim().length() < 2)
                {
                   k = sin.readLine(b, 0, 2028);
                   aline = new String(b, 0, k);
                }
                sname = aline.trim();

             }
             else if (aline.indexOf("sentence") >= 0)
             {
                k = sin.readLine(b, 0, 2028);
                aline = new String(b, 0, k);
                while (aline.trim().length() < 2)
                {
                   k = sin.readLine(b, 0, 2028);
                   aline = new String(b, 0, k);
                }
                sentence = aline.trim().replaceAll("\n", " ");
             }
             else if (aline.indexOf("filename") >= 0)
             {

                    if ( (j=indexOf(aline)) > 0 )
                   {
                        filename = unifilename(aline.substring(j+1,j+4));
                   }
                   else if ((j=aline.toLowerCase().indexOf("english.txt")) > 0)
                   {
                        filename = "English.txt";
                   }
                   else if ((j=aline.toLowerCase().indexOf("chinese.txt")) > 0)
                   {
                        filename = "Chinese.txt";
                   }
                   else
                   {
                      out.println("....." +aline.substring(j+1,j+4) +" is not a valid sound file");
                      return;
                   }

                   try
                   {
                      File fdd = new File(install);
                      if (fdd.exists()==false)  fdd.mkdir();
                      binout = new FileOutputStream(new File(install,filename));
                   } catch (Exception e)
                   {
                      out.println("system error: fail to create file " + filename);
                      return;
                   }

                   k = sin.readLine(b, 0, 2028);
                   k = sin.readLine(b, 0, 2028);
                   had = true;
              }
          }
          else
          {

             if (aline.indexOf(boundary) == 0)
             {
                had = false;
             }
             else
             {
               if (binout != null)
               {
                   binout.write(b, 0, k);
               }
             }
          }
       }
       if (!filename.equals("Chinese.txt") && !filename.equals("English.txt") && update('a', filename, "0", "0",  sentence, sname))
          out.print("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><body style=margin:0px 0px 0px 0px>" + sname +", " + filename  +"<script type=\"text/javascript\" >parent.syn(\""
               + sname +"\",\"" + filename +"\",\"" + sentence.replaceAll("\"", quts) + "\");</script></body></html>");
       else
      {
           slang = "";
           out.print("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><body style=margin:0px 0px 0px 0px>Reload<script type=\"text/javascript\" >parent.document.location.href = parent.document.location.toString();</script></body></html>");
      }
          return;
}
else if ( x != null  && x.equals("w") )
{
   String file =  validate(Toolbox.defaultParam(orgnum,request, ("file"), null), null, 30);
   File f = new File(install, file);
   ServletOutputStream stream = null;
   BufferedInputStream buf = null;
   try
   {
             if (file.indexOf(".txt") < 0)
             {
                 response.setContentType("audio/mpeg");
                 response.addHeader("Content-Disposition",   "inline;filename=" + file);
             }
             else
             {
                 response.setContentType("text/plain");
                 response.addHeader("Content-Disposition",   "attachment;filename=" + file);
             }

                 response.addHeader("Content-Disposition",   "inline;filename=" + file);
                 stream = response.getOutputStream();
                 response.setContentLength((int) f.length());
                 FileInputStream input = new FileInputStream(f);
                 buf = new BufferedInputStream(input);
                 int readBytes = 0;
                 while ((readBytes = buf.read()) != -1)
                 {
                     stream.write(readBytes);
                 }
                 input.close();
                 response.flushBuffer();
     }
     catch (IOException ioe)
     {
                  throw new ServletException(ioe.getMessage());
      }
              finally
              {
                  if (stream != null) stream.close();
                  if (buf != null) buf.close();
              }
      return;

}
else if (x!=null && x.indexOf("u") ==0)
{
   String filename =  validate( Toolbox.defaultParam(orgnum,request, ("file"), null), null, 30) ;
   String sentence =  validate(Toolbox.defaultParam(orgnum,request, ("text"), null), "\",-();:'!@#&+", 1000);
   String ups = null;
   if (x.equals("us")) ups = "-";
  
   if (update('s', filename, ups, null, sentence, null) == false)
   {
      out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><body  style=\"margin:0px 0px 0px 0px\">Save operation failed<script type=\"text/javascript\" >parent.err('Operation failed');</script></body></html>");
      return;
   }
   else
   {
      out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><body  style=\"margin:0px 0px 0px 0px\">Save operation successful<script type=\"text/javascript\" >parent.textsyn('" + filename + "');</script></body></html>");
   }

   return;
}
else if (x!=null && x.equals("s") )
{
   String filename = validate(Toolbox.defaultParam(orgnum,request, ("file"), null), null, 30);
   String ups = validate(Toolbox.defaultParam(orgnum,request, ("ups"), null), null, 10);
   String grade = validate(Toolbox.defaultParam(orgnum,request, ("grade"), null), null, 10);
    

   if (grade!=null && teacher==false)
   {
      out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><body  style=\"margin:0px 0px 0px 0px\">Only teacher can grade<script type=\"text/javascript\" >parent.err('Only teacher can grade');</script></body></html>");
      return;
   }
   String sentence = validate(Toolbox.defaultParam(orgnum,request, ("text"), null), "~!@#$%&():+;\"',?", 3000);
  
   if (update('s', filename,  ups,  grade,  sentence, null) == false)
   {
      out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><body  style=\"margin:0px 0px 0px 0px\">Save operation failed<script type=\"text/javascript\" >parent.err('Operation failed');</script></body></html>");
      return;
   }
   else if (sentence!=null)
   {
      out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><body  style=\"margin:0px 0px 0px 0px\">Save operation successful<script type=\"text/javascript\" >parent.textsyn('" + filename + "');</script></body></html>");
   }

   return;
}
else if (x!=null && x.equals("d") )
{
   if (teacher==false)
   {
      out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><body  style=\"margin:0px 0px 0px 0px\">Only teacher can delete a file<script type=\"text/javascript\" >parent.err('Only teacher can delete a file');</script></body></html>");
      return;
   }

   String filename = validate(Toolbox.defaultParam(orgnum,request, ("file"), null), null, 30);
   if (update('d', filename,  null, null, null, null))
   {
      out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><body style=\"margin:0px 0px 0px 0px\">Delete operation successful<script type=\"text/javascript\" >parent.delsyn('" + filename +"');</script></body></html>");
   }
   return;
}

else if (x!=null && x.equals("l") )
{

   String password = Toolbox.defaultParam(orgnum,request, ("password"), null);

   if (password.equalsIgnoreCase(pass))
   {
      out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><body  style=\"margin:0px 0px 0px 0px\">Login successful<script type=\"text/javascript\" >parent.setteacher(true);</script></body></html>");
      session.setAttribute("eng","1");
      teacher = true;
   }
   else out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><body  style=\"margin:0px 0px 0px 0px\">Incorrect password<script type=\"text/javascript\" >parent.notpass(true);</script></body></html>");
   return;
}
else if (x!=null && x.equals("x") )
{
   out.println("<html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><body style=\"margin:0px 0px 0px 0px\">Logout successful<script type=\"text/javascript\" >parent.setteacher(false);</script></body></html>");
   session.removeAttribute("eng");
   teacher = false;
   return;
}


String lang = Toolbox.defaultParam(orgnum,request, ("lang"), null);
if (lang==null)
 {
    lang =  (String)session.getAttribute("lang");
    if (lang==null)
    {
         lang = "English";
         session.setAttribute("lang", lang);
    }
}
else
   session.setAttribute("lang", lang);

makeuif(lang);

String before = Toolbox.defaultParam(orgnum,request, ("before"), null);
if (before==null) before =  seven(0);
String before1 = before;
before = before.replaceAll("\\.","") + "23595999";
String after = Toolbox.defaultParam(orgnum,request, ("after"), null);
if (after==null) after = seven(7);
String after1 = after;
after = after.replaceAll("\\.","") + "00000000";
String sname = Toolbox.defaultParam(orgnum,request, ("sname"), null);

%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
    <head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
        <meta http-equiv="Content-Type" content="text/html; charset=<%=encoding%>">
        <title><%=words[0]%></title>
     <style type="text/css">
        body{font-size:16px;background:url(image/bgindex.gif);margin:0px 10px 0px 10px}
        .but{background-color:#00BBBB;color:white;font-weight:700;font-size:16px;height:24px}
        .tdd{background-color:#ffffff;color:#000000;font-weight:600;font-size:16px}
        .h1{margin:6px 6px 6px 6px;text-align:center;background:#B0F549 url(http://web2.cis.desu.edu/tealeaman/image/header11.gif);color:#DDCC11;border:1px #b0b0b0 outset}
        h3{text-align:center;}
    </style>
    </head>
    <body>
<table  cellpadding="0" cellspacing="0" align=center>
<tr><td style="background:url(image/zz1.png) repeat-y" width=5></td>
<td bgcolor="#51E8C7">
 
   <table width="98%" align=center cellpadding="0" cellspacing="0" class=outset2 style="background:#B0f549 url(image/header11.gif);border:0px;border-radius:4px">
   <tr height=100>
     <td width=100 align=left>
        <img src="image/logoani.gif" height=100>
     </td>
     <td   align=center>
       <div   style="color:#DD1111;font-size:30px;font-weight:800">
       <nobr>&nbsp;<%=words[1]%>&nbsp;</nobr>
      </div>
      <br> <div style="color:#DD1111;font-size:20px;font-weight:700"><%=words[2]%></div>
   </td>
   </tr>
   </table>
 


   
   <table align="center"  style="border:1px #b0b0b0 solid;background-color:lightyellow;border-radius:4px"  >
   <tr><td><b>
   <%=words[38]%></td>
   <td>
   <select name="lang" onchange="changelanguage(this)">
   <option value="Chinese" <%=(lang.equals("Chinese")?"selected":"")%> ><%=words[37]%> </option>
   <option value="English" <%=(lang.equals("English")?"selected":"")%> ><%=words[0]%> </option>
   </select>
   </td> <td>&nbsp;&nbsp;&nbsp;</td>
   <td><b>
   <%=words[39]%></td>
   <td>
   <select name="switch" onchange="showlogin(this)">
   <option value="0" <%=(teacher?"":"selected")%> ><%=words[29]%></option>
   <option value="1" <%=(teacher?"selected":"")%>   ><%=words[27]%>  </option>
   </select>
   </td>
   <tr></table>
   

    <form rel=opener name="f" action="<%=thisurl%>" style="margin:0px 0px 0px 0px"
        enctype="multipart/form-data"
        target="resultwn"
        method="post"
        onsubmit="return valid(this)">

   
   <table   align="center" style="background:url(image/header3.gif);border:1px #b0b0b0 solid;margin:5px 10px 5px 10px;border-radius:4px" >

   <%
    for (int j =0; j < phrase.length && phrase[j].equals("")==false; j++)
    {
         out.println("<tr><td valign=top><div style=color:black align=center onclick=color(this)><b>" + (1+j) + "</div></td><td align=left>" + phrase[j] + "</td></tr>");
         if (j==0)
         out.println("<tr><td valign=top></td><td><textarea name=\"sentence\" rows=3 cols=40></textarea></td></tr>");
    }
   %>
   <tr><td></td><td>


      <table align="center" style="border:1px #b0b0b0 solid;border-radius:4px">
         <tr> <td  align="left" ><b><%=words[5]%></td><td align="left"  ><input type="file" name="path" size="40"></td></tr>
        <tr> <td  align="left" ><b><%=words[3]%></td><td  align="left" ><input name="sname">
               <!--tr><td width="25">&nbsp;</td><td valign="top"><%=words[4]%></td><td></td></tr-->
                 <input type="submit" class="but" name="s" class="submit" value="<%=words[6]%>"> </td></tr>
      </table>
  </td></tr>
  </table>
  
   </form>

    <div id="teacher" style="position:absolute;visibility:hidden;padding:5px 5px 5px 5px;border:2px #b0b0b0 outset;background-color:yellow">
   <center><form rel=opener name="f3" method="post" action="<%=thisurl%>" target="resultwn" onsubmit="return go()">
   <input type="hidden" name="x" value="ut"><input type="hidden" name="file" value="">
   <textarea id="tt" name="text" style="width:300px;height:200px"></textarea><br>
   <input type="submit" class="but" name="submit" value="<%=words[6]%>" >
   <input type="button" class="but" name="submit2" value="<%=words[30]%>" onclick="cls()">
   </form></center>
   </div>



   <div id="student" style="position:absolute;visibility:hidden;width:310px;padding:5px 5px 5px 5px;border:2px #b0b0b0 outset;background-color:yellow">
   <form rel=opener name="f4" method="post" action="<%=thisurl%>"  target="resultwn"  onsubmit="return go()">
    <table cellpadding=0 cellspacing=0><tr height="150px"><td id="comment" align="left" valign="top" >&nbsp;</td>
   </tr><tr><td><textarea id="st" name="text" style="width:300px;height:50px"></textarea>
   </td></tr><tr><td align="center"><input type="hidden" name="x" value="us">
   <input type="hidden" name="file" value=""><input type="submit" class="but" name="submit1" value="<%=words[6]%>">
   <input type="button" class="but" name="submit3" value="<%=words[30]%>" onclick="cls()">
   </td></tr></table></form>
   </div>

 <div id="loginwin"  style="position:absolute;visibility:hidden;width:202px;height:100px;padding:10px 10px 10px 10px;border:2px #b0b0b0 outset;background-color:yellow">
    <form rel=opener name="f1" method="post" action="<%=thisurl%>" target="resultwn">
    <center><span id="loginerr" style="color:red;">&nbsp;</span>
    <br><input type="hidden" name="x" value="l"><%=words[20]%>&nbsp;<input type="password" name="password" size="9">
    <br>
    <input type="submit" class="but" name="submit"   value="<%=words[21]%>"
    ><input type="button" class="but" name="cencel"   value="<%=words[28]%>" onclick="goback();hidelogin('loginwin')">
    </center></form>
 </div>

 <div id="calwin"  style="position:absolute;visibility:hidden;padding:10px 10px 10px 10px;border:2px #b0b0b0 outset;background-color:yellow">
    <form rel=opener name="f5"  >
    <div id="recalerr" style="color:red;">&nbsp;</div>
    <table align="center">
    <tr><td><nobr><%=words[44]%></nobr></td><td><input name="max"   size="2"> </td></tr>
  <tr><td><nobr><%=words[43]%></nobr></td><td><input name="scale" size="2"> </td></tr>
    <tr><td align="center" colspan="2">
    <input type="button" class="but" name="recalb"   value="<%=words[4]%>"   onclick="recal()">
    <input type="button" class="but" name="cencel"   value="<%=words[28]%>" onclick="hidelogin('calwin')">
    </td></tr>
    </table>
    </form>
 </div>
   <br>
   <center><span style="border:1px #b0b0b0 solid;background-color:lightyellow;font-size:20px;font-weight:700"><%=words[35]%></span></center>
   <br>
    
   <table align="center" style="border:1px #b0b0b0 solid;background:url(image/header3.gif);border-radius:4px" width="98%">
      <tr><td align="center">


   <form rel=opener name="f2" style="margin:0px 0px 0px 0px" method="post" action="<%=thisurl%>"  onsubmit="return validsel(this)">
   <table align="center"  style="border:1px #b0b0b0 solid;border-radius:4px"  >
   <tr><td ><b>
   <%=words[8]%></td>
   <td><input name="sname" size="7"></td>
   <td><b><%=words[33]%></td><td><input name="after" size="7"  value="<%=after1%>"></td>
   <td><b><%=words[32]%></td><td><input name="before" size="7" value="<%=before1%>"></td>
   <td>
      <input type="hidden" name="lang" value="<%=lang%>">
      <input type="hidden" name="which" value="">
     <input type="submit" class="but" name="total"   style="visibility:hidden;width:1px"  value=""  onclick="choose(this)"

      ><input type="submit" class="but" name="search"  value="<%=words[25]%>"  onclick="choose(this)">
         </td>
   </tr>
   </table>
   </form>



   </td></tr>
   <tr><td>



   <table align="center" bgcolor="#c0c0c0" cellspacing="0" cellpadding="0"><tr><td>
   <table id="table" style="border:1px #b0b0b0 solid;border-radius:4px" cellspacing="1" cellpadding="0">
   <tr style="background:#ECDAED">
   <%
   String which = Toolbox.defaultParam(orgnum,request, ("which"), null);
   boolean total = which!=null && which.equals(words[40]);
   HashMap Q = null;
   if (total)Q = new HashMap(60);
   if (!total)
   {%>
           <td    width="40"><b><%=words[7]%></b></td>
           <td    width="60"><b><%=words[8]%></b></td>
           <td    width="60"><b><%=words[9]%></b></td>
           <td    width="60" colspan="2"><b><%=words[10]%></b></td>
           <td    width="60"><b><%=words[11]%></b></td>
           <td    width="60"><b><%=words[12]%></b></td>
           <td    width="120"><b><%=words[23]%></b></td>
           <td></td></tr>
    <%} else {%>
           <td    width="40"><b><%=words[7]%></b></td>
           <td    width="60"><b><%=words[8]%></b></td>
           <td    width="60"><b><%=words[41]%></b></td> 
           <td    width="60"><b><%=words[10]%></b></td>
           <td    width="60"><b><%=words[42]%></b></td>
           <td    width="60"><a href="javascript:showrecal()"><b><%=words[45]%></b></a></td></tr>
           </tr>
    <%}
   short max = 0;
   String aline;
   boolean goodone = true;
   try
   {
      BufferedReader br = new BufferedReader(new FileReader(install   + File.separator + "list.txt"));
      
      int j = 1;
      StringBuffer buf =new StringBuffer();
      while ((aline = br.readLine()) != null)
      {
          Submission  ss = new Submission(aline);
          if (ss.valid==false || ss.sname==null || ss.sfile==null ) continue;
           if (sname !=null && !sname.equals("") && !ss.sname.equals(sname))
             continue;
          if (ss.sfile.replaceFirst("\\..*","").compareTo(before) > 0)
             continue;
          if( ss.sfile.replaceFirst("\\..*","").compareTo(after) < 0 )
             continue;

            if (total)
               (new Srecord(ss)).inq(Q);
           else
            {
               buf.setLength(0);
               ss.tohtml(buf,j++);
               out.println(buf.toString());
            }
  
      }
      br.close();
      if (total)
      {
          java.util.Set<Object> e = Q.keySet();
          for (Object nm:e) 
          {
              Srecord y  =  (Srecord)(Q.get(nm));
              if (y.times > max)
                   max = y.times;
              buf.setLength(0);
              y.tohtml(buf, j++);
              out.println (buf.toString());
          }
      }
     }
     catch (IOException e)
     {
     }

   %>

   </table></td></tr></table>

   </td></tr></table>
 


   <script type="text/javascript" >
   var max = <%=max%>;
   var total = <%=""+total%>;
   var scale = 100;
   var newline = "<%=newline%>";
   var quts = "<%=quts%>";
   var handle = null, handle1;
  var tbl = document.getElementById("table");
   var div = document.getElementById("student");
   var txt = document.getElementById("st");
   function calcul(numtimes, scale)
   {
       for (var i=1; i < tbl.rows.length; i++)
         tbl.rows[i].cells[5].innerHTML
       = "" + Math.round(parseInt(tbl.rows[i].cells[4].innerHTML) * scale /numtimes/4);
   }
   if (total) calcul(max,scale);
   function recal()
   {
      var m = parseInt(document.f5.max.value);
      var vv = document.getElementById("recalerr");
      if ("" + m == 'NaN' || m < 1)
      {
         if (vv!=null) vv.innerHTML = ('<%=words[47]%>');
         document.f5.max.focus();
         return;
      }
      var n = parseInt(document.f5.scale.value);
      if ("" + n == 'NaN' || n < 1)
      {
         if (vv!=null) vv.innerHTML = ('<%=words[48]%>');
         document.f5.scale.focus();
         return;
      }
      if (vv!=null) vv.innerHTML = "&nbsp;";
      max = m;
      scale = n;
      calcul(m, n);
      document.getElementById("calwin").style.visibility = "hidden";
   }
   function showrecal()
   {
       var vv = document.getElementById("calwin");
       vv.style.visibility = "visible";
       vv.style.left = (thispagewidth()-140)/2 + "px";
       var pos = findposition(document.f2.search);
       vv.style.top  = (pos[1]-120)+ "px";
       document.f5.max.value = max;
       document.f5.scale.value = scale;
       document.f5.max.focus();
   }
   function choose(bt)
   {
      document.f2.which.value = bt.value;
   }
   function changelanguage(sel)
   {
      document.f2.lang.value = sel.options[sel.selectedIndex].value;
       
      visual(document.f2);
document.f2.submit();
   }

   function findposition( oElement )
{

  if (oElement==null) return [0,0];
  if( typeof( oElement.offsetParent ) != 'undefined' )
  {
    var originalElement = oElement;
    for( var  posY = 0,posX=0; oElement; oElement = oElement.offsetParent )
    {
      posY += oElement.offsetTop;
      posX += oElement.offsetLeft;
      if( oElement != originalElement && oElement !=  document.body && oElement !=  document.documentElement )
      {
          posY -= oElement.scrollTop;
          posX -= oElement.scrollLeft;
      }
    }
    return  [posX, posY];
  }
  else
  {
    return  [oElement.x, oElement.y];
  }
}

   var pos = findposition(document.f2.search);
   function switchlang(sel)
   {

   }
   function valid(f)
   {

       if (f.sname.value.length < 2){alert('<%=words[16]%>'); f.sname.focus();return false;}
       if (f.sentence.value.length < 2){alert('<%=words[24]%>'); f.sentence.focus();return false;}
       f.sentence.value = f.sentence.value.replace(/<%=quts%>/g, '').replace(/<%=squt%>/g, '').replace(/<%=newline%>/g, '');
       if (f.sentence.value.length >400){alert('Too long'); f.sentence.focus();return false;}

       if (f.path.value.length < 2){alert('<%=words[17]%>'); f.path.focus();return false;}
       localStorage["myname"] = f.sname.value;
       f.sentence.value = f.sentence.value.replace(/\n/g, " ");
       //handle = window.open("", "resultwn", "toolbar=0,menubar=0,left=200,top=200,width=300,height=250");
       var tt = f.sname.value.split(/[ ]+/);
       f.sname.value = '';
       for (var i=0; i < tt.length; i++)
         f.sname.value += tt[i].charAt(0).toUpperCase() + tt[i].substring(1);
       return true;
   }
   function validsel(f)
   {
      var b = f.before.value.match(/[0-9][0-9].[0-9][0-9].[0-9][0-9]/);

      if ( b == null || b.length>1)
      {
         alert("<%=words[26]%>");
         f.before.focus();
         return false;
      }
      b = f.after.value.match(/[0-9][0-9].[0-9][0-9].[0-9][0-9]/);

      if ( b == null || b.length>1)
      {
         alert("<%=words[26]%>");
         f.after.focus();
         return false;
      }
      if (f.which.value=='<%=words[40]%>' && teacher==false)
      {
         if (f.sname.value=='')
         {
            if (document.f.sname.value!='')
            {
               f.sname.value=document.f.sname.value;
            }
            else
            {
               alert('<%=words[16]%>');
               f.sname.focus();
               return false;
            }
  }
  }

      return true;

   }
   var colors = new Array();
   function color(td)
   {
      if (td.style.color != "lightyellow")
      {
         td.style.color = "lightyellow";
         td.style.backgroundColor = "black";
      }
      else
      {
          td.style.backgroundColor = "lightyellow";
          td.style.color = "black";
      }
   }
   function open1(str)
   {
       self.moveTo(0,150);
       resizeTo(screen.width - 400,screen.height - 150);
       handler1 = open(str,'_blank','left='+ (screen.width - 480) + ',top=0,width=480,height=600');
   }
   function quotefree(str)
   {
      return str.replace(/'/g, '<%=squt%>').replace(/"/g,quts);
   }
   function quoteback(str)
   {
      return str.replace(/<%=squt%>/g, "'").replace(/<%=quts%>/g, '"');
   }
   function syn(sname, sfile, text)
   {

      var j = tbl.rows.length;
      var tr = tbl.insertRow(-1);
//0
      var td = tr.insertCell(-1);
      td.innerHTML = "" + j;
      td.align = "right";

      td = tr.insertCell(-1);
      td.innerHTML =   sname;
      td.align = "left";
//2
      td = tr.insertCell(-1);
      td.innerHTML = "<a href=javascript:listen(" + j +")><%=words[13]%><a>";

      td = tr.insertCell(-1);
      td.innerHTML =  "<a href=javascript:favor("
           + j +")><%=words[14]%></a>";
//4
      td = tr.insertCell(-1);
      td.innerHTML =  "0";
      td.align = "right";

      td = tr.insertCell(-1);
      td.innerHTML =  "<a href=\"javascript:comment(" + j + ",'"
           + quotefree(text) +"')\"><%=words[15]%></a>";
//6
      td = tr.insertCell(-1);
      td.innerHTML = "&nbsp;";
//7
      td = tr.insertCell(-1);
      td.innerHTML = sfile;

      td = tr.insertCell(-1);
      td.innerHTML = "";
      for (var i=0; i <9; i++) tr.cells[i].className = "tdd";
   }

   function login(bt)
   {

   }
   function loginout()
   {
      return true;
   }
   function listen(j)
   {
      var cel = tbl.rows[j].cells[2];
      cel.innerHTML = "<embed src=\"<%=thisurl%>?x=w&file=" + tbl.rows[j].cells[7].innerHTML +"\" loop=false autostart=true height=25px width=100px />"
   }
   function del(j)
   {
      if (confirm("Delete this item?"))
      open("<%=thisurl%>?x=d&file=" + tbl.rows[j].cells[7].innerHTML, "resultwn");
   }
   function favor(j)
   {

      var cel = tbl.rows[j].cells[4];

      var i = parseInt(cel.innerHTML) + 1;
      cel.innerHTML = "" + i;
      open("<%=thisurl%>?x=s&file=" + tbl.rows[j].cells[7].innerHTML +"&ups=" + i, "resultwn");
      tbl.rows[j].cells[3].innerHTML = "";
   }
   var teacher = false;
   function setteacher(b)
   {

      teacher=b;
      hidelogin('loginwin');
      if (b)
      {
         div = document.getElementById("teacher");
         txt = document.getElementById("tt");
         var dw = document.getElementById("downwords");
         if (dw!=null) dw.innerHTML  = "<a href=\"<%=thisurl%>?x=w&file=list.txt\"><%=words[49]%></a>&nbsp;<a href=\"<%=thisurl%>?x=w&file=Chinese.txt\">Chinese</a>&nbsp;<a href=\"<%=thisurl%>?x=w&file=English.txt\">English</a>";
         var n = tbl.rows.length;
         if (total==false)
         { 
         for (var i=1; i < n; i++)
         {
            var cel = tbl.rows[i].cells[6];
            var y = cel.innerHTML;
            var z = "<select onchange=grade(this," + i +")>";
            <%for (int k=0; k < 5; k++){%>
            z += "<option value="
               + <%=k%>
               + " "
               + ((y != '<%=grades[k]%>')?'':'selected')
               + "><%= (k==0)?"":grades[k]%></option>";
            <%}%>
            cel.innerHTML = z + "</select>";
            cel = tbl.rows[i].cells[8];
            cel.innerHTML = "<nobr><a href=javascript:del(" + i +")><%=words[31]%></a></nobr>";
         }
         tbl.rows[0].cells[7].innerHTML = "<b><%=words[31]%>";
         }
         document.getElementById('loginerr').innerHTML = "&nbsp;";
         document.f2.total.value="<%=words[40]%>";
         document.f2.total.style.visibility = "visible";
         document.f2.total.style.width = document.f2.search.offsetWidth +"px";
      }
      else
      {
         document.f2.total.value="";
         document.f2.total.style.visibility = "hidden";
         document.f2.total.style.width = "2px";         div = document.getElementById("student");
         txt = document.getElementById("tt");
         var dw = document.getElementById("downwords");
         if (dw!=null) dw.innerHTML  = "";
         var n = tbl.rows.length;
         if (total==false)
         {
         for (var i=1; i < n; i++)
         {
            var cel = tbl.rows[i].cells[6];
            var y = cel.childNodes[0].selectedIndex;

            <%for (int k=0; k < 5; k++){%>
             if(y == <%=k%>)
                cel.innerHTML = '<%=grades[k]%>';
            <%}%>
            cel = tbl.rows[i].cells[8];
            cel.innerHTML = "";
         }
         tbl.rows[0].cells[7].innerHTML = "";
         }
      }
   }

   function notpass(){ document.getElementById('loginerr').innerHTML =  ("<%=words[18]%>" ); }
   function grade(sel,j)
   {
       if (teacher==false) return;
       var i = sel.selectedIndex;
       open("<%=thisurl%>?x=s&file=" + tbl.rows[j].cells[7].innerHTML +"&grade=" + sel.options[i].value, "resultwn");
   }
   var thispagewidth = function()
{
     var wd = screen.width;
     if (typeof (self.innerWidth) != 'undefined')
     {
       wd = self.innerWidth ;
     }
     else
     {
       wd = document.body.offsetWidth ;
     }
     return wd;
}

var thispageheight = function()
{
     var het = screen.height;
     if (typeof (self.innerHeight) != 'undefined')
     {
         het= self.innerHeight ;
     }
     else
     {
         het= document.body.offsetHeight ;
     }
     return het;
}
   var filename = "";
   function comment(j,text)
   {
       var yourname = document.f.sname.value;
       if (yourname=='' && !teacher)
       {
          alert('<%=words[16]%>');
          document.f.sname.focus();
          return;
       }
       filename = tbl.rows[j].cells[7].innerHTML;
       div.style.visibility = 'visible';
       var lt =  Math.floor((thispagewidth() - div.offsetWidth)/2);
       if (lt < 0) lt = 0;

       div.style.left = "" + lt +"px";
       var pos = findposition(tbl.rows[j].cells[4]);
       lt = pos[1] - 100;
       div.style.top = "" + lt +"px";
       var yourname = document.f.sname.value;
       if (teacher)
       {
           if (yourname == '')
           {
             yourname = "<%=words[27]%>";
           }
           txt.value = quoteback(text.replace(/<%=newline%>/g, "\n")) + "\n" + yourname +  ": ";
           txt.focus();
       }
       else
       {
           document.getElementById("comment").innerHTML = quoteback(text.replace(/<%=newline%>/g, "<br>"));
           txt.value =   yourname +  ": ";

       }

   }

   function textsyn(f)
   {
      var tt = "";
      if (teacher)
       {
          tt = txt.value.replace(/\n/g,  newline);
       }
       else
       {

          tt = document.getElementById("comment").innerHTML.replace(/<br>/g, newline)
          +  newline  + txt.value.replace(/\n/g, newline);
          txt.value = "";
       }
       div.style.visibility = "hidden";
       for (var k=1; k < tbl.rows.length; k++)
        if (tbl.rows[k].cells[7].innerHTML == f)
          {
             tbl.rows[k].cells[5].innerHTML =  "<a href=\"javascript:comment(" + k + ",'"
                + quotefree(tt) +"')\"><%=words[15]%></a>";
          }
   }
   function cls()
   {
       div.style.visibility = "hidden";
   }

   function delsyn(f)
   {
      for (var j =1; j < tbl.rows.length; j++)
        if (tbl.rows[j].cells[7].innerHTML == f)
           tbl.deleteRow(j);
   }
   function go()
   {
       txt.value = txt.value.replace(/<%=newline%>/g,"").replace(/<%=quts%>/g,'').replace(/<%=squt%>/g,'');
       
       if (teacher)
       {
  document.f3.file.value = filename;
       }
       else
       {
          if (txt.value.length > 200)
          {
             alert('Too long. Comment length < 200');
             return false;
          }
          document.f4.file.value = filename;
       }
       return true;
   }
   function hidelogin(str)
   {
      var vv = document.getElementById(str);
      document.getElementById('loginerr').innerHTML = "";
      vv.style.visibility = "hidden";
   }
   var sele = null;
   function goback(){sele.selectedIndex = 0;}
   function showlogin(sel)
   {
       sele = sel;
       if (sel.selectedIndex==0)
       {
           open("<%=thisurl%>?x=x","resultwn");
       }
       else
       {
       var vv = document.getElementById("loginwin");
       vv.style.visibility = "visible";
       vv.style.left = (thispagewidth()-200)/2 + "px";
       vv.style.top  =  "100px";
       document.f1.password.focus();
       }
   }

   function err(str){alert(str);}
   function resiz(){document.f.sentence.style.width = "" + (thispagewidth() - 90) + "px";}
   resiz();
   onresize = resiz;
    
 

 
var myname = localStorage["myname"];
if (myname!=null)
   document.f.sname.value = myname;
for (var k =1; k < tbl.rows.length; k++)
   for (var j=0; j < tbl.rows[1].cells.length; j++)
    tbl.rows[k].cells[j].className = "tdd";
 <% if (teacher){%> setteacher(true);<%}%>
   </script>

   
 </td><td   width=5></td></tr> 
 
    <tr height="40" bgcolor="#51E8C7">
        <td   width=5></td>
       <td >
       <table width="100%" style=";border-radius:4px" >
         <tr>
         <td id="downwords"  >
          <%if (teacher){%><a href="<%=thisurl%>?x=w&file=list.txt"><%=words[49]%></a>&nbsp;
          <a href="<%=thisurl%>?x=w&file=Chinese.txt">Chinese</a>&nbsp;<a href="<%=thisurl%>?x=w&file=English.txt">English</a><%}%>
         </td>
         <td valign="middle"><%=words[36]%></td>
         <td><iframe name="resultwn" width="280" height="24px" scrolling="no" style="border:0px;margin:0px 0px 0px 0px" /></td>
         </tr>
       </table>
       </td> 
       <td   width=5></td>
    </tr>
 </table>
</body>
</html>