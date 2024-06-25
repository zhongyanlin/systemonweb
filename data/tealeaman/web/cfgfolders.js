function setact(a)
{
    if (a==1)
    {
      document.form1.target = "w" + tstmp;
      formnewaction(document.form1,"cfgfolders.jsp");
      //document.form1.target = "_blank"  ;
      //formnewaction(document.form1,"Echo");
    }
    else  
    { 
        
        document.form1.target = "backupwf"; 
        formnewaction(document.form1,"DataTable?rdap=backupfolder&subdb=");
    }
}
function check()
{
   var  folders = new Array(5);
    folders[0] = document.form1.websiteFolder.value;
    folders[1] = document.form1.webFileFolder.value;
    folders[2] = document.form1.webFileFolder1.value;
     folders[3] = document.form1.dbFileFolder.value;
    if (folders[3] == null || folders[3] == '')
    {
        myprompt(msg354);
        document.form1.dbFileFolder.focus();
        return false;
    }
    
    if (sl == '//') sl = '/';
    
     folders[4] = document.form1.workingFolder.value;
     
    for (var i=0; i < 5; i++)
    {
           if ( folders[i] == null) folders[i] = '';
           if ( folders[i] != ''  && folders[i].substring(folders[i].length-1) == sl) 
              folders[i] = folders[i].substring(0, folders[i].length-1);
    }

    for (var  i = 0; i < 5; i++)
    for (var  j = 0; j < i; j++)
    {
           if  ( i == 2 && j == 1 || folders[i]=="" || folders[j]=="") 
               continue;
           if (folders[i].toLowerCase()==folders[j].toLowerCase())
           {     
               myprompt(nms[i] + ' ' + msg352 + ' ' + nms[j] + msg353);
               return false;
           }
   } 
   document.form1.websiteFolder.value = folders[0];
   document.form1.webFileFolder.value = folders[1];
   document.form1.webFileFolder1.value = folders[2];
   document.form1.dbFileFolder.value = folders[3];
    document.form1.workingFolder.value = folders[4];
   formnewaction(document.form1) ;
  
   return true;
}
function nojs(t)
{
    t.value = removejs(t.value);
  }
function chcolor( )
{
   return true;
}
var sids = '';
var opt =''
function subchange(x)
{
     var mps = [];
     mps["GrantWebsite"] = textmsg[1752];
     mps["Grant"] =  textmsg[1751];
     mps["Revoke1"] =  textmsg[1753];
     mps["RevokeWebsite"] =  textmsg[1754];
     mps["Notify"] =    textmsg[1757];
     mps["Revoke"] =  textmsg[1753];
     opt = mps[x];
     if (document.getElementById('sid')!=null)
         sids = document.getElementById('sid').value 
              = document.getElementById('sid').value.replace(/^[\s]+/,'').replace(/[\s]+$/,'').replace(/[^a-z0-9]+/ig,'\n');
     
     if (x == 'Revoke1')
     {
         if (sids!='')
         myprompt(textmsg[1756] + "<br><center><input name=b1 type=button class=OrangeButton style=\"" + bwlen + "px\" value=\"" + textmsg[1757] + "\" onclick=subchange('Notify')>" + 
         "<input name=b2 type=button class=OrangeButton  style=\"" + bwlen + "px\"  value=\"" + textmsg[1758] + "\" onclick=subchange('Revoke')  ></center>");
     }
     else if (x == 'Notify')
     {
         
         var nms = ['opt','sids'];
         var vls = [x, sids];
         if (sids!='') 
         postopen('cfgfolders.jsp',nms,vls,  "w" + tstmp);
        
     }
     else
     {
         var nms = ['opt','sids'];
         
         var vls = [x, sids];
         if (sids!='')
         postopen('cfgfolders.jsp',nms,vls,  "w" + tstmp);
     }
}
function notdone(x, sids)
{
    if (sids=='') myprompt(msg71);
    else myprompt(opt + '<br>' + sids.replace(/,$/,'') + "<br>" + textmsg[91]);
}
function startfolder()
{
     var str =  "<form rel=opener name=f22  ><table width=96% align=center><tr><td  colspan=2>" + textmsg[1755] + "</td></tr>" + 
      "<tr><td   colspan=2><textarea rows=20 cols=40 style=width:404px name=sids id=sid></textarea></td></tr>" + 
     "<tr><td><input name=b2 type=radio value=\"GrantWebsite\"></td><td>" + textmsg[1752]  + "</td></tr>" +
     "<tr><td><input name=b2 type=radio value=\"Grant\" checked></td><td>" + textmsg[1751]  + "</td></tr>" + 
     "<tr><td><input name=b2 type=radio value=\"Revoke1\"></td><td>" + textmsg[1753]  + "</td></tr>" +
     "<tr><td><input name=b2 type=radio value=\"RevokeWebsite\"></td><td>" + textmsg[1754]  + "</td></tr>" + 
    "<tr><td colspan=2 align=center><input name=b1 type=button class=OrangeButton style=width:70px value=\"" + textmsg[720] + "\" onclick=subchange(document.f22.b2.value) >" + 
    "<input name=b3 type=button class=OrangeButton style=width:70px value=\"" + textmsg[18] + "\" onclick=closeprompt() ></td></tr></table></form>";
    myprompt(str,null,null,textmsg[154] + ' '+ textmsg[675]);
}



