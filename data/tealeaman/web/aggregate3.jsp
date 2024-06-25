<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>

<%!
     
String   caldeduct(String absentdeduct,double arr[])
{
    CSVParse p = new CSVParse(absentdeduct,'|',new String[]{",", ";"});
    String [][] q = p.nextMatrix();
    
    int v = 0; 
    int z = 0;
    String a = "";
    int k =0; 
    
    for (k=0; k< arr.length; k++)
        arr[k]= 0;
    k=0;
  
    while (k < q.length && q[k].length>1) 
    {
        try
        {
           q[k][1] = q[k][1].replaceAll("<[^>]+>","").replaceAll(";","").replaceAll("[a-z]","").replaceAll("&","");
           arr[Integer.parseInt(q[k][0])] =  Double.parseDouble(q[k][1]) ;
           a += q[k][0] + "," + q[k][1] + ";";
        }catch(Exception e){}
          k++;
    }
    if (a.equals("")) a = "1,0";
   
    return a.replaceFirst(";$","");
}

double ded(int times, double arr[])
{
    double v = 0;
    for (int i=1; i <= times; i++) 
    {
       v += arr[i];
    }
    return v;
}
String status(String allstatus[],String s)
{
 int i = 0;
 try{
 i = Integer.parseInt(s);
 i = i%10;
 }catch(Exception e){}
 if (i >= allstatus.length||i<0 || i==1 ) return "";

 return allstatus[i];
}

String spaces = "                                                    ";
void append(StringBuffer  buf, String str, int l, boolean left)
{
 if (left)
 {
 buf.append(str);
 if (l > str.length())
 buf.append(spaces.substring(0, l - str.length()));
 }
 else
 {
 if (l > str.length())
 buf.append(spaces.substring(0, l - str.length()));
 buf.append(str);
 }

}
String pad(String str, int l )
{
 if (l <= str.length())
 return str;
 return str + spaces.substring(0, l - str.length());

}
 
String twoplace(double g)
{
   g *= 100;
   long g1 = Math.round(g);
   String gstr = Long.toString(g1);
   if (g1 == 0) return "0.00";
   if (g1 < 10) return "0.0" + g1;
   if (g1 < 100) return "0." + g1;
   return gstr.replaceFirst("([0-9][0-9])$", ".$1");
}
String comb(String s1, String s2, String s3, String s4, String s5, String s6, String s7, String s8 )
{
  
 return "[\"" + s1 + "\",\"" + s2 + "\",\"" + s3 + "\",\"" + s4 + "\",\"" + s5 + "\",\"" + s6 + "\",\"" + s7+ "\",\"" + s8 +"\"],";
}

String nonnull(String sts)
{
 if (sts == null || sts.equals("null") || sts.equals(" ") )return "";
 return sts.trim();
}
%>
<%
int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
User user = null;
if (  (user = User.authorize(orgnum, Systemroles.INSTRUCTOR | Systemroles.TEACHINGADMIN |Systemroles.ASSESSER,application,session,request, response, "aggregate3.jsp", true)) == null|| !Toolbox.verifytoken(request))
 return;
orgnum = user.orgnum; 
user.changedb(user.id);
String allstatus[] =  Toolbox.dbadmin[user.orgnum%65536].domainValue(Toolbox.langs[orgnum>>16], "Registration Status",1,0 ).replaceAll(",[0-9]+","").split(";"); 
String semester =  Toolbox.defaultParam(orgnum,request, "semester",Toolbox.dbadmin[orgnum%65536].currentSemester,null,40);
String cid  =   Toolbox.defaultParam(orgnum,request,"cid","",null,30);
String title =   Toolbox.defaultParam(orgnum,request,"title","","@#$+:()", 200);
String sessionname =   Toolbox.defaultParam(orgnum,request,"sessionname","", null, 30);
String absentdeduct  =  (Toolbox.defaultParam(orgnum,request,"absentdeduct","", "<,;|>/", 500)).replaceAll("<nobr>","").replaceAll("<.nobr>","");
double arrp[] = new double[30];
 
absentdeduct = caldeduct(absentdeduct, arrp);
String gradesystemstr = "" + Toolbox.gradeSystem;
String grouping = Toolbox.defaultParam(orgnum,request,"grouping","0", null,1);
if (!grouping.equals("0")) grouping = "1";
long tstmp = System.currentTimeMillis() % 10000000;

int gradesystem = Toolbox.dbadmin[orgnum%65536].gradeSystem;


int height[] = {223,95,200,210};
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head><% CachedStyle cachedstyle = new  CachedStyle(request, orgnum);%>
<%=Toolbox.getMeta(orgnum)%>
<title><%=Toolbox.emsgs(orgnum,229)%></title>

<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />
<style type="text/css">
 input.BG {background-color:<%=cachedstyle.TBGCOLOR%>; color:<%=cachedstyle.IBGCOLOR%> !important;border:0;text-align:right}
 input.BG2 {background-color:<%=cachedstyle.TBGCOLOR%>; color:<%=cachedstyle.IBGCOLOR%> !important;border:0;text-align:left}
 input.LG {background-color:<%=cachedstyle.DBGCOLOR%>; border:0;text-align:left}
 input.BG1 {text-align:right;border:0;}
