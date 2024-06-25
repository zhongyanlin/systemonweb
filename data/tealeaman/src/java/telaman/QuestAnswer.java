

package telaman;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import telaman.CSVParse;
import telaman.Evaluate;
import telaman.Toolbox;

public class QuestAnswer {
    
    public boolean valid = true;
    public boolean verified = false;
    public int fmt;
    public String outcome = "";
    public int num;
    public int shuffled;
    public float pts = 1;
    public float score = -1;
    public int timestay = 0;
    public String question = "";
    public String solution = "";
    public String answer = "";
    public String comments = "";
    public int numAnswered = 0;
    public int numRight = 0;
    int labelw = 70;
    Vector<String> answerv = null;
    int orgnum = Toolbox.langnum<<16;
    public char action = 'g';
    public static int[][] states = new int[][]{{1, 4, 0, 0, 0, 0}, {5, 2, 1, 0, 0, 0}, {3, 5, 2, 0, 0, 0}, {5, 5, 3, 0, 0, 0}, {1, 5, 4, 0, 0, 0}, {5, 5, 5, 6, 0, 0}, {1, 4, 7, 6, 7, 0}, {7, 7, 7, 8, 8, 8}, {1, 4, 0, 0, 0, 0}};

    
    public static String parsec(String s) 
    {
        String choices = "";
        Matcher m = Assignment.questionchoice.matcher((CharSequence)s);
        int k = 0;
        int nn = -1;
        while (m.find(k)) 
        {
            int i = m.start();
            k = m.end();
            choices = choices + s.substring(i, k).toLowerCase().replaceFirst("^[ |\n|\r]", "").replaceFirst("[ |\n|\r]+$", "").replaceAll("[^a-z]", "");
        }
        return choices;
    }

    public String parseq() {
        return QuestAnswer.parsec(this.question);
    }

    
    private String format(int fmt, String s) {
        if (fmt == 0 && s != null) {
            s = s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\r\n", "<br>").replaceAll("[\r|\n]", "<br>");
        }
        return s;
    }

    public QuestAnswer(int n, int orgnum) {
        this.num = n;
        this.orgnum = orgnum;
    }

    public QuestAnswer(String[] x, int orgnum) {
         
        this.orgnum = orgnum;
            if (x.length == 11) 
            {
                try{ this.num = Integer.parseInt(x[0]); } catch(NumberFormatException e){valid=false;}
                try{ this.shuffled = Integer.parseInt(x[1]); } catch(NumberFormatException e){valid=false;}
                try{ this.pts = Float.parseFloat(x[2]); } catch(NumberFormatException e){
                  
                    this.pts = 1;}
                try{ this.score = Float.parseFloat(x[3]); } catch(NumberFormatException e){this.pts = 1;}
                this.outcome = x[4];  
                try{ this.timestay = Integer.parseInt(x[5]); } catch(NumberFormatException e){this.timestay=10000;}
                try{ this.fmt = Integer.parseInt(x[6]); } catch(NumberFormatException e){this.fmt=5;}
                this.question = x[7];  
                this.solution = x[8]; 
                this.answer = x[9];
                this.comments = x[10];
            } 
            else if (x.length == 4 || x.length == 5 || x.length == 6) 
            {
                try{ this.num = Integer.parseInt(x[0]); } catch(NumberFormatException e){valid=false;}
                this.solution = x[1];
                try{ this.timestay = Integer.parseInt(x[2]); } catch(NumberFormatException e){this.timestay = 10000;}
                try{this.fmt = Integer.parseInt(x[3]);}catch(NumberFormatException er){this.fmt = 5;}
                if (x.length > 4)
                    try{ this.shuffled = Integer.parseInt(x[4]); } catch(NumberFormatException e){valid=false;}
                else
                    this.shuffled = this.num;
                if (x.length == 6) 
                {
                    try{ this.score = Float.parseFloat(x[5]); } catch(NumberFormatException e){this.score=1;}
                }
                else
                {
                    this.score = 0.0f; 
                }
                
            } 
            else if (x.length == 2) 
            {
                try{ this.num = Integer.parseInt(x[0]); } catch(NumberFormatException e){valid=false;}
                this.solution = x[1];
                this.fmt = x[1].trim().toLowerCase().replaceFirst("[a-z]", "").equals("") ? 5 : 0;
                this.timestay = 100000;
                this.shuffled = this.num;
            } 
            else 
            {
                this.valid = false;
            }
            if (this.num > 10000) 
            {
                this.valid = false;
            }
        
    }

