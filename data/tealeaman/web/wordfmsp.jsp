<%@ page import="java.sql.*,java.util.*,java.util.regex.*,java.io.*,telaman.*"%>
<%
    int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
    User user = (User)(session.getAttribute("User"));
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>
<title></title>
 
</head>
<%  
 
if ((user = User.authorize(orgnum, -1, application, session, request, response, "wordfmsp.jsp", true)) == null || !Toolbox.verifytoken(request) ) {
       return;
    }
String numfrms = Toolbox.defaultParam(orgnum,request, ("numfrms"), null);
numfrms = Toolbox.validate(numfrms, null, 4);
String rdap = Toolbox.defaultParam(orgnum,request, ("rdap"), null);
rdap = Toolbox.validate(rdap, null,20);

if (numfrms==null) 
{
%>
<body>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>    
<%=Toolbox.emsgs(orgnum,1446)  %>

</body>
<%
}
else if (numfrms.equals("2"))
{
%>

<frameset cols="40%,*" border="1">
<frame name="tlmdocwn" scrolling="no" frameborder="1"  id="fset" style="border:1px #b0b0b0 solid"  src="wordform.jsp?mode=4&rdap=<%=rdap%>" />
<frame name="tlmcvtfm" scrolling="auto"  frameborder="1"  src="wordfmsp.jsp" />
</frameset>

<%
}
else if (numfrms.equals("3"))
{
%>
<frameset cols="10%,40%,*" frameborder=1 id="fset" border="1">
<frame name="tlmdocwn" scrolling="no" frameborder="1"  src="wordform.jsp?mode=4&rdap=<%=rdap%>" />
<% String js = Toolbox.defaultParam(orgnum,request, "js", null, "$-_", 200);
if (js==null)
{%>
<frame name="tlmfrmds" scrolling="no" frameborder="1"  src="mytool.jsp?<%=rdap%>" />
<%}
else
{%>
<frame name="tlmfrmds" scrolling="yes" frameborder="1"  src="wordfmsp.jsp?numfrms=0&js=<%=js%>&rdap=<%=rdap%>" />
<%}%>
<frame name="tlmcvtfm" scrolling="auto" frameborder="1"  src="wordfmsp.jsp" />
</frameset>
<%
}
else if (numfrms.equals("0"))
{
  String js = Toolbox.defaultParam(orgnum,request, "js", null, "$-_", 200);
  
  File file = null;
  if (js!=null && !js.equals("1"))
  {
      file = new File(Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator +  "forms", user.id + "_fm.htm");
  }
  else if (js!=null && js.equals("1"))
  {
      file = new File(Toolbox.dbadmin[orgnum%65536].webFileFolder + File.separator +  "forms" + File.separator + rdap + ".htm");
      
  }
  String txt = "";
  int i;
  String sty = "padding:2px;border:0px #b0b0b0 solid;background-color:transparent;color:#000000;font-family:" + Toolbox.fontsnamestr(orgnum>>16) + ";font-size:16px;font-weight:bold;border-radius:2px;text-shadow:#b0b0b0 0px 0px;vertical-align:inherit"; 
  String yy = "[]";
if( file.exists()) 
 try 
{
     Scanner s =  new Scanner(file);
     txt = s.useDelimiter("\\Z").next();
 
     s.close();
}catch(Exception e){}

if (!txt.equals(""))
try{
     int j = txt.indexOf("FileOperation?did=");
     if (j>=0 && js!=null && js.equals("1"))
     {
        
         js = txt.substring(j+18);
        
         j = js.indexOf(")");
         if (j >= 0)
         {
            
             js = js.substring(0,j);
         }
     }
     i = txt.indexOf(".commonlooking{");
    
     if (i >= 0)
     {
         sty = txt.substring(i+15);
        
         i = sty.indexOf("}");
         
         
         if (i > 0)
         {
             sty = sty.substring(0,i); 
            
         }
     }  
     
 
     int i1 = txt.indexOf("<div ");
     
     if (i1>0)
     {
         i1 = txt.indexOf("<div ", i1+6);
         int i2 = txt.indexOf("<script", i1);
         txt = txt.substring(i1,i2-7);
       
         i1 = txt.indexOf("addedsubbutton");
         
         if (i1>0)
         {
             i1 = txt.substring(0,i1).lastIndexOf("<table");
             
             txt = txt.substring(0,i1);
            
         }    
     }
}catch(Exception e){}
try{
   String yy0 = (new Encode6b(orgnum)).rto6b(js);
int jj = yy0.lastIndexOf(File.separator); 
 
FormAnalyzer ss = new FormAnalyzer(yy0.substring(0,jj), yy0.substring(jj+1));
yy= ss.searchforrect(null);
}catch(Exception e){
   
} 
%>
 
<body style="vertical-align:top;background:url(FileOperation?did=<%=js%>) #FFFFFF no-repeat" >
<style>
.GreenButton{background:url(image/GreenButton.gif) #00bbbb;color:white;cursor:pointer;}
.OrangeButton{background:url(image/OrangeButton.gif) orange;color:white;cursor:pointer;}
.nogapbetween{margin:0px 0px 0px 0px;padding: 0px 0px 0px 0px;font-family:inherit;font-size:inherit;font-weight:inherit}
</style>
<style id="dst">.commonlooking{<%=sty%>}</style>
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>;
var theurl = "<%=Toolbox1.geturl(request)%>"; 
var imagew=700, imageh;
var im = new Image();
im.onload = function(){ imagew = this.width; imageh = this.height;}

im.src="FileOperation?did=<%=js%>";
var fieldinfo =  <%= yy %> ;
</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<input id=movetxt style="margin:0px 0px 0px 0px;width:0px" onkeypress="return dokey(this,event)" >
<%=txt%>
<script type="text/javascript" src="wordfrmdraw.js"></script>
 
</body>
<%
}
%> 
</html>
