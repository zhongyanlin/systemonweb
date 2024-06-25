/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
function makeSelect(caption, values, fieldname)
{
   var str =  "<select name=" + fieldname+" multiple on>" ;
   for (var i=0; i < caption.length; i++)
     str += "<option value=\"" + values[i] +"\">" + caption[i] + ">" ;
   return str +  "</select>" ;
}
 
function fillSelect(sel, code, isnum)
{
     
     if (code == null) 
     {
        if (sel.options[0].value==code)
           sel.selectedIndex = 0; 
        else
           sel.selectedIndex = -1;
        return;
     }
     if (isnum)
    {
       
       sel.options[0].selected =(code == 0);
       
       for (var i = 1; i <  sel.options.length ; i++)
           sel.options[i].selected = ( (code & (1<<(i-1)) ) > 0);
    }
    else
    {
       code = "," + code + ",";
       for (var i = 1; i <   sel.options.length ; i++)
           sel.options[i].selected = ( code.indexOf(","+ sel.options[i].value+",") >= 0);
    } 
}
 
function fromSelect(sel, isnum)
{
   if (isnum)
   {
      if (sel.options.length==0 || sel.selectedIndex==0 || sel.selectedIndex==-1) 
          return 0;
      var code = 0;
      for (var i = 1; i <   sel.options.length ; i++)
      if ( sel.options[i].selected)
         code |= (1<<(i-1));
      return code;
   }
    
   var str="";
   for (var i = 1; i < sel.options.length ; i++)
      if ( sel.options[i].selected)
         str += "," + sel.options[i].value ;
   
   if (str == "")  return str;
   return str.substring(1);
}
var bbbbb = 0;
function fromChoose(sel, isnum)
{
   var j = sel.selectedIndex;   
   if (typeof (j)=='undefined' || j==-1)
   {
      if (isnum) 
         return null; 
     return '';
   }
   if (isnum && sel.options[j].value == '') 
      return  null; 
    
   return sel.options[j].value;
} 
 
function fillChoose(sel, vl)
{
    if (sel.options == null)
    {
       return;
    }
    if (vl != null)
    {
        var j = 0;
        for(; j < sel.options.length && sel.options[j].value != vl; j++);
        if ( j == sel.options.length )
        {
           if (j>=1&& sel.options[j-1].value.indexOf("...")>=0)
           {
              var xx = sel.options[j-1].value;
              sel.options[j-1] = new Option(vl, vl);
              sel.options[j] = new Option(textmsg[925]+"...", xx);
              sel.selectedIndex = j-1;
              sel.options[j-1].selected = true;
           }
           else
           {
              sel.options[j] = new Option(vl, vl);
              sel.selectedIndex = j;
              sel.options[j].selected = true;
           }
        }
        else
        {
           sel.selectedIndex = j;
           sel.options[j].selected = true;
        }

    }
    else
    {
        if (sel.options[0].value == null)
            sel.selectedIndex = 0;
        else
            sel.selectedIndex = -1; 
    }
}

 

function fillmultivalue(sel, va, options, captions,j, isd) 
{
   sel.options[0]  = new Option(multivalue(va,options,captions,j,isd),va);
}
function multivalue(va, options, captions, j, isnum)
{
   if (options[j] == null) return ""; 
   var jj; 
   var wvalue = "";
   if (isnum == false)
   {
      for (jj=0; jj < options[j].length; jj++)
      {
          if ( ("," + va +",").indexOf("," + options[j][jj] +",") >=0)
          {
              if (wvalue!='') wvalue +=",";  
              wvalue += captions[j][jj];
          } 
      }
      if (wvalue == '') return va;
      return wvalue;
  }
 
  if (va == '0') return "";
  var x = parseInt(va);   //x = 18,  1, student, 2, instuctor, 3, 4, 5, System Analyst 
  for (var jj = 1; jj < options[j].length ; jj++)
  {  
     
      if ( (x & (1<<(jj-1)) ) > 0)
      {
          
           if (wvalue!='') wvalue +=",";  
           wvalue += captions[j][jj];
      }
  }
  return wvalue;
}

 
if (typeof(rdapname)!='undefined' && rdapname=='lecturenotes' && typeof(parent.frames[0].openit19)!='undefined')
{
    var reopenit = function(){parent.frames[0].openit19();};
    webserviceAlloptions = "<a href=\"javascript:reopenit()\">" + textmsg[1291] + "</a>" + webserviceAlloptions;
}