    public QuestAnswer(int n, String x1, String x2, String x3, int y1, int y2, String y3, int orgnum) {
        this.orgnum = orgnum;
        this.question = x1;
        this.solution = x2;
        this.answer = x3;
        this.pts = y1;
        this.score = y2;
        this.outcome = y3;
        this.num = n;
    }

    public QuestAnswer(String content, String complete) {
        if (complete.equals("complete")) {
            this.parse(content);
        } else {
            CSVParse p = new CSVParse(content, '\'', new String[]{","});
            this.shuffled = this.num = p.nextInteger();
            this.solution = p.nextElement();
        }
    }

    public boolean verify() {
        if (this.fmt == 4) {
            String x;
            if (this.answer.length() == 0) {
                return false;
            }
            if ((x = this.parseq()).indexOf(this.answer.substring(0, 1).toLowerCase()) == -1) {
                return false;
            }
        }
        return true;
    }

    public void grade(Assignment as, int num) 
    {
        String s = this.solution;
      
        if ( s == null ) 
        {
            this.score = 0;
            return;
        }
            
        s = s.toLowerCase().trim();
        if ( s.equals("") ) 
        {
            this.score = 0;
            return;
        }
        if (num < as.answers.length)
            this.answer = as.answers[num];
        else 
            this.answer = null;
       
        String a = (this.answer ==null)? "":this.answer.toLowerCase().trim();
       
        if (a.equals("")) 
        {
            if (this.pts == 0 ) 
            {
                this.pts = 1 ;
            }
            this.score =  this.pts; 
        } 
        else if (this.fmt == 4) 
        {
            if (this.pts == 0 ) 
            {
                this.pts = 1 ;
            }
            this.score = ((s.length() == 1 || s.length() > 1 && s.charAt(1)==' ') && s.charAt(0) == a.charAt(0)) ? this.pts : 0 ;
        } 
        else 
        {
            if (this.pts == 0 ) 
            {
                this.pts = 1 ;
            }
            
            int hits = 0 ;
            if (num >= as.anwserv.size())
            {
                for (int j=as.anwserv.size(); j <= num; j++)
                {
                   as.anwserv.add(null); 
                }
            }
            ArrayList<String> y = as.anwserv.get(num);
            if (y == null)
            {
                y  = new ArrayList();
                if (a!=null && !a.equals(""))
                splitString(a, y);
                as.anwserv.set(num, y);
            }
            
            for (int i = 0; i < y.size(); ++i) 
            {
                if (s.indexOf(y.get(i)) >= 0) 
                hits += 1;
            }
            if (y.size() == 0)
                this.score = this.pts;
            else
                this.score =  Math.round(1.2 * Math.sqrt((double) hits / ((double)y.size())) * (double)this.pts);
            if (this.score > this.pts) 
            {
                this.score = this.pts;
            }
        }
        
    }

    public static void splitString(String s, ArrayList<String> v)
    {
       
        int i = 0;
        char t = 0;
        int j = -1;
        if (s == null || s.equals("")) return;
        for (; i < s.length(); i++)
        {
            char c = s.charAt(i);
             
            if (c >= 'a' && c <= 'z') 
            {
               if (t != 'e') 
               {
                   if (j!=-1)
                   {
                       String ss = s.substring(j,i);
                       if (!ss.replaceAll("[ |\r|\n|\t]","").equals(""))
                       v.add(ss);
                   }
                   j = i;
                   t = 'e';
               }
               
            }
            else if (c >= '0' && c <= '9') 
            {
               if (t != 'n') 
               {
                   if (j!=-1)
                   {
                       String ss = s.substring(j,i);
                       if (!ss.replaceAll("[ |\r|\n|\t]","").equals(""))
                       v.add(ss);
                   }
                   j = i;
                   t = 'n';
               }
               
            }
            else if (c == '.' && t == 'n') 
            {
            }
            else
            {
                if (j!=-1)
                {
                    String ss = s.substring(j,i);
                    if (!ss.replaceAll("[ |\r|\n|\t]","").equals(""))
                    v.add(ss);
                }
                j = i;
                t = c;
            }
        }
        if (j!=-1)
        {
            String ss = s.substring(j,i);
            if (!ss.replaceAll("[ |\r|\n|\t]","").equals(""))
            v.add(ss);
        }
        
    }
    