</style>
<script type="text/javascript"> if (document.location.toString().indexOf("localhost") >= 0
    && typeof (handleErr) == 'undefined')
{
function handleErr(msg, url, l)
{
      var txt= "There was an error on this page.\n\n"
       + "Error: " + msg + "\n"
       + "URL:   " + url + "\n"
       + "Line:  " + l + "\n\n"
       + "Click OK to continue.\n\n";
      myprompt(txt);
      window.onerror = handleErr;
      return true;
}
window.onerror = handleErr;
}

<%= Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle)%>, securitytoken="<%=Toolbox.gentoken("aggregate3.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script><script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script><script type=text/javascript  src=cookie.js></script>
<script type="text/javascript"  > document.write(unifontstyle(<%=cachedstyle.fontsize%>)); </script>
</head>
<body  style="background-color:<%=cachedstyle.DBGCOLOR %>;margin:5px 5px 0px 5px" >


<%
//user.changedb(null);
user.changedb(user.id);
JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
if (!adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
    return;
}
if (request.getParameter("updateded") != null)
{
    String sql0 = "UPDATE Session SET absentdeduct='" + absentdeduct + "' WHERE courseid='" + cid + "' AND name='" + sessionname + "' AND semester='" + semester + "' AND  instructor='" + user.id +"'";
    int nn0 = adapter.executeUpdate(sql0); 
     
}
int nn;
cid = cid.trim();
int maxlen = 0;
long lu = System.currentTimeMillis()/1000;
String course1 = cid.replaceAll("'", "''");



String absentquery = "SELECT  sid,count(*)  FROM Absence WHERE justified=0 AND  courseid='"+cid.replaceAll("'","''")+ "' AND semester=" + semester.replaceAll("'","''") +" GROUP BY sid ORDER BY sid";  
boolean bb1 = adapter.executeQuery2(absentquery,true);
HashMap<String,String> sid2ded = new HashMap(25);
 
for (int i=0; bb1 && adapter.getValueAt(i,0)!=null; i++)
{  
   String sid =  adapter.getValueAt(i,0); 
   String abtimes = adapter.getValueAt(i,1); 
   double deductpoint = ded(Integer.parseInt(abtimes),arrp);
   sid2ded.put(sid,abtimes + "_" + twoplace(deductpoint));
}



int  i=0;
String submstr = "SELECT Registration.sid, AppUser.lastname, AppUser.firstname, Registration.status, Registration.sessionname,AppUser.middlename from Registration, AppUser where AppUser.id = Registration.sid and courseid ='"+course1+"' and Registration.semester='" + semester.replaceAll("'", "''") + "' AND sessionname='" + sessionname +"' order by 1";
int numreg = 0;
boolean bn = adapter.executeQuery2(submstr,false);
//out.println("<!-- num regis=" + numreg + ", sql=" + submstr   +"-->");
java.util.ArrayList<String> sids = new java.util.ArrayList();
java.util.ArrayList<String> lns = new java.util.ArrayList();
java.util.ArrayList<String> fns = new java.util.ArrayList();
java.util.ArrayList<String> sts = new java.util.ArrayList();
java.util.ArrayList<String> snm = new java.util.ArrayList();
java.util.ArrayList<String> mns = new java.util.ArrayList();

for (i = 0; adapter.getValueAt(i, 0)!=null; i++)
{
 numreg++;  
 sids.add(nonnull(adapter.getValueAt(i, 0)));
 lns.add( nonnull(adapter.getValueAt(i, 1)));
 fns.add( nonnull(adapter.getValueAt(i, 2)));
 sts.add( nonnull(adapter.getValueAt(i, 3)));
 mns.add( nonnull(adapter.getValueAt(i, 5)));
 snm.add( nonnull(adapter.getValueAt(i, 4)));
 sts.set(i, status(allstatus, sts.get(i)));
 if (snm.get(i) == null || snm.get(i).equals("NULL") || snm.get(i).equals(" ") ||snm.get(i).equals(""))
 snm.set(i,"?");
}

