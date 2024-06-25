<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>
<% 
 int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if ( (user = User.authorize(orgnum, Systemroles.INSTRUCTOR,application,session,request, response, "assignmentindex.jsp", true)) == null) 
    return;
orgnum = user.orgnum; 
int type = 0; 
try{type=Integer.parseInt( Toolbox.defaultParam(orgnum,request, ("Type"), null));}catch(Exception e){}
if (type<1 || type > 3)
{%>
   <script type="text/javascript" > close()</script>
<%
return;
}
CachedStyle cachedstyle = new  CachedStyle(request, orgnum);
String style = Toolbox.butstyle(cachedstyle.fontsize);
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head>
<%=Toolbox.getMeta(orgnum)%>
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" /> 
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("cfgquiz.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript" >
    document.write(unifontstyle(<%=cachedstyle.fontsize%>));
var captions = textmsg[798].split(",");</script>
<style type="text/css">
input.field {border:1px #b0b0b0 solid;}
input.chk {background-color:<%=cachedstyle.DBGCOLOR%>}
</style>
</head>
<body style="margin:0px 0px 0px 0px">
<TABLE width=100% border=0   cellpadding=0 cellspacing=5>
  <TR><TD valign=TOP> 
  <script type="text/javascript" >document.write(unititle(captions[<%=type%>] + ' <%=Toolbox.emsgs(orgnum,366)%>','outset2'))</script>
  
</td></tr>
<tr><td>
<script type="text/javascript" >document.write(round1('100%'));</script>
<table BORDER=0 cellspacing=1 width=100% class=outset3 ><tr><td>

<form rel=opener name=form1  >
    
<table border=0>
 
<% if ( type > 1) { %>   
<tr><td> 
<input type=checkbox name=o class="chk" >
</td><td   colspan=2>
<nobr><%=Toolbox.emsgs(orgnum,367)%></nobr>
</td></tr>    


<tr><td > 
<input type=checkbox name=r  class="chk" >
</td><td   colspan=2>
<nobr><%=Toolbox.emsgs(orgnum,368)%></nobr></td></tr>

<%} if ( type == 3) { %>
<!--tr><td><input type=checkbox name=d  style="background-color:<%=cachedstyle.DBGCOLOR%>" >
</td><td   colspan=2>
<nobr><%=Toolbox.emsgs(orgnum,369)%></nobr></td></tr-->
<%} if ( type >= 2 )  { %>
<tr><td><input type=checkbox name=p  class="chk">
</td><td   colspan=2>
<nobr><%=Toolbox.emsgs(orgnum,1333)%></nobr></td></tr>
<%}%>


<tr><td align=center> 
<img src=image/tri2.gif >
</td><td >
<nobr><%=Toolbox.emsgs(orgnum,370)%></nobr>
</td><td>
<nobr><%=Toolbox.emsgs(orgnum,67)%><select name=ff  ></select>
      <%=Toolbox.emsgs(orgnum,371)%><select name=fs  ></select>
      <%=Toolbox.emsgs(orgnum,69)%><select name=fw  ></select>
</nobr>
</td></tr>
<%if ( type == 2 || type == 3) {%>
<tr><td  align=center> 
<img src=image/tri2.gif >
</td><td>
<nobr><%=Toolbox.emsgs(orgnum,1089)%></nobr>
</td><td>
<input name=cd class="field">
</td></tr>


<tr><td  align=center> 
<img src=image/tri2.gif >
</td><td>
<nobr><%=Toolbox.emsgs(orgnum,1090)%></nobr>
</td><td>
        <input name=ip  class="field">   <nobr>(<%=Toolbox.emsgs(orgnum,1130)%>:<%=request.getRemoteAddr()%>)</nobr>
</td></tr>


<%} if ( type == 1 || type == 3) {%>
<tr><td   align=center> 
<img src=image/tri2.gif >
</td><td colspan="2" valign="top" ><nobr><%=Toolbox.emsgs(orgnum,372)%></nobr>
<input name=dr value="0" size=2  class="field" onkeypress="return numberonly(event)">
<nobr><%=Toolbox.emsgs(orgnum,1372)%></nobr>
<input name=f size=20 value="S"  class="field" onchange=parseit(this)>
</td></tr>

<tr><td>&nbsp;&nbsp;
</td><td colspan=2>
<nobr><%=Toolbox.emsgs(orgnum,373)%>:</nobr>
<table>
<tr><td width=50></td><td width=50> <b><%=Toolbox.emsgs(orgnum,374)%></td> <td><%=Toolbox.emsgs(orgnum,375)%></td></tr>
<tr><td width=50></td><td width=50> <b> S </td> <td><%=Toolbox.emsgs(orgnum,376)%></td></tr>
<tr><td width=50></td><td width=50> <b> Q </td> <td><%=Toolbox.emsgs(orgnum,377)%></td></tr>
</table>
</td></tr>

<tr><td></td>
<td colspan=2>
<nobr><%=Toolbox.emsgs(orgnum,378)%>:</nobr>
<table border=0>
<tr><td width=50></td><td width=50> <b>  <font size=+1> + </font></b> </td><td><%=Toolbox.emsgs(orgnum,379)%></td>
 <td width=50></td><td width=50> <b> <font size=+1> - </font></b> </td><td><%=Toolbox.emsgs(orgnum,380)%></td></tr>
<tr><td width=50></td><td width=50> <b> <font size=+1> * </font></b>   </td><td><%=Toolbox.emsgs(orgnum,381)%></td>
 <td width=50></td><td width=50> <b>  <font size=+0> / </font></b>  </td><td><%=Toolbox.emsgs(orgnum,382)%></td></tr>
<tr><td width=50></td><td width=50> <b>  <font size=+2> ^ </font></b>  </td><td><%=Toolbox.emsgs(orgnum,383)%></td>
 <td width=50></td><td width=50> <b>  <font size=+0> (&nbsp;&nbsp;) </font></b>  </td><td><%=Toolbox.emsgs(orgnum,1133)%></td></tr>

</table>

</td></tr>
<tr><td>
&nbsp;&nbsp;
</td><td colspan=2>
<%=Toolbox.emsgs(orgnum,385)%>:
<table border=0>
<tr><td width=50></td><td width=200> <b>  S </td> <td><%=Toolbox.emsgs(orgnum,386)%></td></tr>
<tr><td width=50></td><td width=200> <b>  100*S/Q </td> <td><%=Toolbox.emsgs(orgnum,387)%></td></tr>
<tr><td width=50></td><td width=200> <b>  100*(S/Q)^0.5 </td><td><%=Toolbox.emsgs(orgnum,388)%></td></tr>
<tr><td width=50></td><td width=200> <b>  30 + 70*S/Q </td><td><%=Toolbox.emsgs(orgnum,389)%></td></tr>
</table>
</td></tr>
<%}%> 
</table>
</td></tr></table>
 <script type="text/javascript" >document.write(round2);</script>
</td></tr><tr><td align=center>
<input name=b1 class=GreenButton type=button <%=style%>;  value="<%=Toolbox.emsgs(orgnum,813)%>" onclick=tryit()>
<input name=b2 class=GreenButton type=button <%=style%>;  value="<%=Toolbox.emsgs(orgnum,46)%>"  onclick=setback()>
</form>


</td></tr></table>



<center>
     <nobr><font style="font-size:12px" color=<%=cachedstyle.IBGCOLOR%> > <%= Toolbox.copyright[orgnum>>16]%></font></nobr>
 </center>




<script type="text/javascript" >

if (document.location.toString().indexOf("localhost") >= 0
    && typeof (handleErr) == 'undefined')
{
function handleErr(msg, url, l)
{
      var txt= "There was an error on this page.\n\n"
       + "Error: " + msg + "\n"
       + "URL:   " + url + "\n"
       + "Line:  " + l + "\n\n"
       + "Click OK to continue.\n\n";
       myprompt(txt);
      window.onerror = handleErr;
      return true;
}
window.onerror = handleErr;
}

function tryit()
{
    if (setvalues()) 
      opener.testmultitest();
 
}
function setback()
{
   if (setvalues())
   {
      opener.applyoptions();
      var win=window.open('','_top','',true);win.opener=true;win.close();
   }
 
}
 
 
var fm = document.form1; 
var type = <%=type%>;
var assoptions = "<%=Generic.handle(Toolbox.defaultParam(orgnum,request, "Options", "ff:courier;fs:16;fw:650;"))%>";
 
function extract(nm)
{
  if (assoptions == null) return null;
  var ii = assoptions.indexOf(";" + nm + ":");
  var k  = assoptions.indexOf(";cd:");
  var result = null;
  if (ii == -1 || ii > k && k>=0 )
  {
     if (nm.length > 1 || nm=='f')
         result = "";
  }
  else  //  ;ip:;cd:;d:;f:100*C/Q;ff:courier;fs:18;fw:650
  {
     var jj = assoptions.indexOf(";", ii+2);
     if (jj == -1 || nm == 'cd')
         result =  assoptions.substring(ii+2+nm.length);
     else
         result = assoptions.substring(ii+2+nm.length, jj);
  }
  return result;
 // document.write("Extract (" + nm + ")=" + result +"<br>");
}

function setcfg()
{  
  assoptions = ";" + assoptions;
  
  var fs = extract("fs");  
  var ff = extract("ff");
  var fw = extract("fw");  
 
  for (var i = 0; i < 22; i++)
  {
    fm.fs.options[i] = new Option(""+(10+i), ""+(10+i) );
    if (fs == "" +(10+i))
      fm.fs.selectedIndex = i;
  } 
  var fns = new Array ('arial','courier','times'); 
  for(var i =0; i < fns.length; i++)
  {
    fm.ff.options[i] = new Option(fns[i], fns[i]);
    if (ff == fns[i])  fm.ff.selectedIndex = i;
  }
  for (var i = 0; i < 5; i++)
  {
    fm.fw.options[i] = new Option(""+ (600+50*i), ""+ (600+50*i));
    if (fw == ""+ (600+50*i))  fm.fw.selectedIndex = i;
  }
  var tmp = "";
  if (type > 1 )
  {
      fm.o.checked =(extract("o")!=null );
      fm.r.checked =(extract("r")!=null );
      tmp = extract("cd");  
      if ("" + tmp == "undefined")
          tmp = "";
      fm.cd.value = tmp; 
      tmp = extract("ip");  
      if ("" +  tmp == "undefined")
          tmp = "";
      fm.ip.value = tmp;     
  }
  
  if (type==3) // if m test
  {
    //  fm.d.checked = (extract("d")!=null );

  }

  if (type>=2) // if m test
  {
      fm.p.checked = (extract("p")!=null );
  }
  
  //if (type==3 || type==1)  // if multiple
  {
      tmp = extract("f");
      if ("" + tmp == "undefined")
      {
          fm.f.value = "x";
          fm.dr.value = "0";
      }
      else
      {
          tmp = tmp.replace(/C/g,"S");
          var i = tmp.indexOf("|");
          if (i==-1)
              fm.dr.value="0";
          else
          {
             fm.dr.value= tmp.substring(0,i);
          }
          fm.f.value = tmp.substring(i+1);

      }
  }
}

function numberonly(evt)
{
   var e = evt? evt : window.event;
   if(!e) return true;
   var key = 0;
   if (e.keyCode) { key = e.keyCode; } // for moz/fb, if keyCode==0 use 'which'
   else if (typeof(e.which)!= 'undefined') { key = e.which; }
   return (key >= 48  && key <= 57)
    
}

function parseit(txt)
{
   txt.value = txt.value.replace(/ /g, '').toUpperCase();
   if (txt.value == '')
   {
        myprompt("<%=Toolbox.emsgs(orgnum,390)%>");
        txt.value = "S";
   }
   var num = txt.value.replace(/[S|Q|0-9|\.|\+|\-|\*|\/|\^|\)|\(]+/g, '');
   if (''!= num )
   {
        myprompt(num + " <%=Toolbox.emsgs(orgnum,392)%>");
        txt.focus();
        return false;
   }
   txt.value = txt.value.replace(/\s/g,'');
   var num = txt.value.replace(/S/g,'1').replace(/Q/g,'2');
   if (evalhat(num) == 'NaN')
   {
        myprompt(txt.value + "  is invalid");
        txt.focus();
        return false;
   }
   return true;
}
function evalhat(x)
{
    var i=x.indexOf('^');
    if (i==-1)
    {
        var t = 0;
        try{ t= eval(x);}catch(e){return 'NaN';}
         
        return t;
    }
    if (i==0||i==x.length-1) return 'NaN';
    var j=i+1;
    var lft,rt;
    if (x.charAt(j)=='(')
    {
        var np = 1;
        for(j++; j < x.length; j++)
        {
          if (x.charAt(j)=='(') np++;
          else if (x.charAt(j)==')') np--;
          if (np==0) break;
        }
        if (np>0) return 'NaN';
        j++;
        rt = evalhat(x.substring(i+1,j));
        if (rt=='NaN') return 'NaN';
    }
    else if ("0123456789.".indexOf(x.charAt(j)) >= 0)
    {
        for (j++; j < x.length; j++)
        {
            if ("0123456789.".indexOf(x.charAt(j)) < 0) break;
        }
        rt = parseFloat(x.substring(i+1,j))
    }
    else return 'NaN';
    var k=i-1;
    if (x.charAt(k)==')')
    {
        var np = 1;
        for(k--; k>=0; k--)
        {
          if (x.charAt(k)==')') np++;
          else if (x.charAt(k)=='(') np--;
          if (np==0) break;
        }
        if (np>0) return 'NaN';

        lft = evalhat(x.substring(k,i));
        if (lft=='NaN') return 'NaN';
    }
    else if ("0123456789.".indexOf(x.charAt(k)) >= 0)
    {
        for (k--; k>=0; k--)
        {
            if ("0123456789.".indexOf(x.charAt(k)) < 0) break;
        }
        if(k>0) k++;
        lft = parseFloat(x.substring(k,i));
    }
    else return 'NaN';

    var z = Math.pow(lft, rt);
    if (k==0)
    {
        if (j==x.length) return z;
        return evalhat(z + x.substring(j));
    }
    else
    {
        if (j==x.length) return evalhat(x.substring(0,k) + z);
        return evalhat(x.substring(0,k) + z + x.substring(j));
    }
}

function setOption(ele,txt)
{
    if (assoptions != '')
        assoptions +=";";
    assoptions += ele +":" + txt;
} 
function setOptionSel(nm)
{
    setOption(nm.name, nm.options[nm.selectedIndex].value);
}
function setOptionEle(nm)
{
    if (nm.name=='f')
        setOption(nm.name,fm.dr.value +"|" + nm.value);
    else
        setOption(nm.name,nm.value);
}
function setflag(ck)
{
   if (ck.checked) setOption(ck.name,"");
}
function setvalues()
{
   assoptions="";
   if ((type == 1 || type == 3)&& parseit(fm.f) == false) 
      return false;
   if (type > 1)
   {
       setflag(fm.o);
       setflag(fm.r);
   }
   if (type >= 2)
      setflag(fm.p);
   if (type==3) 
   {
      //setflag(fm.d);
   }
   setOptionSel(fm.ff);
   setOptionSel(fm.fs);
   setOptionSel(fm.fw);
   if (type > 1)
   {
       setOptionEle(fm.ip);
       
   }

   setOptionEle(fm.f);

   if (type > 1)setOptionEle(fm.cd);
    
   opener.setv(0, 14, assoptions);

    
   return true;  
 
}

function testit(ck)
{
  // resizeTo(600, 600);
  // opener.testmultitest();
}
resizebut(document.form1, <%=cachedstyle.fontsize%>);
setcfg();
resizeTo(screen.width-220, screen.height);
<%=Toolbox.msgjspout((orgnum%65536)+user.id,true)%>
</script>
<script type="text/javascript"  src=curve.js></script>     
</html>
