 
package telaman;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.io.*;
 

public class Assignment extends Vector<QuestAnswer>
{
    //public static Pattern separator = Pattern.compile("[\r|\n][0-9]+[ |\\.|\\)|:|\\]]" ); 
    static public String separator(int orgnum)
    {
        String x = "[\r|\n][0-9]+[ |\\.|\\)|:|\\\\";
        if (!Toolbox.encodings[orgnum>>16].equals("utf-8"))
        {   
            String str = Toolbox.emsgs(orgnum, 1556);
            for (int i=0; i < str.length(); i++)
               if (x.indexOf(str.charAt(i))<0) 
                   x += "|" + str.charAt(i);
            
        }
        return x + "]";
    }
    public static Pattern questionchoice = Pattern.compile("[\r|\n][\\(]?[a-z|A-Z][ |:|\\.|\\)|\\]]"); 
    public Assignment()
    {
    }
    boolean k = false;
    int nn = -1;
    public int Q = 0;
    public int maxn = 0;
    
    public int maxlength = 0;
    public String quest = "";
    public boolean embedquiz = false;
    
    String fmt;
    String questionstr;
    String answerstr;
    String atypestr;
    public int epts = 0;
    public int nzn = 0;
    String formula;
    boolean regrade = false;
    
    ArrayList<ArrayList<String>> anwserv  = new ArrayList();
    String[] answers = null;
    boolean[] ismult = null;
    int orgnum = Toolbox.langnum<<16;
    boolean keepcommets = false; 
    public Assignment(String fmt,  String ans, String assessstr, String atypestr, String formula , int N1, String regradenum, String question1, int orgnum)// String[] bystr, int[] byint) 
    {
        super(10);
        boolean recal = false;
        this.orgnum = orgnum;
        answerstr = ans;
        Q = 0;
        embedquiz = atypestr.equals("4");
       
        if (ans == null) 
        {
            ans = "";
        }
        this.formula = formula;
        this.keepcommets = (regradenum!=null &&( regradenum.charAt(0)=='2' || regradenum.charAt(0)=='3')); 
        recal = (regradenum==null || regradenum.charAt(0)=='1' || regradenum.charAt(0)=='3'); 
        if (regradenum != null)
        {
            regrade = true;
        }     
        if (regradenum!=null && regradenum.length()>1 )
        {
            if (regradenum.charAt(0) == '0')
               this.formula = "0|S"; 
            
        }
        this.fmt = fmt;
        int la = ans.length();
        ans = "\n" + ans;
        maxlength = 0;
        Pattern separator1 = Pattern.compile(separator(orgnum));
        answers =  parse(ans, separator1);
        
        String [] questions = parse(question1, separator1);
        
        if (questions!=null)
        {
            ismult = new boolean[questions.length];
            if (questions.length > maxlength)
                maxlength = questions.length - 1;
        }
        if (questions!=null)
        for (int j=1; j < questions.length; j++)
        {
            String z = questions[j];
            if (z == null) continue;
           
            Matcher m = questionchoice.matcher(z);
            int k=0; 
            String abc = "";
            while ( m.find(k))
            {
               int i = m.start();
               k = m.end();
               abc += z.substring(i,k).toLowerCase().replaceAll("[^a-z]", "");
            } 
         
            ismult[j] = (abc.length() - abc.replaceAll("[a|b|c]", "").length()) >= 2; 
        }
        
     
        QuestAnswer qa;
        if (answers!=null)
        for (int i = 1;  i < answers.length ; ++i) 
        {
            String y;
            if (  i < answers.length  && answers[i] != null) 
            {
                qa = new QuestAnswer(i, "", "", answers[i], 1, 0, "", orgnum);
                ++Q;
            } 
            else 
            {
                qa = new QuestAnswer(i, "", "", "", 1, 0, "",orgnum);
            }
            
            qa.valid =  (qa.answer != null && !qa.answer.equals(""));
          
            
            y = qa.answer.toLowerCase().trim();
            if (i < ismult.length && ismult[i] && qa.valid && (y.length() == 1 &&  (y.charAt(0) >= 'a' || y.charAt(0) <= 'z') 
                          || y.length() > 1  &&  y.substring(0, 2).replaceFirst("[a-z][ |:|,|@|\\.|/|\\|]", "").equals(""))) 
            {
                qa.fmt = 4;
            }
            qa.verified = qa.verify(); 
            for (int j = size(); j < i; ++j) 
            {
                addElement(null);
            }
            if (regradenum!=null)
            {
                int k3 = regradenum.indexOf("@" + qa.num + '@');
                if (k3 > 0)
                {
                    qa.action = regradenum.charAt(k3-1);
                    
                }
            }
 
            addElement(qa);
            if (embedquiz) 
            {
                // empty if block
            }
            if (maxn < qa.num) 
            {
                maxn = qa.num;
            }
           
        }
        
        if (assessstr == null) 
        {
            assessstr = "";
        }
        int epts = 0;
        int nzn = 0;
        qa = null;
        String[][] sep = CSVParse.csvToArray2(assessstr, '|', ",", ";");
      
        for (int l = 0; l < sep.length; ++l)
        {
            if (sep[l] == null) continue;
            if (sep[l].length < 2) continue;
            int kk = -1;
            try {
                kk = Integer.parseInt(sep[l][0]);
            }
            catch (NumberFormatException e) 
            {
                // empty catch block
            }
            if (kk < 0 ) 
            {
                continue;
            }
            if (   kk >=  size()) 
            {
                for (int j=size(); j <= kk; j++)
                    addElement(null);
                qa  = new QuestAnswer(kk, "", "", "", 1, 0, "",orgnum);
               
            }
            else
            {
                 qa =  elementAt(kk);
                 if (qa == null) 
                     qa = new QuestAnswer(kk, "", "", "", 1, 0, "",orgnum);
            }
            if (sep[l].length > 1) 
            {
                try 
                {
                    qa.pts = Float.parseFloat(sep[l][1]);
                    if (qa.pts == 0.0f) qa.pts = 0.0000001f;
                    epts = (int)((float)epts + qa.pts);
                    ++nzn;
                }
                catch (NumberFormatException e) 
                {
                    qa.pts = qa.fmt == 4 ? 1  : 10;
                    
                }
            }
            
            if (sep[l].length > 2) {
                qa.outcome = sep[l][2];
            }
           
            if (sep[l].length > 3) {
                try {
                    qa.numAnswered = Integer.parseInt(sep[l][3]);
                }
                catch (NumberFormatException e) {
                    qa.numAnswered = 0;
                }
            }
           
            if (sep[l].length > 4) 
            {
                try {
                    qa.numRight = Integer.parseInt(sep[l][4]);
                }
                catch (NumberFormatException e) {
                    qa.numRight = 0;
                }
            }
            if (regradenum!=null)
            {
                int k2 = regradenum.indexOf("@" + qa.num + '@');
                if (k2 > 0)
                {
                    qa.action = regradenum.charAt(k2-1);
                }
            }
 
            setElementAt(qa, kk);
        }
        if (maxn < maxlength) maxn = maxlength;
    }
    public void resetcount()
    {
        for (int i=0; i < size(); i++)
        {
            if (elementAt(i)!=null){
            elementAt(i).numAnswered = 0;
            elementAt(i).numRight = 0;
            }
            else
            {
               
            }
        }
    }
    
     
    public static String[] parse(String s, Pattern p ) {
        
       
        Vector<String> ht = new Vector<>();
        int i;
       
        Matcher m = p.matcher((CharSequence)s);
        int k = 0;
        int nn = -1;
        int n0 = 0;
        int mx = -1;
        String ansstr = null;
        String header = "";
        while(true)
        {
            if (m.find(k)) 
            {
                
                i = m.start();
                 
              
                if (k < i)
                {
                    ansstr = s.substring(k, i).replaceFirst("^[\t| |\n|\r]+", "").replaceFirst("[\t| |\n|\r]+$", "");
                    if (k==0) header = s.substring(k, i);
                }
                else
                  ansstr =  "";
                k = m.end();
                try 
                {
                    n0 = Integer.parseInt(s.substring(i, k).replaceAll("[^0-9]", ""));
                }
                catch (NumberFormatException e) {}
            } 
            else 
            {
                i = -1;
                ansstr = s.substring(k).replaceFirst("^[\t| |\n|\r]+", "").replaceFirst("[\t| |\n|\r]+$", "");
            }
            if (nn > -1)
               ht.addElement(nn + " " + ansstr);
            if (i != -1)  
            {
                nn = n0;
                if (nn > mx) 
                    mx = nn;
            }
            else 
                break;
        }  
        if (mx==-1) return new String[]{s};
        String[] x = new String[mx+1];
        for (i = 0; i < ht.size(); i++) 
        {
            String v =   ht.elementAt(i); 
            int j = v.indexOf(" ");
           
            x[Integer.parseInt(v.substring(0,j))]  = v.substring(j+1);
        }
        
        if (x[0] == null) x[0] = header;
        return x;
    }
    public static String sumup(String formulas, float[] sorts, int Q,  String leas, int EN, float [] SM)
    {
            int dropn = 0;
            int j= formulas.indexOf("|");
 
            if (j < 0) 
            {
                j = 0;
            } 
            else 
            {
                try 
                {
                    dropn = Integer.parseInt(formulas.substring(0, j));
                } 
                catch (NumberFormatException e) 
                {
                    dropn = 0;
                }
                formulas = formulas.substring(j + 1);
            }
            float S = 0.0f;
            Arrays.sort(sorts);
            int kk=0;
            int Mx = Q; if (Q < EN) Mx = EN;
            for (int ii3 = sorts.length-1; kk < Mx - dropn && ii3>=0; kk++,ii3--) 
            {
                S += sorts[ii3];
            }
            formulas  = formulas.replaceFirst("^0",""); 
            float M = -1;
            String error = "";
 
            String expression = formulas.replaceAll("T", "" + leas).replaceAll("S", "" + S).replaceAll("Q", "" + EN);
    
            try 
            {
                M = (float) ( Evaluate.arithematic(expression));
            } 
            catch (Exception e) 
            {
                error += "Wrong formulas: " + formulas + ";";
            }
        SM[0] = S; 
        SM[1] = M;
        SM[2] = dropn;
        return error;
    }
     