String sql = "select Submission.sid, Submission.grade, Submission.assignname, AppUser.lastname, AppUser.firstname, Assignment.scale, Assignment.weight from Submission, AppUser, Assignment, Registration where Registration.sid=AppUser.id AND Registration.courseid=Assignment.course AND Registration.sessionname='" 
+ sessionname +"' AND Registration.semester=Assignment.semester AND Assignment.name=Submission.assignname and Assignment.course=Submission.course and AppUser.id=Submission.sid "
+ " and Submission.semester=Assignment.semester AND Assignment.semester='" 
+ semester +"' AND (Assignment.sessionname='" 
+ sessionname + "' OR Assignment.sessionname LIKE '" 
+ sessionname +",%' OR Assignment.sessionname LIKE '%," 
+ sessionname +",%' OR Assignment.sessionname LIKE '%," 
+ sessionname +"') and Submission.course ='" 
+ course1 +"' and Submission.grade > -1  order by Submission.sid, Submission.assignname";
if (grouping.equals("1"))
sql = "select  Submission.sid, Submission.grade,Submission.assignname, AppUser.lastname, AppUser.firstname, Assignment.scale, Assgroup.weight,Assgroup.name,Assgroup.droptop,Assgroup.dropbottom,Assgroup.length, Submission.grade/Assignment.scale as ra from Submission, AppUser, Assignment,Assgroup,Registration where Assignment.scale>0 AND Registration.sid=AppUser.id AND Registration.courseid=Assignment.course AND Registration.sessionname='" 
+ sessionname +"' AND Registration.semester=Assignment.semester AND Assgroup.course=Assignment.course  AND Assgroup.semester=Assignment.semester  AND Assignment.assgroup=Assgroup.name AND Assignment.name=Submission.assignname AND Assgroup.sessionname='" 
+ sessionname +"' and AppUser.id=Submission.sid and Submission.course=Assignment.course  and Submission.semester=Assignment.semester AND Assignment.semester='" 
+ semester +"' AND (Assignment.sessionname='" 
+ sessionname + "' OR Assignment.sessionname LIKE '" 
+ sessionname +",%' OR Assignment.sessionname LIKE '%," 
+ sessionname +",%' OR Assignment.sessionname LIKE '%," 
+ sessionname +"')  and Assignment.course='" 
+ course1+ "'  and Submission.grade > -1  order by 1, 8, 12";//Submission.sid, Assignment.assgroup, Submission.grade/Assignment.scale";
//out.println("<!-- sql=" + sql +"-->");

int num = 0;
boolean b = adapter.executeQuery2(sql,false);
 

if (maxlen < 25) maxlen = 25;

String old = "", sid, score, assignname, lname, fname;
int numstudents = 0;

