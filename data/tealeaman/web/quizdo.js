function   answ(ans,  tt )
{
        if (ans == null || tt == null) return  '\0';
        var la = ans.length;
        var  lt = tt.length;
        var i;
        for ( i = 0; i < la - lt; i++)
        {
            var t = ans.substring(i, i+ lt);
            if (t==tt) break;
        }
        if ( i == la - lt) return '\0';
        for (i+=lt; i < la; i++)
        {
            var c  = ans.charAt(i);
            if ( (c >= 'a' && c <= 'z') || ( c <'Z' && c >='A'))
            return c;
        }
        return '\0';
    }

   function  whichpattern(str,   j,   l)
    {
        if ( j != 0 )
        {
            if ( j >= l - 3 ||  str.charAt(j) != '\n'   )
                return  null;
        }
        else
        {
            j = -1;
        }
        var c = str.charAt(j+1);
        if ( c >='0' && c <= '9')
        {
            var i;
            for (  i = j+1; i < l-1 && str.charAt(i) >= '0' && str.charAt(i) <= '9'; i++);
            if ( str.charAt(i) == '.')
                return str.substring(j+1, i);
         }
        else if ( j > 0 && (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') )
        {
            if ( str.charAt(j + 2) == '.')
                return str.substring(j+1, j+2);
        }
        return null;
    }

    function formatstr1(format,   str)
    {
        if (format == null || str == null) return str;
        else if (format==("0"))
            return  str.replace(/>/g, "&gt;") .replace(/</g, "&lt;").replace(/\r\n/g, "<br>") .replace(/[\r|\n]/g, "<br>");
        else if (format==("1"))
            return str;
        else if (format==("2"))
            return  str ;
        else if (format==("3"))
        {
            if (str == null) return "";
            var strs = str.split("\n");
            var ans = "";
            for (var i = 0; i < strs.length; i++)
            {
               str =strs[i].trim();
               var framename = str.replaceAll("[^a-z]","");
               if (framename.length() > 8)
                    framename = framename.substring(0,8);
               var leng = str.length;
               if (leng < 4) continue;
               var ext = str.substring(leng - 4).toLowerCase();
               if (ext==(".jpg") || ext==(".gif") )
               {
                    ans += ("<img src=\"" + str +"\"><br>");

               }
               else if (ext==(".txt") || ext==(".jsp") || ext==(".doc") || ext==(".pdf") || ext==("html"))
               {
                    ans+= "<iframe src=\"" + str +"\" width=580 height=400 frameborder=0 name=" + framename +"></iframe><br>";

               }
               else
                    ans+= "<a href=\"" + str +"\" target=\"" + framename + "\">" + str +"</a><br>";
            }
            return ans;
         }

        return str;
    }
 

