<%@ page contentType="text/html; charset=utf-8" import="java.util.concurrent.*, telaman.*,java.sql.*,java.util.*,java.math.*,java.util.regex.*,java.io.*"%>
<%!
boolean ismulti(String s,int orgnum)
{
        String r = "[\r|\n][a-z|A-Z][ |\\.|\\)|:|\\\\";
        if (!Toolbox.langs[orgnum>>16].equals("en"))
        {   
            String str = Toolbox.emsgs(orgnum, 1556);
            for (int i=0; i < str.length(); i++)
               if (r.indexOf(str.charAt(i))<0) 
                   r += "|" + str.charAt(i);
        }
        r += "]";
        Pattern p = Pattern.compile(r);
        Matcher m = p.matcher((CharSequence)s);
        int k=0, i=0;
        String ss = "";
        while(m.find(k))  
        {
                i = m.start(); 
                k = m.end(); 
                 
                ss += s.substring(1+i, k).replaceFirst(".?([a-z|A-Z]).*$", "$1").toLowerCase(); 
        }
       
        return ss.equals("ab") ||  ss.equals("abc") ||  ss.startsWith("abcd");
}
String eval1(String x, String b)
{
    String [] xs = x.split("\\+");
    float s = 0;
    for (String xx : xs)
        s += Float.parseFloat(xx);
    float bf = Float.parseFloat(b);
    if (s > bf && !b.equals("-1")) return b;
    else return ""+s;
}
 
String   borderstyle(int t,int r,int b,int l,int orgnum, String bcolor)
{
    String x = "padding:" + (t*5+3) + "px 2px " + (b*5+3) + "px 2px;px;background-color:#ffffff;font-family:inherit;border-color:" + bcolor +";border-top-width:" + t + "px;border-left-width:" + l + "px;border-bottom-width:" + b + "px;border-right-width:" + r + "px";
    if (t >0 && l > 0)
        x += ";border-top-left-radius:5px;-webkit-border-top-left-radius:5px;-moz-border-top-left-radius:5px";
    if (t > 0 && r > 0)
        x += ";border-top-right-radius:5px;-webkit-border-top-right-radius:5px;-moz-border-top-right-radius:5px";
    if (l > 0 && b > 0)
        x += ";border-bottom-left-radius:5px;-webkit-border-bottom-left-radius:5px;-moz-border-bottom-left-radius:5px";
    if (b > 0 && r > 0)
        x += ";border-bottom-right-radius:5px;-webkit-border-bottom-right-radius:5px;-moz-border-bottom-right-radius:5px";
    return x;
}

String  makesel(char fmt,int qora, int orgnum,CachedStyle cachedstyle)
 {
     String fmtops   = "<option value=0 " + ( fmt =='0'? "selected":"") + ">" +  Toolbox.emsgs(orgnum,214)+ "</option>"
                 + "<option value=1 " + ( fmt =='1'? "selected":"") + ">HTML</option>"
                 + "<option value=2 " + ( fmt =='2'? "selected":"") + ">LaTeXML</option>"
                 +  "<option value=3 " + ( fmt=='3'? "selected":"") + ">" + Toolbox.emsgs(orgnum,890) + "</option>"
                + "<option value=4  >" +  Toolbox.emsgs(orgnum,442) + "Tab</option>";
     fmtops =   "<select name=fmtbox" + qora+"  onchange=\"updatefmt1(this,'" + qora + "')\" class=gradetxt  style=\"border:1px #999999 solid;float:right;background-color:" + cachedstyle.TBGCOLOR + ";width:100px\" >" + fmtops + "</select>";
     return  fmtops;
 }

boolean goodip(javax.servlet.http.HttpServletRequest request, String ip)
{
 if (ip.equals("")) return true;
 String addr = request.getRemoteAddr();
 return (addr.indexOf(ip) >=0 );
}
 
String fields2(String str,int orgnum){
    return "<b><NOBR>" + str +"</NOBR></b>";
}

String fields2(int j, int orgnum)
{
   return  "<b><nobr>" + Toolbox.emsgs(orgnum,j) + "</nobr></b>" ;
}

static ConcurrentHashMap<String, String>[] grab = null; // new ConcurrentHashMap();

String canupdate(String x,String uid, int org)
{
    if (grab == null)
    {
        grab = new ConcurrentHashMap[Toolbox.dbadmin.length]; 
        for (int i=0; i < Toolbox.dbadmin.length; i++)
           grab[i] = new ConcurrentHashMap();
    }
    if (org%65536 > Toolbox.dbadmin.length) return null; 
    synchronized (grab[org%65536])
    {
        String  who = grab[org%65536].get(x);
        if (who == null)
        {
            grab[org%65536].put(x, uid);
            return null; 
        }
        return who;
    }
}
void delme(String x,int org )
{
    synchronized (grab[org%65536])
    {
        grab[org%65536].remove(x);
    }
}

String[] attach(String x, String subdb, String course, boolean question, int orgnum)
{
     if (  x == null || x.equals("") ) return new String[]{"",""};
     Encode6b encoder = new Encode6b(orgnum);
     String str = Toolbox1.unzip(x).replaceFirst(",$",""); 
     CSVParse parse = new CSVParse(str,'\'',new String[]{"@",","});
     String [][] ats = parse.nextMatrix();
     String atstr = "";
     HashMap<String,String> fn2code = new HashMap(3);  
     String q = "";
     for (int i=0;  i < ats.length; i++)
     {
         String xs[] = ats[i];
         String code = xs[xs.length-1];
         if ( xs[0].replaceAll("[0-9]","").equals("")  && code.replaceAll("[0-9]", "").length() > 2)
         {
 
            String ns[] = code.split("_");
            q += "div.imagelet" +  xs[0] + (course.equals("")? "" : ("_" + course)) 
              + "{background-image:url(FileOperation?did=" 
              + fn2code.get(xs[1]) + ");background-position:-" + ns[0] + "px -" + ns[1] + "px;width:" + ns[2] + "px;height:" + ns[3] + "px;}\n"; 
         }
         else
         {
             fn2code.put(xs[0], code); 
             String path = "";
             try{encoder.rto6b(code); }catch(Exception e){}
             path = path.replace('/', File.separatorChar ); 
             
                 try
                 {
                      if (code.toLowerCase().indexOf("http")== 0 && question==false)
                      {
                          atstr += " <span style=color:blue;cursor:pointer onclick=\"openproper('" + code + "','" + xs[0] + "',this)\" >" + xs[0] + "</span> "; 
                      }
                     else  if ( question == false && code.indexOf("_") == 0 ) 
                     {
                          atstr += " <span style=color:blue;cursor:pointer onclick=\"openproper('" + code + "','" + xs[0] + "',this)\" >" + xs[0] + "</span> "; 
                     }
                     else if ( question && (path.toLowerCase().contains(File.separator + "assignment" + File.separator) || path.toLowerCase().contains((File.separator +  Toolbox.emsgs(orgnum,1398).split(",")[1]+  File.separator).toLowerCase() ) ))
                         atstr += " <span style=color:blue;cursor:pointer onclick=\"openproper('" + code + "','" + xs[0] + "',this)\" >" + xs[0] + "</span> "; 
                 }catch(Exception e){ }
             
         }
        
    }     
    return new String[] {atstr,   q  };
}
String[] attachpic(String x, String subdb, String course, boolean question, int orgnum, int sid)
{
     if (  x == null || x.equals("") ) return new String[]{"",""};
     Encode6b encoder = new Encode6b(orgnum);
     String str = Toolbox1.unzip(x).replaceFirst(",$",""); 
     CSVParse parse = new CSVParse(str,'\'',new String[]{"@",","});
     String [][] ats = parse.nextMatrix();
     String atstr = "";
     HashMap<String,String> fn2code = new HashMap(3);  
     String q = "";
     String pic = "";
     String dvs = ""; 
     int ii = 0;
     for (int i=0;  i < ats.length; i++)
     {
         String xs[] = ats[i];
         String code = xs[xs.length-1];
         if ( xs[0].replaceAll("[0-9]","").equals("")  && code.replaceAll("[0-9]", "").length() > 2)
         {
            dvs += "[Imagelet" + xs[0] + "]"; 
            String ns[] = code.split("_");
            q += "div.imagelet" +  xs[0] + (course.equals("")? "" : ("_" + course)) 
              + "{background-image:url(FileOperation?did=" 
              + fn2code.get(xs[1]) + ");background-position:-" + ns[0] + "px -" + ns[1] + "px;width:" + ns[2] + "px;height:" + ns[3] + "px;}\n"; 
         }
         else
         {
             fn2code.put(xs[0], code); 
             String path = "";
             if (code.toLowerCase().indexOf("http")== 0)
         {
             atstr += " <span style=color:blue;cursor:pointer onclick=\"openproper('" + code + "','" + xs[0] + "',this)\" >" + xs[0] + "</span> "; 
            
         }
         else
             try
             {
                String picname = xs[0].toLowerCase();  
                if (picname.indexOf(".jpg")>0 || picname.indexOf(".png") >0 || picname.indexOf(".gif")>0) 
                    pic +=  "<img width=30 id=\"" + sid + "_" +   (ii) +   "\" src=\"image/clip.png\" style=border:0px   ><div  id=\"" + sid + "@" +   (ii++) +   "\" style=color:blue;display:inline;padding:0px onclick=\"loadclose(this,'" + code + "','" + xs[0] + "')\" >" + xs[0] + "&nbsp;&nbsp;</div>";
                else
                    atstr += " <span style=color:blue;cursor:pointer onclick=\"openproper('" + code + "','" + xs[0] + "',this)\" >" + xs[0] + "</span> "; 
             }catch(Exception e){ }
        }
    }     
    return new String[] {atstr,   q , pic, dvs };
}

String delanspart(String x)
{
   
    x = Toolbox1.unzip(x);
    
    x = x.replaceFirst(",$","");
  
    String [] xs = x.split(","); 
    String ans = "";
    for (int i=0; i < xs.length; i++)
    {
     
        if (xs[i].indexOf("@_") < 0)
          ans += xs[i] + ",";
    }
    return ans; 
} 

String maybeimg(String x,   boolean question, int orgnum)
{
     
     if (  x == null || x.equals("") ) return "";
     Encode6b encoder = new Encode6b(orgnum);
     
     String [] ats = Toolbox1.unzip(x).split(","); 
     String atstr = "";
     String q = "";
     HashMap<String,String> fn2code = new HashMap(3); 
     for (int i=0;  i < ats.length; i++)
     {
         String xs[] = ats[i].split("@");
         String fn = xs[0].replaceFirst("^.*\\.([^\\.]+)$", "$1").toLowerCase();
         
         
         String code = xs[2];
         if ( xs[0].replaceAll("[0-9]","").equals("")  && code.replaceAll("[0-9]", "").length() > 2)
         {
            String xx = fn2code.get(xs[1]); if (xx == null) continue;
            String ns[] = code.split("_");
            q += "div.imagelet" +  xs[0] 
              + "{background-image:url(FileOperation?did=" 
              + xx + ");background-position:-" + ns[0] + "px -" + ns[1] + "px;width:" + ns[2] + "px;height:" + ns[3] + "px;}\n"; 
            
            continue;
         }
         if (!fn.equals("jpg") && !fn.equals("jepg") && !fn.equals("gif") && !fn.equals("png"))
         {
             continue;
         }
        
         
         
         String path = "";
         try
         {
             path = encoder.rto6b(code);
             path = path.replace('/', File.separatorChar ); 
             
             if ( question == false && code.indexOf("_") == 0 ) 
             {
                 atstr += "<img src=\"FileOperation?did=" + code + "\" ><br>"; 
                  fn2code.put(xs[0], code); 
             }
             else if ( question && (path.indexOf(File.separator +  Toolbox.emsgs(orgnum,537)+  File.separator) >=0 || path.indexOf(File.separator + "assignment"+  File.separator) >=0)) 
             {
                 atstr += "<img src=\"FileOperation?did=" + code + "\" ><br>"; 
                  fn2code.put(xs[0], code); 
             }
         }catch(Exception e){}
     }
     if (!q.equals("")) atstr = "<style>" + q + "</style>" + atstr.replaceAll("\\[Imagelet([0-9]+)\\]", "<table style=display:inline><tr><td><div class=imagelet$1></div></td></tr></table>");
     return atstr;
}