    public boolean gradeembed(Assignment as, int num) 
    {
        
        String s = this.solution.toLowerCase().trim();
        this.score = 0;
        this.pts = 1;
        if (num >= as.answers.length)
        {
            answer = null;
        }
        else
            answer = as.answers[num];
        if (this.answer == null || this.answer.equals("")) 
        {
            this.score = 1;
            //msg = Toolbox.emsgs(orgnum,53) + "(" + num + ") " + Toolbox.emsgs(orgnum,1532);
            return false;
        }
        
        String a = (this.answer ==null)? "":this.answer.toLowerCase().trim();
         
        if (s.equals("")) {
            this.score = 0.0f;
        } else {
            if (num >= as.anwserv.size())
            {
                for (int j=as.anwserv.size(); j <= num; j++)
                {
                   as.anwserv.add(null); 
                }
            }
            ArrayList<String> y = as.anwserv.get(num);
            if (y == null)
            {
                y  = new ArrayList();
                if (a!=null && !a.equals(""))
                splitString(a, y);
                as.anwserv.set(num, y);
            }
             
            int hits = 0;
            for (int i = 0; i < y.size(); ++i) 
            {
                if (s.indexOf(y.get(i)) >= 0)  
                hits += 1;
            }
            this.score = (hits >= 0.6 * y.size()) ? 1 : 0;
        }
        return true;
    }

    public String reformat(String x, int fmt) {
        if (x == null) {
            return "";
        }
        if (fmt != 0) {
            return x;
        }
        return x.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\r\n", "<br>").replaceAll("[\r|\n]", "<br>");
    }

    public String tohtml(int qfmt) 
    {
        String str = this.reformat(this.question, qfmt);
        if (this.fmt == 4 && qfmt != 48) 
        {
            str = str.replaceAll("[\\r|\\n][ ]*[\\(|\\[]?[ ]*([a-z|A-Z])[ |\\.|\\)|\\]]", "<br>$1. ");
        }
        String[] ft = new String[]{Toolbox.emsgs(orgnum,214), "HTML", "LaTeXML", "", Toolbox.emsgs(orgnum,206)};
        if (this.fmt >= 5 || this.fmt < 0) {
            return "";
        }
       
        return "<tr><td><nobr>" + Toolbox.emsgs(orgnum,231) + "</nobr></td><td>" + this.num + "</td>\n<td><nobr>" + Toolbox.emsgs(orgnum,478) + "</nobr></td><td>" + this.shuffled + "</td>\n<td><nobr>" + Toolbox.emsgs(orgnum,1145) + "</nobr></td><td>" + this.pts + "</td>\n<td><nobr>" + Toolbox.emsgs(orgnum,224) + "</nobr></td><td>" + this.score + "</td>\n<td><nobr>" + Toolbox.emsgs(orgnum,1182) + "</nobr></td><td>" + this.outcome + "</td>\n<td><nobr>" + Toolbox.emsgs(orgnum,986) + "</nobr></td><td>" + this.timestay + "</td>\n<td><nobr>" + Toolbox.emsgs(orgnum,21) + "</nobr></td><td>" + ft[this.fmt] + "</td></tr>\n<tr><td><nobr>" + Toolbox.emsgs(orgnum,50) + "</nobr></td><td colspan=15>" + str + "</td></tr>\n<tr><td><nobr>" + Toolbox.emsgs(orgnum,627) + "</nobr></td><td colspan=15>" + this.reformat(this.solution, this.fmt) + "</td></tr>\n<tr><td><nobr>" + Toolbox.emsgs(orgnum,53) + "</nobr></td><td colspan=15>" + this.reformat(this.answer, qfmt) + "</td></tr>\n<tr><td><nobr>" + Toolbox.emsgs(orgnum,1006) + "</nobr></td><td colspan=15>" + this.reformat(this.comments, qfmt) + "</td></tr><tr><td colspan=16></td></tr>\n";
    }
    private String quote(String x) {
        if (x == null) {
            return null;
        }
        if (x.indexOf(",") >= 0 || x.indexOf("\r") >= 0|| x.indexOf("\n") >= 0) {
            return "'" + x.replaceAll("'", "''") + "'";
        }
        return x;
    }
    public static String quote1(String x) {
        if (x == null) {
            return null;
        }
        if (x.indexOf(",") >= 0 || x.indexOf(";") >= 0)
        {
            return "|" + x.replaceAll("\\|", "||") + "|";
        }
        return x;
    }
    public void tocsv1(StringBuffer sb)
    {
        if (this.score<0) this.score = 0.0f;
        sb.append(this.num);
        sb.append(",");
        sb.append(String.valueOf(this.pts).replaceFirst("\\.[0]+$", ""));
        sb.append(",");
        sb.append(String.valueOf(this.score).replaceFirst("\\.[0]+$", ""));
        sb.append(",");
        sb.append(this.quote1(this.comments));
    }
    
