var app = document.location.search.replace(/^\?/,'');
var applink = {"Java2swift":"https://sourceforge.net/projects/j2swift/",
"Android2Java":"https://sourceforge.net/projects/a2java8/",
"Enquire-Response":"https://sourceforge.net/projects/response/",
"Android2SwiftUI":"https://sourceforge.net/projects/a2swiftui/",
"JDAO":"https://sourceforge.net/projects/jvdao/",
"Sorting-Demo":"https://sourceforge.net/projects/sorting-demo/",
"Facial-Attendance":"https://sourceforge.net/projects/facialattendance/",
"TeaLeaMan":"https://sourceforge.net/projects/tealeaman/",
"Special-Effect":"https://sourceforge.net/projects/specialeffect/",
"BBGrade":"https://sourceforge.net/projects/BBGrade/"};
 
 
 
 function $(x){return document.getElementById(x).value;}
 onload = function()
 {
     if (app == null) alert('Invalid software');
     else
     document.getElementById('software').innerHTML = app;
     if (applink[app] == null) alert('Invalid software');
     let x = localStorage['downloading'];
     if (x!=null)
     {
     var s = x.split(/#%@&/);
     document.getElementById('user').value = s[0];
     if (s.length>1)document.getElementById('email').value = s[1];
     if (s.length>2)document.getElementById('company').value = s[2];
     if (s.length>3)document.getElementById('position').value = s[3];
     }
     
 }
 function send()
 {
     if (applink[app] == null) alert('Invalid software');
     if ( $('user').replace(/ /g,'')=='')
     {
        document.getElementById('user').focus();
        return;
     }
     if ($('email').replace(/ /g,'')=='' ) 
     {
         document.getElementById('email').focus();
        return; 
     }
     localStorage['downloading'] = $('user') + "#%@&" + $('email') + "#%@&"
     + $('company') + "#%@&"+ $('position');
     document.getElementById('yourmail').innerHTML = 
     "In case you can not invoke your email program from this page, please send an email exactly as the following from your favorite email program:<br><table><tr><td><b>To:</b></td><td>linzhongyan@gmail.com</td></tr><tr><td><b>Reply(from):</b></td><td>"
     + $('email') + "</td></tr><tr><td><b>Subject:</b></td><td>Request-"+ app + "</td></tr><tr><td valign=top><b>Message:</b></td><td>" +  $('user')   + "<br>" + $('company') + "<br>" + $('position') + "</td></tr></table>";
     window.location.href = "mailto:linzhongyan@gmail.com?subject=Request-"
     +app + "&body=" + escape($('user')  + "\n" + $('company') + "\n" + $('position'));
     
 }
  