void nums(String allmyquestion,String questionnum, int fs, int orgnum, String [] numarr,CachedStyle cachedstyle)
{
     
   String allmyquestionarr[] = allmyquestion.replaceFirst("^,","").replaceFirst(",$","").split(",");
   
   String numstr = "<table id=numqstr style=margin-bottom:0px; ><tr>";
   String numstr1 = "";
   String nextone = ""; 
   for (int  la=0; la < allmyquestionarr.length; la++)
   {
       if (nextone.equals(" "))
           nextone = allmyquestionarr[la];            
       if (allmyquestionarr[la].equals(questionnum))
       {
           nextone = " ";
           numstr1 += "<td><a href=javascript:toquestion(" + allmyquestionarr[la] + ")><b>" +  allmyquestionarr[la]  + "</b></a></td>";
           numstr += "<td><div style=\"margin:0px 0px 0px 0px;vertical-align:middle;text-align:center;width:" + (fs +4) + "px;height:" + (fs+4) + "px;border-radius:" + (fs/2+2) + "px;background-color:" + cachedstyle.IBGCOLOR + ";color:#ddcc11;font-family:inherit;font-weight:700;font-size:18px\"  onclick=toquestion(" + allmyquestionarr[la] + ")>" + allmyquestionarr[la] + "</div></td>";
       }
       else
       {      
           numstr += "<td><a href=javascript:toquestion(" + allmyquestionarr[la] + ")>" +  allmyquestionarr[la]  + "</a></td>";
           numstr1 += "<td><a href=javascript:toquestion(" + allmyquestionarr[la] + ")>" +  allmyquestionarr[la]  + "</a></td>";
       }
      
   }
   if (allmyquestionarr.length>1 && (nextone.equals(" ")))
      nextone = allmyquestionarr[0]; 
   if (!nextone.equals("") && !nextone.equals(" "))
   numstr1 = "<table id=numqstr1 style=margin-bottom:0px><tr><td><INPUT type=button id=nextbtn onclick=\"toquestion(" + nextone+ ")\" class=OrangeButton style=width:" + (4.5*fs) + "px ></td>" + numstr1;
   numstr1 +="</tr></table>";        
   numstr +="</tr></table>";
   numarr[0] = numstr;
   numarr[1] = numstr1;
}
%>
<% 
int orgnum = Toolbox.setcharset(request, response);
if (orgnum == -1)
{
     
    return;
}
  
User user = null;
if ( (user = User.authorize(orgnum, Systemroles.TA |Systemroles.ASSESSER | Systemroles.INSTRUCTOR | Systemroles.TEACHINGADMIN | Systemroles.SYSTEMANALYST, application, session, request, response, "gradingQuestion.jsp", true)) == null) 
{
    return;
} 
CachedStyle cachedstyle = new  CachedStyle(request, orgnum); 
long tstmp = System.currentTimeMillis() % 10000000; 
String imgletq[]=null;
String imgleta[]=null;
String scal = "-1";
long l = System.currentTimeMillis() / 1000;
String course = Toolbox.defaultParam(orgnum,request, "course", "",   "-_.", 30);
boolean freeform = false;
String needsave = "false";
if (course.equals("")) 
{
    course = Toolbox.defaultParam(orgnum,request, "CourseId", "",   "-_.", 30);
    if (course.equals("")) 
    {
     %>
    <!DOCTYPE html> <html lang="<%=Toolbox.langs[orgnum>>16]%>" > <head>
            <%=Toolbox.getMeta(orgnum)  %></head>
     <body><%=Toolbox.emsgs(orgnum,1563)%></body></html>
     <%
     return;
        
    }
}
String DBGCOLOR=cachedstyle.DBGCOLOR;
String IBGCOLOR=cachedstyle.IBGCOLOR;
String BBGCOLOR=cachedstyle.BBGCOLOR;
String TBGCOLOR=cachedstyle.TBGCOLOR;

String sessionname = Toolbox.defaultParam(orgnum,request, "sessionname", "", ",-.", 300);
if (sessionname.equals("")) 
    sessionname = Toolbox.defaultParam(orgnum,request, "Sessions", "", ",-.", 300);
if (sessionname.equals("")) 
    sessionname = Toolbox.defaultParam(orgnum,request, "Session", "", ",-.", 300);
if (sessionname.equals("")) 
{ %>
<!DOCTYPE html> <html lang="<%=Toolbox.langs[orgnum>>16]%>" > 
<head>
        <%=Toolbox.getMeta(orgnum)  %>
</head>
<body>
    <%=Toolbox.emsgs(orgnum,1035) + " "+ Toolbox.emsgs(orgnum,13)%>
</body>
</html>
<%
return;
}
 
String semester1 = request.getParameter("Semester");
String semester = Toolbox.defaultParam(orgnum,request, "Semester", Toolbox.dbadmin[orgnum%65536].currentSemester, null, 30);
String subdb = Toolbox.defaultParam(orgnum,request, "subdb", user.id, null, 30);
user.changedb(subdb);
JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
if (!adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
    return;
}
String outcome =  Toolbox.defaultParam(orgnum,request, "outcome", null, null, 2);
 
if (outcome!=null)
{ 
     String sql = "select name,atype,assess,question,attach,format FROM Assignment WHERE course='" + course + "'  "
     + " AND (Assignment.sessionname ='" + sessionname  + "' OR Assignment.sessionname LIKE '%," + sessionname  + "' OR Assignment.sessionname  LIKE '" + sessionname  + ",%' OR Assignment.sessionname LIKE '%," + sessionname  + ",%') "
     + " AND semester='" + semester + "'"; 
     boolean bb = adapter.executeQuery2(sql,false);
     String name = Toolbox.emsgs(orgnum,223),atype,assess; 
     StringBuffer xx = new StringBuffer(""); 
     StringBuffer yy = new StringBuffer("<div class=outset3 style=\"background-color:white;border:1px #888888 solid;margin:5px 3px 3px 3px;border-color:#999999;border-radius:4px;\"><table border=1 cellspacing=1 cellpadding=3 style=\"border-collapse:collapse;\" ><tr style=background:linear-gradient(" + BBGCOLOR + "," + TBGCOLOR + ")><td valign=top align=left><nobr>" 
+ name + "</nobr></td><td  valign=top  align=right>#</td><td  align=left><nobr>" + Toolbox.emsgs(orgnum,50) + "</nobr></td><td  valign=top  align=center><script>document.write('<nobr>'+textmsg[139] +'</nobr>');</script></td></tr>"); 
     for (int i=0; (name=adapter.getValueAt(i,0))!=null; i++)
    {
        atype = adapter.getValueAt(i,1);
        assess = adapter.getValueAt(i,2);
        if (assess==null || assess.equals("")) continue;
        String question =  adapter.getValueAt(i,3);
        String questionarr[] = null;
        if (atype.equals("1") || atype.equals("3") || atype.equals("4"))
        {
            String delimiter = Assignment.separator(orgnum);
            Pattern pp = Pattern.compile(delimiter);
            questionarr  = Assignment.parse("\n"+ question, pp); 
        }
 
        String attach =  adapter.getValueAt(i,4);
        String format =  adapter.getValueAt(i,5);
        
        String [][]assessarr = (new CSVParse(assess,'|',new String[]{",",";"})).nextMatrix();
        for (int j=0; j < assessarr.length; j++)
        {
            if (assessarr[j]!=null && assessarr[j].length>2 && assessarr[j][2]!=null && ("," + assessarr[j][2].replaceAll(" ","") + ",").indexOf(","+outcome + ",")>=0)
            {
                  int qn = 0; try{ qn = Integer.parseInt(assessarr[j][0]);}catch(Exception e){} 
                  if (atype.equals("1") || atype.equals("3") || atype.equals("4"))
                  question = questionarr[qn];
                   
                  if (question!=null && !question.equals("")) question = Toolbox.formatstr(format, question);  
                  if (question!=null && !question.equals("")) question = Toolbox1.todiv(orgnum,question, -1);   
                  imgletq  = attach(attach ,subdb, "",true, orgnum) ;
                  if (imgletq!=null && imgletq[1]!=null && !imgletq[1].equals(""))
                     xx.append(imgletq[1]);
                  yy.append("<tr><td valign=top bgcolor=white align=left>" + name + "</td><td  valign=top  bgcolor=white  align=right>" + qn + "</td><td  bgcolor=white  align=left>" + question + "</td><td  valign=top  bgcolor=white  align=center><a href=javascript:opensubs('" + course + "','" +
                  sessionname + "','" + semester + "','" + name + "'," +  qn + ")>>></a></td></tr>");
            }
        }
    }
    yy.append("</table></div>");
   adapter.close();
    %>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head> 
<%=Toolbox.getMeta(orgnum) + Toolbox.jaxhead%>
<title><%=Toolbox.emsgs(orgnum,229)%></title>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<script  type=text/javascript>
<%= Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, 
securitytoken="<%=Toolbox.gentoken("gradingQuestion.jsp","f1")%>";
<%=Toolbox.someconsts(orgnum)%>
</script>
<script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script>
<script type=text/javascript  src=cookie.js></script>
<script type="text/javascript"> document.write(unifontstyle(<%=cachedstyle.fontsize%>));</script>
<style type="text/css">
 <%= xx.toString()%> 
 </style>
</head>
<body style="background-color:<%=IBGCOLOR%>">
<%=Toolbox.title(Toolbox.emsgs(orgnum,1578).replaceFirst("#", outcome))%>
 
 <%= yy.toString()%>
 <script>
 function opensubs(course,session,semester,name,qn)
 {
    var nms = ['subdb','securitytoken', 'orgnum', 'assignname','sessionname','course','questionnum','Semester','viewassess' ];
    var vls = [ '<%=subdb%>',  securitytoken,  orgnum,   name,  session,  course,qn,semester,'1' ];
    postopen('gradingQuestion.jsp', nms, vls, "_blank" );
 }
 </script>
 </body>
</html>
 <%
  return;
}

String viewassess = Toolbox.defaultParam(orgnum,request, "viewassess", null, null, 50);
String viewcolor = (viewassess==null?TBGCOLOR : "transparent");
String assignname = Toolbox.defaultParam(orgnum,request, "assignname", "", ",-_.'", 50);
if (assignname.equals(""))  
    assignname = Toolbox.defaultParam(orgnum,request, "Assigntest", "", ",-_.'", 50);

if ( assignname.equals("")) assignname = Toolbox.defaultParam(orgnum,request, "Name", "", null, 60);
if (assignname.equals(""))  
    assignname = Toolbox.defaultParam(orgnum,request, "AssignmentTest", "", ",-_.'", 50);
 
String questionnum  = Toolbox.defaultParam(orgnum,request, "questionnum", null, ",", 200);
int qn = -1;
try
{
   qn = Integer.parseInt(questionnum);

}
catch(Exception e){}
boolean hasquestion = true;
boolean hasanswer = true;

String assess  = Toolbox.defaultParam(orgnum,request, "assess", null);
String [] lab1s = Toolbox.emsgs(orgnum, 1561).split("@");

//0) Course,  1) AssignTest, 2) StudentId, 3) SubmitAt, 4) Score,  5)PhotoUrl,
//6) Content, 7) Comment, 8) due, 9) Format, 10) timesplit, 11) Attachment
//12.atype, 13 assess 14, AsAssess,15, question, 16, Answer, 
//17 Attachat,18 Scale, 19 Weight, 20 Sessions  21 Aformat
// + " AND ( status=0  or  status >=2 AND due <= " + (l+20) + ")  ";
 
String sql  = null;// "UPDATE Submission, Assignment SET grade=-1 WHERE Submission.course=Assignment.course AND Submission.assignname=Assignment.name AND Submission.semester=Assignment.semester AND Submission.grade<-1 AND Assignment.due <= " +  l;
String [] sessionarr = sessionname.split(",");
if (assignname.equals(""))
{
    String sql00 =  "SELECT  Submission.assignname,Submission.submtime FROM Registration LEFT JOIN Submission ON Registration.sid=Submission.sid AND Registration.courseid=Submission.course AND Submission.semester=Registration.semester"
    + " WHERE Registration.courseid='" + course +"'"
    + " AND Registration.semester='" + semester + "'"
    + " AND Submission.grade =-1" 
    + " AND (";  
    for (int ll=0; ll < sessionarr.length; ll++)
    { 
        if (ll>0) sql00 += " OR ";
        sql00 += "Registration.sessionname='" + sessionarr[ll] + "'";
    }
    sql00 += ") order by submtime";
    int nn = adapter.executeQuery(sql00);
    if (nn>0) 
        assignname = adapter.getValueAt(0,0);
    else
    {
     %>
<!DOCTYPE html> <html lang="<%=Toolbox.langs[orgnum>>16]%>" > 
<head>
    <%=Toolbox.getMeta(orgnum)  %>
</head>
<body>
<%=Toolbox.emsgs(orgnum,286)%> : <%=Toolbox.emsgs(orgnum,480)%><br>
<%=Toolbox.emsgs(orgnum,982)%> : <%=course%><br>
<%=Toolbox.emsgs(orgnum,1004)%>: <%=semester%><br>
<% 
    for (int ll=0; ll < sessionarr.length; ll++)
    { 
      out.println(Toolbox.emsgs(orgnum,233) +": " + sessionarr[ll]  +"<br>");
    }
   // out.println(sql00);
%>   
<font color=red><%=Toolbox.emsgs(orgnum,206)%> <%=Toolbox.emsgs(orgnum,286)%></font> 
</body>
</html>
     <%
     return;  
    }
}


String questiontext = Toolbox.defaultParam(orgnum, request, "questiontext", null);
String answertext = Toolbox.defaultParam(orgnum, request, "answertext", null);
 
