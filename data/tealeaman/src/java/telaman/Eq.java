 
package telaman;

import java.util.Date;
import java.util.*;
import java.util.regex.Pattern;

public class Eq 
{
    public class Vectorstr extends Vector<String>
    {
        public String set(int i, String x)
        {
            while (size()<=i) addElement("");
            return super.set(i,x);
        }
        public String get(int i)
        {
            if (size()<=i) return "";
            return (String)elementAt(i);
        }
        public void del()
        {
            remove(size()-1);
        }
        public void delto(int i)
        {
            while (size()>i+1) remove(size()-1);
        }
    }
    public class Vectorint extends Vector<Integer>
    {
        public Integer set(int i, int j)
        {
            while (size()<=i) addElement(0);
            return super.set(i,j);
        }
        public Integer get(int i)
        {
            if (size()<=i) return 0;
            return elementAt(i);
        }
        public void del()
        {
            remove(size()-1);
        }
        public void delto(int i)
        {
            while (size()>i+1) remove(size()-1);
        }
    }
    public static Hashtable<String,Eq> eqs = new Hashtable();
    int orgnum;
    public String key;
    public DBConnectInfo dbinfo = null;
    public String iid;
    public String assignname;
    public long start;
    public long due = 0;
    public boolean monitored = false;
    public int numtester = 0;
    public int numquestion = 0;
    public Vectorint numanswered = new Vectorint();
    public Vectorstr ansv = new Vectorstr();
    public Vectorstr questiontxt = new Vectorstr();
    public HashMap<String,Queue<Integer>> dynanswer = new HashMap<>();
    public Vectorstr banswer = new Vectorstr();
    public Vectorint numright = new Vectorint();
    public Vectorstr objective = new Vectorstr();
    public String assoptions = "";
    public String code = "";
    public boolean ableviewques = true;
    public String notext = "";
    public Vectorstr whofirst = new Vectorstr();
    public int total = 0;
    public boolean hasindb = false;
     
    public String  attach = null;
    public int tid = -1;
    public String snapshot()
    {
        StringBuffer s = new StringBuffer();
        s.append("{Orgnum:" + orgnum);
        s.append(",\nKey:'" + key);
        s.append("',\nSubdb:'" + dbinfo.server);
        s.append("',\nInstructor:'"+ iid);
        s.append("',\nQuiz:'" + assignname);
        s.append("',\nStart:'"+ Toolbox.timestr(start));
        s.append("',\nDue:'"+ Toolbox.timestr(due));
        s.append("',\nMonitored:"+ monitored);
        s.append(",\nNumberTester:" + numtester );
        s.append(",\nNumberQuestion:"+ numquestion);
        s.append(",\nOptions:'" + assoptions);
        s.append("',\nCode:'"+ code);
        s.append("',\nAbleViewQuestion:"+ ableviewques);
        s.append(",\nNotext:'"+ notext.replace("'", "\\'").replace("\n", "\\n")); 
        s.append("',\nTotal:"+ total);
        s.append(",\nHasindb:"+ hasindb);
        s.append(",\nAttachment:'"+ attach);
        s.append("',\nQuestion:"+ vecarrstr(questiontxt));
        s.append(",\nAnswer:"+ vecarrstr(ansv));
        s.append(",\nAnswered:"+ vecarrstr(numanswered));
        s.append(",\nCorrect:"+ vecarrstr(numright));
        s.append(",\nBest:"+ vecarrstr(banswer));
        s.append(",\nFirstSubmit:"+ vecarrstr(whofirst));
        s.append(",\nObjective:"+ vecarrstr(objective));
        s.append(",\nDynmicAnswer:" + dynanswer.toString().replace("=",":"));
        s.append("}");
        return s.toString();
    }
    
