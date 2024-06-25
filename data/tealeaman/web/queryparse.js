/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/
 
var def = "";
function readElement()
{
       var i = 0;
       var m = '';
       if (def == null|| def == '')  return  '';
       while (i < def.length && (def.charAt(i) == ' ' || def.charAt(i) == '\r' || def.charAt(i) == '\n'))
          i++;
       if (i >= def.length) return '';
       var jj = i+1; 
       
       if (def.charAt(i) == ',')
       {
            if (jj < def.length)
                def = def.substring(jj);
            else def = "";
            return ",";
       }
       else if (def.charAt(i) == '\'')
       {
          var state = false;
          while ( jj < def.length)
          {
             if ( def.charAt(jj)=='\'') 
                 state = !state;
             else if (def.charAt(jj) == ',' || def.charAt(jj) == ' ' || def.charAt(jj) == '\r' || def.charAt(jj) == '\n')
             {
                if (state) 
                {
                    m = def.substring(i,jj);
                    if (jj < def.length)
                        def = def.substring(jj);
                    else def = "";
                    return m;
                }
             }

             jj++;
          }
          m = def.substring(i);
          def = "";
          return m;
      }
      else 
      {
          state = true;
          while (jj < def.length)
          {  
              if (def.charAt(jj) == '\'')
              {
                  state =!state;
              }
              else if (def.charAt(jj) == ',' || def.charAt(jj) == ' ' || def.charAt(jj) == '\r' || def.charAt(jj) == '\n' )
              {
                  if (state)
                  {
                   m = def.substring(i,jj); 
                   if (jj < def.length)
                       def = def.substring(jj);
                   else def = "";
                   return  m;
                  }
              }

              jj++;
          }
          m = def.substring(i);
          def = "";
          return m;
      }
}

function qparse(qdefinition, numCols, mt, outstr)
{
    if (qdefinition==null||qdefinition==''){outstr[0]='';outstr[1]='';return 0;} 
    var x = qdefinition.indexOf("\n\n");
    var y = qdefinition.indexOf("\n\r\n");
    var leftover = "";
    if (x==-1 && y!=-1) x= y;
    else if (x==-1 && y==-1) x = qdefinition.length;
    else if (x!=-1 && y!=-1 && y < x) x = y;
    {
         leftover = qdefinition.substring(x);
         qdefinition = qdefinition.substring(0,x);
    } 
    
    def = qdefinition; 
   
    var item = readElement();  
    if (item.toLowerCase()!='select') return 0; 
    var state = 0;
    var  q = "";
    var  numRows = 0;
    while (true)
    {
        item = readElement();
       
        if (item.toLowerCase()=='as')
        {
            mt[numRows] = new Array(numCols);
            mt[numRows][0] = (numRows+1);
            mt[numRows][1] = q; q="";
            mt[numRows][10] = readElement();  
            mt[numRows][2] = "VARCHAR";
            var tmp = mt[numRows][10].replace(/[^_]+/,'').replace(/_[a-z|A-Z]/,'').replace(/_/,'').replace(/_.*/,'');
            if (tmp!='')  
               mt[numRows][3] = tmp; 
            else 
               mt[numRows][3] = '25';
 
            mt[numRows][4] = '0';  

            mt[numRows][5]   = '0';  
  
            mt[numRows][7] = '0';
            mt[numRows][6] =   '';  mt[numRows][8]  = '';  mt[numRows][9] = '';
        }
        else if (item == ',')
        {
            if (state == 0)
            {
               if (mt[numRows][10] == null)
               {
                   mt[numRows] = new Array(numCols);
                   mt[numRows][1] = q; 
                   q = "";
               }
               numRows++;
            }
            else if (state == 1)
            {
                q += ",";
            }
         }
         else if (item == '') 
         {

            if (state == 0)
            {
               if (q != '') 
               {
                   mt[numRows] = new Array(numCols);
                   mt[numRows][1] = q; q=""; 
               } 
               numRows++;
            }
           break;

         }
         else if (item.toLowerCase() == 'from')
         {

            if (state == 0)
            {
               if (q != '') 
               {
                   mt[numRows] = new Array(numCols);
                   mt[numRows][1] = q; q=""; 
               }
               numRows++;
            }
            q="";
            state = 1;

         }
         else if (item.toLowerCase() =='where')
         {

            if (state == 1)
               break;
         }
         else
         {

            if (state == 0)
            {
               if (q=='') 
                   q = item; 
               else
                   q += ' ' + item;
            }
            else if (state == 1)
            {
               q += item;
            }
         }
      }
      outstr[0] = q; outstr[1] = def + leftover;

      return numRows;
}
 
 