if (questiontext != null || answertext!=null)
{
    String sid = Toolbox.defaultParam(orgnum, request, "sid", null);  
    if (sid != null && answertext!=null)
{
    StringBuilder sql11 = new StringBuilder("UPDATE Submission SET ");
    sql11.append(" content='");
    String text = answertext.trim().replaceAll("'", "''");
    sql11.append(text);
    sql11.append("'  WHERE  course='");   
    sql11.append(course);
    sql11.append("' AND  semester='"); 
    sql11.append(semester.replaceAll("'", "''"));  
    sql11.append("' AND assignname = '");
    sql11.append(assignname);
    sql11.append("' AND sid ='");
    sql11.append(sid);
    sql11.append("'");
System.out.println(sql11.toString());
    int n = adapter.executeUpdate(sql11.toString() ); 
    adapter.close();%>
    <!DOCTYPE html><html lang="<%=Toolbox.langs[orgnum>>16]%>" > 
<head>
    <%=Toolbox.getMeta(orgnum)  %>
</head> 
 <body>
     <script>
      parent.myprompt('OK. After saving the graded submissions, you can reload this question');
     </script>
 </body>
</html>
    <%
        return;
}
     String sql1 =  "SELECT question,answer FROM Assignment "
                + " WHERE Assignment.course='" + course + "'"
                + " AND Assignment.semester='" + semester.replaceAll("'", "''") + "'"
                + " AND Assignment.name = '" + assignname + "'"
                + " AND (Assignment.sessionname ='" + sessionname  + "' OR Assignment.sessionname LIKE '%," + sessionname  + "' OR Assignment.sessionname  LIKE '" + sessionname  + ",%' OR Assignment.sessionname LIKE '%," + sessionname  + ",%') ";
    boolean bb = adapter.executeQuery2(sql1,false);
    String text="";
    if (bb && ((text=adapter.getValueAt(0,0) )!=null || adapter.getValueAt(0,1)!=null ))
    {
        if (answertext!=null) text=adapter.getValueAt(0,1);
        String delimiter = Assignment.separator(orgnum);

        Pattern pp = Pattern.compile(delimiter);
        String q[] =  Assignment.parse("\n"+ text, pp);

       if (qn < 10000)
      {    
       qn = Integer.parseInt(questionnum); 

       if (q==null || qn  >= q.length) 
       {
            String questionarr1[] = new String[qn+1];
            int i=0;
            if (q !=null)
            for (  i=0; i < q.length; i++) 
               questionarr1[i] = q[i];
            for (; i < qn; i++) questionarr1[i] = "";
            q = questionarr1;  
       }
       q[qn] = (questiontext!=null ? questiontext:answertext).replaceAll("([\n])([0-9])", "$1 $2");
       text = q[0].trim(); 
       for (int k=1; k < q.length; k++)
          text += "\n\n" + k + ". " + q[k];
    }
    else if (questiontext!=null) {text = questiontext;} 
    else if (answertext  !=null) {text = answertext;} 

    StringBuilder sql11 = new StringBuilder("UPDATE Assignment SET ");
    if (questiontext!=null) 
        sql11.append(" question='");
    else 
        sql11.append(" answer='");
    if (qn >0) 
        text = text.trim().replaceAll("'", "''");
    sql11.append(text);
    sql11.append("'  WHERE Assignment.course='");   
    sql11.append(course);
    sql11.append("' AND Assignment.semester='"); 
    sql11.append(semester.replaceAll("'", "''"));  
    sql11.append("' AND Assignment.name = '");
    sql11.append(assignname);
    sql11.append("' AND (Assignment.sessionname ='");
    sql11.append(sessionname);
    sql11.append("' OR Assignment.sessionname LIKE '%,"); 
    sql11.append( sessionname);
    sql11.append("' OR Assignment.sessionname  LIKE '");
    sql11.append( sessionname);
    sql11.append(",%' OR Assignment.sessionname LIKE '%,"); 
    sql11.append(sessionname);
    sql11.append(",%')");
        int n = adapter.executeUpdate(sql11.toString() ); 
    if (n==1) n=0; else if (n==-1 || n==0) n=1;
           adapter.close();
         %>
<!DOCTYPE html><html lang="<%=Toolbox.langs[orgnum>>16]%>" > 
<head>
    <%=Toolbox.getMeta(orgnum)  %>
</head> 
 <body>
     <script>
<%  if (answertext==null && n==0){   %>
    parent.myprompt('<%=Toolbox.emsgs(orgnum,71+n)%>');
<%}%>
     </script>
 </body>
</html><%
    }
    else 
    {
        adapter.close();
        %>
<!DOCTYPE html><html lang="<%=Toolbox.langs[orgnum>>16]%>" > 
<head>
    <%=Toolbox.getMeta(orgnum)  %>
</head> 
<body>
    <script>parent.myprompt('<%=adapter.error()%>');</script>
</body>
</html><%

    }

    return;
} 

String status = null;
if (( status = Toolbox.defaultParam(orgnum, request, "status", null)) != null)
{
 
     String sql0  = "UPDATE  Assignment SET status=" + status + "   WHERE Assignment.course='" + course + "'"
                + " AND Assignment.semester='" + semester.replaceAll("'", "''") + "'"
                + " AND Assignment.name = '" + assignname + "'"
                + " AND (Assignment.sessionname ='" + sessionname  + "' OR Assignment.sessionname LIKE '%," + sessionname  + "' OR Assignment.sessionname  LIKE '" + sessionname  + ",%' OR Assignment.sessionname LIKE '%," + sessionname  + ",%') ";
     int n = adapter.executeUpdate(sql0);

     adapter.close();
     if (n==1) {%>
<!DOCTYPE html><html lang="<%=Toolbox.langs[orgnum>>16]%>" > 
<head>
    <%=Toolbox.getMeta(orgnum)  %>
</head> 
<body>
    <script>parent.changestatus2(<%=status%>);</script>
</body>
</html>
        <%}  
     else {%>
<!DOCTYPE html><html lang="<%=Toolbox.langs[orgnum>>16]%>" > 
<head>
    <%=Toolbox.getMeta(orgnum)  %>
</head> 
<body>
    <script>parent.changestatus2(<%= status.equals("3")?2:3 %>);</script>
</body>
</html>
        <%}  
     return;
}
else if (assess != null) 
{
    String sql0  = "UPDATE Submission, Assignment SET grade=-1 WHERE Submission.course=Assignment.course AND Submission.assignname=Assignment.name AND Submission.semester=Assignment.semester AND Submission.grade<-1 AND Assignment.due <= " +  l;
    //adapter.executeUpdate(sql0);
    boolean byquestion = (qn > -1);
    String[] q;
    CSVParse ap;
    String[] z;
    String formula = null;
    int NS = 0;
    StringBuffer missedsid = new StringBuffer();
    boolean firstround = true;
    StringBuffer savedsid = new StringBuffer(",");
  
    CSVParse sidassess = new CSVParse(assess, '\'', new String[]{",", ";"});
  

    while ((q = sidassess.nextRow()) != null) 
    {
        String who = canupdate(course + "#" + assignname + "#" + q[0], user.id, orgnum);
          
        if (who != null) 
        {
            missedsid.append("" + q[0] + ":" + who + ";");
            continue;
        }
        if (q.length<3) continue;
        boolean noqnop = q[1].equals("@");
        String sql1 = "";
         
        if (noqnop)
        {
             sql1 = "UPDATE Submission SET assess='" + q[3].replaceAll("'","''") + "', grade=" + q[2]  + (q.length>4?(", comment='" + q[4] + "' "):"")
                + " WHERE   Submission.course='" + course + "'"
                + " AND Submission.semester='" + semester.replaceAll("'", "''") + "'"
                + " AND Submission.assignname = '" + assignname + "'"
                + " AND sid='" + q[0] + "' AND Submission.grade>=-1";
            if (1 == adapter.executeUpdate(sql1)) 
            {
                NS++;
                savedsid.append(q[0] + ",");
            }
            else
            {
                 missedsid.append("" + q[0] + ":;");
            }
            delme(course + "#" + assignname + "#" + q[0], orgnum);
            continue; 
        }
        
        if (q[0]!=null && q[0].equals("")==false)
            sql1 = "SELECT  assess FROM Submission "
                + " WHERE   Submission.course='" + course + "'"
                + " AND Submission.semester='" + semester.replaceAll("'", "''") + "'"
                + " AND Submission.assignname = '" + assignname + "'"
                + " AND sid='" + q[0] + "' AND Submission.grade>=-1";
        else
            sql1 =  "SELECT  assess FROM Assignment "
                + " WHERE Assignment.course='" + course + "'"
                + " AND Assignment.semester='" + semester.replaceAll("'", "''") + "'"
                + " AND Assignment.name = '" + assignname + "'"
                + " AND (Assignment.sessionname ='" + sessionname  + "' OR Assignment.sessionname LIKE '%," + sessionname  + "' OR Assignment.sessionname  LIKE '" + sessionname  + ",%' OR Assignment.sessionname LIKE '%," + sessionname  + ",%') ";
        if (adapter.executeQuery2(sql1, false)) 
        {
            String oldassess = adapter.getValueAt(0, 0);
      
            ap = new CSVParse(oldassess, '|', new String[]{",", ";"});
            StringBuffer sf = new StringBuffer();
            float M=0;
            StringBuffer sortstr = new StringBuffer();
            if (byquestion) 
            {
                int dropn = 0;
                float S;
                String leas = "0";
                int Q = 0;
                String error = "";
                boolean hit  = false; 
                int Q1 = 0;
                StringBuffer allq = new StringBuffer();
                while ((z = ap.nextRow()) != null) 
                {
                    if (z.length == 7) 
                    {
                        Q1 = Integer.parseInt(z[0]);
                        dropn = Integer.parseInt(z[1]);
                        S = Float.parseFloat(z[2]);
                        formula = dropn + "|" + z[3];
                        leas = z[4];
                        M = Float.parseFloat(z[5]);
                        error = z[6];
                    } 
                    else if (z.length == 4) 
                    {
                        Q++;
                        if (z[0].equals(questionnum)) 
                        {
                            z[1] = q[1];
                            z[2] = q[2];
                            z[3] = q[3];
                            hit = true;
                        }
                        allq.append("," + z[0]);
                        sortstr.append("," + z[2]);
                        if (sf.length()>0)  sf.append(";");
                        sf.append(z[0] + "," + z[1] + "," + z[2] + "," + QuestAnswer.quote1(z[3])  );
                    }
                }
                if (hit==false)
                {
                    Q++;
                    allq.append("," + qn);
                    sortstr.append("," + q[1]);
                    if (sf.length()>0)  sf.append(";");
                    sf.append(questionnum + "," + q[1] + "," + q[2] + "," + QuestAnswer.quote1(q[3]) );
                }
                 
                String []sortarr = sortstr.substring(1).split(",");
                float []sorts = new float[sortarr.length];
                for (int r=0; r < sorts.length; r++)
                    sorts[r] = Float.parseFloat(sortarr[r]); 
                if (formula == null) {
                    String sql2 = "SELECT  options  FROM Assignment  "
                            + " WHERE   course ='" + course + "'"
                            + " AND  semester='" + semester.replaceAll("'", "''") + "'"
                            + " AND  sessionname = '" + sessionname + "'"
                            + " AND  name= '" + assignname + "'";
                    //  + " AND ( atype=1 OR atype=3 OR  atype=4)  ";
 
                    if (adapter.executeQuery2(sql2, false)) {
                        String optionstr = adapter.getValueAt(0, 0);
                        if (optionstr != null) {
                            AssOption assopt = new AssOption(optionstr, orgnum);
 
                            formula = (assopt).f;
                        }
                    }
                }
                if (Q1 > Q) Q = Q1;
                int EN = Q;
                if (formula == null) {
                    formula = "0|S";
                }
                float[] SM = new float[3];
                String err = Assignment.sumup(formula, sorts, Q, leas, EN, SM) + error;
                S = SM[0];
                M = SM[1];
                error = "";
                sf.append(";" +  Q + "," + formula.replaceFirst("[\\|].*", "") + "," + S + ",|" + formula.replaceFirst("[^\\|]+\\|", "") + "|," + leas + "," + M + ",|" + error + "|");
  
            }
            else
            {
               CSVParse X = new CSVParse(q[3], '|', new String[]{",", ";"});
               try{M =  Float.parseFloat(q[1]);}catch(Exception e1){} 
               String [][] tt= ap.nextMatrix(); 
               String [] w;
               while ((w = X.nextRow())!=null)
               {
                   if (w.length<2 || w[1]==null || w[1].equals("") || !w[1].replaceAll("[0-9|\\.]","").equals("") )continue;
                   if (sf.length()>0)  sf.append(";");
                   int ll=0;
                   if (tt==null) 
                       ll = -1;
                   else
                   for(; ll < tt.length; ll++)
                   {
                       if (tt[ll][0].equals(w[0])) break;
                   }
                   String ww = "";
                   if (ll>=0 && ll < tt.length && tt[ll].length > 3)
                       ww = tt[ll][3];
                   sf.append("|" + w[0] + "|,|" + w[1] + "|,|" + w[2] + "|,|" + ww.replaceAll("\\|", "||") + "|");
                   
                   if (ll>=0 && ll < tt.length && tt[ll].length > 4)
                   {
                       if (tt[ll][4]!=null)
                          sf.append( ",|" +   tt[ll][4].replaceAll("\\|", "||") + "|");
                       else 
                          sf.append( ",||"); 
                   }
                   if (ll>=0 && ll < tt.length && tt[ll].length > 5)
                   {
                       if (tt[ll][5]!=null)
                          sf.append( ",|" +   tt[ll][5].replaceAll("\\|", "||") + "|");
                       else 
                          sf.append( ",||"); 
                   }
               }
            }
            if (q[0]!=null && !q[0].equals(""))
            {
            sql1 =  "UPDATE Submission SET grade=" + M + (byquestion? (",assess='" + sf.toString().replaceAll("'", "''")
                    + "'"):(",assess='1,10," + M + ",|" + q[3].replaceAll("'","''").replaceAll("\\|","||") + "|' ")) +  (q.length>4?(", comment='" + q[4] + "' "):"") + " WHERE Submission.course='" + course + "'"
                    + " AND Submission.semester='" + semester.replaceAll("'", "''") + "'"
                    + " AND Submission.assignname = '" + assignname + "'"
                    + " AND sid='" + q[0] + "' AND grade>=-1";
 
            }
            else
               sql1 = "UPDATE Assignment SET assess='" + sf.toString().replaceAll("'", "''")
                    + "'  WHERE Assignment.course='" + course + "'"
                    + " AND Assignment.semester='" + semester.replaceAll("'", "''") + "'"
                    + " AND Assignment.name = '" + assignname + "'"
                    + " AND (Assignment.sessionname ='" + sessionname  + "' OR Assignment.sessionname LIKE '%," + sessionname  + "' OR Assignment.sessionname  LIKE '" + sessionname  + ",%' OR Assignment.sessionname LIKE '%," + sessionname  + ",%')";
       
            if (1 == adapter.executeUpdate(sql1)) 
            {
                NS++;
                if (q[0]!=null && !q[0].equals("")) 
                   savedsid.append(q[0] + ",");
                else
                   savedsid.append( "q,");
            }
           else
            {
                 missedsid.append("" + q[0] + ":;");
            }
             
        }
        
        delme(course + "#" + assignname + "#" + q[0], orgnum);

    }
    adapter.close();
%>
<!DOCTYPE html><html lang="<%=Toolbox.langs[orgnum>>16]%>" > 
<head>
    <%=Toolbox.getMeta(orgnum)  %>
</head>
<body>
    <script>parent.syn('<%= savedsid.toString() %>',<%=NS%>, '<%=missedsid%>');</script>
</body>
</html><%
    return;
}

