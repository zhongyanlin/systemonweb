
<%@ page contentType="text/html; charset=utf-8" import="javax.activation.*,javax.mail.*,javax.mail.internet.*,telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<!DOCTYPE html>
<html >
    <head><% CachedStyle cachedstyle = new  CachedStyle(request, 0);%>
        <meta http-equiv="Content-Type" content="text/html; charset=GBK">
        <title>JSP Page</title>
    </head>
    <body>
        <h1>Hello World!</h1>
        <% 
            
           
  
  //String host="smtp.qq.com";  
  String user="534638858@qq.com";//change accordingly  
  //final String password="1200Duponthwy";//change accordingly  
    
  String to="zhongyanlin@yahoo.com";//change accordingly  
  
   //Get the session object  
   Properties props = new Properties();  
   /* props.put((Object)"mail.smtp.socketFactory.port", (Object)"465");
        props.put((Object)"mail.smtp.socketFactory.class", (Object)"javax.net.ssl.SSLSocketFactory");
        props.put((Object)"mail.smtp.port", (Object)"465");
           */
   props.put("mail.smtp.host", "127.0.0.1");  
   //props.put("mail.smtp.auth", "true");  
   
     
   javax.mail.Session session1 = javax.mail.Session.getDefaultInstance(props);  
  
   //Compose the message  
    try {  
     MimeMessage message = new MimeMessage(session1);  
     message.setFrom(new InternetAddress(user));  
     message.addRecipient(Message.RecipientType.TO,new InternetAddress(to));  
     message.setSubject("javatpoint");  
     message.setText("This is simple program of sending email using JavaMail API");  
       
    //send the message  
     Transport.send(message);  
  
      out.println("message sent successfully...");  
   
     } catch (MessagingException e) {out.println(e.toString());  e.printStackTrace();}  
  
                %>
    </body>
</html>
