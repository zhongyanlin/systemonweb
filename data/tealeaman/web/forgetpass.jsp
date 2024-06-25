<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*" %>

<%! 
void exect(ServletContext app, HttpServletRequest request, HttpServletResponse response, String page)
{
   try{RequestDispatcher  dispatcher  = app.getRequestDispatcher(page);
   dispatcher.forward(request, response);}catch(Exception e){}
}


String doit(String id, HttpSession session, String url, int orgnum) 
{ 
    
        String [] fields = {"email"};
        String [] to  =  User.getAttribute(orgnum,id,fields ); 
        String ans  =  id + Toolbox.emsgs(orgnum,1126);
        String ans1="";

        if (to!=null&&to.length>0&& to[0]!=null&&!to[0].equals(""))
        {

           String subject = Toolbox.emsgs(orgnum,818);
           fields[0] = "password";
           String [] to1  =  User.getAttribute(orgnum, id, fields);
          
           if (to1==null)
           {
              ans =  id +  " " + Toolbox.emsgs(orgnum,1531)  ;
 
           }
           else
           {
                String hash = Sha1.hash(id + Toolbox.apphashgene + to1[0]);
                int j = url.indexOf("forgetpass.jsp");
                String content = Toolbox.emsgs(orgnum,1128) +":\n" + url.substring(0,j) + "forgetpass.jsp?id=" + id +"&h=" + hash;
                String from =  Toolbox.dbadmin[orgnum%65536].stmpuser;
                
                   ans = Toolbox.emsgs(orgnum,1430) + "  host" ; 
                   try
                   {
                     ans = telaman.Email.postMail(to, subject, content, from, null, orgnum);
                     if (ans.equals(""))
                     {
                     int i = to[0].indexOf("@");
                     j = to[0].indexOf(".", i);
                     String fake = to[0].substring(0,i).replaceAll("[a-z]", "*")  + to[0].substring(i,j) +
                                   to[0].substring(j).replaceAll("[a-z]", "*");
                     ans =  Toolbox.emsgs(orgnum,1127).replaceFirst("#", fake)  ;
                     }
                     else
                     {
                        ans1 = ans;
                        ans = "";
                     }
                   }
                   catch(Exception e1)
                   {
                       ans1 = "," + Toolbox.dbadmin[orgnum%65536].stmphost; 
                       //ans = e.toString() + Toolbox.dbadmin[orgnum%65536].stmphost + Toolbox.dbadmin[orgnum%65536].stmpuser + Toolbox.dbadmin[orgnum%65536].stmppass;
                   }
                   //ans = e.toString() + Toolbox.dbadmin[orgnum%65536].stmphost + Toolbox.dbadmin[orgnum%65536].stmpuser + Toolbox.dbadmin[orgnum%65536].stmppass;
              
           }
     }
       
     ans =  ans   +   ans1 ;
     
     return ans;
} 
%>
<%
int orgnum = Toolbox.setcharset(request,response);
if (orgnum == -1) return;

if(!Toolbox.verifytoken(request) ) return;
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>"> 
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>
<title><%=Toolbox.emsgs(orgnum,164)%></title>
</head>
<body>
 
<br>
<%
User user = (User)(session.getAttribute("User"));
if ( user==null) user = new User(orgnum);
String id = Toolbox.defaultParam(orgnum,request,"id",null, null, 30);
String errmsg = "";
String hash = null;    
if (id == null || id.equals(""))
{
         
}
else if ( (hash = Toolbox.defaultParam(orgnum,request,"h",null, null, 100)) !=null )
{
    String [] fields = {"password","roles"};
    String passwd [] =  User.getAttribute(orgnum,id,fields);
    if (passwd == null)
    {
        out.println(id  + Toolbox.emsgs(orgnum,1531) );
    }
    else 
    {
        String saved = Sha1.hash(id + Toolbox.apphashgene + passwd[0]);
        long l = 1;try{ l = Long.parseLong(passwd[1]);}catch(Exception e){}
        if (saved.equals(hash))
        {
            user = new User(orgnum,id, passwd[0], l, null, cachedstyle.timeformat);
            session.setAttribute("User", user);
            session.removeAttribute("numoftries");
            try
            {
               javax.servlet.RequestDispatcher dispat =  application.getRequestDispatcher("/DataForm?rdap=userresetpass&rsacode=2&exbut=cp");
               dispat.forward(request,response);
            }catch(Exception e){ }
           
        }
        else
            out.println("Invalid link");
    }
}
else
{
    String er = doit(id, session,request.getRequestURL().toString(),orgnum).replaceAll("'", "\\'").replaceAll("\n", "<br>").replaceAll("\r", "<br>");
    
    out.print("<script>");
    out.println("if (parent==window) document.write('" + er + "'); else {let p = parent.document.getElementById('progress');\nif (p==null)parent.myprompt('"+ er + "'); else { let q=p.parentNode; q.innerHTML='" + er + "';}");
    out.println("}</script>");
    
}
%> 
</body></html>
 