    public  boolean grade(Submission submission) 
    {
        QuestAnswer qa;
        int C = 0;
        submission.sol = "";
        float S = 0.0f;
        float M = 0.0f;
                String[] sep = new String[]{",", "\r\n"};
        CSVParse parse = new CSVParse(submission.content, '\'', sep);
        String[] sep1 = new String[]{",", ";"};
        CSVParse aparse = new CSVParse(submission.assess, '|', sep1);
        String [][]oldass = aparse.nextMatrix();
        String leas = submission.leas;
        boolean isdelay = false;
        
        if (oldass.length>1 && leas == null && oldass[oldass.length-1].length > 4)
        {
            leas = oldass[oldass.length-1][4];
            isdelay = oldass[oldass.length-1][7].indexOf(Toolbox.emsgs(orgnum,1452))>=0;
        }
          
        String[] astr = null;
        String header = "";
        StringBuffer assess = new StringBuffer();
        StringBuffer youranswer= new StringBuffer("<table border=1 style=border-collapse:collapse >");
        String yourtext = "";
        ArrayList<Float> sorts = new ArrayList();
         
        int[] orders = new int[20];
        for (int ii2 = 0; ii2 < orders.length; ++ii2) 
        {
            orders[ii2] = -1;
        }
        boolean ismult = true;
        QuestAnswer sol = null;
        String quitassign = "";
        String [] errs = Toolbox.emsgs(orgnum,1540).split("@");
        String err = "";
        boolean QK = false;
        String error = "";  
        if (!(leas == null || leas.equals(""))) 
            leas = "0";
        int jj1 = 0; 
        int EN = 0;
        int Q = 0;      
        int timestay = 0;
        int ordercount = 0;
        while ((astr = parse.nextRow()) != null) 
        { 
            if (astr.length == 1) continue;
            jj1++;
         
            if (  astr.length==2  )
            {
                astr = new String[]{astr[0], astr[1], "0","0"};
            }
            else if  ( astr.length==3 )
            {
                astr = new String[]{astr[0], astr[1],  astr[2], "0"}; 
            }
             
            sol = new QuestAnswer(astr,orgnum);
            submission.sol += sol.num + "." + sol.solution + "\n\n";
            //if (sol.num < 1) continue;
  
            EN++;
 
            if (!sol.valid) 
            {
                quitassign +=  ","  + sol.num;
                err = errs[0];
                sol.score = 0.0f;
                sol.tocsv1(assess);
                assess.append(";"); 
            }
            else
            {
                 
                String fstr =  Toolbox.formatstr("0",sol.solution);
                  
                youranswer.append("<tr><td vlign=top>" + sol.num + "</td><td>" + fstr + "</td><td>" +  sol.timestay  + "</td></tr>");
 
                yourtext += sol.num +  sol.solution  +  sol.timestay;
              
                if (oldass!=null)
                {
                      
                    int z = 0; 
                    for (; z < oldass.length; z++)
                    {
                         
                        if (oldass[z]!=null && 
                            oldass[z].length > 0 && 
                            oldass[z][0] !=null &&
                            oldass[z][0].equals("" + sol.num))
                        { 
                      
                            break;
                        }
                    }
                    
       
                    if (z < oldass.length && oldass[z].length >= 4)
                    {
                        try{ sol.pts = Float.parseFloat(oldass[z][1]);}catch(NumberFormatException ex1){ }
                        try{sol.score = Float.parseFloat(oldass[z][2]);}catch(NumberFormatException ex2){}
                        if (this.keepcommets)sol.comments = oldass[z][3];
                    }
                }
   
                int nn = sol.num;
                if (sol.shuffled < orders.length && sol.shuffled>=0 ) 
                {
                    orders[sol.shuffled] = nn;
                }
  
                if (nn < size()) 
                {
                    qa = elementAt(nn);
                     
                    if (qa == null)
                    {
                        quitassign = quitassign.replaceFirst(","  + sol.num + "$", "");
                        quitassign +=  ","  + sol.num  ;
                        err = errs[1];
                        if (sol.pts == 0) 
                        sol.pts = 1;
                        if (sol.solution == null || sol.solution.trim().equals(""))
                        {
                            sol.score = 0;
                        }
                        else
                        {
                            sol.score = sol.pts;
                        }
                        sorts.add(sol.score);
                        S += sol.score;
                        sol.tocsv1(assess);
                        assess.append(";"); 
                          
                    }
                    else if (qa.action == 'u')
                    {
                        sol.score = -1;
                        assess.append(";");
                        Q++; 
                    }
                    else
                    {
                        Q++;
                        if (sol.fmt == 5 ) 
                        {
                            sol.fmt = qa.fmt;
                        }
                        
                        boolean needgrade = true; 
                        /* (  sol.fmt==4 
                         || sol.pts != qa.pts       
                         || qa.answer.trim().length() > 0  
                         || sol.score <= 0.0);*/
         
                        if (!qa.verified && sol.fmt == 4) 
                        {
                            qa.verified = true;
                            String xx = qa.answer.toLowerCase();
                            qa.valid = xx.length() == 1 && xx.charAt(0) >= 'a' && qa.answer.charAt(0) <= 'z' 
                            || xx.length()  > 1 &&  xx.substring(0, 2).replaceFirst("[a-z][ |:|,|@|\\.|/|\\|]", "").equals("");
                        }
                         
                        if (sol.fmt != 4 && qa.valid) 
                        {
                            ismult = false;
                        }
                       
                        
                        if (qa.answer.equals("")) 
                        {
                            quitassign +=  "," + qa.num;
                            err = errs[2];
                        } 
                       
                        if (!qa.valid) 
                        {
                            quitassign +=  "," + qa.num;
                            err = errs[3];
                        }
   
                        sol.answer = qa.answer; 
  
                        
                        if (embedquiz) 
                        {
                            if (sol.gradeembed(this,sol.num) == false)
                            {
                                quitassign = quitassign.replaceFirst(","  + sol.num + "$", "");
                                quitassign +=  ","  + sol.num;
                                err = errs[3];
                            }
                            sol.pts = 1;
                        } 
                        else 
                        {
                            
                            if (qa.action == 'r' && sol.pts > 0)
                            {
                                sol.score *= qa.pts/sol.pts;
                             }
                            else  if (qa.action=='g' || sol.pts == 0)
                            {
                               if (sol.num >= this.answers.length)
                               {
                                   quitassign = quitassign.replaceFirst(","  + sol.num + "$", "");
                                   quitassign +=  ","  + sol.num;
                                   err = errs[4];
                               }
                               sol.pts = qa.pts;
                               
                               try{
                                   timestay += sol.timestay;
                                   if (sol.timestay>0)ordercount++;
                                   sol.grade(this, sol.num); 
 
                               }catch(Exception e){
                                   
                               }
                            
                            }
                        }
                           
                        if (sol.score < 0) 
                            sol.score =  0;
                        S += sol.score;
                        if (sol.score > 0 ) 
                        {
                            C++;
                        }
                      
                         
                        sorts.add(sol.score);
                        if (sol.pts == 0.0000001f)
                            sol.pts = 0.0f;
                        sol.tocsv1(assess);
                        assess.append(";"); 
                      
                        if (embedquiz) 
                        {
                            qa.numAnswered++;
                            if (sol.score == qa.pts) 
                            {
                                qa.numRight++;
                            }
                        }
                    
                        if (submission.testing) 
                        {
                            qa.fmt = sol.fmt;
                            qa.solution = sol.solution;
                            qa.timestay = sol.timestay;
                            qa.score = sol.score;
                            qa.shuffled = qa.num;
                            setElementAt(qa, nn);
                        }
                        
                    }
                } 
                else 
                {
                    quitassign = quitassign.replaceFirst(","  + sol.num + "$", "");
                    quitassign +=  ","  + sol.num;
                    err = Toolbox.emsgs(orgnum,471);
                    if (sol.pts == 0) 
                        sol.pts = 1;
                    if (sol.solution == null || sol.solution.trim().equals(""))
                    {
                        sol.score = 0;
                    }
                    else
                    {
                        sol.score = sol.pts;
                    }
                    sorts.add(sol.score);
                    S += sol.score;
                     
                    sol.tocsv1(assess);
                    assess.append(";"); 
                }
            }
 
        }
  
        if (!quitassign.equals("")) 
        {
            error  +=  err  +  ":" +  quitassign.replaceFirst("^,", "")  ;
        }
 
        if (formula.equals("")) 
        {
            formula = "0|S";
        }
        
        int dropn = 0;
        float [] SM = new float[3]; 
        float sr[] = new float[sorts.size()]; 
        for (int i=0; i < sr.length; i++)
            sr[i] = sorts.get(i).floatValue();
        if (!formula.equals("") && !formula.equals("0|S")) 
        {  
            Float [] y = new Float[sorts.size()];
            error += sumup( formula,  sr,  (Q > maxn? Q:maxn),  leas,  EN, SM);
            S = SM[0];
            M = SM[1];
           
            dropn = (int)(Math.round(SM[2]));
        }
        else 
        {
            dropn = 0;
            formula = "S";
            M = S;
              
        }
        
        if (S>=0 && M >=0)
        {
            int N = Q; if(maxn > Q) N = maxn;  else if (maxn == 0) N = EN;
            assess.append(N + "," + dropn + "," + n2s(S) + ",|" + formula.replaceFirst("[^\\|]+\\|", "") + "|," + (embedquiz&&ordercount>0?(timestay/ordercount):leas) + "," + n2s(M) + ",|" + error + (isdelay?(" " + Toolbox.emsgs(orgnum,1452)):"") + "|");
            submission.assess = assess.toString();
            submission.receipt = youranswer + "</table>";
            submission.curved =  M;
            submission.score = S;
            submission.text = yourtext;
        }
        else
        {
            submission.receipt ="";
            submission.curved =  -1;
            submission.score = -1;
            submission.text = "";
            submission.assess = "";
        }
           
        submission.error = error;
        return ismult;
    }
    