    public void tocsv2(StringBuffer sb)
    {
        sb.append(this.num);
        sb.append(",");
        sb.append(this.quote(this.solution));
        sb.append(",");
        sb.append(String.valueOf(this.timestay).replaceFirst("\\.[0]+$", ""));
        sb.append(",");
        sb.append(this.fmt);
        sb.append(",");
        sb.append(this.shuffled);
        sb.append(",-1");
        
    } 
    
    public String tocsv() {
        StringBuffer sb = new StringBuffer();
        sb.append(this.num);
        sb.append(",");
        sb.append(this.shuffled);
        sb.append(",");
        sb.append(String.valueOf(this.pts).replaceFirst("\\.0+$", ""));
        sb.append(",");
        sb.append(String.valueOf(this.score).replaceFirst("\\.0+$", ""));
        sb.append(",");
        sb.append(this.quote(this.outcome));
        sb.append(",");
        sb.append(this.timestay);
        sb.append(",");
        sb.append(this.fmt);
        sb.append(",");
        sb.append(this.quote(this.question));
        sb.append(",");
        sb.append(this.quote(this.solution));
        sb.append(",");
        sb.append(this.quote(this.answer));
        sb.append(",");
        sb.append(this.quote(this.comments));
        return sb.toString();
    }

    public void parse(String html) {
        CSVParse parse = new CSVParse(html, '\'', new String[]{","});
        this.num = parse.nextInteger();
        this.shuffled = parse.nextInteger();
        this.pts = parse.nextFloat(); 
        this.score = parse.nextFloat();  
        this.outcome = parse.nextElement();
        this.timestay = parse.nextInteger();
        this.fmt = parse.nextInteger();
        this.question = parse.nextElement();
        this.solution = parse.nextElement();
        this.answer = parse.nextElement();
        this.comments = parse.nextElement();
    }

    public String toaccess() {
        return   this.num + "," + this.pts + ",|" + this.outcome + "|," + this.numAnswered + "," + this.numRight ;
    }

    public static int ccode(char c) {
        switch (c) {
            case '\r': {
                return 0;
            }
            case '\n': {
                return 1;
            }
            case ' ': {
                return 2;
            }
        }
        if (c >= '0' && c <= '9') {
            return 3;
        }
        if (c > ' ' && c < 'A' || c > 'Z' && c < 'a' || c > 'z' && c < '') {
            return 4;
        }
        return 5;
    }

    

    

    public String toString() {
        return this.tocsv();
    }

    public static void sort(float[] sorts, int N) {
        int NZ = 0;
        for (int i = 0; i < sorts.length; ++i) {
            if (sorts[i] < 0.0f) 
                sorts[i] = 0.0f;
            if (sorts[i] != 0.0f) continue;
            ++NZ;
        }
        int I = 0;
        int RM = sorts.length - N - NZ;
        for (int i2 = 0; i2 < RM; ++i2) 
        {
            int m =0;
            float min = 10000;
            for (int k =  0; k < sorts.length; k++)
                if (sorts[k] > 0 && sorts[k] < min)
                {
                    min = sorts[k]; m = k;
                }
            sorts[m] = 0.0f;
        }
    }

    

   
}