int j,   l, ll=0;
double g, wei, total = 0, tp = 0;
String weistr, scastr, gstr;
StringBuffer detail = new StringBuffer(700), subdetail = new StringBuffer(100);
append(detail, " ", maxlen, true);
append(detail, Toolbox.emsgs(orgnum,225), 11,  false);
append(detail, "00.0%", 9, false);
append(detail, "0.00", 10, false);
String tail0 = "\\n"+detail.toString();
detail.setLength(0);
String style=  Toolbox.butstyle(cachedstyle.fontsize).replaceFirst("background:[^\\)]*\\);","");
%>
<script type="text/javascript"  >
var msg1600 = "<%= Toolbox.emsgs(orgnum,1600)%>";  
var msg1601 = "<%= Toolbox.emsgs(orgnum,1601)%>";
var cid = "<%=cid%>";
var title = "<%=title%>";
var tstmp = <%=tstmp%>;
var userid = "<%=user.id%>";
var grouping = "<%=grouping%>";
var font_size = <%=cachedstyle.fontsize%>;
var encoding = "<%=Toolbox.encodings[orgnum>>16] %>";
var langcode = "<%= Toolbox.langs[orgnum>>16]%>";
var sessionname = "<%=sessionname%>";
var theurl='<%=Toolbox1.geturl(request)%>', needtranslator=false,font_size=17,isRegistered=true,theight=500;
var viewonly = false;
var semester = "<%=semester%>"; 
var absentdeduct = "<%=absentdeduct%>";
var timeformat = '<%=cachedstyle.timeformat%>';
var haswebfolder=<%=user.websitename != null && !user.websitename.equals("")||user.webFileFolder != null && !user.webFileFolder.equals("") %>;
var iid = '<%=user.id%>';
var str = "aggregate3.jsp?cid=" + encodeURIComponent(cid) +
"&title=" + encodeURIComponent(title) +
"&grouping=" + grouping + 
"&semester=" + encodeURIComponent(semester) + 
"&sessionname=" + encodeURIComponent(sessionname) + "&absentdeduct="  + encodeURIComponent(absentdeduct);
var thispage = str;
semester = semester.replace(/'/g, "''");
var coursecid = '<%=cid%>';
var selectReport = '';// " Generic.handle(selid) ";
var instructorName = "<%=Toolbox.makeFullName(user.lastname,"", user.firstname)%>";
var tim = <%= (new java.util.Date()).getTime()/1000 %>;
var lastupdate = <%=lu%>;
var popwin, popstr, areastr, areaname;
var defaultRecord =new Array(8),labels = new Array(8);
labels[0] = '<%=Toolbox.emsgs(orgnum,232)%>';
for( var jj = 25; jj < 32; jj++)
 labels[jj-24] =  textmsg[jj];
labels[1] =textmsg[25];
labels[2] =textmsg[26];
labels[3] =textmsg[27];
labels[4] =textmsg[28];
labels[5] =textmsg[29];
labels[6] =textmsg[30];
labels[7] =textmsg[31];
var H = "sid,Session,LastName,FirstName,Score,Grade,Detail,Details";
 
var pubkeys="0020T11,0027H5,0033T13,0041T12,006T5,008T6,10152433354H,0066L5";
function round(d)
{
 var x = Math.floor(d);
 if (d-x >=0.5) return x+1;
 return x;
}
<%

boolean debug = false;
String allstr = "";
boolean valid = true;
String head = null;
String groupname="", topstr, botstr;
int G = 0;
String assignnames[] = new String[60];
double scores[] = new double[60];
double weights[] = new double[60];
double scales[] = new double[60];
double normalscores[] =  new double[60];

int droptop[] = new int[60];
int dropbottom[] = new int[60];
int size[] = new int[60];

out.println("var mat =[");
String err = "",newsid=null, newgroup=null;
 
if (grouping.equals("1")) 
{
    for (i = 0; valid ; i++) 
    {
// sid, grade, assignname,  lastname,  firstname,  scale, weight, 
// name, droptop, dropbottom, length,  grade/scale as ra
        num++;
        if (newsid!=null) 
            sid = newsid;
        else
            sid = adapter.getValueAt(i, 0);
        if (sid == null) break;
        sid = sid.trim();
        if (newgroup != null)
            groupname = newgroup;
        else
            groupname = nonnull(adapter.getValueAt(i, 7));
        lname = adapter.getValueAt(i, 3);
        fname = adapter.getValueAt(i, 4);
        int step = 0;
        try {
            scores[G] =   Double.parseDouble(adapter.getValueAt(i, 1)); 
            step = 1;
            assignnames[G] = adapter.getValueAt(i, 2).trim();
            step = 2;
            weights[G] =   Double.parseDouble(adapter.getValueAt(i, 6)); 
            step = 3;
            scales[G] =   Double.parseDouble(adapter.getValueAt(i, 5)); 
            step = 4;
            droptop[G] =   Integer.parseInt(adapter.getValueAt(i, 8)); 
            step = 6;
            dropbottom[G] =  Integer.parseInt(adapter.getValueAt(i, 9)); 
            step = 7;
            size[G] =  Integer.parseInt(adapter.getValueAt(i, 10)); 
            step = 8;
            normalscores[G] =   Double.parseDouble(adapter.getValueAt(i, 11)); 
            if (scales[G] == 0) 
            {
                valid = false;
                err += ("<font color=red>" + Toolbox.emsgs(orgnum, 230) + " " + groupname + "</font>");
                scores[G] = 0;
                
            } 
            else 
            {
                out.println("//" + assignnames[G] + " " + scores[G] + " " + weights[G] + " " + scales[G] + " " + groupname + " " + droptop[G] + " " + dropbottom[G] + " " + size[G]);
            }

            G++;
        } catch (Exception e) {
            valid = false;
            scores[G] = 0; 
            err += ("<font color=red>" + Toolbox.emsgs(orgnum, 221) + "  " + groupname + ":  " + step + "</font>" + e.toString());
           // break;
        }
        newsid = adapter.getValueAt(i+1,0);
        newgroup = nonnull(adapter.getValueAt(i+1,7));
        if (newsid == null || newgroup==null || !groupname.equals(newgroup) || !sid.equalsIgnoreCase(newsid)) 
        {
            if (G == 1 && (weights[0] >  100|| weights[0] < 0 )) 
            {
                append(detail, assignnames[0], maxlen, true);
                append(detail, "" + scores[0] + "/", 6, false);
                append(detail, "" + scales[0], 5, true);
                append(detail, Toolbox.emsgs(orgnum, 1558), 9, false);
                g = scores[0];
                gstr = twoplace(g);
                append(detail, gstr + "\\n", 10, false);
                total += g;
            } 
            else if (G>=1)
            {
                int M = size[0] - droptop[0] - dropbottom[0];
                double xx = weights[0];
                for (int kk = 0; kk < G; kk++) 
                {
                    append(detail, assignnames[kk], maxlen, true);
                    append(detail, "" + scores[kk] + "/", 6, false);
                    append(detail, "" + scales[kk], 5, true);
                    if (M <= 0) 
                    {
                        weights[kk] = 0;
                    } 
                    else if (G - dropbottom[0] >= M) 
                    {
                        weights[kk] = ((kk >= dropbottom[0] && kk < M + dropbottom[0]) ? 1 : 0) * xx / M;
                    } 
                    else 
                    {
                        weights[kk] = ((kk >= G - M) ? 1 : 0) * xx / M;
                    }
                    if (weights[kk] > 0) {
                        weistr = "" + twoplace(weights[kk]) + '%';
                    } else {
                        weistr = Toolbox.emsgs(orgnum, 222);
                    }
                    append(detail, weistr, 9, false);
                    tp += weights[kk];
                    wei = weights[kk] / scales[kk];
                    g = scores[kk] * wei;
                    gstr = twoplace(g);
                    append(detail, gstr + "\\n", 10, false);
                    total += g;
                }
            }
            G = 0;
        }

        if (newsid== null || !sid.equalsIgnoreCase(newsid))  
        {
            while (ll < numreg && sids.get(ll) != null && sids.get(ll).compareToIgnoreCase(sid) < 0) 
            {
                head = pad(sids.get(ll) + "     " + Toolbox.makeFullName(lns.get(ll), mns.get(ll), fns.get(ll)), maxlen + 28) + "\\n";
                out.print(comb(sids.get(ll).trim(), snm.get(ll), lns.get(ll), fns.get(ll), "0.00", sts.get(ll), (head + tail0), ""));
                allstr += "@0.00";
                ll++;
                numstudents++;
            }
            head = sid + "  " + Toolbox.makeFullName(lname, "", fname) + "\\n";
            float dedf = 0;
            String ded = sid2ded.get(sid);
            
            if (ded!=null) 
            {
                dedf = Float.parseFloat(ded.replaceFirst("[^_]+_", ""));
            }
            else
               ded = "0_0.00";
         
            
            append(detail, "", maxlen, true);
            detail.append("      " + Toolbox.emsgs(orgnum, 225));
            String tpstr = twoplace(tp);
            append(detail, tpstr, 8, false);
            detail.append("%");
            gstr = twoplace(total);
            String gstr1 = twoplace(total- dedf);
            allstr += "@" + gstr1;
            append(detail, gstr +"\\n" , 8, false);
            append(detail, Toolbox.emsgs(orgnum, 1600), maxlen, true);
            append(detail, ded.replaceFirst("_.*", ""), 11, true);
            append(detail, Toolbox.emsgs(orgnum, 1601), 9, false);
            append(detail, "-" + ded.replaceFirst("[^_]+_", "") +"\\n" , 10, false);
            append(detail, "", maxlen+10, false);
            append(detail, gstr1, 10, false);
            int p = 0;
            for (; p < numreg && !sid.equals(sids.get(p)); p++);
            String aa = null;
            if (p < numreg) {
                aa = snm.get(p);
            }
            String bb = null;
            if (ll < numreg && sids.get(ll).equals(sid)) {
                bb = sts.get(ll);
                ll++;
            }
            if (aa != null && bb != null) {
                out.print(comb(sid.trim(), aa, lname, fname, gstr1, bb, (head + "\\n" + detail.toString()), ""));
                numstudents++;
            }
            total = 0;
            tp = 0;
            detail.setLength(0);
        }
        if (newsid==null) break; 
    }
    
} 
else 
{
    for (i = 0; ; i++)  
    {
        if (newsid!=null) 
            sid = newsid;
        else
            sid = adapter.getValueAt(i, 0);
        if (sid==null) break;
        sid = sid.trim(); 
        num++;
        score = adapter.getValueAt(i, 1);
        assignname = adapter.getValueAt(i, 2).trim();
        lname = nonnull(adapter.getValueAt(i, 3));
        fname = nonnull(adapter.getValueAt(i, 4));
        scastr = adapter.getValueAt(i, 5);
        weistr = adapter.getValueAt(i, 6);
 
        if (weistr == null || scastr == null) 
        {
           // valid = false;
            err += ("<font color=red>" + Toolbox.emsgs(orgnum, 227) + assignname + "</font>");
           // break;
        } 
        else 
        {
            append(detail, assignname, maxlen, true);
            append(detail, score + "/", 6, false);
            append(detail, scastr, 5, true);

            double percent = 0, scale=1; 
            g = 0;
            try {
                percent = Double.parseDouble(weistr);
                scale = Double.parseDouble(scastr);
                g = Double.parseDouble(score);
            } 
            catch (Exception e) {}
            if (percent <= 100 && percent >= 0) 
            {
                append(detail, weistr + '%', 9, false);
                tp += percent;
                wei = percent/scale;
                g *= wei;
            } 
            else 
            {
                append(detail, Toolbox.emsgs(orgnum, 1558), 9, false);
                
            }

            gstr = twoplace(g);
            append(detail, gstr + "\\n", 10, false);
            total += g;
        }

        newsid = adapter.getValueAt(i+1, 0);
        if (newsid!=null) newsid = newsid.trim();
        if ( newsid ==null  || !sid.equalsIgnoreCase(newsid)) 
        {
            while (ll < numreg && sids.get(ll) != null && sids.get(ll).compareToIgnoreCase(sid) < 0) {
                head = pad(sids.get(ll) + "     " + lns.get(ll) + " " + Toolbox.makeFullName(lns.get(ll), mns.get(ll), fns.get(ll)), maxlen + 28) + "\\n";
                out.print(comb(sids.get(ll).trim(), snm.get(ll), lns.get(ll), fns.get(ll), "0.00", sts.get(ll), (head + tail0), ""));
                numstudents++;
                allstr += "@0.00";
                ll++;
            }

            head = sid + "     " + Toolbox.makeFullName(lname, "", fname);
            head = pad(head, maxlen + 28) + "\\n";
            float dedf = 0.0f; 
            String ded = sid2ded.get(sid);
            if (ded!=null) 
            dedf = Float.parseFloat(ded.replaceFirst("[^_]+_", ""));
            else
               ded = "0_0.00";
            
            append(detail, "", maxlen, true);
            detail.append("      " + Toolbox.emsgs(orgnum, 225));

            String tpstr = twoplace(tp);

            append(detail, tpstr, 8, false);
            detail.append("%");
            gstr = twoplace(total);
            String gstr1 = twoplace(total- dedf);
            allstr += "@" + gstr;
            append(detail, gstr  + "\\n" , 8, false);
            append(detail, Toolbox.emsgs(orgnum, 1600), maxlen, true);
            append(detail, ded.replaceFirst("_.*", ""), 11, true);
            append(detail, Toolbox.emsgs(orgnum, 1601), 9, false);
            append(detail, "-" +  ded.replaceFirst("[^_]+_", "") + "\\n", 10, false);
            append(detail, "", maxlen+10, false);
            append(detail, gstr1, 10, false);
            int p = 0;
            for (; p < numreg && !sid.equals(sids.get(p)); p++);
            String aa = null;
            if (p < numreg) {
                aa = snm.get(p);
            }
            String bb = null;
            if (ll < numreg && sids.get(ll).equals(sid)) {
                bb = sts.get(ll);
                ll++;
            }
            if (aa != null && bb != null) {
                
                out.print(comb(sid.trim(), aa, lname, fname, gstr1, bb, (head + "\\n" + detail.toString()), ""));
                numstudents++;
            }
            total = 0;
            tp = 0;
            detail.setLength(0);
        }
        if (newsid==null) break; 
    }
}

while (ll < numreg) 
{
    head = pad(sids.get(ll) + "     " + lns.get(ll) + " " + Toolbox.makeFullName(lns.get(ll), mns.get(ll), fns.get(ll)), maxlen + 28) + "\\n";
    allstr += "@0.00";
    out.print(comb(sids.get(ll).trim(), snm.get(ll), lns.get(ll), fns.get(ll), "0.00", sts.get(ll), (head + tail0), ">>")); 
    numstudents++;
    ll++;
}

adapter.close();
if (err.equals("") == false) {
    out.println("</script>" + err + "</body></html>");
    return;
}
out.print("new Array(8)]; var numstudents=" + numstudents + ";  function getNumRows(){return " + numstudents + ";}\n");
out.print("var maxlen =" + maxlen + ";\n");
if (valid == false) {
    return;
}

detail.setLength(0);
append(detail, " " + Toolbox.emsgs(orgnum, 223), maxlen, true);
append(detail, Toolbox.emsgs(orgnum, 224), 11, false);
append(detail, Toolbox.emsgs(orgnum, 254), 9, false);
append(detail, Toolbox.emsgs(orgnum, 320), 9, false);
String headingline = detail.toString();
String subdb = user.id;
if (user.mydb == false) {
    subdb = "";
}
String updatestr = MyRSA.encryptString0("@5@,@6@,|0|,'" + cid + "','" + semester + "'", orgnum >> 16);
out.print("var MS = '0,1,0,0,0,"  + numstudents + ","  + numstudents + ",8';");
%>
    
var ZQ = ["SaveEvaluation","<%=title%>","<%=updatestr%>","","","","<%=subdb%>","0","","","<%=Toolbox.locales[orgnum>>16].charsize%>"];
ZQ[5] = textmsg[33];
var mm = 0;
function openitme(Z)
{
 var url = 'studentpage.jsp?mode=instructor';
 for (var j=0; j < 5; j++)
 {
 var vv= retrv(Z,j);
 if (vv==null) vv='';
 vv = encodeURIComponent(vv);
  
 url +='&';
 url +=fields[j] +'='+vv;
 }

 url +='&iid=' + iid;
 postopen(url,   '_blank');
}
var gradesystem = <%=gradesystem%>;
var stt = str;
function makebut(stra, strb, cl)
{
 return "<tr><td valign=top> <input  type=button  style=width:<%=Math.round(4.5*cachedstyle.fontsize)%>px class=" + cl +"   value=\"" + stra +"\"></td><td>" + strb.replace('"', '\\"') +"</td></tr>";
}

var running = 8;
var positionstr='';
var ffsize = ["","","","","","0","",""];
var STNEVE = ["","","","","","",""];
 
var  src  =  ["","",
"DataTable?rdap=gradethresh&numrows=6&system=2&subdb=" + userid,
"DataTable?rdap=gradethresh&system=3&numrows=14&subdb=" + userid,
"DataTable?rdap=gradethresh&system=4&numrows=6&subdb=" + userid];
for (var  kk = 2; kk < 5; kk++)
 src[kk] += "&semester=" + encodeURIComponent(semester) + "&course=" + encodeURIComponent(cid)  + "&session=" + encodeURIComponent(sessionname) +"&cellonblur=52&onbegin=53";
   
</script>
<script type="text/javascript"  src=stab.js></script>
<script type="text/javascript"  src=decrypt.js></script>
<table  cellpadding=3 cellspacing=1 border=0 align="center">
<%=Toolbox.title( title ,1)%>
<tr><td     wdith=600>
<form rel=opener name=form1 style="margin:5px 0px 0px 0px"  >
<script type="text/javascript" >document.write(round1('100%').replace(/">$/,'background-color:#cccccc">'));</script>
<table align=center width="100%" cellpadding=4 cellspacing=1 class=outset3 >
 <TR style="background:<%=Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle)%>">
 <TD align=left ><input type=hidden name=check1 value=''><div ><b><NOBR><%=Toolbox.emsgs(orgnum,231)%></NOBR></b></div> </TD>
 <TD align=left><div onclick=sort(0) onMouseOver="showmyhint(0)"   onMouseOut="hidemyhint()"><b><NOBR><%=Toolbox.emsgs(orgnum,232)%></NOBR></b></div> </TD>

 <TD align=left><div onclick=sort(2)  onMouseOver="showmyhint(2)"   onMouseOut="hidemyhint()"><b><NOBR><%=Toolbox.emsgs(orgnum,234)%></NOBR></b></div> </TD>

 <TD align=left><div onclick=sort(3)  onMouseOver="showmyhint(3)"   onMouseOut="hidemyhint()"><b><NOBR><%=Toolbox.emsgs(orgnum,235).equals("nolabel")?"":Toolbox.emsgs(orgnum,235)%></NOBR></b></div> </TD>

 <TD align=right><div onclick=sort(4)  onMouseOver="showmyhint(4)"   onMouseOut="hidemyhint()"><b><NOBR><%=Toolbox.emsgs(orgnum,236)%></NOBR></b></div> </TD>
 <TD align=right><div onclick=sort(5)  onMouseOver="showmyhint(5)"   onMouseOut="hidemyhint()"><b><NOBR><%=Toolbox.emsgs(orgnum,237)%></NOBR></b></div> </TD>
 <TD align=center ><div ><b><NOBR><%=Toolbox.emsgs(orgnum,121)%></NOBR></b></div> </TD>
</TR>

<script type="text/javascript" >
for (var Z = 0; Z < <%=numstudents%>; Z++)
{
mat[Z][4] =  ''+Math.ceil(parseFloat(mat[Z][4]));
document.writeln('<TR  valign=center align=right>\n <TD align=right bgcolor=<%=cachedstyle.TBGCOLOR%>><input type=hidden name=checkbox><font color=<%=cachedstyle.IBGCOLOR%>>'
+ (Z+1) + '</TD>\n <TD  bgcolor=<%=cachedstyle.TBGCOLOR%> align=left><input  value="' + mat[Z][0] + '"  style=color:blue;cursor:pointer;border:0 size=11 NAME=' + Z + '_0 readonly onClick="openitme(' + Z + ')"></TD>'+
 
'<input type=hidden name=' + Z + '_1></td>' +
'<TD  bgcolor=<%=cachedstyle.TBGCOLOR%> ><INPUT class=BG2 value="' + mat[Z][2] + '" readonly size=12 NAME=' + Z + '_2 onkeypress="return false">'+

'</td><TD  bgcolor=<%=cachedstyle.TBGCOLOR%> ><INPUT class=BG2  value="' + mat[Z][3] + '"  readonly size=12 NAME=' + Z + '_3 onkeypress="return false"></td>'+



'<TD  bgcolor=<%=cachedstyle.TBGCOLOR%> ><INPUT class=BG  value="' + mat[Z][4] + '"   readonly size=5  NAME=' + Z + '_4 onkeypress="return false"></TD>\n'+
'<TD  bgcolor=<%=cachedstyle.TBGCOLOR%> ><INPUT class=BG  value="' + mat[Z][5] + '"   readonly size=5  NAME=' + Z + '_5 onkeypress="return false"></TD>\n'+
'<TD align=center  bgcolor=<%=cachedstyle.TBGCOLOR%> ><input type=hidden    NAME=' + Z + '_6><input type=button class=flat value=">>" NAME=' + Z + '_7 onClick="showstr(' + Z + ')" ></TD>'+
'\n</TR>\n');
}



var help0 = makebut("<%=Toolbox.emsgs(orgnum,246)%>","<%=Toolbox.emsgs(orgnum,247)%>",'GreenButton')
+ makebut("<%=Toolbox.emsgs(orgnum,260)%>", "<%=Toolbox.emsgs(orgnum,249)%>",'GreenButton')
+ makebut("<%=Toolbox.emsgs(orgnum,121)%>", "<%=Toolbox.emsgs(orgnum,248)%>",'GreenButton')

+ makebut("<%=Toolbox.emsgs(orgnum,36)%>", "<%=Toolbox.emsgs(orgnum,250)%>",'OrangeButton')
+ makebut("<%=Toolbox.emsgs(orgnum,30)%>", "<%=Toolbox.emsgs(orgnum,425)%>",  'RedButton')
+ makebut("<%=Toolbox.emsgs(orgnum,261)%>", "<%=Toolbox.emsgs(orgnum,251)%>",'GreenButton');
var headerline = '<%=headingline%>';
var msg317="<%=Toolbox.emsgs(orgnum,317)%>";

</script>


<tr  bgcolor=#FFFFC0>

<td> <input type=hidden name=checkbox2>
 <input type=hidden name=hidden1><input type=hidden name=hidden2>
 <input type=hidden name=hidden3><input type=hidden name=hidden4>
 <input type=hidden name=hidden5>
<b><%=Toolbox.emsgs(orgnum,225)%></b></td>
<td><font color=<%=cachedstyle.IBGCOLOR%> > <%=numstudents%></font> </td>
<td colspan=2 align=right> <b><%=Toolbox.emsgs(orgnum,238)%></b> </td>
<td align=right><input class=BG style=background-color:#FFFFC0 name=As size=5  readonly> </td>
<td align=right ><input class=BG   style=background-color:#FFFFC0 name=Avg size=4  readonly> </td>
<td align=center><input type=button class=flat  style=background-color:#FFFFC0  NAME=tdetail   onclick="showDetail()" value=">>" >
 <input type=hidden name=total></td>
</tr>
</form>
</table><script type="text/javascript" >document.write(round2);</script>
</td>

</tr>

<tr width=100%><td width=100%><img name=testimg src=image/blank.gif width=100% height=1></td></tr>


<tr><td valign=top align=center>
<% if (gradesystem != 1) 
{%>
<%=Toolbox.emsgs(orgnum,239)%>
<%} else {%>
<%=Toolbox.emsgs(orgnum,240)%>
<%}%>
</td></tr>
<tr><td valign=top  align=center id="subtd">
<% if (gradesystem > 1) {%>
<iframe frameborder=0 name=subframe  width=100% height="<%=height[gradesystem]%>" ></iframe>
<% } %>
</td></tr>
</table>

<form rel=opener name=thisform method=post style="margin:5px 0px 0px 0px"  target=savewindow  >
<table align=center>
<tr><td valign=top align=center>
<input type=HIDDEN   name=subdb    value=<%=subdb%>>
<input type=HIDDEN   name=rdap     value=SaveEvaluation>
<input type=hidden   name=semester value="<%=semester%>">
<input type=hidden   name=course   value="<%=cid%>">
<input type=hidden   name=id   value="<%=subdb%>">
<input type=hidden   name=wcds   value="<%=subdb%>">
<input  name="alertbtn" <%=style%>  class=GreenButton type=button value="<%=Toolbox.emsgs(orgnum,246)%>"   onclick="myalert()"     onMouseOver="showmyhint(9)"   onMouseOut="hidemyhint()"      tabindex=6
><input name="reportbtn"  <%=style%>   class=GreenButton type=button value="<%=Toolbox.emsgs(orgnum,260)%>"   onclick="report(0)"    onMouseOver="showmyhint(10)"   onMouseOut="hidemyhint()"     tabindex=7
><input name="detailbtn"  <%=style%>    class=GreenButton type=button value="<%=Toolbox.emsgs(orgnum,121)%>"   onclick="showDetail()"   onMouseOver="showmyhint(11)"   onMouseOut="hidemyhint()"   tabindex=6
><input  name="savebtn"  <%=style%>    class=OrangeButton  type=button value="<%=Toolbox.emsgs(orgnum,36)%>"    onclick="saveGrades(1);disablefuncbut(true)"   onMouseOver="showmyhint(12)"   onMouseOut="hidemyhint()"  tabindex=8
<%if (gradesystem>1) {%><input name="delbtn"   <%=style%>  
 class=RedButton type=button value="<%=Toolbox.emsgs(orgnum,30)%>"    onclick="saveGrades(3)"   onMouseOver="showmyhint(13)"   onMouseOut="hidemyhint()"  tabindex=8  <%}%>
><input  name="hisbtn"  <%=style%>    class=GreenButton  type=button value="<%=Toolbox.emsgs(orgnum,261)%>"   onclick="historyback()"   onMouseOver="showmyhint(14)"   onMouseOut="hidemyhint()"  tabindex=9
><input  name="printbtn"  <%=style%>    class=GreenButton  type=button value="Print"   onclick="printing()"   onMouseOver="showmyhint(15)"   onMouseOut="hidemyhint()"  tabindex=10
><input  name="helpbtn"  <%=style%>    class=GreenButton type=button value=<%=Toolbox.emsgs(orgnum,32)%>      onclick="showhelp()"       tabindex=11>

</td></tr></table>
</form>

<script type="text/javascript"  src=multipleselect.js></script>

<script type="text/javascript"  src=timeformat.js></script>

<script type="text/javascript"  src=helpformat.js></script>

 
<script type="text/javascript"  src=commonused.js></script>

<script type="text/javascript"  src=maketabledu.js></script>
<script type="text/javascript"  src=hints.js></script>
<% if (gradesystem>1){%>
<script type="text/javascript" > postopen( src[<%=gradesystem%>],"subframe");</script>
<%}%>
<script type="text/javascript"  src=aggregatefunc.js></script>
<script type="text/javascript" >
 datapresentformat  = 'DataTable';
 document.thisform.printbtn.value = textmsg[409];
 for (var ii=0; ii < 7; ii++)
 hints[ii] +="<br>" + textmsg[74];
 hints[9]  = "<%=Toolbox.emsgs(orgnum,247)%>";
 hints[10] = "<%=Toolbox.emsgs(orgnum,249)%>";
 hints[11] = "<%=Toolbox.emsgs(orgnum,248)%>";
 hints[12] = "<%=Toolbox.emsgs(orgnum,250)%>";
 hints[13] = "<%=Toolbox.emsgs(orgnum,425)%>";
 hints[14] = "<%=Toolbox.emsgs(orgnum,251)%>";
 <%=Toolbox.msgjspout((orgnum%65536)+user.id,true)%>
 
systemname = function()
{
     
    if (parent!=window && parent.opener!=null && typeof(parent.opener.systemname)!='undefined' && parent.opener.systemname!=null)
    {   
         ans = parent.opener.systemname();
         if  (ans!=null) return ans;
    }
    return null;
}
 
systemnamestr = systemname();
 
</script>
<script type="text/javascript"  src=curve.js></script>
<div id="copyright" style="text-align:center;color:#4d5ddd;font-size:12px"> 
<%= Toolbox.copyright[orgnum>>16]%> 
</div>
<input type="button" value="test" onclick="fill()">
</body>
</html>



