var timeformat0 = timeformat;
var ss =timestr(timenow/1000,"MM/DD/YYYY hh:mm:ss");
var parsed =  parseTime(timenowstr0);
timeformat = timeformat0;
getTimelements(timeformat);
var diff = ~~((new Date()).getTime()/1000) -  parsed;
var zonedif = Math.round(diff/3600);
diff -= zonedif*3600;  
diff = ~~(diff/120);
 
let servertz = tzid/3600000;
 
let tzoffset =  zonedif + servertz;
let tzstr = '';
if ( Math.round(tzoffset) != tzoffset) tzstr = tzoffset.toFixed(1);
else tzstr = ("" + (tzoffset+0.1)).replace(/\..*/,'');
if (tzoffset > 0)tzstr = '+' + tzstr;
var zone = document.getElementById('zone');
if (zone!=null) 
{
    zone.innerHTML = '&nbsp;' +textmsg[1934]+ ":" + tzstr + (diff>0?('/' + diff):'');
    zone.previousSibling.width = '50';
}
 
function validat(fm)
{
    if (typeof (fm.code) != 'undefined' 
        && fm.code!=null )
    {
       fm.onbegin.value="21";
       if(fm.code.value=='')
       {
        myprompt(textmsg[716] +".");
        fm.code.focus();
        return false;
       }
    }

    var nav = window.open("","register",dim(600,600));
    return true;
}
  
function validate(ifm)
{
    
  if (document.f1.id.value == '' )
  {
    document.f1.id.focus();
    if (ifm==null)
        document.getElementById("loginhtr").innerHTML = "<font color=red>" +(textmsg[286])+ "</font>";
    else  if (parent.document.getElementById && parent.document.getElementById("loginhtr")!=null)
        parent.document.getElementById("loginhtr").innerHTML = "<font color=red>" +(textmsg[286])+ "</font>";
    return false;
  }
   
  if (document.f1.password1.value == '' )
  {
    document.f1.password1.focus();
    if (ifm==null)
        document.getElementById("loginhtr").innerHTML = "<font color=red>" +(textmsg[287]) + "</font>";
    else if (parent.document.getElementById && parent.document.getElementById("loginhtr")!=null)
        parent.document.getElementById("loginhtr").innerHTML = "<font color=red>" +(textmsg[287]) + '</font>';
    return false;
  } 
   
  var privatersa  = defaultrsakey; 
  saveMyrsakey(privatersa);
  var xx = privatersa.split(",");
  document.f1.pubkeys.value = xx[0] +"," + xx[2] +"," + xx[3];
  document.f1.password.value= hex_sha1(sessionid + sha1pass(document.f1.password1.value));
  document.f1.password1.value = ''; 
  document.f1.password1.disabled = true;
  document.f1.securitytoken.value = securitytoken;
  var ipt = document.createElement('input');
  ipt.type='hidden';
  ipt.name = 'zonedif';
  ipt.value = ''+ zonedif;
  document.f1.appendChild(ipt);
  var  oldid = GetCookie("oldid");
  if (oldid!=null && oldid!=document.f1.id.value)
  {
     SetCookie(oldid + "acinfo",''); 
     SetCookie(oldid + "tcmt",'');  
     SetCookie("oldid", document.f1.id.value);
  }
  document.f1.mobile.value = (ismobile()==true?'1':'0'); 
   
  return true;
}
 
var  oldid = GetCookie("oldid");
if (oldid != null && document.f1.id.value=='')
   document.f1.id.value = oldid;
  
 
function forgetpass()
{
   if (document.f1.id.value == '' )
   {
         document.f1.id.focus();
         myprompt(textmsg[286]);
         return;
   }
   else
   {
         myprompt("<img id=progress src=image/progress.gif>",null,null,"Email...");
         var ifr = document.querySelector('[name=w' + tstmp +']');
        
         ifr.src =  'forgetpass.jsp?id=' + document.f1.id.value ;
   }
 // window.open('forgetpass.jsp?id=' + document.f1.id.value, "forgetpa",
 // "toolboar=0,menubar=0,width=300,height=280,top=" + (screen.height-280)/2 +",left=" + (screen.width-300)/2);
}

function subfm()
{
    document.f1.id.value = parent.document.reloginfor.id.value;
    document.f1.password1.value = parent.document.reloginfor.password1.value;
    if (typeof(parent.document.reloginfor.patchcafield)!='undefined' && typeof(document.f1.patchcafield)!='undefined')
    document.f1.patchcafield.value = parent.document.reloginfor.patchcafield.value;
    parent.closeprompt();
    if (validate(1))
    {
        visual(document.f1);
        document.f1.submit();
    }
}

function getidv(bx)
{
   document.f1.id.value = bx.value;
}

function getPassv(bx)
{
   document.f1.password1.value = bx.value; 
}

 
function maybeparent()
{
    if (parent == self) return;
    var nm = window.name;
    if ( nm.replace(/w[0-9]+/g, '') != '' ) return;
     
    for (var k=0; k < parent.frames.length; k++)
    {
        if (parent.frames[k].name == nm)
        {    
            break;
        }
    }
    if (oldid == null ) oldid = '';
    var tbl = document.getElementById("entries").innerHTML;
         
    tbl = tbl.replace(/type="submit"/, " type=button onclick=window.frames[" + k + "].subfm() ")
    .replace(/ name="id"/,   " name=\"id\" value=\"" + oldid + "\" onblur=window.frames[" + k + "].getidv(this) ")
    .replace(/ name="password1"/, " name=\"password1\" onblur=window.frames[" + k + "].getPassv(this) ");
     
    parent.myprompt("<form rel=opener name=\"reloginfor\"   ><table cellpadding=3 id=entries border=0  cellspacing=1   width=290 align=center>" 
            + tbl + "</table></form>", null, null, textmsg[389]);
     
}
maybeparent();
 
 
 

