/**************************************************************************
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
 
var attachref = null;
function setattachref(x)
{
   if( x != attachref)
   attachref = x;
}
function getattachref()
{
   return attachref;
}

var filetobedeleted = null;
function setfiletobedel(filename)
{
    filetobedeleted = filename;
}
function updateattch()
{
   var  filename =  filetobedeleted;
   if (attachref != null)
   {
      attachref.value = attachref.value.replace(new RegExp("[^@]+@[^@]@" + filetobedeleted +","), "");
      if (typeof(valuechanged) != 'undefined')
          valuechanged[counter] = true;
   }
}


if (typeof(openmid)=='undefined')
{
  function openmid(url,x,y)
  {
  if (x==null) x= '300';
  if (y == null) y = '300';
  window.open(url,'winname', 'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width='+x +',height=' +y +',top=' +(screen.height-y)/2+',left=' + (screen.width-x)/2);
  }
}
function refreshatt()
{
    closeprompt();
    updateattch();
    attachman(attachref);
}
if (typeof (nav1)== 'undefined')
    var nav1=null;
var savedfiletodelete = '';
 
function deleteAttachedFile(codedpath)
{
   setfiletobedel(codedpath);
   savedfiletodelete ="FileOperation?did=" + codedpath + '&operation=delet';
   myprompt(textmsg[809] + "?",null,"delgoahead(v)");
}
function showback()
{
    attachman(attachref);
}
function delgoahead(v)
{
   if (v == false) showback();
   else{
   nav1 = window.open(savedfiletodelete,'w' + tstmp);
   nav1.opener = self;
   }
}
 

function openAttachedFile(codedpath)
{
  openmid( "FileOperation?did=" + codedpath + '&operation=open');
}

function attachman(attach_h)
{
   if (attach_h == null) 
   attach_h = f1.Attachment;
    
   var hasframe = false;
   if (parent!=window && typeof(upperrightwin)!='undefined' && upperrightwin!=null)
    hasframe = true;
    
   setattachref(attach_h);

   var dbgcolor = "lightyellow", ibgcolor="teal", bbgcolor = "grey", tbgcolor="white";
   if (typeof(DBGCOLOR) != "undefined")
      dbgcolor = DBGCOLOR;
   if (typeof(IBGCOLOR) != "undefined")
      ibgcolor = IBGCOLOR;
   if (typeof(BBGCOLOR) != "undefined")
      bbgcolor = BBGCOLOR;
   if (typeof(TBGCOLOR) != "undefined")
      tbgcolor = TBGCOLOR;
    
   var encoding1 = "utf-8";
   if (typeof(encoding) != "undefined")
       encoding1 = encoding;
    
   var selectedfiles = "";

   var replywin = null;
   var ss = "";
   if (hasframe)
   {
       replywin = upperrightwin;
       if (	replywin.document.body!=null)
            replywin.document.body.innerHTML = "";
       ss = ("<html><head><meta http-equiv=\"content-type\" content=\"text/html; charset="
       + encoding1 +"\"><link rel=\"stylesheet\" type=\"text/css\" href=\"styleb.css\" />"
       + "</head><body>");
       ss +=(unititle(textmsg[787],"outset2"));
       if (attach_h.value.replace(/ /g,'').length < 2)
       {
          ss += ("There is no attachment</body></html>");
          replywin.document.write(ss);
          return;
       }
   }
   else if (attach_h.value.replace(/ /g,'').length < 2)
   {
       myprompt(textmsg[89]);
       if (typeof(showattachment)!='undefined')
                showattachment(attach_h);
       return;
   }

   var files = attach_h.value.replace(/,$/,'').split(",");
   var timest = new Array(files.length);
   
   var codedpath = new Array();
   for (i=0; i < files.length; i++)
   {
       var xx = files[i].split(/@/);
       files[i] = xx[0];
       timest[i] = xx[1];
       codedpath[i] = xx[xx.length-1]; 
      
   }

   ss +=  "<form rel=opener name=form1 style=\"margin:4px 2px 0px 2px\"  ><div style=\"background-color:#b0b0b0;border:0px " + bbgcolor +" solid\"><table cellpadding=3 cellspacing=1 border=0 style=\"border:1px #b0b0b0 outset;border-radius:3px;margin:0px 0px 0px 0px\" align=center width=100% >";
    
   if (typeof(font_size)=='undefined')
   var font_size = 16;

   for (i =0; i < files.length; i++)
   {
      if (files[i]==null||files[i]=='') continue;

      ss +=  "<TR bgcolor=" + tbgcolor +"><td bgcolor=" + dbgcolor +"><a href=\"javascript:";
      if (hasframe)
      {
          if (parent.frames[0].attachman)
              ss += "parent.frames[0]."
          else 
              ss += "parent." + self.name +".";
      }
      //var xx =  (isanswer[i]) ? basestr.replace("/assignment","/answer") : basestr;
       
      ss += "openAttachedFile('" + codedpath[i] + "')\">" + files[i] + "</a></td>";
     var bb = typeof(issubmit)!='undefined' && issubmit == true ||  rdapname.indexOf(  'grading') >=0 || rdapname == 'assignedit' || rdapname.toLowerCase().indexOf("message") >= 0;
     
     if (bb)
     {
      ss+= "<td width=" + (4.5*font_size) +" style=\"background:url(image/RedButton.gif);color:white;font-weight:700\" align=center   onclick=\"";
      if (hasframe)
      {
          if (parent.frames[0].attachman)
              ss += "parent.frames[0]."
          else
              ss += "parent." + self.name +".";
      }
      
     ss += "deleteAttachedFile('" + codedpath[i] + "')\">" +  textmsg[69] +"</td>";
     }

     ss += "</tr>" ;
  }
  ss += ("</table></div></form>"  );

  if (hasframe)
  {
     ss += ("<scrip" + "t type=text/javascript  src=curve.js></scrip" + "t>" );
     replywin.document.write(ss + "</body></html>");
  }
  else
  {
      myprompt(ss,null,null,textmsg[787]);
  }
  if (typeof(showattachment)!='undefined')
                showattachment(attach_h);
}

 


