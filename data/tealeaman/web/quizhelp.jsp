<%@  page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*,java.io.*" %>
<%
int orgnum = Toolbox.setcharset(request,response);
if (orgnum == -1) return;
User user = null;
if ( (user = User.authorize(orgnum, Systemroles.INSTRUCTOR|Systemroles.STUDENT,application,session,request, response, "assigndoc.jsp", true)) == null|| !Toolbox.verifytoken(request)) 
   return;
String backupinfo0 = Toolbox.dbadmin[orgnum%65536].error2;
boolean backupset = true;
if (backupinfo0!=null && !backupinfo0.equals("")) 
{   
     String xx = Sha1.hash(user.firstname + user.lastname + user.id);
    backupinfo0 = backupinfo0+ "?id=" + user.id + "&passcode=" + xx;
    try{Toolbox1.SetCookie(response, "backupinfo", backupinfo0); }catch(Exception e){backupset = false;}
}

%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum) + Toolbox.jaxhead%>
<title> </title>
<script type=text/javascript>
    <%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("assigndoc.jsp","f1")%>";
    var needtranslator = true;
    <%=Toolbox.someconsts(orgnum)%>
</script>
<script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script>
<script type=text/javascript  src=encryption.js></script>
<script type=text/javascript  src=cookie.js></script>
<script type="text/javascript" src="checkHTML.js"> </script> 
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="stylea.css" />
<link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<script>
<% 

if(backupset == false){%>   var backupinfo = '<%=backupinfo0%>';<%}%>
resumehalted = function()
{
    expiretime = activeidletime + (new Date()).getTime();
    saveit();
}
function showerr(s)
{
    document.getElementById('relogin').innerHTML =s;
}
myprompt = function(x,x1,x2,x3)
{
    var z = document.getElementById('relogin');
    z.innerHTML = x; 
    z.className='outset3';
    z.style.padding = '4px';
}
function closeprompt()
{
    var z = document.getElementById('relogin'); 
    z.className=null;
}
function keyrestrict(evt){
    var e = evt? evt : window.event;
    if(!e) return true;
    var key = 0;
    if (e.keyCode){key = e.keyCode;} 
    else if (typeof(e.which)!= 'undefined'){key = e.which;} 
    return (key==3||key==22);
}
function syn(x,x1,x2){
    
    var d = new Date();showerr(d.getHours() + ':' + d.getMinutes());
    if (typeof(parent.frames[0].onbeforeunload)!='undefined' && parent.frames[0].onbeforeunload!=null)
        parent.frames[0].onbeforeunload=null;
}

function saveit(){
    parent.frames[0].delcac();
    var tt=document.f.Content.value;
    document.f.format.value = parent.frames[0].guessfmt();
    document.f.attach.value = parent.frames[0].leftattach();
    document.f.Content.value=tt.replace(/[0-9]+[\r|\n]+/,'');
    visual(document.f);
    document.f.submit();
    document.f.Content.value=tt;
}
function saveit1()
{
     saveit();
}
 
function chatsend()
{
    var txt = document.getElementById('chattxt');
    if (txt.value == '')
    {
        parent.frames[0].checkreply();
        return;
    }
    checkHTML(txt,true);
    let str = txt.value;
    
    var fmt=guessFormat(str);
     var area = null;
     var chatmsgnum = parent.frames[0].getchatmsgnum();
     var chatmsgs = parent.frames[0].getchatmsgs();
     var chatmsgorient = parent.frames[0].getchatmsgorient();
     if (chatmsgorient[chatmsgnum]==1 && chatmsgs[chatmsgnum]=='' &&  document.getElementById('chatmsg' + chatmsgnum)!=null)
     {
        area = document.getElementById('chatmsg' + chatmsgnum);
        LaTexHTML.deformat(area);
        chatmsgs[chatmsgnum] = str;
     }
     else
     {
        chatmsgnum++;
        parent.frames[0].setchatmsgnum(chatmsgnum);
        chatmsgs[chatmsgnum] = str;
        chatmsgorient[chatmsgnum]= 1;
        area=  document.createElement('div');
        area.id= 'chatmsg' + chatmsgnum;
        area.style.cssText = 'font-family:inherit;font-size:12px;color:#008800';
        document.getElementById('chatmsg').appendChild(area); 
     }
     
     area.innerHTML = '&uarr;' + formatstr(str, fmt);
     if (fmt + '' == '2') LaTexHTML.formatele(area);
     if (parent.frames[0].proctored)  
         parent.frames[0].sendprocmsg("ak"+str);
     else
         parent.frames[0].askquestion();
     parent.frames[0].tic();
     txt.value = '';
}
  
