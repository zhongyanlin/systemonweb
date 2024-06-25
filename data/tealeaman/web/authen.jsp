<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.io.*" %>
 
<% int orgnum = Toolbox.setcharset(request, response);
    if (orgnum == -1) return;
long tstmp = System.currentTimeMillis() % 10000000;
User user = null;
if ( (user = User.authorize(orgnum, Systemroles.TOTAL,application,session,request, response, "assignment.jsp", false)) == null) 
    return;
orgnum = user.orgnum; 

%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>"><head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>
<script type="text/javascript">  <%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("authen.jsp","f1")%>";
function parsefile1()
{
   let x = "<h3>,</h3>,<h2>,</h2>,<b>,</b>,<nobr>,</nobr>,<b>,</b>,<nobr>,</nobr>,<b>,</b>,<nobr>,</nobr>,<b>,</b>,<nobr>,</nobr>,<b>,</b>,<nobr>,</nobr>,<b>,</b>,<nobr>,</nobr>,<b>,</b>,<nobr>,</nobr>,</td><td align=left>,</td></tr><tr><td align=left>,<nobr>,</nobr>,<td align=left>,</td>,<nobr>,</nobr>,</td><td align=left>,</td>".split(/,/);
   let str = document.f1.message.value;
   let j, k=0;
   let z = '';
   for (let i=0; i < x.length/2; i++)
   {
       j = str.indexOf(x[2*i],k); if (j < 0) break;
       j += x[2*i].length; 
       k = str.indexOf(x[2*i+1],j);if (j < 0) break; 
       let y = str.substring(j, k);
       if (x[2*i] == '<nobr>')
       {
           z += padding(y, 20) ;
       }
       else
       {
           if ( i<10) y = y.replace(/<[a-z][^>]+>/g,'');
           else if (i==16 && y.includes('<table'))
           {
               let rs = y.split(/<\/tr><tr>/);
               let arr = [];
               let width = [];
               for (let r = 0; r < rs.length; r++)
               {
                   arr[r] = [];
                   let cs = rs[r].split(/<\/td><td[^>]*>/);
                   for (l=0; l < cs.length; l++)
                   {
                       let x = cs[l].replace(/<[a-z][^><]*>/g, ' ').replace(/<\/[a-z][^><]*>/g, ' ').replace(/^[ ]+/,'').replace(/[ ]+$/,'');
                       if (width[l] == null) width[l] = x.length;
                       else if (width[l] < x.length)width[l] = x.length;
                       arr[r][l] = x;
                   }
               }
               y = '\n' + padding('',20);
               for (let r = 0; r < arr.length; r++)
               {
                    
                    for (l=0; l < arr[r].length; l++)
                      y += padding(arr[r][l], width[l]+2);
                     y+='\n';
                     y += padding('',20);
               }
           }
           z += y +'\n';
       }
       k += x[2*i+1].length;
   }
   document.f1.message.value = z;
   enablebut(false);
}

function padding(y, n)
{
   for (let i=y.length; i < n; i++)
       y += ' ';
   return y;
}
function enablebut(b)
{
    document.f1.parsebtn.style.display = b?'inline':'none';
}

</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
 
<title> <%= Toolbox.emsgs(orgnum,1293) %> </title>
<link rel="stylesheet" type="text/css" href="stylea.css" />
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<title><%=Toolbox.emsgs(orgnum,1293)%></title>
</head>
    
    <body  style="background-color:<%= cachedstyle.DBGCOLOR %>;margin:5px 5px 5px 5px" ><table align="center">
       <%=Toolbox.title( Toolbox.emsgs(orgnum,1293),1)%>
       
       <tr><td> </td></tr>
       <tr><td>
       <div class=outset1 style="width:800px;border-radius:3px;"> <%= Toolbox.emsgs(orgnum,1400)%><br></div>
           </td></tr>
        <tr><td> </td></tr>
        <tr><td align="center"> 
        <div class=outset1 style="width:800px;border-radius:3px; ">
         <div style="text-align:left;">
                1. <%=Toolbox.emsgs(orgnum,1402)%> 
         </div>
        
        <form rel=opener name="f1"   method="post"  action="Everify" target="w<%=tstmp%>" >
        <input name="localpath" type="file"  onchange="javascript:enablebut(true);openfileto(this,document.f1.message,parsefile1)" ><input name="parsebtn" class=GreenButton type="button" value="Parse"  onclick="parsefile1()" >
        <textarea name="message" rows="15"  style="border:1px #b0b0b0 solid;width:794px;Courier" ></textarea><br>
        
        
         
          <img src="patchca.png" alt="<%=Toolbox.emsgs(orgnum,1463)%>"  style="cursor:pointer;vertical-align:text-bottom;height:22px;line-height:22px;margin:0px 0px -3px 0px" onclick="this.src=this.src+'?'+Math.random();">
          <input type="text" name="patchcafield"   style="border:1px #b0b0b0 solid !important;width:80px;font-size:18px"> 
          <input name="submit1" type="button" class="OrangeButton"  style="width:70px" value="<%=Toolbox.emsgs(orgnum,55)%>" onclick="f1submit()" >
        </form>
        </div>
        </td></tr> 
       
       <tr><td> </td></tr>
       
       <tr><td> 
        <div class=outset1 style="width:800px;border-radius:3px;text-align:left;">2. <%=Toolbox.emsgs(orgnum,1403)%>   <%
        MyRSA rsa = new MyRSA(Esign.signrsastr,(byte)Toolbox.locales[orgnum>>16].charsize); 
        out.println(rsa.publickey().replaceFirst(",[^,]+$", "") );
        %></div> </td></tr>
       
        </table>
       
       <script>
       function f1submit()
       {
           formnewaction(document.f1, "Everify");
           
           visual(document.f1);
document.f1.submit();
       }
        
       </script>
      <script type="text/javascript"  src="curve.js" ></script>
      <script> onload = function (){document.f1.message.style.fontFamily = 'courier';}</script>
      <p  align=center   style="color:<%=cachedstyle.IBGCOLOR%>;font-size:12px" ><nobr> <%= Toolbox.copyright[orgnum>>16]%> </nobr> </p>
    </center>
    <iframe name="w<%=tstmp%>" style="border:1px #b0b0b0 solid;visibility: hidden" width="1"  height="1" />
    </body>
</html>
