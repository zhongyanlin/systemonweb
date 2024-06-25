 
package telaman;

public class PassedData 
{
    char sep = 39;
    char type = 116;
    public String query;
    public String baddata = "";
    int before;
    int pos;
    int N = 0;
    boolean alert = false;
    
    String getElementc() 
    {
        String word = null;
        int before = this.pos;
        int state = 0;
        do {
            ++this.pos;
            if (this.pos >= this.N) {
                return "r" + this.query.substring(before + 1);
            }
            char c = this.query.charAt(this.pos);
            switch (state) {
                case 0: {
                    if (c == '\"') {
                        state = 1;
                        before = this.pos;
                        break;
                    }
                    if (c == ',') {
                        return "c";
                    }
                    if (c == '\n') {
                        return "r";
                    }
                    if (c == ' ') {
                        state = 21;
                        break;
                    }
                    state = 11;
                    break;
                }
                case 1: {
                    if (c != '\"') break;
                    state = 2;
                    break;
                }
                case 2: {
                    if (c == '\"') {
                        state = 1;
                        break;
                    }
                    if (c == ',') {
                        return "" + 'c' + this.query.substring(before + 1, this.pos - 1).replaceAll("\"\"", "\"");
                    }
                    if (c == '\n') {
                        return "" + 'r' + this.query.substring(before + 1, this.pos - 1).replaceAll("\"\"", "\"");
                    }
                    word = this.query.substring(before + 1, this.pos - 1).replaceAll("\"\"", "\"");
                    while (this.query.charAt(this.pos) != ',' && this.query.charAt(this.pos) != '\n') {
                        ++this.pos;
                    }
                    if (this.query.charAt(this.pos) == ',') {
                        return "" + 'c' + word;
                    }
                    return "" + 'r' + word;
                }
                case 11: {
                    if (c == ',') {
                        return "" + 'c' + this.query.substring(before + 1, this.pos - 1);
                    }
                    if (c != '\n') break;
                    return "" + 'r' + this.query.substring(before + 1, this.pos - 1);
                }
                case 21: {
                    if (c == ',') {
                        return "" + 'c' + this.query.substring(before + 1, this.pos - 1);
                    }
                    if (c == '\n') {
                        return "" + 'r' + this.query.substring(before + 1, this.pos - 1);
                    }
                    if (c == '\"') {
                        state = 1;
                        before = this.pos;
                        break;
                    }
                    if (c == ' ') break;
                    state = 11;
                }
            }
        } while (true);
    }


    public void init() 
    {
        this.pos = -1;
        this.before = 0;
        if (this.query != null) 
        {
            this.N = this.query.length();
        }
    }

    public PassedData(String d, char typ)
    {
        query = d;
        type = typ;
        if (typ == 't') 
            sep = '\'';
        else
            sep = '"';
        if (typ == 's')
        {
            query = query.replaceAll("\\\"", "\"\"");
        }
        init();
    }

    public PassedData(String d) {
        this.query = d;
        this.init();
    }

    public char getChar() {
        ++this.pos;
        this.before = this.pos + 1;
        if (this.pos >= this.N) {
            return '\u0000';
        }
        return this.query.charAt(this.pos);
    }

    private String assure(String x) {
        if (x == null || x.equals("")) {
            return x;
        }
        for (int i = 0; i < x.length(); ++i) {
            char u;
            if (('a' > (u = x.charAt(i)) || u > 'z' || u == 'e') && (u < 'A' || u > 'Z' || u == 'E')) continue;
            this.baddata = x;
            this.alert = true;
            return null;
        }
        return x;
    }

    private String assure1(String x) {
        String y;
        if (x == null || x.equals("") || this.sep == '\"') {
            return x;
        }
        if ((y = x.replaceAll("''", "")).indexOf("'") == -1) {
            return x;
        }
        this.baddata = x;
        this.alert = true;
        return null;
    }

    public String getElement() {
        if (this.type == 's') {
            return this.getElementt().replaceAll("\"\"", "\\\"").replaceFirst("^\"", "").replaceFirst("\"[\\s]*$", "");
        }
        if (this.type == 't') {
            return this.getElementt();
        }
        if (this.type == 'c') {
            return this.getElementc();
        }
        return "";
    }

    
     
    String  getElementt()
    {
       String word = null;
       boolean inquo = false;
       while (true)
       {
           ++pos;
           if (pos>=N)
           {
               if (before < N)
               {
                   if (query.charAt(N-1) == sep)
                   {
                      word = assure1(query.substring(before+1,N-1));
                   }
                   else
                   {
                      word = assure(query.substring(before));
                   }
                   before=N;

               }
               else word = null;

               return  word;
           }

           char c=query.charAt(pos);

           if ( c == sep)
           {
             inquo = !inquo;
           }
           else if (c == ','|| c == '|' || c=='&' || c == '#' || c == ';' || c == ':')
           {
              if (inquo == false)
              {
                  if ( pos == before )
                  {
                      word = null;
                  }
                  else if ( query.charAt(pos-1) == sep)
                  {
                      if ( pos-1 > before+1)
                      {
                         word = assure1(query.substring(before+1,pos-1));

                      }
                      else
                         word = "";
                  }
                  else
                  {
                      word = assure(query.substring(before,pos));
                  }
                  before = pos+1;
                  return word;
              }
          }
       }
    }
}
