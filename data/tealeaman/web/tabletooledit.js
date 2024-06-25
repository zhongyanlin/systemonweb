 

 if ( opener!=null && onmydomain(opener) && typeof(opener.getSubdb) != 'undefined' && typeof(opener.getFolder) != 'undefined'
      || parent.frames!=null && typeof(parent.frames[0].expandmenu) != 'undefined' && typeof(parent.frames[0].expandform) != 'undefined'
     || parent.parent.frames!=null && typeof(parent.parent.frames[0].assemble) != 'undefined')  
{ 
   
    document.write("<scr" + "ipt type=\"text/javascript\" src=\"/tealeaman/pagemenu.js\"></scr" + "ipt>");
    document.write("<scr" + "ipt type=\"text/javascript\" src=\"/tealeaman/tabletool.js\"></scr" + "ipt>");
}
 