function chatdisplaytxt(ta,evt)
{
  var e = evt? evt : window.event;
  
 if(!e) return true;
 var key = 0;
 if (e.keyCode)
 {
     key = e.keyCode;
 }  
 else if (typeof(e.which)!= 'undefined')
 {
     key = e.which;
 }
  
 if (key == 36 || key==62)
 {
     var p = caretPos(ta) ;
     var str = '';
     var ch = String.fromCharCode(key);
     if (p > 0)
        str   = ta.value.substring(0,p) + ch +  ta.value.substring(p);
     else
        str   =   ch +  ta.value.substring(p);
     var fmt=guessFormat(str);
     var area = null;
     var chatmsgnum = parent.frames[0].getchatmsgnum();
     var chatmsgs = parent.frames[0].getchatmsgs();
     var chatmsgorient = parent.frames[0].getchatmsgorient();
     if (chatmsgorient[chatmsgnum]==1 && chatmsgs[chatmsgnum] == '')
     {
        area =  document.getElementById('chatmsg' + chatmsgnum);
        if (fmt + '' == '2') 
            LaTexHTML.deformat(area);
     }
     else
     {
        chatmsgnum++;
        parent.frames[0].setchatmsgnum(chatmsgnum);
        chatmsgs[chatmsgnum] = '';
        chatmsgorient[chatmsgnum]= 1;
        area=  document.createElement('div');
        area.id= 'chatmsg' + chatmsgnum;
        area.style.cssText = 'font-family:inherit;font-size:12px;color:#008800';
        document.getElementById('chatmsg').appendChild(area); 
     }
     area.innerHTML =   formatstr(str, fmt);
     if (fmt + '' == '2') LaTexHTML.formatele(area);
  }
   
  return true;
}
var savedQuizName = null;
function openbackup()
{
    let f1 = document.f;
    savedQuizName = (orgnum%65536) + '-' + f1.semester.value + '-' +   f1.course.value + "-" + f1.assignname.value + '-' + f1.sid.value;
    try{f1.attach.value = parent.frames[0].document.f1.attach.value;}catch(e){}
    myprompt("Only when left window is frozen and only once.<input type=checkbox onclick=backups(this)>Frozon");
    
} 
let done = false;
function backupbyajax1(iid, line, key)
{
    savedQuizName = key;
    backupbyajax(iid, line);
}
function backups(ck)
{
    if (done || ck.checked == false) return;
    let subm = ~~((new Date()).getTime()/1000);
    let f = document.f;
    let line =  subm + ",'" + f.sid.value + "','" + f.semester.value + "','" + f.course.value + "','" + f.assignname.value + "','" + f.Content.value.replace(/'/g,"''") 
     + "','" + f.leavs.value + "',-1," + subm + ",'" + f.format.value + "','" + f.attach.value + "',''";
    backupbyajax(f.subdb.value, line);
    done = true;
    document.getElementById('google').style.visibility = 'hidden';
}
</script>
</head>
<body>
<script>
    document.write(parent.frames[0].dyncontent);
</script>
<script type=text/javascript  src=curve.js?sn=40&dn=30></script>        
</body>
</html>