String   sformat="",format = request.getParameter("format");
String whichformat = "assignment";
if (format!=null && request.getParameter("sid") != null)
{
    if (qn == -1) 
        whichformat = "noquestion";
    else 
        whichformat= "byquestion";
}
if (whichformat.equals("byquestion"))
{
    String [] q;
    CSVParse ap; 
    String [] z;
    String formula = null;
    int NS = 0;
    StringBuffer missedsid = new StringBuffer();
   
    StringBuffer savedsid = new StringBuffer(","); 
     
    String sid = Toolbox.defaultParam(orgnum, request, "sid", null, null, 20); 
    if (sid!=null)
    {
        String  who = canupdate(course + "#" + assignname + "##" + sid,user.id, orgnum);
       
        if (who==null) 
        {
       
        String sql1  = "SELECT content FROM Submission "
            + " WHERE   Submission.course='" + course +"'"
            + " AND Submission.semester='" + semester.replaceAll("'", "''") + "'"
            + " AND Submission.assignname = '" + assignname +"'"
            + " AND sid='" + sid + "'";
          
        if (adapter.executeQuery2(sql1,false))
        {
            String oldassess = adapter.getValueAt(0,0);
            ap = new CSVParse(oldassess, '\'',  new String[]{",","\r\n"} ); 
            StringBuffer sf = new StringBuffer();
            
            while ( (z = ap.nextRow())!=null)
            {
                
                if ( sf.length()>0 ) sf.append("\n");
                for (int j=0; j < z.length; j++)
                {
                   
                    if (z[0].equals(questionnum))
                    { if ( !format.equals("5")) 
                        z[3] = format;
                      else
                        z[1] = z[1].replaceAll("\t", "     ");
                    }
                    if (j==1 && (z[1].contains("\n") || z[1].contains("\r") || z[1].contains(",")))
                        sf.append("'" + z[1].replaceAll("'", "''") + "'");
                    else
                        sf.append(z[j]);
                    if (j < z.length-1) sf.append(",");

                }
            }
            
            sql1 =  "UPDATE  Submission SET content='" + sf.toString().replaceAll("'","''") 
            + "' WHERE Submission.course='" + course +"'"
            + " AND Submission.semester='" + semester.replaceAll("'", "''") + "'"
            + " AND Submission.assignname = '" + assignname +"'"
            + " AND sid='" + sid + "'";
            if (1==adapter.executeUpdate(sql1)){ NS++;savedsid.append(sid + "," );}
        }
        
        delme(course + "#" + assignname + "##" + sid,orgnum);
     }
  }
  adapter.close();  
%><!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>" > 
<head>
    <%=Toolbox.getMeta(orgnum)  %>
</head>
<body>
    <script>parent.syn("<%=Generic.handle(adapter.error())%>");</script>
</body>
</html><% 
   return;
}
else if (whichformat.equals("noquestion"))
{
   
    StringBuffer missedsid = new StringBuffer();
    StringBuffer savedsid = new StringBuffer(","); 
    String sid = Toolbox.defaultParam(orgnum, request, "sid", null, null, 20); 
    if (sid!=null)
    {
        String  who = canupdate(course + "#" + assignname + "##" + sid,user.id, orgnum);
       
        if (who==null) 
        {
            String  sql1 =  "UPDATE  Submission SET format='" + format 
            + "' WHERE Submission.course='" + course +"'"
            + " AND Submission.semester='" + semester.replaceAll("'", "''") + "'"
            + " AND Submission.assignname = '" + assignname +"'"
            + " AND sid='" + sid + "'";
            if (1==adapter.executeUpdate(sql1)){  savedsid.append(sid + "," );}
            delme(course + "#" + assignname + "##" + sid,orgnum);
        }
    }
    adapter.close();  
%><!DOCTYPE html><html lang="<%=Toolbox.langs[orgnum>>16]%>" > 
<head>
    <%=Toolbox.getMeta(orgnum)  %>
</head><body><script>parent.syn("<%=Generic.handle(adapter.error())%>");</script> </body></html><% 
    return;
}

String sql0 = "SELECT  name, course, atype, assess,grader, timesplit, "
            + "question, answer, attach, scale, weight, sessionname,  format,due,status,options   FROM Assignment  "
            + " WHERE   course ='" + course +"'"
            + " AND  semester='" + semester.replaceAll("'", "''") + "'"
            + " AND  sessionname = '" + sessionname +"'"
            + " AND  name= '" + assignname +"'";
           // + " AND ( atype=1 OR atype=3 OR  atype=4)  ";
 
int n = adapter.executeQuery(sql0);
String timesplit,grader,question,answer, asassess,scale;

if (n !=1)
{
    adapter.close();
    return;
}

String goal="",tquota=""; 
asassess=adapter.getValueAt(0,3);
String name=adapter.getValueAt(0,0),
atype=adapter.getValueAt(0,2);
boolean byquestion = (atype.equals("1") || atype.equals("3") || atype.equals("4")); 
grader=adapter.getValueAt(0,4); 
timesplit=adapter.getValueAt(0,5); 
status = adapter.getValueAt(0,14); 

boolean shortone = (request.getParameter("shortone")==null); 

question=adapter.getValueAt(0,6);
 
Pattern pt = Pattern.compile("\n[0-9][\\W]");

answer=adapter.getValueAt(0,7); 

