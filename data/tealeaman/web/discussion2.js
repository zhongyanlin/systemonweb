function openit(str,l, pd, tp)
{
   if (replywin != null) replywin.close();
   replywin  = window.open("", "replywin", dim(520,620));
   var rootstyle = document.getElementsByTagName("head")[0].innerHTML;
   let jj = rootstyle.indexOf(":root");
   if (jj == -1)rootstyle = '';
   else 
   {
      let kk = rootstyle.indexOf("}",jj);
      rootstyle = "<style>" + rootstyle.substring(jj,kk+1) + "</style>";
   }
   replywin.document.getElementsByTagName("body")[0].innerHTML = "";
   replywin.document.write(
  '<html><meta http-equiv="Content-Type" content="text/html; charset=' + encoding +'">' + "<head><title>" + msg897 +"</title><scr" + "ipt src=textmsgs.js></" + "scr" + "ipt>"
+  rootstyle + "<link rel=stylesheet type=text/css href=stylea.css /><link rel=stylesheet type=text/css href=styleb" + (orgnum) + ".css /></head>"
+ "<body style=\"background-color:" + DBGCOLOR + ";margin:5px 5px 5px 5px\" >"
+ title      
+ "<form rel=opener name=form1 method=post style=\"margin:5px 0px 5px 0px\" action=DataUpdate  >\n"
+ "<input type=hidden name=rdap value=\"" + str +"\">"
+ "<input type=hidden name=id value=\"");
if (str.indexOf("edit") > 0)
 replywin.document.write(pd);
else
 replywin.document.write(jj);
replywin.document.write("\"><input type=hidden name=fid value=\"" + pd + "\">\n"
+ "<input type=hidden name=author value=\"" + ssn +"\">\n"
+ "<input type=hidden name=format value=0>\n"
+ "<input type=hidden name=courseid value=\"TeaLeaMan\" >\n"
+ "<table align=center class=outset1 width=100% >\n"
+ "<tr  height=25>"  + field1  
+ "<td><input type=\"text\" name=\"topic\" style=\"width:440px\" value=\"" + tp.replace(/"/g,"\\\"") +"\" size=50 onblur=javascript:opener.killsp(this)></td></tr>"
+ "<tr> " + field2  
+ "<td><textarea name=\"content\" style=\"width:440px;height:400px\" onblur=javascript:opener.killsp(this)>");
if (l>=0 && content[l]!=null) 
  replywin.document.write(content[l].replace(/</g,"\0x3c"));
 replywin.document.write( "</textarea></td></tr></table>"
+ "<table><tr height=5><td></td></tr></table><center> <input class=GreenButton style=width:68px type=submit value=\"" + msg901 +"\"> </form>" 
+ "<scri" + "pt>function resizeCont(){opener.resizeCont(window);} window.onresize = resizeCont; </scri" +"pt>"
+ "</body></html>");
    
replywin.resizeTo(540, 620);
replywin.moveTo((screen.width - 540)/2, (screen.height - 620)/2);
}
function resizeCont(replywin)
{
      var wd = screen.width - 100;
      var het = screen.height - 2 ;
       
      if (navigator.appName=='Microsoft Internet Explorer') 
      {
          wd = replywin.document.body.offsetWidth ;
          het = replywin.document.body.offsetHeight;
      }
      else if(navigator.appName=='Netscape')
      {
          wd = replywin.innerWidth;
          het = replywin.innerHeight;
      }
      
      het -= 200; wd-=100;
      het = Math.floor(het);
      if (wd < 100)  wd = 100;
      if (het < 100) het = 100;
       
      replywin.document.form1.content.style.width= ""  + wd+  "px";
      replywin.document.form1.topic.style.width= ""  + wd+  "px";
      replywin.document.form1.content.style.height="" + het+ "px"; 
}
 
function killsp(ta)
{
   if (ta.value=='') ta.value='deleted';
}
function syn(s)
{
   if (s == '1')
   {
      replywin.close();
      document.location.reload();
    }
   
}
function openit1(str, pd, tp)
{
   myprompt(msg1067 + " \"" +  tp +"\"?",null,"if(v)open2(" + pd + ")");
}
function open2(pd)
{
   formnewaction(document.form1, "DataUpdate");
   document.form1.id.value = pd;
   document.form1.courseid.value = 'TeaLeaMan';
   document.form1.rdap.value = "forumdelete";
   visual(document.form1);
document.form1.submit();
}
moveTo(screen.width*15/100,screen.height*5/100);
resizeTo(screen.width*70/100, screen.height*90/100);