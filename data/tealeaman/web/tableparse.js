/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
var def="";
function delimit(c1 )
{     
      var c2 = ')'; if (c1 == '\'') c2 = c1; 
      var jj = 0; 
      while (jj < def.length && (def.charAt(jj) == ' ' || def.charAt(jj) == '\n'|| def.charAt(jj) == '\r') ) 
          jj++;
      if (jj == def.length || def.charAt(jj) != c1 ) 
      {
          return null;
      }
      var m = ''; 
      jj++;
      for(; jj < def.length  && def.charAt(jj) != c2; jj++ ) 
      { 
         m += def.charAt(jj);
      }
      if (jj == def.length) 
      {
         return  null;
      }
      else
      {
         def = def.substring(jj+1);
         return m;
      }
}

function match(c)
{
   
   var m = null;
   if ( c == 'w')     
   {
        m = def.replace(/(\s*[A-Z|a-z|0-9|_]+)/, "$1|_sdMs__23_1||||||||");
   }
   else if (c == 's')
   {
       if (def.charAt(0) == ',')
       {
           return null;
       }
       else if (def.charAt(0) == '\'')
       {
          var jj = 1; 
          var state = false;
          while (jj < def.length)
          {
             if ( def.charAt(jj)=='\'') state = !state;
             else  if (def.charAt(jj) == ',' || def.charAt(jj)==' ' || def.charAt(jj)==')' || def.charAt(jj) == '\r' || def.charAt(jj) == '\n')
             {
                if (state) 
                {
                   if (jj-1>1) 
                       m = def.substring(1,jj-1); 
                   else
                       m = '';
                   def = def.substring(jj); 
                   return m; 
                }
             }
             jj++;
         }
      }
      else 
      {
          var jj = 0; 
          while (jj < def.length)
          {   
              if (def.charAt(jj) == ',' || def.charAt(jj)==' ' || def.charAt(jj)==')'   || def.charAt(jj) == '\r' || def.charAt(jj) == '\n')
              {
                   m =  def.substring(0,jj); 
                   def = def.substring(jj); 
                   return m;
              }
              jj++;
           }
       }
   }
   else if (c == 'n') 
   {
        m = def.replace(/(\s*[0-9| ]*)/,    "$1|_sdMs__23_1||||||||");
   }
   else if (c == 'p') 
   {
       return delimit('(');
       
   }
   else if (c == 'c') 
   {
        m = def.replace(/(\s*,\s*)/,            "$1|_sdMs__23_1||||||||");
   }
   else if (c == 'a') 
   {
       if (def.charAt(0)==',') 
       {
           return null;
       }
       m = def.replace(/([A-Z|a-z| ]+)/,     "$1|_sdMs__23_1||||||||"); 
   }
    
   if (m == def) 
   {  
       return null;
   }

   var j = m.indexOf("|_sdMs__23_1||||||||");
   if (j>=0)
   m = m.substring(0,j);
   if (def.indexOf(m) != 0) 
   {
      return null;
   }
   def = def.substring(j);
   return m.replace(/^[ ]+/,'');
  
}



function parse(definition, mt, tblname)
{
   var numberRows = 0;  
   def  = definition.replace(/[^\(]*\(\s*/,'').replace(/\)\s*$/,',');
 
   var aword = null;
   var uline="";
   
   while (true)
   {  
    aword = match('w');  
    
    if (aword == null) break;
    uline = aword.toUpperCase(); 
    if (  uline.indexOf("PRIMARY") == 0 
       || uline.indexOf("FOREIGN") == 0 
       || uline.indexOf("CHECK") == 0 ) 
    {
          break;
    }
    else
    {
        if (numberRows == mt.length)
           mt[numberRows] = new Array(numCols);
        mt[numberRows][0] = '' + (numberRows+1);
    }
    
    mt[numberRows][1] = tblname +  aword;
    
    aword = match('w');
  
    if (aword == null) break;
    mt[numberRows][2] = aword;
 
    aword = match('p');   
    if (aword == null) 
        mt[numberRows][3] = '';
    else
        mt[numberRows][3] = aword.replace(/^\s*/,'').replace(/\s*$/,'');
 
    aword = match('a');
    
    if (aword == null)
    {
        mt[numberRows][4] = "1"; 
        mt[numberRows][5] = "0"; 
        mt[numberRows][6] = "";
    }
    else 
    {
        aword = aword.toUpperCase();
        if (aword.indexOf("NOT NULL") >= 0)
             mt[numberRows][4] = "0";
        else
             mt[numberRows][4] = "1";

        if (aword.indexOf("DISTINCT") >= 0|| aword.indexOf("UNIQUE") >=0) 
             mt[numberRows][5] = "1";
        else
             mt[numberRows][5] = "0";
 
        if (aword.indexOf("DEFAULT") <  0) 
             mt[numberRows][6] = '';
        else
        {
            var tmp = match('s');
            if (tmp!=null) 
                mt[numberRows][6]=tmp; 
            else mt[numberRows][6]=''; 
        }
    }
    aword = match('c');
    numberRows++;
  }

   
    for (let ll =0; ll < 4; ll++)
    {
        if (uline == 'PRIMARY')
        {
            for (j = 0; j < numberRows; j++)
            {
                mt[j][7] = '0';
            }
            aword = match('w');
            aword = match('p');
            if (aword == null)
                aword = match('w');

            var keyfields = ',' + aword + ',';
            for (j = 0; j < numberRows; j++)
            {
                if (keyfields.indexOf("," + mt[j][1].replace(/[^\.]*./, '') + ",") >= 0 || keyfields.indexOf("," + mt[j][1] + ",") >= 0)
                    mt[j][7] = '1';
            }
            uline = '';
            aword = match('c');
            if (aword != null)
            {
                aword = match('w');
                if (aword != null)
                    uline = aword.toUpperCase();
                else break;
            }
            else break;
        } else if (uline == 'FOREIGN')
        {
            aword = match('w');
            if (aword.indexOf("KEY") == -1)
                break;
            aword = match('p');
            if (aword == null)
                aword = match('w');
            var keyfields = aword.split(/\s*,\s*/);

            aword = match('w');

            var lr = aword.toUpperCase().indexOf("REFERENCES");
            if (lr == -1)
            {
                if (typeof (textmsg) != 'undefined')
                    myprompt(textmsg[243] + def);
                break;
            }

            aword = match('w');
            var ftable = aword;

            aword = match('p');
            if (aword == null)
                aword = match('w');
            var fkeyfields = aword.split(/\s*,\s*/);
            var j1;
            for (j = 0; j < numberRows; j++)
            {
                j1 = 0; 
                while (j1 < keyfields.length &&  keyfields[j1] != mt[j][1].replace(/[^\.]+\./, '') && keyfields[j1] != mt[j][1])
                    j1++;
                //alert(j1 + ' ! '+ fkeyfields.length + ' ! '+  keyfields[j1] + '   '+ mt[j][1]);
                if (j1 < fkeyfields.length)
                {
                    mt[j][8] = ftable;
                    mt[j][9] = fkeyfields[j1];
                }

            }
            uline = '';
            aword = match('c');
            if (aword != null)
            {
                aword = match('w');
                if (aword != null)
                    uline = aword.toUpperCase();
                else break;
            }
            else break;
        } else if (uline == 'CHECK')
            checks = 'CHECK (' + def;
        
    } 
     
     for (var i = 0; i < numberRows; i++)
        {
           
            for (var j = 0; j < numCols - 1; j++)
                if (mt[i][j] == null)
                {
                    mt[i][j] = '';
                }
        } 
  return numberRows;
} 

 