String keywords = answer;
String attach=adapter.getValueAt(0,8); 
scale=adapter.getValueAt(0,9); 
String weight=adapter.getValueAt(0,10); 
sessionname=adapter.getValueAt(0,11);  
if (format==null) format=adapter.getValueAt(0,12);
String due=adapter.getValueAt(0,13);
boolean got = false;
String allmyquestion = ",";
String misquestion = ",";
boolean anony = adapter.getValueAt(0,15).indexOf("g:") >= 0;
boolean ismultichoice = false;  
boolean isfillingblank = false;
String numstr = "",numstr1="";
String asassstr = "";
char answerletter1 = ' '; 
char solutionletter1 = '!'; 
String header = "";
if (byquestion)  //type =1, 3, 4
{
    String delimiter = Assignment.separator(orgnum);
 System.out.println("delimiter=" + delimiter);
    Pattern pp = Pattern.compile(delimiter);
    String questionarr[] = Assignment.parse("\n"+ question, pp);
    int la = 1;
    if (grader.contains(user.id) &&  questionarr!=null)
    for (; la < questionarr.length; la++) 
    {
        if (questionarr[la]!=null && !questionarr[la].equals(""))
            allmyquestion += la + ",";
    }
    
    la = 0;
   
    CSVParse pa  = new CSVParse(timesplit,'\'',new String[]{",", ";"}); 
 
    if (!timesplit.equals("")) 
    for (;;la++)
    {
      String [] q = pa.nextRow();
      if (q==null) break;
       
      if (got==false && qn != -1 && q[0].equals(questionnum))
      {
          if (q.length>2 && q[2]!=null && !q[2].equals("")&& !q[2].equals("undefined")) 
          grader = q[2];
          tquota = q[1];
          got = true;
          if (allmyquestion.indexOf( q[0] + ",")<0)
              allmyquestion += q[0] + ",";
      }
      else if (got == false && q.length>2 && qn == -1 && q[2].contains(user.id))
      {
          questionnum = q[0];
          tquota = q[1];
          qn = Integer.parseInt(questionnum);
          grader = q[2]; 
          got = true;
          if (allmyquestion.indexOf( q[0] + ",")<0)
              allmyquestion += q[0] + ",";
      }
      if (q.length>2 &&q[2]!=null&& !q[2].equals("undefined") && !q[2].equals("") && !q[2].contains(user.id))
      {
          allmyquestion = allmyquestion.replaceFirst("," + q[0] + ",",",");
      }    
        
    }
 
    if (grader!=null && !grader.contains(user.id))
    {
        out.println(user.id + Toolbox.emsgs(orgnum,491) + " grader=" + grader);
         adapter.close();
        return;
    }
   
   if (qn==-1)
   {
       questionnum = allmyquestion.replaceFirst("^,","").replaceFirst(",.*","");
       try
       {
            qn = Integer.parseInt(questionnum);
       }catch(Exception e)
       {  
            qn = 1;
            questionnum = "1";
       }
   }
   
   header = questionarr[0]; 
    
   if (qn==-1 || questionarr!= null  && questionarr.length <=qn || questionarr!= null  && questionarr[qn] == null)
   {
      question = "";
      hasquestion = false;
   // out.println(Toolbox.emsgs(orgnum,491) + " qn=" + qn);
       // adapter.close();
       // return;
    } 
    else if (questionarr!= null)
    {  
       if (qn < questionarr.length)
       {
          question =   questionarr[qn];
          ismultichoice = ismulti(question, orgnum);
          if (!ismultichoice) isfillingblank = question.indexOf("___") >= 0;
       }
       else
      {  
          question =   ""; 
          hasquestion = false;
       }

    }
    else
   {  
         question = Toolbox.emsgs(orgnum,1576);  
         hasquestion = false; 
   }
  
   if (!question.equals("")) question = Toolbox.formatstr(format,question);  
   if (!question.equals("")) question = Toolbox1.todiv(orgnum,question, -1); 
   pa  = new CSVParse(asassess,'|',new String[]{",", ";"});
    String q[];
    while ((q = pa.nextRow())!=null)
    {
       if (q.length<2 || q[1]==null || q[1].equals("") || !q[1].replaceAll("[0-9|\\.]","").equals("") )continue;
      if ( q[0].equals(questionnum))
      {
         goal = q[2];
         scale = q[1];
         break;
      }
    }
 
   String qq = "("+  Assignment.separator(orgnum).replaceFirst("0\\-9","a-z")  + ")";
    if (!question.equals("")) question = question.replaceAll(qq, "<br>$1");
   String [] answerarr    = Assignment.parse("\n" + answer, pp); 
System.out.println(pp+ "answer=" + answer);   
   if (answerarr ==null || answerarr.length <=qn || answerarr[qn] == null)
       answer = "";
   else
   {
       answer =  answerarr[qn];
System.out.println(qn+"answer=" + answer); 
       keywords = answer;
       if (answer!=null) answer = answer.split("[ ]*\n[ ]*why:")[0].trim();  
       if(!answer.trim().equals(""))
          answerletter1 = answer.trim().toLowerCase().charAt(0);  
    }    
}
else  // byquestion
{
   if (shortone)
   {
        Matcher mt = pt.matcher(question);
        shortone = !mt.find();
 
      // if (shortone && asassess!=null && asassess.length()>5 && asassess.indexOf("1")>0)
            shortone = false;
   }
 
    String asassstr0 = "<td style=border-top-width:0px;border-bottom-width:0px;width:5px></td>\n<td  class=outset3 style=border-radius:0px align=right>" + lab1s[0] + "</td>\n<td   class=outset3  style=border-radius:0px  align=right>" + lab1s[1] + "</td>\n<td   class=outset3  style=border-radius:0px  align=right>" + lab1s[3] + "</td>";
    String asassstr1 = "<table  border=1 style=border-collapse:collapse  cellspacing=0 cellpadding=0><tr>";
    asassstr1 += "<td  class=outset3 style=border-radius:0px align=right>" + lab1s[0] + "</td>\n<td   class=outset3  style=border-radius:0px  align=right>" + lab1s[1] + "</td>\n<td   class=outset3  style=border-radius:0px  align=right>" + lab1s[3] + "</td>";
    String asassstr2 = "</tr><tr>"; 
    asassstr = ""; 
    //StringBuffer asabuf = new StringBuffer(); 
    CSVParse p  = new CSVParse(asassess,'|',new String[]{",", ";"}); 
    int la = 0;
    String q1,q2; 
   String [] q;
 
    while (( q = p.nextRow())!=null)
    {
      if (la < 3 && la>0) asassstr1 += asassstr0;
      
      if (q.length<2 || q[1]==null || q[1].equals("") || !q[1].replaceAll("[0-9|\\.]","").equals("") )continue;
      if (la%4 > 0) asassstr += "<td style=border-top-width:0px;border-bottom-width:0px;width:5px>\n</td>";
      q1 = ""; if (q.length>1) q1 = q[1];
      q2 = ""; if (q.length>2) q2 = q[2];
      asassstr += "<td><input  class=gradeinput style=width:50px;color:black value=\"" + q[0] + "\"  id=qq" + la + " onfocus=resist(this)  onchange=\"varyqn(this,''," + la + ")\" ></td>\n"
                 +"<td><input   class=gradeinput style=width:50px;color:green value=\"" + q1 + "\" id=\"sq" + la + "\"   onfocus=resist(this)  onchange=\"varyscale(this,''," + la + ")\" ></td>\n"
               + "<td><input   class=gradeinput style=width:50px;color:#00BBBB value=\"" + q2 + "\"  id=\"gq" + la + "\"   onchange=\"varyscore(this,''," + la + ")\" ></td>\n";
      if ( la%4==3) asassstr += "</tr><tr>";
      la++;
    }
   // if (!asassstr.endsWith("</tr><tr>")) asassstr += "</tr><tr>";
    asassstr = asassstr1 +   (la>0?asassstr0:"") +asassstr2 + asassstr;
    if ( (la-1)%4!=3 && la>0 ) asassstr += "<td style=border-top-width:0px;border-bottom-width:0px;width:5px></td>";
    asassstr += "<td><input   class=gradeinput style=width:50px;color:black id=\"qq" + la + "\"  onfocus=resist(this)  onchange=\"varyqn(this,''," + la + ")\"></td>\n";
    asassstr += "<td><input   class=gradeinput style=width:50px;color:green  id=\"sq" + la + "\" onfocus=resist(this)  onchange=\"varyscale(this,''," + la + ")\" ></td>\n";
    asassstr += "<td><input   class=gradeinput style=width:50px;color:#00BBBB  id=\"gq" + la + "\"   onchange=\"varygrade(this,''," + la + ")\" ></td>\n";
    if (!question.equals("")) question = Toolbox.formatstr(format,question); 
    if (!question.equals("")) question = Toolbox1.todiv(orgnum,question, -1);  
    if (la%4==3) asassstr += asassstr.replaceFirst("<tr>$", "</table>");
    else asassstr +="</tr></table>";
 
    keywords = answer;
}
   
   imgletq  = attach(attach ,subdb, "",true, orgnum) ;
   imgleta  =  attach(attach ,subdb, "",false, orgnum) ;
   String ansarray[] = null; 
   String originalanswer = null;
   if (!answer.equals("")){ 
   if (isfillingblank) originalanswer = answer;
   try{
   answer = Toolbox.formatstr(format,answer); }catch(Exception e){}
   if (isfillingblank) ansarray = answer.split("((?=<.span><span>))"); 
   answer = Toolbox1.todiv(orgnum,answer, -1); }
   tquota = tquota.replaceAll(" ",""); 
   if (goal.equals("")) goal = "&nbsp;";
   if (scale.equals("")) scale = "&nbsp;";
   String graders[] = grader.split(",");
   int numgraders = graders.length;
   int whichone = 0;
 
   for (; whichone < numgraders; whichone++)
   if (graders[whichone].equals(user.id)) break;
   int rowas = 2;
   int noatt = (imgletq[0]!=null && !imgletq[0].equals("")||imgleta[0]!=null && !imgleta[0].equals(""))?0:1;
   if (noatt==0) rowas++;
   if (!byquestion) rowas++;
  
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head> 
<%=Toolbox.getMeta(orgnum) + Toolbox.jaxhead%>
<title><%=Toolbox.emsgs(orgnum,229)%></title>
<style type="text/css">
 input {background-color:<%=TBGCOLOR%>;}
 textarea {background-color:<%=TBGCOLOR%>;}
 select {background-color:<%=TBGCOLOR%>;}
 input.BG {background-color:<%=TBGCOLOR%>; color:<%=IBGCOLOR%> !important;border:0;text-align:right}
 input.BG2 {background-color:<%=TBGCOLOR%>; color:<%=IBGCOLOR%> !important;border:0;text-align:left}
 input.LG {background-color:<%=DBGCOLOR%>; border:0;text-align:left}
 input.BG1 {text-align:right;border:0;}
 input.human{text-align:right;border:1px red solid;border-radius:2px;color:red;margin:0px 0px 0px 0px;padding:1px 3px 1px 2px}
 div.why{background-color:<%=TBGCOLOR%>;margin:3px 3px 3px 3px;border-radius:3px;border:1px #ddcc55 solid;padding:3px 3px 3px 3px}
 <%=((imgletq!=null && imgletq[1]!=null)?imgletq[1]:"")%>
 <%=((imgleta!=null && imgleta[1]!=null)?imgleta[1]:"")%>
 <%
out.println("td.s1001{" + borderstyle(1,0,0,1,orgnum,cachedstyle.DBGCOLOR)  +"}\n");
out.println("td.s1000{" + borderstyle(1,0,0,0,orgnum,cachedstyle.DBGCOLOR) +"}\n");
out.println("td.s1100{" + borderstyle(1,1,0,0,orgnum,cachedstyle.DBGCOLOR) +"}\n");
out.println("td.s0100{" + borderstyle(0,1,0,0,orgnum,cachedstyle.DBGCOLOR) +"}\n");
out.println("td.s0110{" + borderstyle(0,1,1,0,orgnum,cachedstyle.DBGCOLOR) +"}\n");
out.println("td.s0010{" + borderstyle(0,0,1,0,orgnum,cachedstyle.DBGCOLOR) +"}\n");
out.println("td.s0011{" + borderstyle(0,0,1,1,orgnum,cachedstyle.DBGCOLOR) +"}\n");
out.println("td.s0001{" + borderstyle(0,0,0,1,orgnum,cachedstyle.DBGCOLOR) +"}\n");
out.println("td.s0111{" + borderstyle(0,1,1,1,orgnum,cachedstyle.DBGCOLOR) +"}\n");
out.println("td.s0000{" + borderstyle(0,0,0,0,orgnum,cachedstyle.DBGCOLOR) +"}");
out.println("input.gradeinput{color:red;background-color:" + viewcolor + ";margin:0px 0px 0px 0px;text-align:right;font-family:courier;border:1px " + BBGCOLOR +" solid;font-weight:700;width:" + Math.round(cachedstyle.fontsize*2) +"px}");
boolean forfeedback = ( request.getParameter("feed")!=null);  
if ( allmyquestion.split(",").length > 2)
{
    String allmyquestion11 = allmyquestion; 
    if (allmyquestion.indexOf("," + qn + ",")<0)
        allmyquestion11 += qn + ",";
    String [] xx = new String[2];
    nums(allmyquestion11, questionnum, cachedstyle.fontsize, orgnum, xx,  cachedstyle);
    numstr = xx[0];
    numstr1 = xx[1]; 
}
else
{
    String [] xx = new String[2];
    nums(qn + "," + (qn+1), questionnum, cachedstyle.fontsize, orgnum, xx, cachedstyle);
    numstr = xx[0];
    if (xx[0].indexOf("-1")>=0) numstr = "";
    numstr1 = xx[1]; 
    
}
if (viewassess!=null) numstr = numstr1 = ""; 
%>
</style>

<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<script  type=text/javascript>
<%= Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, 
securitytoken="<%=Toolbox.gentoken("gradingQuestion.jsp","f1")%>";
<%=Toolbox.someconsts(orgnum)%>
var mat = new Array();  
</script>
<script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script>
<script type=text/javascript  src=cookie.js></script>
<script type="text/javascript"  > document.write(unifontstyle(<%=cachedstyle.fontsize%>));</script>
</head>
<body  style="background-color:<%= IBGCOLOR %>;margin:0px 6px 0px 0px" >
    <%= Toolbox.title( course + " " + sessionname + " " + assignname ).replaceFirst("<table ", "<table style=\"width:100%;margin:0px 0px 0px 0px\"").replaceFirst("class=outset2"," ").replaceAll("2px","0px").replaceAll("3px","0px").replaceAll("border-radius:\\s*[0-9]", "border-radius:0")  %> 
 
<table border="0" cellspacing=0 cellpadding=5 bgcolor="<%= IBGCOLOR %>"   style="margin:4px  4px 0px 4px;border-color:#ddcc99;border-radius:3px;background-color:<%= IBGCOLOR %>" >
    <tr >
    <td class="s0111" valign=top colspan="7"  style="background-color:<%= DBGCOLOR %>">
     
    <table style="float:left;border:1px #ddcc99 solid;border-radius:3px" cellpadding="2" cellspacing="0"><tr>
     <td  style="color:green" id="status2"><%= status.equals("3")?"":"&check;"%></td>
     <td  style="color:<%= status.equals("2")?"black":"blue"%>" onclick="changestatus(2,this)"><nobr><%=forfeedback?Toolbox.emsgs(orgnum,887):Toolbox.emsgs(orgnum,54)%></nobr></td></tr>
    <tr><td  style="color:green"  id="status3"><%= status.equals("3")?"&check;":""%></td>
        <td  style="color:<%= status.equals("3")?"black":"blue"%>" onclick="changestatus(3,this)" ><nobr><%=Toolbox.emsgs(orgnum,490)%></nobr></td></tr>
    </table>  
    
         <center><%=numstr %><div id="summary"></div></center>

   </td>
    </tr>
    <tr height="3"><td  colspan="7" ></td></tr> 
<tr>
         
        
<td class="s1001"   width="<%=4.5*cachedstyle.fontsize%>px"  valign="top"><%=fields2(50, orgnum)%>

</td>
<td class="s1100" colspan="6" style="border-radius:3px" valign="top" align="left">
    <select name="format" style="float:right;border:0px;background-color:<%=viewcolor%>" onchange="changefmt(this,null)">
 <option value="0" <%=format.equals("0")?"selected":""%> ><%=Toolbox.emsgs(orgnum,214)%> </option> 
 <option value="1" <%=format.equals("1")?"selected":""%> >HTML </option>
 <option value="2" <%=format.equals("2")?"selected":""%> >LaTex </option>
     </select>
 <%=qn==1?Toolbox.formatstr(format,header):""%><%=question%><% if(question.trim().equals("")){%> <textarea id="question<%=qn%>" onchange="updatequestion(this,<%=byquestion%>)"  rows="3" cols="50"  onkeypress="return displaytext(this,event,-2)" style="border-radius:3px;width:99%;background-color:<%=TBGCOLOR%>"></textarea>
 <div id="showarea-2"></div><%}%> </td></tr>
  
   
<tr> 
<td    class="s0001"  valign="top"><%=fields2("<script>document.write(textmsg[457]);</script>", orgnum)%></td>
<td  colspan="6" valign="top"   class="s0100"  style="border-radius:3px"  align="left"><div id="referenceans"></div><%if (answer.trim().equals("")){%> <textarea id="answer<%=qn%>" onchange="updateanswer(this,<%=byquestion%>)"   rows="3" cols="50"  style="border-radius:3px;width:99%;background-color:<%=viewcolor %>"  onkeypress="return displaytext(this,event,-1)"></textarea>
    <div id="showarea-1"></div><%}%></td>
</tr>
<%
 
if (noatt == 0) 
{%>
<tr>
<td  class="s0001"    valign="top"><%=fields2(355, orgnum)%></td>
<td  colspan="6"  class="s0100" bgcolor="white"> 
<%
if (imgletq!=null && imgletq[0]!=null && !imgletq[0].equals("")) out.print( imgletq[0] );
if (imgleta!=null && imgleta[0]!=null && !imgleta[0].equals("")) out.print(  imgleta[0] );

%>
</td>
</tr>
<%} 
if (!byquestion && shortone==false) 
{
  
%>
<tr>
<td class="s0001"     valign="top"><%=fields2(1372, orgnum)%></td>
<td colspan="6"  class="s0100"> 
<%   out.print(asassstr); %>
</td>
</tr>

<%
}%> <tr> <td align="left"   class="s0011"  ><%=fields2(291, orgnum)%></td> 
   <td  class="s0010"  id="atype"   align="left"></td> 
   <td  class="s0010"   align="right"><%=fields2("<script>document.write(textmsg[1268]);</script>", orgnum)%></td> 
      <td  class="s0010"   id="scale" align="left"><%= scale %> </td> 
      <td   class="s0010"  align="left">&nbsp;&nbsp;<%=fields2(Toolbox.emsgs(orgnum,1560).replaceFirst(".*@([^@]+)$","$1"), orgnum)%></td> 
      <td   class="s0010"   align="left" id="average">&nbsp;</td><td   class="s0110"   width="0%"><table width="100%"><tr><td><%=fields2(734, orgnum)%></td><td><%=  tquota.equals("")?"&nbsp;":(tquota + "'") %></td></tr></table></td></tr>
<tr height="10px">
    <td colspan="7" style="background-color:<%=IBGCOLOR%>" class="s0000"  ><a name="0" id="anchor0"></td></tr>
<%
int nn = adapter.executeUpdate("DROP TABLE temp" + user.id);
nn = adapter.executeUpdate("CREATE  TABLE temp" + user.id + "(sid VARCHAR(20), lastname VARCHAR(50),firstname VARCHAR(50), url VARCHAR(255), sessionname VARCHAR(40),PRIMARY KEY(sid))");
 
String sqltemp = "INSERT INTO   temp" + user.id + "(sid,lastname,firstname,url,sessionname) SELECT Registration.sid, " + (anony?("'','',''"):("AppUser.lastname, AppUser.firstname, AppUser.photourl")) + ", Registration.sessionname FROM  Registration, AppUser WHERE AppUser.id=Registration.sid "
    + " AND Registration.courseid='" + course +"'"
    + " AND Registration.semester='" + semester.replaceAll("'", "''") + "' AND (";
for (int ll=0; ll < sessionarr.length; ll++)
{ 
    if (ll>0) sqltemp += " OR ";
    sqltemp += "Registration.sessionname='" + sessionarr[ll] + "'";
}
sqltemp += ")";

String feedstr = forfeedback?( " AND Submission.comment LIKE '#%' "):"";
nn = adapter.executeUpdate(sqltemp);
sql = "SELECT temp" + user.id + ".sid,Submission.submtime,Submission.grade,Submission.content,Submission.comment,Submission.format,Submission.attach,Submission.assess,temp" + user.id + ".sessionname,temp" + user.id + ".lastname, temp" + user.id + ".firstname, temp" + user.id + ".url,'' FROM temp" + user.id + " LEFT JOIN Submission ON temp" + user.id + ".sid=Submission.sid  "
    + " AND Submission.course='" + course +"'"
    + " AND Submission.semester='" + semester.replaceAll("'", "''") + "'"
    + " AND Submission.assignname = '" + assignname  + "'"  + feedstr
    + " UNION  SELECT '" + user.id + "',Submission.submtime,Submission.grade,Submission.content,Submission.comment,Submission.format,Submission.attach,Submission.assess,'" + sessionname + "', '" + user.lastname + "','" +  user.firstname + "','','' FROM   Submission WHERE '" + user.id + "'=Submission.sid  "
    + " AND Submission.course='" + course +"'"
    + " AND Submission.semester='" + semester.replaceAll("'", "''") + "'"
    + " AND Submission.assignname = '" + assignname  + "'" 
    + " ORDER BY 9";
if (!anony) sql += ",10";    
 
boolean tt = adapter.executeQuery2(sql,false);
 
if (tt==false)
{
    out.println(adapter.error());
    adapter.close();
    return; 
}
String  sid, submtime, grade, content, comment="",  sattach, sassess,sessioname,firstname="",lastname="",photourl="";
int tspent = 0, i;
int numr=0, nums=0, numq=0; 
String misseds = "";
String missedq = "";
int NS =0;
float sum = 0.0f;
int i0 ;
i = 0;
String loadall = Toolbox.defaultParam(orgnum, request, "loadall", "false", null, 5);
int timerace =  1310;
String attachstr = "";
boolean pictureway = false; 
ArrayList<String>   sids = new ArrayList();
ArrayList<Integer>    orders = new ArrayList();
for (i0=0; ;i0++)
{
    sid = adapter.getValueAt(i0, 0);
    if (sid == null) 
    {
        NS = i0;
        break;
    }
    
    /*if (feedback == null && numr>0) continue;
    if (forfeedback && numr>0 )
    {
        int j = feedback.indexOf("//");
        String feed1 = feedback; if (j == 0) continue;
        else if (j>0) feed1 = feedback.substring(0,j);
        if (!("@" + feed1.replaceFirst("//.*$","").replaceAll("[^0-9]+","@") + "@").contains("@" + questionnum + "@"))
        {
            continue;
        } 
    }*/
    if (loadall.equals("false") && !grader.contains(user.id)) 
    {
        int hs = (assignname + sid + questionnum).hashCode();
        if (hs % numgraders != whichone) {
            continue;
        }
    }
    numr++;
    submtime = adapter.getValueAt(i0, 1);
    if (submtime == null || submtime.equals("")) 
    {
        misseds += ",<a href=\"studentpage.jsp?mode=instructor&Semester=" + semester + "&sid=" + sid + "\" target=_blank>" + sid + "</a>";
        continue;

    } else {
        nums++;
    }
    grade = adapter.getValueAt(i0, 2); if (grade == null) grade = "-1";
    content = adapter.getValueAt(i0, 3);
    String feedback = anony?"":adapter.getValueAt(i0, 4);
    sformat = adapter.getValueAt(i0, 5);
    sattach = adapter.getValueAt(i0, 6);
    pictureway = sformat.equals("6"); 
    attachstr += "<input type=hidden value=\"" + sattach + "\" id=attach" + i + " >";
    sassess = adapter.getValueAt(i0, 7);
    String fmt1 = "0";
    sessioname = adapter.getValueAt(i0, 8);
    firstname = adapter.getValueAt(i0, 9);
    lastname = adapter.getValueAt(i0, 10);
    photourl = adapter.getValueAt(i0, 11);
    if (pictureway)
        imgletq = attachpic(sattach, subdb, "" + i, true, orgnum,i );
    else
        imgletq = attach(sattach, subdb, "" + i, true, orgnum);
    String assstr0 = "<td style=border-top-width:0px;border-bottom-width:0px;width:5px rowsapn=5></td><td  class=outset3 style=border-radius:0px align=right>" + lab1s[0] + "</td><td   class=outset3  style=border-radius:0px  align=right>" + lab1s[1] + "</td><td   class=outset3  style=border-radius:0px  align=right>" + lab1s[2] + "</td>";
    String assstr1 = "<table  border=1 style=border-collapse:collapse  cellspacing=0 cellpadding=0><tr>" + assstr0; 
    String assstr = "";
    String assstr2 = "</tr><tr>";
    ArrayList<String> rws = new ArrayList<>();
    String[][] pqm = null;
    if (sassess != null && sassess.equals("") == false) {
        CSVParse pq = new CSVParse(sassess, '|', new String[]{",", ";"});
        pqm = pq.nextMatrix();
    }
  
    CSVParse zz = new CSVParse(asassess, '|', new String[]{",", ";"});
    String[] w;
    StringBuffer sf = new StringBuffer();
    int ll1 = 0;

    while ((w = zz.nextRow()) != null) 
    {
        if (w.length < 2 || w[0] == null || w[0].equals("") || w[1] == null || !w[1].replaceAll("[0-9|\\.]", "").equals("") || w[1].equals("")) 
        {
            continue;
        }
        if (sf.length() > 0) 
        {
            sf.append(";");
        }
        String g = "1";
        int ll = ll1;
        if (pqm != null) {
            for (; ll < pqm.length; ll++) {
                if (pqm[ll][0] != null && w[0].equals(pqm[ll][0])) {
                    if (pqm[ll].length > 2) {
                        g = pqm[ll][2];
                    }
                    ll1 = ll + 1;

                    break;
                } else {
                    sf.append(pqm[ll][0]);
                    for (int kk = 1; kk < 3; kk++) {
                        if (pqm[ll].length > kk) {
                            sf.append("," + pqm[ll][kk]);
                        }
                    }

                    if (pqm[ll].length > 3) {
                        if (pqm[ll][3] != null) {
                            sf.append(",|" + pqm[ll][3].replaceAll("\\|", "||") + "|");
                        } else {
                            sf.append(",");
                        }
                    }
                }

            }
        }

        sf.append(w[0] + "," + w[1] + "," + g);
        if (pqm != null && ll < pqm.length && pqm[ll].length > 3) 
        {
            if (pqm[ll][3] != null) 
            {
                sf.append(",|" + pqm[ll][3].replaceAll("\\|", "||") + "|");
            } 
            else 
            {
                sf.append(",");
            }
        }
    }

    if (pqm != null) 
    {
        for (int ll = ll1; ll < pqm.length; ll++) 
        {
            if (sf.length() > 0) 
            {
                sf.append(";");
            }
            sf.append(pqm[ll][0]);

            for (int kk = 1; kk < 3; kk++) {
                if (pqm[ll].length > kk) {
                    sf.append("," + pqm[ll][kk]);
                }
            }
            if (pqm[ll].length > 3) {
                if (pqm[ll][3] != null) {
                    sf.append(",|" + pqm[ll][3].replaceAll("\\|", "||") + "|");
                } else {
                    sf.append(",");
                }
            }
        }
    }
    sassess = sf.toString();
    int la = 0;
    if (byquestion) 
    {
        grade = "0";
        comment = "";
    }
    CSVParse pq = new CSVParse(sassess, '|', new String[]{",", ";"});
    
    String[] q;
    la = 0;
    while ((q = pq.nextRow()) != null)
    {
        if (q.length < 3 || q[1] == null || q[1].equals("") || !q[1].replaceAll("[0-9|\\.]", "").equals("")) 
        {
            continue;
        }
         
        if (!byquestion) 
        {
            if (q.length >= 4)
               comment = q[3];
             
            rws.add("<td><input   class=gradeinput style=width:50px;color:black value=\"" + q[0] + "\"  id=q" + i + "q" + la + " onfocus=resist(this)  onchange=\"varyqn(this," + i + "," + la + ")\" ></td><td><input   class=gradeinput style=width:50px;color:green value=\"" + q[1] + "\" id=\"s" + i + "q" + la + "\" onfocus=\"followscale(this," + i + "," + la + ");resist(this)\"   onchange=\"varyscale(this," + i + "," + la + ")\" ></td><td><input   class=gradeinput style=width:50px;color:red value=\"" + q[2] + "\" id=\"g" + i + "q" + la + "\"  onfocus=\"followscale(this," + i + "," + la + ")\"    onchange=\"varyscore(this," + i + "," + la + ")\" ></td>");
           
        } 
        else if (q[0].equals(questionnum)) 
        {

            if (q.length > 1 && q[1] != null && !q[1].equals("") && q[1].replaceAll("[0-9|\\.]", "").equals("")) {
                scal = q[1];
            }
            if (q.length > 2 && q[2] != null && !q[2].equals("") && q[2].replaceAll("[0-9|\\.|\\+| ]", "").equals("")) {
                grade = q[2];
            } 
            else 
            {
                grade = "";
            }
            if (q.length > 3 && q[3] != null) 
            {
                comment = q[3];
            } 
            else 
            {
                comment = "";
            }
            break;
        }
        la++;
    }

    String noformat = content;
    String submitted = "";
    boolean garbed = false;
    if (!byquestion) {
      
        int laa = la;
        do{
          rws.add("<td><input   class=gradeinput style=width:50px;color:black  id=q" + i + "q" + laa + " onfocus=resist(this)   onchange=varyqn(this," + i + "," + la + ")></td><td><input   class=gradeinput style=width:50px;color:green  id=s" + i + "q" + laa + "  onfocus=\"followscale(this," + i + "," + laa + ");resist(this)\"   onchange=varyscale(this," + i + "," + laa + ")></td><td><input   class=gradeinput style=width:50px;color:red  id=g" + i + "q" + laa + "  onfocus=\"followscale(this," + i + "," + laa + ")\"   onchange=varygrade(this," + i + "," + laa + ")></td>"); 
          laa++;
        } while(laa %4 != 0);
        assstr = "<table  border=1 style=border-collapse:collapse  cellspacing=0 cellpadding=0 width=0% ><tr>"; 
         for (int n1=0;  n1 < 4; n1++)
         {
            assstr += "<td  class=outset3 style=border-radius:0px align=right>" + lab1s[0] + "</td><td   class=outset3  style=border-radius:0px  align=right>" + lab1s[1] + "</td><td   class=outset3  style=border-radius:0px  align=right>" + lab1s[2] + "</td>";
           if (n1 < 3) assstr += "<td style=border-top-width:0px;border-bottom-width:0px;width:5px  rowspan=" + Math.ceil(1 + laa/4.0) + "></td>";
         }
         assstr += "</tr><tr>";
         for (int n1 =0; n1 < rws.size(); n1++)
        {  
           assstr += rws.get(n1);
           if (n1%4 == 3  )
           {
             if (n1 < rws.size()-1)
                assstr += "</tr><tr>";
             else
                assstr += "</tr></table>";
           }
        }
         
        try {
            sum += Float.parseFloat(eval1(grade,scal));
        } catch (Exception e1) {
        }
        fmt1 = sformat;
        if (content!=null && !content.equals(""))
        {    
            submitted = Toolbox.formatstr(sformat, content);
            submitted = Toolbox1.todiv(orgnum, submitted, i);
        }
        numq++;
    } 
    else 
    {
        noformat = "";sformat = "0";fmt1=format;tspent = 0;submitted = "";
        try 
        {
            sum += Float.parseFloat(eval1(grade,scal));
        } catch (Exception e1) {
        }
        la = 0;
        CSVParse cp = new CSVParse(content, '\'', new String[]{",", "\r\n"});
        sformat = "4";
        String x[];

        misquestion = ",";
        while ((x = cp.nextRow()) != null) 
        {
            if (x.length < 2 || x[0] == null || x[0].equals("")) 
            {
                continue;
            }
            
            misquestion += x[0] + ",";
            if (x[0].equals(questionnum)) 
            {
                if (x[1] !=null && !x[1].trim().equals("") )
                {   
                    submitted =  x[1].trim();
                } 
                 
                noformat = submitted;
                sformat = x.length>3?x[3]:"0";
                if (x.length < 4) garbed = true;
                if (sformat.equals("4")) {
                    solutionletter1 = '!';
                    if (submitted.length() > 0) {
                        solutionletter1 = submitted.toLowerCase().charAt(0);
                    }
                }

                
                if (sformat == null || sformat.equals("")) {
                    sformat = "0";
                }

                fmt1 = sformat.equals("4") ? format : sformat;
                if (submitted!=null && !submitted.equals(""))
                {
                   submitted = Toolbox.formatstr(fmt1, submitted);  
                   submitted = Toolbox1.todiv(orgnum, submitted, i);
                }
                try {
                    tspent = Integer.parseInt(x[2]);
                } catch (Exception e) {
                }
            }
        }

        if (submitted.equals("")) {
            missedq += ",<a href=\"studentpage.jsp?mode=instructor&Semester=" + semester + "&sid=" + sid + "\" target=_blank>" + sid + "</a>";
            //continue;
        } else {
            numq++;
        }

        if (atype.equals("4")) {
            timerace = 1309;
        }
    }
if (anony)
   {
       sids.add(sid);  
       orders.add(i);
   }
   String sidbg = i%2==0?BBGCOLOR:"lightyellow"; try{
%>
<%=(imgletq[1]!=null && imgletq[1].equals(""))? ("<style>" + imgletq[1] + "</style>"):"" %> 
<script> 
    mat[<%=i %>]=['<%=course%>',"<%=assignname%>","<%=anony?(""+i):sid%>", "<%=submtime%>","<%=grade%>", '<%=photourl%>', 
    "<%=Generic.handle(noformat )%>","<%=anony?"":Generic.handle(feedback)  %>",  '<%=due%>',  '<%=pictureway?"6":sformat%>',
    "<%=Generic.handle(lastname + " " + firstname)%>",  '<%=sattach%>',
    '<%=atype%>',"<%=Generic.handle(comment)%>",
    "<%=Generic.handle(asassess.replaceAll("\n",""))%>",  "question", "answer", "<%=attach %>","<%=scale%>", "<%=1%>", "<%=sessioname %>", 
    "<%=format%>","<%=tspent%>","<%=scal%>"]; 
</script>
<% }catch(Exception e){} %>
<!--<div style="border:1px #aaaaaa outset;text-shadow:1px 1px #aaaaaa;width:26px;height:20px;border-radius:13px/10px;text-align:center;background-color:<%=BBGCOLOR%>;color:black">-->
<tr ><td  style="width:<%=4.5*cachedstyle.fontsize%>px" align="center" class=s1001>
        <div id="disk<%=i%>" style="font-family:arial;font-weight:700;width:<%=cachedstyle.fontsize*1.5%>px;
                    border-radius:<%=cachedstyle.fontsize*0.75%>px;
                    font-size:<%=cachedstyle.fontsize%>px;color:#ddcc11;
                    line-height:<%=1.5*cachedstyle.fontsize%>px;
                    text-align:center;background-color:<%=IBGCOLOR%>"><%=i+1%></div> </td>
<% if (lastname!=null && lastname.equals("")==false )
{ 
        out.print("<td  class=s1000><a href=\"studentpage.jsp?mode=instructor&Semester=" 
        + semester + "&sid=" + sid + "\" target=_blank><nobr>" 
        + Toolbox.makeFullName(lastname, "", firstname) 
        + "</nobr></a></td><td  class=s1000> " 
        + sid  + "</td><td  class=s1000>"    
        + ((photourl!=null && !photourl.equals(""))?("<img onmouseover=showmyhint(" + i + ",true) onmouseout=hidemyhint()  src=image/nophoto.jpg width=12px>"):"") 
        + "</td>");
}
else 
        out.print("<td  class=s1000 colspan=3> </td>");
 
float displayedgrade = 0; 
try{ displayedgrade = Float.parseFloat(eval1(grade,scal));}catch(Exception e1){} 
if (sformat.equals("4"))
{
if (answerletter1==solutionletter1 && displayedgrade==0)
{
   grade =  (scale); 
   needsave = "true";
}
else if (answerletter1!=solutionletter1 && displayedgrade>0)
{
     grade = "0";
    needsave = "true";
}

}
%><td class="s1000" align="right"><%=sessioname%></td>
<td  class="s1000"> <%
if (!imgletq[0].equals("")){%><b><%=Toolbox.emsgs(orgnum,355)%></b>: <%= imgletq[0]%><%}
 
if (subdb.equals(user.id)){%>  &#2295;  <%}%>  
</td><td class="s1100" >
<% if (!sformat.equals("4")){%> 
 <select name="format<%=i%>" style="float:right;border:0px;width:100px;overflow:hidden;background-color:<%= viewcolor%>"  onchange="changefmt(this,<%=i%>)"  >
 <option value="0" <%=!pictureway&&sformat.equals("0")?"selected":""%> ><%=Toolbox.emsgs(orgnum,214)%> </option> 
 <option value="1" <%=!pictureway&&sformat.equals("1")?"selected":""%> >HTML </option>
 <option value="2" <%=!pictureway&&sformat.equals("2")?"selected":""%> >LaTex </option>
 <option value="6" <%=pictureway?"selected":""%> ><%=Toolbox.emsgs(orgnum,185)%></option>
 <% if (content.indexOf("\t")>0){%><option value="5"   ><%=Toolbox.emsgs(orgnum,442)%> Tab</option> <%}%> 
     </select>
         <%}%>
</td>

</tr>
     
<tr >
<td  class="s0001"    width="<%=4.5*cachedstyle.fontsize%>px"  valign="top"><%=fields2("<script>document.write(textmsg[139]);</script>", orgnum)%>
<%=forfeedback?("<br><div style=vertical-align:bottom><b>"+Toolbox.emsgs(orgnum,887)  + "</b></div>"):""%>
</td>
<td  class="s0100" colspan="6" valign="top"  style="border-radius:3px;color:purple"   align="left" id="showans<%=i%>">
 <% if (pictureway) 
 { 
     if (imgletq!=null && imgletq.length>2) out.println(imgletq[2]);  
     if (imgletq!=null && imgletq.length>3) 
         submitted = Toolbox1.todiv(orgnum, imgletq[3], i);
     else submitted = "";
 } 
 
 if (!submitted.equals(""))
 {
    if (isfillingblank)
    {
       submitted = "<div id=fillblank" + i + " >" + submitted + "</div>";
    }
    out.println(submitted);
 }
 else  
 {
    if (isfillingblank)
    {
        submitted = "<div id=fillblank" + i + " ></div>";
        out.println(submitted);
     }
    else
        out.println("<script>document.write(textmsg[1865]);</script>");
 }
 
 %>
  <input id=feedback<%=i%> style="visibility:<%=anony?"hidden":"visible" %>;float:<%=forfeedback?"left":"right"%>;background-color:<%=TBGCOLOR%>;color:purple;border:1px #ddcc99 solid;border-radius:3px;width:200px" value="<%=feedback%>"  >
   
</td>
<tr >  
<td  class="s0001"    width="<%=4.5*cachedstyle.fontsize%>px"  valign="top"><%=fields2("<script>document.write(textmsg[541])</script>", orgnum)%></td>
<td colspan=6  class="s0100"  valign="top" align="left" id="commenttd<%=i%>"> 
    <%if (garbed)
    {
     
       out.println(
"<table  cellspacing=0 cellpadding=3 width=100% ><tr><td style=width:99% rowspan=3 ><textarea id=error" +i + " rows=5 cols=60 style=\"width:99%;height:80px;border:1px #ddcc99 solid;color:red;\" onfocus=onlinetoolbarfollow(this) onkeypress=\"return displaytext(this,event," + i + ")\" >" + content + "</textarea></td><td><a href=javascript:whatitis()>Why</a></td></tr><tr><td><input type=button class=OrangeButton style=width:" + (4.5*cachedstyle.fontsize) + "px value=Correct onclick=\"correctit('" +sid + "',"+ i + ")\" ></td><tr><tr><td><input type=hidden id=comment" + i + "></td></tr></table>"); 
    }
    else if (sformat!=null && sformat.equals("4") || ismultichoice)
    { 

        if (answerletter1==solutionletter1 || !grade.equals("") &&  !grade.equals("0") )
           out.println("<font color=#009900>&check;</font>");
        else  
           out.println("<font color=#99000>&cross;</font>");
        out.println("<input type=hidden id=comment" + i + ">");   
    } 
    else
    { 
        
        if (viewassess!=null)
        { 
            if (!pictureway || ismultichoice) 
            {
               out.println(Toolbox.formatstr(sformat,comment));
            }
        }
        else 
        { 
             if (!pictureway  ){  %>  
    <table cellspacing=0 cellpadding=0 width="100%" >
        <tr ><td style="width:99%;" rowspan="3"><textarea id="comment<%=i%>" style="width:99%;height:80px;border:1px #ddcc99 solid;color:red;background-color:<%=TBGCOLOR%>" onfocus="onlinetoolbarfollow(this)" onchange="varycomment(); calvposition();" onkeypress="return displaytext(this,event,<%=i%>)"><%= comment.replaceFirst("</textarea>","<.textarea>") %></textarea></td> 
<td  style="padding:2px 2px 2px 2px;width:<%=4.5*cachedstyle.fontsize%>px" ><input id="submitted<%=i%>" type="button" value="<%=Toolbox.emsgs(orgnum,676)%>" class="GreenButton"  style="overflow:hidden;width:<%=4.5*cachedstyle.fontsize%>px" onclick="getsubmitted(<%=i%>)"> </td></tr>
<td  style="padding:2px 2px 2px 2px;width:<%=4.5*cachedstyle.fontsize%>px" ><input name="OK<%=i%>" type="button"  value="<%=Toolbox.emsgs(orgnum,1083)%>"  class="OrangeButton"  style="visibility:hidden;width:<%=4.5*cachedstyle.fontsize%>px"  onclick="ascomment(<%=i%>,'<%=sid%>')"> </td></tr> 
<td  style="padding:2px 2px 2px 2px;width:<%=4.5*cachedstyle.fontsize%>px" ><input name="as<%=i%>" type="button"  value="<%=Toolbox.emsgs(orgnum,1559)%>"  class="OrangeButton"  style="overflow:hidden;width:<%=4.5*cachedstyle.fontsize%>px"  onclick="toclass(<%=i%>)"> </td></tr>
 <tr ><td colspan="3"  class="s0110"  style="border-radius:3px"  id="showarea<%=i%>"><%if (!sformat.equals("0")) out.print(Toolbox.formatstr(sformat,comment));%>&nbsp;</td></tr>
 
</table><%} else {%>
 <table cellspacing=0 cellpadding=0 width="100%" >
     <tr><td style="width:99%;" rowspan="3"><input readonly="yes" id="comment<%=i%>"  style="border:1px #ddd solid;color:grey"   type="text" size="40" value="<%=comment.replaceAll("\"","\\\\\"")%>">  
        </td><td><input name="as<%=i%>" type="button"  value="<%=Toolbox.emsgs(orgnum,1559)%>"  class="OrangeButton"  style="overflow:hidden;width:<%=4.5*cachedstyle.fontsize%>px"  onclick="toclass(<%=i%>)">
        </td></tr></table>
<%}}} %>
</td>
</tr>
  
 <% if (!byquestion && shortone==false) {%>
 <tr ><td  class="s0001"   width="<%=4.5*cachedstyle.fontsize%>px"  valign="top"><%=fields2(lab1s[4], orgnum)%></td>
<td colspan="6" class="s0100"  valign="top" align="left" > 
<%= assstr %>
</td></tr>
 
<%}
 if (grade!=null){ grade = grade.replaceFirst( "(\\.[0-9])[0-9]+$", "$1"); } 
%>
<tr > 
    <td class="s0011"  align="left"><%=fields2("<script>document.write(textmsg[" + timerace + "]);</script>", orgnum)%></td>
    <td  class="s0010"  width="100"  align="left"><%=  atype.equals("4")? (""+tspent):(( tspent/60) +"'" + (tspent%60) + "\"")   %></td> 
    <td    class="s0010"  align="right"><%=fields2("<script>document.write(textmsg[1268]);</script>", orgnum)%></td> 
     <td  class="s0010"  width="80"   align="left"  id="scale<%=i%>"><%= scale %> </td> 
     <td    class="s0010"  align="right"><table><tr><td><a href="javascript:switchg()">&olarr;</a></td><td><%=fields2(224, orgnum)%></td></tr></table></td> 
  <td  width="99%"  class="s0010"  id="scoretd<%=i%>"  align="left">
      <input class="gradeinput" 
             id="score<%=i%>" 
             style="text-align:right;background-color:<%=viewcolor%>;width:65px;border-color:#ddcc99;padding:2px 3px 2px 2px" 
             onfocus="selecttext(this)"  
             onchange="asscore(this)"  
             tabindex="<%=i+1%>"  
             value="<%= (grade==null)?"":eval1(grade,scal) %>" 
             onkeypress="return down1(this,<%=i%>,event)"> 
  <input type=button id='darrow<%=i%>' class="GreenButton" style="width:<%=cachedstyle.fontsize*4.5%>px" onclick="ignore(<%=i%>);down(<%=i%>,this.parentNode)" value="&darr;" >
  </td> 
      <td  class="s0110"></td>
</tr> 
<tr   height="10"><td colspan="7" style="background-color:<%=cachedstyle.IBGCOLOR%>" ><a name="<%=i+1%>" id="anchor<%=i+1%>"></td></tr>
          


<% i++;}
if (i==0)
{%><script>document.body.innerHTML = textmsg[351];</script><% adapter.close();return;}
int N = i;

String toolstr = ""; 
 
String avg =  ""; 
if (numq>0) avg =  ("" + (int)(Math.round(100*sum/numq)));
if (avg.length()==1) avg = "00" + avg;
else if (avg.length()==2) avg = "0" + avg;
else if (avg.equals(""))avg = "000";
 
String sql1 = "SELECT  DomainValue.domainvalue,category,DomainValue.description,name,cgi,opt,OperationCourse.forgrading from DomainValue,Operation, OperationCourse where  caption=CONCAT('',DomainValue.code) AND DomainValue.domain='Tool Caption' AND  DomainValue.language='" + Toolbox.langs[orgnum>>16] + "' AND Operation.name=OperationCourse.operation and OperationCourse.course ='" + course + "' AND  OperationCourse.forgrading> 0 order by OperationCourse.forgrading";
boolean bb = adapter.executeQuery2(sql1,false);
 
String x1; 
for ( i = 0; (x1=adapter.getValueAt(i, 3))!=null; i++) 
{
    if (x1.contains("Upload") || x1.contains("Attach")) continue; 
   // if (x1.contains("Plagiarism") && N==1)  continue;
    for (int j = 0; j < 6; j++) 
    {
         x1 = adapter.getValueAt(i, j).replaceAll(";", ","); 
   
        toolstr += ";" + x1;
    }
}
if (n==-1) out.println(adapter.error());
 
adapter.close();
 
if (allmyquestion==null || allmyquestion.equals(",") || misquestion!=null && allmyquestion.split(",").length < misquestion.split(",").length )
{
    String [] xx = new String[2];
    nums(misquestion, questionnum, cachedstyle.fontsize, orgnum, xx, cachedstyle);
    numstr = xx[0];
    numstr1 = xx[1]; 
}
String [] labels = Toolbox.emsgs(orgnum,1560).split("@");
String [] graderarr = grader.trim().split("[ ]*,[ ]*");
String gradestr = "<nobr>";
if (sformat==null||sformat.equals("")) sformat = "0"; 
for (int ii=0; ii < graderarr.length; ii++)
gradestr += (ii>0?",":"") + " <a href=\\\"javascript:myprompt('<iframe width=600 height=600 src=DataFormHTML?subdb=&rdap=userinfo&uid=" + graderarr[ii] + " />')\\\" >"  + graderarr[ii] + "</a>";
gradestr += "</nobr>";
%>
<tr height="5px"><td colspan="7" class="s0000" style="border-bottom-left-radius:3px;border-bottom-right-radius:3px;"></td></tr>
</table>
<script> //document.write(round20.replace(/5/g, '2')); 
</script>
<% if (viewassess==null){%>
<table width="100%"> <tr><td width="5%"><span  style="float:left"><a href="javascript:picktools()"><nobr><b><script>document.write(textmsg[188]);</script></b></nobr></a></span>
        </td><td><table id="butbase" align=center ><tr>
 <% if (!byquestion &&shortone  )
 {%>
 <td>
<input type="button" class="OrangeButton" style="width:<%=4.5*cachedstyle.fontsize%>px"  id="enablebtn"    value="<%=Toolbox.emsgs(orgnum,1372)%>" onclick="enableass(this)"  >
</td>
<%} if (i0 > 0) {%>        
<td>
 <input type="button" class="OrangeButton" style="width:<%=4.5*cachedstyle.fontsize%>px"  id="unigrade"    value="" onclick="quickgrade(this)"  >
</td><td><input id=sendbtn type="button" class="OrangeButton" style="width:<%=4.5*cachedstyle.fontsize%>px" value="<%=Toolbox.emsgs(orgnum,36)%>" onclick="send(this)"> 
</td>
<%}%>
<td><%=numstr1%></td><td><%=attachstr%></td></tr>
            </table></td></tr></table>

<%}


%>
<script>
<%
if (anony)
{  
    out.println("var charsize=" + Toolbox.locales[orgnum>>16].charsize  + ";");
    //out.print("var shuffledsids = ["); 
    StringBuffer sstr = new StringBuffer();
    StringBuffer sssid = new StringBuffer();
    int NN = orders.size(); 
    Collections.shuffle(orders);
    for (int j=0; j < NN; j++) 
    {
        int jj = orders.get(j);
        //out.print( "\"" + sids.get(jj) + "\"" + (j == NN-1?"];\n":","));
        sssid.append(sids.get(jj) + (j == NN-1?"":",") );
        sstr.append(jj + (j == NN-1?"":","));
    } 
    out.println("var encorders=\"" +  MyRSA.encryptString0(sstr.toString(),orgnum>>16) + "\";");  
    out.print("var sids = \"" +  MyRSA.encryptString0(sssid.toString(),orgnum>>16) + "\";");  
}
 
%>
var isfillingblank = false; 
var atype =  <%=ismultichoice ? 0:(isfillingblank? 1: 2) %>;
<% 
if (isfillingblank && originalanswer!=null)
{%>
var originalanswer= "<%=Generic.handle(originalanswer)%>".split(/[ ]*\n[ ]*why:/)[0];
isfillingblank = true;
<%
   
} 
else
{%>
var originalanswer= "<%=Generic.handle(keywords.replaceFirst("[ |\r|\n]+why:.*$",""))%>".split(/[ ]*\n[ ]*why:/)[0];
<%}%>
var qn = <%=qn%>;
var viewcolor = "<%=viewcolor%>";
var loadall = <%=loadall%>;
var isinstructor =  <%=subdb.equals(user.id)%>;  
var byquestion = <%=byquestion%>;
var font_size = <%=cachedstyle.fontsize%>;
var numOfparts = <%=(question + ' ').split("___[_]*").length-1%>; 
isfillingblank = numOfparts > 0;
var N = <%=N%>;
var due = <%=due%>;
var scale = <%=scale%>;
var tstmp = <%=tstmp%>; 
var msg224 = "<%=fields2(224, orgnum)%>";
var msg931= "<%=Toolbox.emsgs(orgnum,931)%>";
var msg1224 = "<%=Toolbox.emsgs(orgnum,1244)%>";
var msg1570= "<%=Toolbox.emsgs(orgnum,1570)%>";
var needtranslator = true;
var assignname = '<%=assignname%>';
var sessionname = '<%=sessionname%>';
var course = '<%=course%>';
var questionnum = '<%=questionnum%>';
var semester = '<%=semester%>'; 
var statusnum =  <%=status%>;
var subdb = "<%=subdb%>";
var theurl = "<%=Toolbox1.geturl(request)%>";
var onlinetoolinitial = "<%=Generic.handle(toolstr)%>".replace(/File_f/g,'File_f&subfolder=submission').replace(/;;/g,'; ;');
var keywords = "<%=Generic.handle(keywords)%>".replace(/[\r|\n|~|!|@|#|\$|%|\^|&|\*|\(|\)|_|\-|\+|=|\{|\}|\[|\]|:|;|"|'|<|>|\.|,|\?|\/|\\|\|| ]+/g, ",");
var str = "";
var sformat = <%=sformat%>; 
var pictureway = <%=pictureway%>;
var forfeedback = <%=forfeedback%>;
<% if (!grader.equals(user.subdb)){%>str += "<tr><td><%=labels[0]%>:</td><td align=left colspan=3  width=80><%=gradestr%> </td></tr>"; <%}%>
str += "<tr><td width=80 align=left><nobr><%=labels[1]%>:</nobr></td><td  width=80><table><tr><td align=left><%=NS%></td> <td style=\"color:#aa0000\"  id=\"anonytd\"></td></tr></table></td>";   
str += "<td  width=80 align=left><nobr><%=labels[2]%>:</nobr></td><td  align=left><%=N%><% if (!user.subdb.equals(grader)){%> <a href=javascript:loadAll()>" + (!loadall?"<%=Toolbox.emsgs(orgnum,1562).replaceFirst("@","\":\"")%>") + "</a><%}%> </td></tr>"; 
<%if(!misseds.replaceFirst(",","").equals("") && !forfeedback) {%>  str+= '<tr><td  width=80 align=left><nobr><%=labels[3]%>:</nobr></td><td colspan=3  align=left><%=misseds.replaceFirst(",","")%></td></tr>';<%} 
if(!missedq.replaceFirst(",","").equals("")) {%>  str += '<tr><td  width=80 align=left><nobr><%=labels[4]%>:</nobr></td><td colspan=3  align=left><%=missedq.replaceFirst(",","")%></td></tr>';<%}%>
var avgpoints = "<%=avg%>".replace(/(..)$/, ".$1");
var font_size = <%=cachedstyle.fontsize%>;
var timeformat = "<%=cachedstyle.timeformat%>";
var encoding = "<%= Toolbox.encodings[orgnum>>16]%>";
var langcode = "<%= Toolbox.langs[orgnum>>16]%>";
var needsave = <%=needsave%>;
var timerace = <%= timerace %>; 
var viewassess = <%=viewassess!=null%>;
var review = "<%=Toolbox.emsgs(orgnum,54)%>";
var statusstr = "<%=Toolbox.emsgs(orgnum,290)%>";

var onloadbeforegrdeQ  = null;
if (typeof window.onload === 'function')
onloadbeforegrdeQ = window.onload;
window.onload = function()
{
    onstart();
    if (onloadbeforegrdeQ!==null) 
        onloadbeforegrdeQ(); 
} ;
</script>
 
<% if (anony){%>
<script type=text/javascript  src="encryption.js" ></script> <%}%>   
<script type=text/javascript  src="attachment.js" ></script> 
<script type=text/javascript  src="sha1.js" ></script>
<script type=text/javascript  src="checkHTML.js" ></script>
<script type=text/javascript  src="gradingquestion.js" ></script>
<script type=text/javascript  src="hints.js"></script>
<script type=text/javascript  src="timeformat.js"></script>
<script type=text/javascript  src="installtool.js"></script>
<script type=text/javascript  src="curve.js?sn=40&dn=30"></script>

<iframe width="1px" height="1px" name="w<%=tstmp%>" />

</body>
</html>