    public String makeaccess() {
        String ans = "";
        for (int i = 0; i <  size(); ++i) {
            QuestAnswer qa;
            if ((qa =  elementAt(i)) == null) continue;
            if (i > 0) 
            {
                ans = ans + ";";
            }
            ans = ans + qa.toaccess();
        }
        return ans;
    }

    public String makehtml( int fmt) 
    {
        String ans = "";
        for (int i = 0; i <  size(); ++i) {
            QuestAnswer qa;
            if ((qa =  elementAt(i)) == null) continue;
            ans = ans + qa.tohtml(fmt);
        }
        return ans;
    }
    
     public static void main(String[] a) 
     {
        String assignname = "ddd";
        String questionstr = "1.  $(x^2)'=$\na. $t_3$\nb. $2x$\nc. d\n\n2. find  $$\\int_0^x 2(t)dt$$ \n\n3. x=__________________, y=___________________";
        String ans = "1.b\n2.sdf1. b\n\n2. $t^2$\n\n3. x,y";
        String assessstr = "1,a,c,d,e,1;1,1,1;2,20,|1,2|;3,20,1";
        String atypestr = "3";
        
        String[] bystr = new String[5];
        int[] byint = new int[5];
         String formula = "1|S";
        Assignment as = new Assignment(assignname,  ans, assessstr, formula, atypestr, 1,null, "", 0);
        String content = "1,b,15043,4,1\n2,$t^2$,58666,2,3\n3,'x\ny',6452,2,2";
        boolean testing = false;
       
        String leas = "111";
        int maxn = 3;
        boolean embedquiz = false;
        Submission submission = new Submission("",content, leas, false, false,0); 
        boolean b = as.grade(submission);
        
    }
    public static String n2s(float S)
    {
        return String.format("%.2f",S).replaceFirst("\\.00$","").replaceFirst("\\.([0-9])0$",".$1");
    }
}