    String vecarrstr(Vectorstr x)
    {
        if (x == null) return "null";
        StringBuffer s = new StringBuffer("[");
        for (String y:x)
        {
            if (s.length()>1) s.append(",");
            s.append("\""+y.replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "") + "\"");
        }
        s.append("]");
        return s.toString();
    }
    String vecarrstr(Vectorint x)
    {
        if (x == null) return "null";
        StringBuffer s = new StringBuffer("[");
        for (Integer y:x)
        {
            if (s.length()>1) s.append(",");
            s.append("'"+y + "'");
        }
        s.append("]");
        return s.toString();
    }
    String strarrstr(int [] x)
    {
        if (x == null) return "null";
        StringBuffer s = new StringBuffer("[");
        for (int y:x)
        {
            if (s.length()>1) s.append(",");
            s.append(y);
        }
        s.append("]");
        return s.toString();
    }
    public Eq(String key1, String ques, String anss, String opt, long du, int orgnum) 
    {
        this.key = key1;
        this.setQuesAnswer(ques, anss);
        this.assoptions = opt;
        this.code = (new AssOption(opt,orgnum)).code;
        this.due = du;
        this.orgnum = orgnum;
        eqs.put(key,this);
    }
    public  synchronized void setQuesAnswer(String q, String ans) {
        
        Vectorstr v = new Vectorstr();
        String[] ques = Assignment.parse("\n" + q,Pattern.compile(Assignment.separator(orgnum)));
        v.addElement(ques[0]);
        String noanswer = "";
        for (int j =1; j < ques.length; j++)
        if (ques[j]!= null)   
            noanswer = noanswer + j + "@";

        this.numquestion = 0;
        StringBuffer not = new StringBuffer();
        int mi = 0;
        String[] nn = noanswer.split("@");
        int j = 1;
        for (j = 1; j < ques.length; ++j) {
            String choices;
            if (ques[j] == null) {
                if (v == null) continue;
                v.addElement(null);
                continue;
            }
            int mn = 0;
            try {
                mn = Integer.parseInt(nn[this.numquestion]);
                if (mi < mn) {
                    mi = mn;
                }
            }
            catch (Exception e) {
                // empty catch block
            }
            ++this.numquestion;
            not.append("" + mn + ". ");
            if (v != null) {
                if (v.size() > j) {
                    v.set(j, ques[j]);
                } else {
                    v.addElement(ques[j]);
                }
            }
            if ((choices = QuestAnswer.parsec(ques[j])).length() > 1) {
                for (int i = 0; i < choices.length(); ++i) {
                    not.append("" + choices.charAt(i) + "." + choices.charAt(i) + "\n");
                }
            } else {
                not.append(" ");
            }
            not.append("\n\n");
        }
        int i = this.numquestion;
        ++mi;
        while (i < 10) {
            not.append("" + mi + ". \n\n");
            if (v != null) {
                v.addElement("");
            }
            ++i;
            ++mi;
        }
        if (this.numquestion < 10) {
            this.numquestion = 10;
        }
        this.notext = not.toString();
        if (ans!=null && !ans.equals(""))
        {
            String[] qs = Assignment.parse("\n" + ans, Pattern.compile(Assignment.separator(orgnum)));
           // this.ansv = new String[this.numquestion + 1];
            for (j = 1;   j < qs.length; ++j) {
                this.ansv.set(j,qs[j]);
            }
        }
        //this.questiontxt = new String[this.numquestion + 1];
        this.growto(this.numquestion + 1, false);
        questiontxt = v;
        
    }


    private String arrstr(int[] a) {
        String x = "";
        if (a == null || a.length == 0) {
            return "";
        }
        for (int i = 0; i < a.length; ++i) {
            x = x + "," + a[i];
        }
        return x.substring(1);
    }

    public int mnb() 
    {
        int mn=0; if (this.ansv==null) return 0;
        for (mn = this.numquestion; 
        mn >= 0 && (  mn < this.ansv.size()  && (this.ansv.get(mn).equals(""))  ) 
        && ( mn < this.ansv.size() && this.ansv.get(mn).equals("") 
        || mn < this.numanswered.size() && this.numanswered.get(mn) <= 0);
        --mn) 
        {
            if (!this.objective.get(mn).equals("")) 
                break;
        }
        return mn;
    }
    public void setnumq(int n)
    {
        questiontxt.delto(n);
        ansv.delto(n);
        whofirst.delto(n);
        objective.delto(n);
        banswer.delto(n);
        numright.delto(n);
        numquestion = n;
    }
    public String sumans(int mn) {
        if (mn == 0) {
            return "";
        }
        String answerstr = "";
        for (int i = 1; i <= mn && i < this.ansv.size(); ++i) 
        {
            answerstr = answerstr + "\n" + i + ". " + this.ansv.get(i).replaceAll("\n"," \n");
        }
        return answerstr;
    }

    public String sumass(int mn) {
        String assess = "|# |,|pts|,|Objective|,|numanswered|,|numright|," + this.numtester;
        for (int i = 1; i <= mn; ++i) {
            if (i > 1) {
                assess = assess + ";";
            }
            assess = assess + i + ",1,|" + this.objective.get(i) + "|," + this.numanswered.get(i)
                    + "," + this.numright.get(i);
        }
        return assess;
    }

    public synchronized void savedata(int orgnum) {
        JDBCAdapter adapter;
        int mn;
        if (this.dbinfo == null) {
            return;
        }
        int j = this.key.lastIndexOf("-");
        String course = this.key.substring(0, j);
        String sessionname = this.key.substring(j + 1);
        if ((mn = this.mnb()) == 0) {
            return;
        }
        String answerstr = this.sumans(mn);
        String assess = this.sumass(mn);
        long nowinsecond = System.currentTimeMillis() / 1000;
        adapter = Toolbox.getUserAdapter(this.dbinfo,orgnum);
        String uanswer = "";
        for (int i=0; i < ansv.size(); i++)
        {
            if (!ansv.get(i).equals(""))
            {
                uanswer += i + "." + ansv.get(i).replaceAll("\n", " \n") + "\n";
            }
            else if (i < banswer.size())
            {
                String x = banswer.get(i);
                if (x != null && !x.equals(""))
                {
                    uanswer += i + "." + x.replaceAll("\n", " \n") + "\n";
                }
            }
        }
        String keystr =  (orgnum%65536) + "|" 
               + Toolbox.dbadmin[orgnum%65536].currentSemester
               + "|" + course + "|" + assignname + "|" + sessionname; 
        User user =null;
        String sql = "UPDATE Assignment SET lastupdate=" + nowinsecond + ",answer='" + uanswer.replaceAll("'","''") +"', assess='" + assess + "' where  course='" + course.replaceAll("'", "''") + "' AND  name ='" + this.assignname.replaceAll("'", "''") + "'  AND  sessionname='" + sessionname.replaceAll("'", "''") + "'   AND semester='" + Toolbox.dbadmin[orgnum%65536].currentSemester  + "'";
        String sql1 = "INSERT INTO Assignment( course, lastupdate, name, semester, sessionname,scale,weight,question,answer,atype,format,options,start,due,status,assgroup,assess, grader) VALUE('" + course + "'," + nowinsecond + ",'" + this.assignname + "','" + Toolbox.dbadmin[orgnum%65536].currentSemester + "','" + sessionname + "',10,1,'" + this.notext.replaceAll("'", "''") + "','" + answerstr.replaceAll("'", "''") + "',4,1,'" + this.assoptions + "'," + this.start + "," + this.due + ",2,'" + Toolbox.emsgs(orgnum,1378) + "','" + assess + "','" + this.iid + "')";
        if (adapter.executeUpdate(sql) != 1) 
        {
            if (!this.notext.equals("") && !answerstr.equals(""))
            {
                
                if (adapter.executeUpdate(sql1) == 1)
                {
                   synchronized(this){ Toolbox.dbadmin[orgnum%65536].cache.put(keystr,  start + ","+ this.due +",4,'" + this.assoptions.replace("'","''") + "',''");}
                }
            }
        }
        else
        {
             
             String   info = null; try{ info = Toolbox.dbadmin[orgnum%65536].cache.get(keystr);
             if (info!=null)synchronized(this) { Toolbox.dbadmin[orgnum%65536].cache.put(keystr, info.replaceFirst("[0-9]+,[0-9]+,[0-9]",start + ","+ this.due +",4"));}
             }catch(Exception e){}     
        }
        adapter.close();
    }

    private synchronized int[] growarr(int[] x, int i) {
        if (x != null && i <= x.length) {
            return x;
        }
        int[] y = new int[i];
        if (x != null) {
            for (int j = 0; j < x.length && j < i; ++j) {
                y[j] = x[j];
            }
        }
        return y;
    }

    private synchronized String[] growarr(String[] x, int i, String filler) {
        int j = 0;
        if (x != null && i <= x.length) {
            return x;
        }
        String[] y = new String[i];
        if (x != null) {
            for (j = 0; j < x.length && j < i; ++j) {
                y[j] = x[j];
            }
        }
        for (; j < i; ++j) {
            y[j] = filler;
        }
        return y;
         

    }

    public  synchronized void assess(String a, boolean dostat) {
        CSVParse parse = new CSVParse(a, '|', new String[]{",", ";"});
        String[] x = parse.nextRow();
        if (x == null) {
            return;
        }
        if (x.length == 6 && dostat) {
            try {
                this.numtester = Integer.parseInt(x[5].trim());
            }
            catch (NumberFormatException e) {
                // empty catch block
            }
        }
        while ((x = parse.nextRow()) != null) {
            try {
                int j = Integer.parseInt(x[0]);
                if (j < 0 || j >= this.numright.size()) break;
                if (dostat) {
                    if (x.length > 3) {
                        try {
                            this.numanswered.set(j, Integer.parseInt(x[3].trim()));
                        }
                        catch (NumberFormatException e2) {
                            // empty catch block
                        }
                    }
                    if (x.length > 4) {
                        try {
                            this.numright.set(j,Integer.parseInt(x[4].trim()));
                        }
                        catch (NumberFormatException e) {
                            // empty catch block
                        }
                    }
                }
                if (x.length <= 2) continue;
                this.objective.set(j,x[2]);
            }
            catch (Exception e) {}
        }
    }

     synchronized void growto(int n, boolean all) 
     {
        if (all) 
        {
            this.numquestion = n - 1;
            for (int i = this.numquestion + 1; i < n; ++i) 
            {
                this.notext = this.notext + i + ". \n\n";
            }
        }
    }

    synchronized void inc(int i, int score) {
        if (this.numanswered.get(i) < this.numtester) {
            this.numanswered.set(i, this.numanswered.get(i)+1);
            ++this.total;
        }
        if (score > 0 && this.numright.get(i) < this.numtester) 
        {
            this.numright.set(i,this.numright.get(i)+1);
        }
    }

    public  synchronized void set(String opt, long du) {
        this.assoptions = opt;
        this.due = du;
    }

    public Eq(int orgnum) 
    {
        this.orgnum = orgnum;
    }

    

    public String toString() {
        String x = "<table  border=1 style=border-collapse:collapse><tr><td align=right>num</td><td align=right>ID</td><td align=right>Name</td><td align=right>Subdb</td><td align=right>Has in DB </td><td align=right>numtester</td></tr><tr><td align=right>" + this.monitored  + "</td><td align=right>" + this.key + "</td><td align=right>" + this.assignname + "</td><td align=right>" + this.iid + "</td><td align=right>" + this.hasindb + "</td><td align=right>" + this.numtester + "</td></tr>" + "<tr><td align=right># Question</td><td align=right># Answered</td><td align=right>Start</td><td align=right>Due</td><td align=right colspan=2>Non Question</td></tr>" + "<tr><td align=right>" + this.numquestion + "</td><td align=right>" + this.total + "</td><td align=right>" + new Date(this.start * 1000).toString() + "</td><td align=right>" + new Date(this.due * 1000).toString() + "</td><td align=right  colspan=2>" + this.notext + "</td></tr>\n" + "<tr height=4><td colspan=5></td></tr>" + "<tr><td align=right>#</td><td align=right>Answer</td><td align=right>Objective</td><td align=right># Answered</td><td align=right># Right</td><td align=right>Percent</td></tr>";
        for (int i = 1; i <= this.numquestion; ++i) {
            x = x + "<tr><td align=right>" + i + "</td><td  align=right>" 
                    + this.ansv.get(i) + "</td><td  align=right>" + this.objective.get(i)
                    + "</td><td  align=right>" + this.numanswered.get(i) + "</td><td  align=right>" 
                    + this.numright.get(i) + "</td><td  align=right>" 
                    + (this.numtester > 0 ? new StringBuilder().append("").append(Math.round(100 * this.numright.get(i) / this.numtester)).append("%").toString() : "") + "</td></tr>\n";
        }
        x = x + "</table>";
        return x;
    }
    public String getanswer(int questionnum) 
    {
        if (questionnum > this.numquestion) 
        {
            if (questionnum > 1000) 
            {
                return "";
            }
            this.growto(questionnum + 1, true);
        }
        String answer = this.ansv.get(questionnum);
        return answer;
    }
     
    public int grade(int questionnum, String solution) 
    {
        if (questionnum > this.numquestion) 
        {
            if (questionnum > 1000) 
            {
                return -1;
            }
            this.growto(questionnum + 1, true);
        }
        String answer = this.ansv.get(questionnum);
        int score;
        if (answer.equals("")) 
        {
            //if (quessanswer.size() <= questionnum)
            {
               // this.inc(questionnum, 1);
                return -1;
            }
            /*else
            {
                String banswe = bestanswer(quessanswer.elementAt(questionnum));
                for(int ll=banswer.size(); ll <=questionnum; ll++)
                    banswer.addElement("");
                banswer.setElementAt(banswe, questionnum);
                score =  gradehelp(solution, banswe);
            }*/
        }
        else
            score =  gradehelp(solution, answer);
        this.inc(questionnum, score);
        return score;
    }
    
    private String bestanswer(String p)
    {
        if(p==null || p.equals("")) return "";
        String [] q = p.replaceFirst("\t;$", "").split("\t");
       
        java.util.HashMap<String,Integer> ht = new java.util.HashMap<String, Integer>(q.length);
        int M = 1;
        String w = null;
        for (int i=0; i < q.length; i++)
        {
            String y = q[i].toLowerCase();
            Integer x = ht.get(y);
            int z = 1;
            if (x==null)
            {
                ht.put(y, new Integer(1));
            }
            else
            {
                z = 1 + x.intValue();
                ht.put(y, new Integer(z));
            }
            if (M < z) 
            {
                M = z;
                w = q[i];
            }
        }
        return w;
    }

    private int gradehelp(String s, String answer)
   {
        if (s==null || s.equals("")) return 0;
        if (answer==null || answer.equals("")) return -1;
        s = s.toLowerCase().trim();
        ArrayList<String> v = new ArrayList();
        int score;
        QuestAnswer.splitString(answer.toLowerCase().trim(), v);
        if (s.equals("")) 
        {
            score = 0;
        } 
        else 
        {
           int hits = 0;
            for (int i = 0; i <  v.size(); ++i) 
            {
                if (s.indexOf(v.get(i)) < 0) continue;
                hits += 1;
            }
            score = (hits >= 0.6 * v.size()) ? 1 : 0;
        }
        return score;
   } 
    
}
