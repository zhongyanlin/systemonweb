<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.zip.*,java.io.*" %>
<%
    int orgnum = Toolbox.setcharset(request,response);
    if (orgnum == -1) return;
     CachedStyle cachedstyle = new CachedStyle(request, orgnum);
%>
<%!

Object forlock = new Object();

String unitb(long x)
{
      long y = x/1024/1024;
      String ans = "";
      if (y > 0) 
      {
          ans = ""  + y  +  "MB";
      }
      else
      { 
          long z = x/1024;
          if (z > 0) 
          {
              ans = "" + z + "KB";
          }
          else
          {
              ans =  "" + x + "Bytes";
          } 
      } 
      return ans;                              
}
  
  
  public static void sort(String ra[], int t[],int z, int n) 
  {
        if (n < 2) return;
	int l, j, ir, i;
	String rra;
        int s;

	l = (n >> 1) + 1;
	ir = n;
	for (;;) 
        {
	    if (l > 1) 
            {
                --l;
		rra = ra[l-1+z];
                  s = t[l-1+z];
	    } 
            else 
            {
		rra = ra[ir-1+z]; s = t[ir-1+z];
		ra[ir-1+z] = ra[z]; t[ir-1+z] = t[z];
		if (--ir == 1) 
                {
		    ra[z] = rra; t[z] = s;
		    return;
		}
	    }
	    i = l;
	    j = l << 1;
	    while (j <= ir) 
           {
		if (j < ir && ra[j-1+z].compareTo(ra[j+z]) <0    ) { ++j; }
		if (rra.compareTo(ra[j-1+z]) < 0)
                {
		    ra[i-1+z] = ra[j-1+z]; t[i-1+z] = t[j-1+z];
		    j += (i = j);
		} 
                else 
                {
		    j = ir + 1;
		}
	    }
	    ra[i-1+z] = rra; t[i-1+z] = s;
	}
    }
public static void sort(long ra[], int t[],int z, int n) 
  {
        if (n < 2) return;
	int l, j, ir, i;
	long rra;
        int s;

	l = (n >> 1) + 1;
	ir = n;
	for (;;) 
        {
	    if (l > 1) 
            {
                --l;
		rra = ra[l-1+z];
                  s = t[l-1+z];
	    } 
            else 
            {
		rra = ra[ir-1+z]; s = t[ir-1+z];
		ra[ir-1+z] = ra[z]; t[ir-1+z] = t[z];
		if (--ir == 1) 
                {
		    ra[z] = rra; t[z] = s;
		    return;
		}
	    }
	    i = l;
	    j = l << 1;
	    while (j <= ir) 
           {
		if (j < ir && ra[j-1+z] < ra[j+z]) { ++j; }
		if (rra < ra[j-1+z]) 
                {
		    ra[i-1+z] = ra[j-1+z]; t[i-1+z] = t[j-1+z];
		    j += (i = j);
		} 
                else 
                {
		    j = ir + 1;
		}
	    }
	    ra[i-1+z] = rra; t[i-1+z] = s;
	}
    }

   void reorder(int n, long s[], int t[])
   {
       long ss[] = new long[n]; int i;
       for (  i = 0; i <n; i++)
          ss[i] = s[t[i]];
       for (  i = 0; i <n; i++)
           s[i] = ss[i];
   }
    void reorder(int n, String s[], int t[])
   {
       String  ss[] = new String[n]; int i;
       for (  i = 0; i <n; i++)
          ss[i] = s[t[i]];
       for (  i = 0; i <n; i++)
           s[i] = ss[i];
   }

/*
   5  b  0
   1  c  1
   2  d  2
   
   1  c   1    a[t[i]] = c[i]   
   2  d   2
   5  b   0 */
class triple{
    public int nummatch;
    public String filepath; 
    public String text;
    public triple(int i, String x, String y){nummatch = i; filepath = x; text = y;}
}

void  search(String basedir, String source, String [] words, Vector<triple>  v )
{
     String sourcef = "", fsource = "";
     if (!source.equals("")) 
     {
         sourcef = File.separator  + source;
         fsource = File.separator  + source;
     } 
      
     File ff = new File(basedir + fsource);
     if (ff.isFile())
     {
                if (source.toLowerCase().indexOf(".htm") > 0 ) 
                try 
                {
                    FileInputStream fin = new FileInputStream(new File( (basedir + fsource)));
                    InputStreamReader esr = new InputStreamReader(fin);
                    BufferedReader ebr = new BufferedReader(esr);
                    String aline;
                    int i = 0;
                    StringBuffer s = new StringBuffer();
                    int J = 0, j, k;
                    while (i < words.length && (aline = ebr.readLine())!=null) 
                    {
                        k = 0;
                        aline = aline.replaceAll("<[^>]*>", "");
                        if (aline.replaceAll(" ", "").equals("")) continue;
                        while( i < words.length &&  (j = aline.toLowerCase().indexOf(words[i],k)) >=0)
                        {
                           
                           k = j + words[i].length();
                           i++;
                        }
                        if (k > 0) 
                        {
                            J = s.length() + k;
                        }
                        s.append(aline + "\n");
                    }
                    s.setLength(J);
                    
                    while  (i > 0)
                    {
                        String w = words[i-1];
                        j = s.substring(0,J).toLowerCase().lastIndexOf(w);
                        s.insert(j + w.length(), "</b>");
                        if (j + w.length() + 4 + 40 < J)
                        {
                            s.delete(j + w.length() + 4 + 40, J);
                            s.insert(j + w.length() + 4 + 40, " ...... ");
                        }
                        s.insert(j, "<b>");
                        J = j;
                        i--;
                    }
                    if (s.length() > 0)
                    {
                        j = s.substring(0,J).lastIndexOf("\n")+1;
                        v.addElement(new triple(i, source, s.substring(j)) );
                    }
                    
                    
                    
                    
                    fin.close();
                    
                }
                catch( Exception e){ }
               
     }
         else if (ff.isDirectory())
     {
               String ls[] = ff.list();
                if (ls != null && ls.length > 0)
               for (int j =0; j < ls.length; j++)
               {
                   search(basedir, sourcef + ls[j] ,words, v);
               }
     }
}

class NoImgIndex implements  FileFilter  
{
         public boolean accept(File file)
         {
             return   !file.getName().startsWith(FolderMaintain.imgindex)
                      && !file.getName().equals("tmlpermi.txt");
         }
}

%>
<% 
StringBuffer paramv = new StringBuffer();

String searchtarget = Toolbox.defaultParam(orgnum,request, "searchtarget", null,",!@#$%^&*()-+={}[]|:;\"'.?/><", 100);
if (   searchtarget!= null )
{
paramv.append("<input type=hidden name=\"searchtarget\" value=\"" + searchtarget + "\">\n" );
searchtarget = searchtarget.replaceAll("[,|>|<]", " ");
long  t11 = System.currentTimeMillis();

String path;
String siteowner = Toolbox.defaultParam(orgnum,request, "siteowner", null,null, 30);
if (siteowner == null)
{
path = request.getHeader("referer"); 
int i1 = path.indexOf(Toolbox.dbadmin[orgnum%65536].subsitename + "/") + (Toolbox.dbadmin[orgnum%65536].subsitename.length()+1);
 
int i2 = path.indexOf("/", i1);
if (i1>8 && i2>0)
siteowner = path.substring(i1,i2);
}
else
{
    paramv.append("<input type=hidden name=\"siteowner\" value=\"" + siteowner + "\">\n" );
}
%>    
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">
<head> 
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />        
</head>  
<body  style="background-color:<%= cachedstyle.DBGCOLOR %>;margin:5px 5px 5px 5px"  >
<center>
<%=Toolbox.title("Search Results")%> 
<% if ( siteowner==null ) {%>
Search engine is only valid for subsites </body></center></html>
<%
return;
}%>
<form rel=opener method=post action="webfolder.jsp"   ><input name=siteowner type="hidden" value="<%=siteowner%>" ><input name=searchtarget value="<%=searchtarget%>" ><input type=submit name=sub value=Search></form>
     <br>
<%
    
   path = Toolbox.dbadmin[orgnum%65536].websiteFolder + File.separator +   siteowner;
   
   Vector<triple> v = new Vector<triple>();
   search(path, "", searchtarget.toLowerCase().split("[ ]+"), v);
   double dd = ( System.currentTimeMillis() - t11)/1000.0;
   out.println( v.size() + " HTML files found in about " + dd  +" seconds <div style=\"text-align:left\"> <ol>");
   for (int i=0; i < v.size(); i++)
   {
       int j = 0; int MM = 0;
       for (int k=0; k < v.size(); k++)
       {
           triple tp = (triple)(v.elementAt(k));
           if ( tp.nummatch > MM) 
           {
               j = k;
           }
       }
       triple tp =  v.elementAt(j);
       String appname = request.getRequestURI().substring(1).replaceFirst("/.*","");
       String htp = request.getRequestURL().toString().replaceFirst(appname+".*", "subsites/" + Toolbox.dbadmin[orgnum%65536].subsitename+ "/" + siteowner + "/" + tp.filepath.replace(File.separatorChar, '/'));
       
       out.println("<li> <a href=\"" + htp + "\" target=_blank>" + htp + "</a><br>" + tp.text +"</li>");
       v.elementAt(j).nummatch = 0;
       
   }
    out.println("</ol><div></center> </body>\n</html>");
    return;
}

User user = null;
if (  (user = User.authorize(orgnum, Systemroles.TOTAL,application,session,request, response, "webfolder.jsp", false)) == null|| !Toolbox.verifytoken(request)) 
    return;
 
if ( (user.webFileFolder == null ||   user.webFileFolder.equals("")) &&
      (user.websitename == null ||   user.websitename.equals("")) )
{
%>
<html lang="<%=Toolbox.langs[orgnum>>16]%>"><head>
        <%=Toolbox.getMeta(orgnum)%></head><body   style="background-color:<%= cachedstyle.DBGCOLOR %>;margin:5px 5px 5px 5px" >
<%=Toolbox.emsgs(orgnum,763)%>
<%
return;
}
long tstmp = System.currentTimeMillis()%10000000;
Encode6b encoder = new Encode6b(orgnum); 


String fullname =  Toolbox.defaultParam(orgnum,request,"fullname",null, ",-", 60);
if (fullname == null)
{
   fullname = Toolbox.makeFullName(user.lastname, "", user.firstname);
}
else
{
    paramv.append("<input type=hidden name=\"fullname\" value=\"" + fullname + "\">\n" );
}
String allcourse = Toolbox.defaultParam(orgnum,request,"allcourse", "", ",-", 2000);
paramv.append("<input type=hidden name=\"allcourse\" value=\"" + allcourse + "\">\n" );
  
String isstudent = Toolbox.defaultParam(orgnum,request,"isstudent","", null, 5);
paramv.append("<input type=hidden name=\"isstudent\" value=\"" + isstudent + "\">\n" );
String folder = Toolbox.defaultParam(orgnum,request,"folder","");
paramv.append("<input type=hidden name=\"folder\" value=\"" + folder+ "\">\n" ); 

if (folder.length() > 200) folder = folder.substring(200);

String sel = Toolbox.defaultParam(orgnum,request,"sel","","@#$%+:\\/;,-", -1);
paramv.append("<input type=hidden name=\"sel\" value=\"" + sel+ "\">\n" ); 
 

String sortField = Toolbox.defaultParam(orgnum,request, ("sortField"), null);  
sortField = Toolbox.validate(sortField, null, 20);
paramv.append("<input type=hidden name=\"sortField\" value=\"" + sortField+ "\">\n" );  
String esortField = "";
if (sortField!=null)
    esortField = Toolbox.urlencode(sortField);

String codedfolder = Toolbox.dbadmin[orgnum%65536].webFileFolder;
if (user.roles == 1) codedfolder = Toolbox.dbadmin[orgnum%65536].webFileFolder1;
codedfolder = codedfolder + File.separator + user.id + File.separator;
if ( user.webFileFolder != null && !user.webFileFolder.equals("")) 
    codedfolder = user.webFileFolder+ File.separator;
else if (user.websitename != null && !user.websitename.equals(""))
{
       codedfolder = Toolbox.dbadmin[orgnum%65536].websiteFolder + File.separator + user.websitename + File.separator + folder.replaceFirst("website/", "");
}
 

if (folder == null || folder.indexOf("..") >= 0 )
{
    folder = "";
}
folder = folder.replaceFirst("^/","").replaceFirst("/$","");
String ontitle = user.id + "/" +  folder;

if (!folder.equals(""))
   codedfolder = codedfolder + folder.replace('/', File.separator.charAt(0))   + File.separator;
 

boolean canpublish = false;
boolean siteroot = false;
boolean folderroot =  folder.equals("");
File fwebsite = null;
if (  Toolbox.dbadmin[orgnum%65536].websiteFolder!=null && user.websitename!=null && !user.websitename.equals(""))
    fwebsite = new File(Toolbox.dbadmin[orgnum%65536].websiteFolder + File.separator + user.websitename);


boolean mountwebsite = (fwebsite != null && fwebsite.exists());
boolean canhavewebsite = (fwebsite != null)
                      && !fwebsite.exists()
                      &&  user.websitename!=null
                      && !user.websitename.equals("")
                      && !user.websitename.equals("no");
boolean notmountsite = folder.equals("website") && !mountwebsite;

String fld = folder;
if (!folder.equals("")) 
    fld  = File.separator + folder;


String realfolder = (user.webFileFolder  +  fld).replace('/', File.separator.charAt(0));
 
String iscourse = Toolbox.defaultParam(orgnum,request,"iscourse", null, null, 5); 
 
if ( iscourse!= null && new File(realfolder).exists()==false)
{
    paramv.append("<input type=hidden name=\"iscourse\" value=\"" + iscourse+ "\">" );  
    UploadFile.makedir(realfolder);
    String[] xs = Toolbox.emsgs(orgnum,1398).split("[ ]*,[ ]*");
   
    String xx = realfolder.replaceFirst("[\\\\|/]$","").replaceFirst("." + xs[0] + "$", "");
    xs[0] = "attendance";
    
    for (int j=0; j < 5; j++)
    {
        File f = new File(xx, xs[j]);
        if (f.exists()==false)   f.mkdir();
    }
   
 } 
 

long filesize= 0;
 
out.print("<!--" + FileOperation.mountwebsite(realfolder,user) +"-->");
  
File dir0 = new File(FileOperation.mountwebsite(realfolder,user));

boolean haspermit = (new File(dir0.getAbsolutePath(),"tmlpermi.txt")).exists();
boolean isupdateimg = false;
if (request.getParameter("updateimg")!=null)
{
    isupdateimg = true;
    (new File(dir0.getAbsolutePath(), FolderMaintain.imgindex)).delete(); 
    (new File(dir0.getAbsolutePath(), FolderMaintain.imgindex + ".jpg")).delete(); 
}

if (!dir0.exists())
{
int jj = folder.length() - 1;
while (jj>=0 &&   folder.charAt(jj) != '/' && folder.charAt(jj) != '\\') 
   jj--;

String higher = "";
if (jj > 0) 
     higher = Toolbox.urlencode(folder.substring(0,jj));
HashMap<String,String> saved = new HashMap<String,String>();
if (iscourse != null) saved.put("iscourse", "yes");
saved.put("operation","newdir");
session.setAttribute("savedDBRequest", saved);
RequestDispatcher dispat = getServletConfig().getServletContext().getRequestDispatcher("/FileOperation");
dispat.forward(request, response);
 
return;
}

 
String findex =  Toolbox.dbadmin[orgnum%65536].websiteFolder + File.separator + user.id + File.separator + "index.html";
if (dir0.getAbsolutePath().equalsIgnoreCase(Toolbox.dbadmin[orgnum%65536].websiteFolder + File.separator + user.id) 
 && (new File(findex)).exists()==false)
{
    java.io.FileWriter aWriter = new java.io.FileWriter(findex, true);
    aWriter.write("<!DOCTYPE html><html lang=\""+Toolbox.langs[orgnum>>16]+"\" ><body><form rel=opener method=post action=/tealeaman/webfolder.jsp  ><input name=searchtarget ><input type=submit name=sub value=Search></form></body></html>");
    aWriter.close(); 
}
 
File [] ffn  = dir0.listFiles(new NoImgIndex());;

int N = 0;
if (ffn!=null) N = ffn.length;

if (mountwebsite && folderroot)
{
    N++;
}

String [] rfn = new String[N];
String [] fn = new String[N];
String [] tpn = new String[N];
String [] url = new String[N];
String  [] tstr = new String[N];
int [] isdir = new int[N];
long [] ln = new long[N];
long [] lm = new long[N];
int [] r = new int[N];

boolean [] lock = new boolean[N];

long nb= 0;
int j = 0;
long totallast = 0;

StringBuffer locked = new StringBuffer(";");

File permitFile = new File (FileOperation.mountwebsite(realfolder + File.separator +"tmlpermi.txt", user));
try
{
           FileInputStream fin = new FileInputStream(permitFile);
           byte [] buf = new byte[256]; 
           int jb=0;
           while ( ( jb = fin.read(buf)) > 0)
           {
               locked.append(new String(buf, 0, jb));
           }
           fin.close();
}
catch(Exception e){}

//out.println("<!--" + locked.toString() +"-->");

for (int i = 0; i < N; i++)
{
   String  fwn = "website"; 
   
   if (i < ffn.length) fwn = ffn[i].getName();
   
   if (i < ffn.length && ffn[i].getName().equals("website")  && folderroot
       &&  (new File(realfolder + File.separator + "website")).isDirectory() )
   {
       if (mountwebsite){
       String f0 = "website0";
       while ( (new File(realfolder + File.separator + f0)).exists()) f0 += "0";
       synchronized(forlock)
       {
          (new File(realfolder + File.separator + "website")).renameTo(new File(realfolder + File.separator + f0));
       }
       ffn[i] = new File(realfolder, f0);
       }
       else
           canpublish = true;
   }


   File f = new File(FileOperation.mountwebsite(realfolder + File.separator + fwn,user ));
   if (f.isDirectory() )
   {
          tpn[j] = "";
          isdir[j] = 1;
          fn[j] = fwn;
          lm[j] = f.lastModified();
          if (lm[j]>totallast) totallast = lm[j];
          if (f.isDirectory())
             ln[j] = 0;
          else 
             ln[j] = f.length();// FileOperation.getFileOrDirectorySize(f);
          filesize += ln[j];
          url[j] = "";
          r[j] = j++;
   }
}
int nf = j;
 
for (int i = 0; i < N; i++)
{
   String  fwn = "website";
   if (i < ffn.length) fwn = ffn[i].getName();
    
   File f = new File(FileOperation.mountwebsite(realfolder + File.separator + fwn, user));

   if (f.isFile())
   {
          isdir[j] = 0;
          fn[j] = ffn[i].getName();  
          int lastdotpos = fn[j].lastIndexOf(".");
          if (lastdotpos < 0)tpn[j] = "";
          else tpn[j] = fn[j].substring(lastdotpos+1).toLowerCase();
          lm[j] = f.lastModified();
          if (lm[j]>totallast) totallast = lm[j];
          ln[j] = f.length();
          filesize += ln[j];
          r[j] = j;
          url[j] = encoder.to6b(codedfolder + fn[j]);
 
          j++;
    }
}
 
long totalwebsize = filesize;
 
Object totalwebfilesize = session.getAttribute("totalwebfoldsize");

if (totalwebfilesize==null || folder.equals(""))
{
    session.setAttribute("totalwebfoldsize", new Long(filesize));
}
else if (!folder.equals(""))
{
    totalwebsize = ((Long)totalwebfilesize).longValue();
    String [] xx = ((String)session.getAttribute("folderandsize")).split(";");
    if (xx[1].equals("|" + folder))
    {
       totalwebsize += filesize - Long.parseLong(xx[0]);
       session.setAttribute("totalwebfoldsize", new Long(totalwebsize));
    }
}
session.setAttribute("folderandsize", ""+filesize +";|"+folder+";");
//Toolbox.dbadmin[orgnum%65536].webFileLength = 2000000000;
long spaceleft = Toolbox.dbadmin[orgnum%65536].webFileLength - totalwebsize;
if (  user.roles == 1)
   spaceleft = Toolbox.dbadmin[orgnum%65536].webFileLength1 - totalwebsize;
 

if (sortField == null)
{
}
else if (sortField.equals("Name"))
{
sort(fn,r,0,nf); 
sort(fn,r, nf, j-nf);
reorder(j,lm,r);
reorder(j,ln,r);
} 
else if (sortField.equals("Size"))
{
sort(ln,r,0,nf); 
sort(ln,r, nf, j-nf);
reorder(j,fn,r);
reorder(j,lm,r);
} 
else if (sortField.equals("Last"))
{
sort(lm,r,0,nf); 
sort(lm,r, nf, j-nf);
reorder(j,fn,r);
reorder(j,ln,r);
} 
else if (sortField.equals("Type"))
{
sort(fn,r,0,nf); 
sort(tpn,r, nf, j-nf);
reorder(j,fn,r);
reorder(j,lm,r);
reorder(j,ln,r);
} 

String style = "style=font-size:" + cachedstyle.fontsize + "px";

for (j = 0; j < N; j++)
{
   lock[j] = (locked.indexOf(";" + fn[j] + ";")>=0);
   tstr[j] = "" +lm[j]/1000;
   nb += ln[j];
}
HashMap ht = new HashMap();
JDBCAdapter adapter = Toolbox.getUserAdapter(user, orgnum);
if (!adapter.error().equals(""))
{
    adapter.close();
    out.println(adapter.server + Toolbox.emsgs(orgnum,1550));
    return;
}
String sql1 = "SELECT  ftype, Operation.caption, Operation.name  FROM   OperationType, Operation WHERE OperationType.operation LIKE CONCAT('%',Operation.name,'%')  order by ftype";
sql1 = Webform.mysql2c(adapter.dbms, sql1);
int m = adapter.executeQuery(sql1);
int roundci = cachedstyle.fontsize/5;
String roundc = "border-radius:"+ roundci + "px;-webkit-border-radius:"+ roundci + "px;-moz-border-radius:"+ roundci + "px;font-family:" + Toolbox.fontsnamestr(orgnum>>16) ;
%>
<!DOCTYPE html>
<html lang="<%=Toolbox.langs[orgnum>>16]%>">

<head>
    <%=Toolbox.getMeta(orgnum)%><title><%=Toolbox.emsgs(orgnum,636)%></title>
<script type="text/javascript"><%=Toolbox.dbadmin[orgnum%65536].colors(orgnum, cachedstyle) %>, securitytoken="<%=Toolbox.gentoken("webfolder.jsp","f1")%>";</script>
<script type=text/javascript><%=Toolbox.someconsts(orgnum)%></script>
<script type=text/javascript  src="<%=Toolbox.getUserLang(orgnum)%>" ></script>
<script type=text/javascript  src=cookie.js></script>

<script type="text/javascript" >
var tstmp = <%=tstmp%>;
if (document.location.toString().indexOf("localhost") >= 0
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
var fn2pos = [];
var fn2size = [];
<%
if ( (new File(dir0.getAbsolutePath() + File.separator + FolderMaintain.imgindex)).exists() == false) 
  (new FolderMaintain(orgnum, dir0.getAbsolutePath(), "", "init")).run(); 
String imgindex = FolderMaintain.filebytes(dir0.getAbsolutePath() + File.separator + FolderMaintain.imgindex);
String did = encoder.to6b(dir0.getAbsolutePath() + File.separator + FolderMaintain.imgindex + ".jpg");
if (!imgindex.equals(""))
{
    String [] xy = imgindex.split("';[^']+'");
    if (xy.length==1)
    {
        (new FolderMaintain(orgnum, dir0.getAbsolutePath(), "", "init")).run();  
        imgindex = FolderMaintain.filebytes(dir0.getAbsolutePath() + File.separator + FolderMaintain.imgindex);
        xy = imgindex.split("';[^']+'");
    }
    int imagefilen = 0;
    if (xy.length>1)
    {
        String fns[] = xy[0].split(",");
        String szs[] = xy[1].split(",");
        imagefilen = fns.length;
        for (int i=0; i < fns.length; i++)
        {
            int rr = i/5, cc = i%5;
            out.println("fn2pos['" + fns[i] + "']='-" + (80*cc) + "px -" + (80*rr) + "px';");
            out.println("fn2size['" + fns[i] + "']='" + szs[i] + "'"); 
        }
    }
}    
%>
 
function getProc(d)
{
<%
for (int i=0; i < m; i++)
{
    String v0 = adapter.getValueAt(i,0).toLowerCase();
    String v1 = adapter.getValueAt(i,1);
    if (i==0||!v0.equals(adapter.getValueAt(i-1,0).toLowerCase()) )
        out.print("if (d=='" + v0 + "') return ['");
    out.print( v1);
    if (i==m-1||!v0.equals(adapter.getValueAt(i+1,0).toLowerCase()) )
        out.print("'];\n");
    else 
        out.print("','");
}
%>
   return null;
}
var did = '<%=did%>';
 
var timeformat = '<%=cachedstyle.timeformat%>';
var haswebfolder=<%=user.websitename != null && !user.websitename.equals("")
||user.webFileFolder != null && !user.webFileFolder.equals("") %>;
var allopts = new Array();
var acthandle = new Array();
var captions =  new Array();
<%
String sql = "SELECT DISTINCT name,description,cgi, button,opt,DomainValue.domainValue from Operation, OperationType ,DomainValue where DomainValue.domain='Tool Caption' AND CONCAT('',DomainValue.code)=Operation.caption AND DomainValue.language='" + Toolbox.langs[orgnum>>16] + "' AND  OperationType.operation like  CONCAT('%',Operation.name,'%')   order by button";
sql = Webform.mysql2c(adapter.dbms, sql);
int n = adapter.executeQuery(sql);
for (int i=0; i < n; i++)
{
    //if (adapter.getValueAt(i,4).contains(")")) continue;
    out.println("allopts['" + adapter.getValueAt(i,0) + "']='" + adapter.getValueAt(i,4) + "';"); 
    out.println("captions['" + adapter.getValueAt(i,0) + "']='" + adapter.getValueAt(i,5) + "';"); 
    out.println("acthandle['" + adapter.getValueAt(i,0) + "']='" + adapter.getValueAt(i,2) + "';");
}
adapter.close();
String [] exists = new String[]{"file","filename","subfolder","Format"};
//WebService webService = new  WebService(adapter, sql,  exists, "f5", "f5.content",cachedstyle.fontsize );
String wdt = "style=height:" +   (4+cachedstyle.fontsize) + "px";
String[] xs = Toolbox.emsgs(orgnum,1398).split("[ ]*,[ ]*");
%>
var fixed = ["<%=xs[0]%>", "<%=xs[1]%>", "<%=xs[2]%>","<%=xs[3]%>","<%=xs[4]%>","attendance"];
var iscourse =     <%= (allcourse.replaceAll("\n", "") + ",").contains("," + folder.replaceFirst("[\\\\|/]$","") + ",")   %>;
var designated = ['<%=Toolbox.emsgs(orgnum,1398).replaceAll(",","','")%>']; 
//var allbuthelp = "";// "<%=Generic.handle("webService.helpbuts")%>".replace(/background:[^\)]*\);/g,'').replace(/clas[^ ]+/g,'').replace(/button/g,'text').replace(/background-color:[^ ]+/g,"\"background-color:<%=cachedstyle.TBGCOLOR%>;color:black;width:<%=Toolbox.charwidthrate()*cachedstyle.fontsize%>px;border:1px #b0b0b0 inset\"" );
var websiteurl = null;
var websiteurl1 = document.location.toString().replace(/\/<%=Toolbox.appname%>\/.*/,'/<%=Toolbox.dbadmin[orgnum%65536].subsitename%>/');
var initsitename = '<%=user.websitename%>';

<% if (user.websitename!=null &&  user.websitename.equals(user.id) &&
       user.lastname.replaceAll("[a-z|A-Z]","").equals(""))
{%>
    initsitename = '<%= ( (user.firstname!=null&& user.firstname.length()>0)? user.firstname.substring(0,1):"").toLowerCase() + user.lastname.toLowerCase() %>';
<%}%>

 
 
 //webService.allbuts.replace('\n',' ').replaceAll("<input[ ]+[^ ]+[ ]+[^ ]+[ ]+[^ ]+[ ]+[^ ]+[ ]+value=","acthandle[").replaceAll("[ ]+onclick", "]").replaceAll("><br>", ";\n").replaceAll("onMouse[^ ]+","")
 
   
function getHandler(act)
{ 
     return  acthandle[act];
} 
 

 
</script>


<style type="text/css"> 
    input.BG {background-color:<%=cachedstyle.TBGCOLOR%>;border:0}
    input.BG1 {background-color:<%=cachedstyle.TBGCOLOR%>; border:0;text-align:right}
 
   .tbbutton{border:1px green outset;color:white;width:<%=Math.round(4.2*cachedstyle.fontsize)%>px;font-family:<%=cachedstyle.fontname %>;font-size:<%=cachedstyle.fontsize%>px;font-weight:bold;text-shadow:#606060 -1px -1px;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:3px;margin:3px 3px 3px 3px;}
   .tdbutton{width:<%=Math.round(4.4*cachedstyle.fontsize)%>px !important;border:1px green outset;color:white;font-family:<%=cachedstyle.fontname %>;font-size:<%=cachedstyle.fontsize%>px;font-weight:bold;text-shadow:#606060 -1px -1px;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:3px;}
    
   .buttong {background:url(image/GreenButton.gif);color:white;border:1px #EEEEEE outset;font-size:<%=cachedstyle.fontsize%>px;font-weight:bold;text-shadow:#707070 -1px -1px;<%=roundc%>}
   .buttonr {background:url(image/RedButton.gif);color:white;border:1px #EEEEEE outset;font-size:<%=cachedstyle.fontsize%>px;font-weight:bold;text-shadow:#707070 -1px -1px;<%=roundc%>}
   .buttono {background:url(image/OrangeButton.gif);color:white;border:1px #EEEEEE outset;font-size:<%=cachedstyle.fontsize%>px;font-weight:bold;text-shadow:#707070 -1px -1px;<%=roundc%>}
   .buttonb {background:url(image/BlueButton.gif);color:white;border:1px #EEEEEE outset;font-size:<%=cachedstyle.fontsize%>px;font-weight:bold;text-shadow:#707070 -1px -1px;<%=roundc%>}
    <% if (!imgindex.equals("")){%>
    .icon{width:80px;height:80px;background:url(FileOperation?operation=open&did=<%=did%>)}
    <%}%> 
</style>
 
<%=cachedstyle.toString()%><link rel="stylesheet" type="text/css" href="styleb<%=orgnum%>.css" />

  
<script type="text/javascript" >
    document.write(unifontstyle(<%=cachedstyle.fontsize%>));
</script>
</head>
<body  style="background-color:<%= cachedstyle.DBGCOLOR %>;margin:5px 5px 5px 5px" >
<center> 
<%=Toolbox.title(ontitle)%> 

<% 
adapter.close();
String ss = "subsites/";
     if ( Toolbox.dbadmin.length > 1)
     {
         ss += Toolbox.dbadmin[orgnum%65536].subsitename + "/";
     }
     
if ( (folder.indexOf("website/"  ) == 0 || folder.equals("website")) && mountwebsite)
{
     String tmpl = "";
     if (folder.indexOf("website/"  ) == 0 && folder.length()>8)
         tmpl = folder.substring(8) + "/";

%><script type="text/javascript" > 
   
    document.write(round1(''));
     
     websiteurl  = document.location.toString().replace(/\/webfolder.jsp.*/,'').replace(/[a-z]+$/, '<%=ss%><%=user.websitename%>/<%=tmpl%>');
 <% 
     
     if(tmpl.equals(""))
 {
     siteroot = true;
 %>
     websiteurl1  = document.location.toString().replace(/\/webfolder.jsp.*/,'').replace(/[a-z]+$/, '<%=ss%><b><%=user.websitename%></b>');
     document.write("<%=Toolbox.emsgs(orgnum,554)%>" + textmsg[511] +":  <a href=\"" + websiteurl +"\" target=\"_blank\">" + websiteurl1 +"</a>");
 <%
 }
     else   //  http://website url 
 {
 %>
      
      document.write("<%=Toolbox.emsgs(orgnum,554)%>" + textmsg[511] +":  <a href=\"" + websiteurl +"\" target=\"_blank\">" + websiteurl +"</a>");
 <%
 }
 %>
    
 document.write(round2);</script>
<%
}

%>
 
<%
boolean selfile = (Toolbox.defaultParam(orgnum,request, ("selfile"), null)!=null);
  
//if (webService.m > 0) {out.print(webService.includejs);}

int nbt = 5 + ((selfile)?1:0);
 
int wtd = Math.round(cachedstyle.fontsize*Toolbox.charwidthrate());
if (wtd>80)wtd=80;
String sz = "width=" + (int)(Math.round(4.4*cachedstyle.fontsize)); 
String lecfolder = Toolbox.emsgs(orgnum,1398).replaceFirst(",.*","");
boolean islect = ( realfolder.indexOf(File.separator + lecfolder ) == realfolder.length()-1-lecfolder.length()
        || realfolder.indexOf(File.separator + "lecture" ) == realfolder.length()-8 );
%>
 
<div style="height:3px"> </div>
<table id="tbl0" style="border:0px #b0b0b0 solid;margin:0px 0px 0px 0px" cellpacing=1   align="center"   cellpadding=0  >
    <tr>
<% if (selfile == false) {%>
<td class="tdbutton OrangeButton" <%=sz%> align="center"    onclick="if(sinkbut(this))document.form3.localpath.click()"  onmouseout="hidemyhint()"  onmouseover="showmyhint(0)"><nobr><%=Toolbox.emsgs(orgnum,647)%></nobr></td>
<!--td id="uploadbtn" class="button<a href=javascript:signsheet()>textmsg[1721]</a>&nbsp;&nbsp;<a href=javascript:startface('??CourseId??')>textmsg[1668]</a> &nbsp;&nbsp;<a href=javascript:startfolder()>textmsg[699]</a> o"  style="visibility:hidden" align="center" width="<%=2%>"   onmouseout="hidemyhint()" onmouseover="showmyhint(0)"><%=Toolbox.emsgs(orgnum,647)%></td-->
<%}%>


<% if (selfile == false) {%>
<td class="tdbutton GreenButton" <%=sz%> align="center"    onclick="if(sinkbut(this))downloadselected()"  onmouseout="hidemyhint()"  onmouseover="showmyhint(0)"><nobr><%=Toolbox.emsgs(orgnum,1228)%></nobr></td>
<!--td id="uploadbtn" class="button<a href=javascript:signsheet()>textmsg[1721]</a>&nbsp;&nbsp;<a href=javascript:startface('??CourseId??')>textmsg[1668]</a> &nbsp;&nbsp;<a href=javascript:startfolder()>textmsg[699]</a> o"  style="visibility:hidden" align="center" width="<%=2%>"   onmouseout="hidemyhint()" onmouseover="showmyhint(0)"><%=Toolbox.emsgs(orgnum,647)%></td-->
<%}%>


  
 <%if (siteroot) {%>
 <td class="GreenButton tdbutton"  <%=sz%>  align="center"     onclick=createwebsite(1)  ><nobr><%=Toolbox.emsgs(orgnum,1370)%></nobr></td>
 <td class="GreenButton tdbutton"  <%=sz%>  align="center"      onclick=closewebsite()><nobr><%=Toolbox.emsgs(orgnum,1371)%></nobr></td>
<%}
if (canhavewebsite && folderroot && !canpublish ) { %>
<td class="tdbutton GreenButton"  <%=sz%>  name="crtweb" align="center"   onclick="if(sinkbut(this))createwebsite(0)"   ><nobr><%=Toolbox.emsgs(orgnum,1369)%></nobr></td>
<% } else if (canpublish || notmountsite && user.websitename!=null && !user.websitename.equals("")) { %>
<td class="tdbutton GreenButton"  <%=sz%> name="crtweb1" align="center"   onclick="if(sinkbut(this))publish()"    ><nobr><%=Toolbox.emsgs(orgnum,1369)%></nobr></td>
<% } %>
<% if (selfile) { %>
<td class="tdbutton GreenButton"  <%=sz%>  align="center"   onclick="if(sinkbut(this))selfile()"   ><nobr><%=Toolbox.emsgs(orgnum,206)%></nobr></td>
<% }  %>
<td class="tdbutton GreenButton"  <%=sz%>  align="center"   onclick="if(sinkbut(this))newdir('<%=Toolbox.emsgs(orgnum,646)%>')"  onmouseout="hidemyhint()"  onmouseover="showmyhint(2)"><nobr><%=Toolbox.emsgs(orgnum,646)%></nobr></td>
<td class="tdbutton GreenButton" id="newfiletd"  <%=sz%>  align="center"   onclick="if(sinkbut(this))newfile('<%=Toolbox.emsgs(orgnum,766)%>')"  onmouseout="hidemyhint()"  onmouseover="showmyhint(1)"><nobr><%=Toolbox.emsgs(orgnum,766)%></nobr></td>

 <%  if (!selfile)
 {%>
   <td class="tdbutton GreenButton"  <%=sz%>  align="center"   onclick="if(sinkbut(this))backup()"  onmouseout="hidemyhint()"  onmouseover="showmyhint(3)" ><nobr><%=Toolbox.emsgs(orgnum,78)%></nobr></td>
<td class="tdbutton GreenButton"  <%=sz%>  align="center"   onclick="if(sinkbut(this))restore()"  onmouseout="hidemyhint()"   onmouseover="showmyhint(4)"><nobr><%=Toolbox.emsgs(orgnum,80)%></nobr></td>

 <%}%>  
   
   <td class="tdbutton GreenButton"  <%=sz%>  align="center"   onclick="if(sinkbut(this))seled('<%=Toolbox.emsgs(orgnum,644)%>')"  onmouseout="hidemyhint()"  onmouseover="showmyhint(5)"><nobr><%=Toolbox.emsgs(orgnum,644)%></nobr></td>
<td class="tdbutton GreenButton"  <%=sz%>  align="center"   onclick="if(sinkbut(this))Unselect()"  onmouseout="hidemyhint()"   onmouseover="showmyhint(6)"><nobr><%=Toolbox.emsgs(orgnum,645)%></nobr></td>
<% if (selfile == false) {%>
<td class="tdbutton RedButton"  <%=sz%>  align="center"   onclick="if(sinkbut(this))deleteit('<%=Toolbox.emsgs(orgnum,30)%>')"  onmouseout="hidemyhint()"  onmouseover="showmyhint(7)"><nobr><%=Toolbox.emsgs(orgnum,30)%></nobr></td>
<%}%>

<% if (selfile == false) {%>
<td class="tdbutton OrangeButton"  <%=sz%>  align="center"   onclick="if(sinkbut(this))updateLock()"    onmouseout="hidemyhint()"  onmouseover="showmyhint(8)" ><nobr><%=Toolbox.emsgs(orgnum,36)%></nobr></td>
<%}%>

<% if (selfile == false) {%>
<!--td class="tdbutton OrangeButton"  <%=sz%>  align="center"   onclick="if(sinkbut(this))geticon()"  onmouseout="hidemyhint()"  onmouseover="showmyhint(9)"><nobr><script>document.write(textmsg[1104])</script></nobr></td-->
<%}%>
<% if (selfile == false) {%>
<td class="tdbutton GreenButton"  <%=sz%>  align="center"   onclick="if(sinkbut(this))showhelp()"  id="helpbtn"    ><nobr>         <%=Toolbox.emsgs(orgnum,32)%> </nobr> </td>
<%}%>
<td class="tdbutton GreenButton"  <%=sz%>  align="center"   onclick="if(sinkbut(this))printasis()"  id="printbtn"    ><script>document.write(textmsg[409])</script></td>

</tr>


</table>




<form rel=opener  style="margin:0px 0px 0px 0px;" name=form1 method=post  >
<script type="text/javascript" >document.write(round1('100%') );</script>
<table width=100%  cellpadding=3 cellspacing=1 class=outset3 border=0 id="themaintbl">
<tr style="background:<%=Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle)%>">
<td width=<%=5+cachedstyle.fontsize%>  align=center> 
<input type=checkbox style="background-color:<%=cachedstyle.BBGCOLOR%>" name=check1 onclick="checkall1()">
</td>
 <td align="left" > <div onclick=javascript:redoit('Name') >
   <%=Toolbox.emsgs(orgnum,67)%> </div>
  </td> 
  <td  align=left>  
      <div  onclick=javascript:redoit('Type') >  <nobr> <%=Toolbox.emsgs(orgnum,291)%> </nobr> </div>
  </td>    
   <td  align=right> <div onclick=javascript:redoit('Size')> <nobr>
   <%=Toolbox.emsgs(orgnum,371)%></nobr> </div>
  </td>  
  <td  align="left">
      <div  ><nobr> <%=Toolbox.emsgs(orgnum,637)%> </nobr> </div>
  </td>   
    <td   align=center>  
      <nobr><%=Toolbox.emsgs(orgnum,1227)%></nobr>  
  </td> 
   <td align=right> <div onclick=javascript:redoit('Last')>
   <nobr><%=Toolbox.emsgs(orgnum,638)%></nobr></div>
  </td>
   <td  align="left"> <nobr>
       <div >URL<%=Toolbox.emsgs(orgnum,890)%></nobr></div>
  </td>
  </tr>  
 
<%if (!folder.equals("")) {%>
<tr bgcolor=<%=cachedstyle.TBGCOLOR%>> 
   <td  align="left"> &nbsp;</td>
   <td align="left" ><a href="javascript:openFolder(-1)"><nobr><%=Toolbox.emsgs(orgnum,639)%>&bull;&bull;</nobr></a></td>
   <td  align=left> <img src=image/folder.jpg border=0 alt="Folder" />  </td> 
   <td  align="left"> &nbsp;</td>
   <td  align="left">
   <select   name=operationn1 onchange=invoke(this)  >
   <option value=""><%=Toolbox.emsgs(orgnum,206)%></option>
   <option  value="moveto(-1)"><%=Toolbox.emsgs(orgnum,640)%></option>
   <option  value="copyto(-1)"><%=Toolbox.emsgs(orgnum,764)%></option>
   </select> 
   </td>
   <td  align="left"> &nbsp;</td>
   <td align="left"> &nbsp;</td>
   <td> &nbsp;</td>
</tr> 
<%
}
else 
{
%>
<tr bgcolor=<%=cachedstyle.TBGCOLOR%>> 
   <td  align="left"> &nbsp;</td>
   <td  align="left"><!--a href="javascript:openFolder(-1)"--> <%=Toolbox.emsgs(orgnum,765)%>  </td>
   <td  align=left> <img src=image/folder.jpg border=0 alt="Folder" />  </td> 
   <td> &nbsp;</td> 
   <td>
   <select name=operationn1 onchange=invoke(this)  >
   <option value=""><%=Toolbox.emsgs(orgnum,206)%></option>
   <option  value="moveto(-1)"><%=Toolbox.emsgs(orgnum,640)%></option>
   <option  value="copyto(-1)"><%=Toolbox.emsgs(orgnum,764)%></option>
   </select> 
   </td>
   <td  align="left"> &nbsp;</td>
   <td> &nbsp;</td>
   <td> &nbsp;</td>
</tr> 
<%
}
%> 

<script type="text/javascript"  src=timeformat.js></script>
 
<script type="text/javascript" >
<% if (isupdateimg ){%>
myprompt('<img src="FileOperation?act=open&folder=<%=folder%>&filedir=<%=FolderMaintain.imgindex%>.jpg" >',null,null,textmsg[1104]);
<%}%>
var selfile = <%=selfile%>; 
var lang = '<%=Toolbox.getUserLang(orgnum).replaceFirst("\\.js$","")%>';
var encoding = '<%=Toolbox.encodings[orgnum>>16]%>';
var font_size = <%=cachedstyle.fontsize%>;
var folder = '<%=folder%>';
var passedsel = '<%=sel%>';
var changedlock=false;
var inquota =  <%=spaceleft>0%>;
var ln=[<%for (int i=0; i < N; i++) out.print(ln[i]+",");%>0];
var nf = <%=nf%>;
var N  = <%=N%>;
var fn = ["<% for (int i = 0; i < N; i++)  out.print(fn[i] +"\",\"");%>"]; 
var lock = [<% for (int i = 0; i < N; i++)  out.print(lock[i] + ",");%>false]; 
var url = [<% for (int i = 0; i < N; i++)  out.print("'" + url[i] + "',");%>''];     
var movetostr = "<%=Toolbox.emsgs(orgnum,640)%>";
var copytostr = "<%=Toolbox.emsgs(orgnum,764)%>";
var renamestr = "<%=Toolbox.emsgs(orgnum,89)%>";
var zipstr = "<%=Toolbox.emsgs(orgnum,641)%>";
var unzipstr = "<%=Toolbox.emsgs(orgnum,643)%>";
var chs = "<%=Toolbox.emsgs(orgnum,206)%>";
var edited = "<%=Toolbox.emsgs(orgnum,642)%>";
var downloadit = "<%=Toolbox.emsgs(orgnum,1228)%>";
var tstr = [<% for (int ii=0; ii<N; ii++) out.print(tstr[ii] + ",");%>0];
var wfdl = "web/<%=user.id +"/"+ fld.replaceFirst("^\\\\","")%>";
var chkwidth = 5 + <%=cachedstyle.fontsize%>;
var fileext,procs,procsn;
var theurl = "<%=Toolbox1.geturl(request)%>";

function folderrow(i)
{
   return   '<td align=center width=' + chkwidth +'> <input type=checkbox name=checkbox' + i +' value="' + fn[i] + '" onclick="checkseq(' + i +')"> </td>'
   + '<td  align="left"><a href="javascript:openFolder(' + i + ')"><NOBR>' + (fn[i]=='website'?'<b>':'')+ fn[i] + (fn[i]=='website'?'</b>':'') +  '</NOBR></a></td>'
   + '<td align=left> <img src=image/folder.jpg border=0 alt="Folder" />  </td>' 
   + '<td align=right><font color=<%=cachedstyle.IBGCOLOR%> >' + ln[i] + '</font></td>' 
   + '<td align="left" >'
   + '<select name=operation' + i + ' onchange=invoke(this) style=border:0>'
   + '<option value="">'     + chs + '</option>'
   + '<option  value="moveto(' + i + ')">' + movetostr + '</option>'
   + '<option  value="copyto(' + i + ')">' + copytostr + '</option>'
   + ((iscourse && (fn[i]==designated[0] ||  fn[i]==designated[1] ||  fn[i]==designated[2] ||  fn[i]==designated[3] ||  fn[i]==designated[4]))?'':('<option  value="rename(' + i + ')">' + renamestr + '</option>'))
   + '<option  value="zip(' + i + ')">' + zipstr + '</option>'
   + '</select>' 
   + '</td>'
   + '<td  align=center><input type=checkbox name=lockit' + i +' value="' + fn[i] + '" onclick="changedlock=true;lockseq('+i+')" >'
   +'</td>'
   + '<td  align=right> <font color=<%=cachedstyle.IBGCOLOR%> ><NOBR>' + timestr(tstr[i]) + '</NOBR></font></td>'
   + '<td  align="left">' +   ( (typeof(websiteurl)!='undefined' && websiteurl!=null)? '<a href=javascript:hin(\'' + i + '\')>' + textmsg[543] +'</a>':''  ) +  '</td>';
}

for (var i=0; i < nf; i++)
  document.write("<tr bgcolor=<%=cachedstyle.TBGCOLOR%> >" + folderrow(i) + '</tr>'); 
function isimage(f) 
{
    var fen = f.replace(/@.*/, '');
    var jj = fen.lastIndexOf(".");
    var fen = fen.substring(jj + 1).toLowerCase();
    return (fen === 'jpg' || fen === 'jpeg' || fen === 'gif' || fen === 'png');  
}
var needrefresh = false;
var NN = 0;
function addFileRow(i)
{
   var bb = typeof(websiteurl)!='undefined' && websiteurl!=null;
   if (false==<%=selfile%>){
   var filelink =  bb? ('<td  align="left"><a href="' + websiteurl +  fn[i] + '" target="_blank">') :
                       ('<td  align="left"><a href="javascript:download(' + i + ')">');
   }
   else
       filelink =  '<td  align="left">';
    
   if (fn2pos[fn[i]]!=null)
   {
       NN++;
       var wh = fn2size[fn[i]].split(/x/);
       var w = parseInt(wh[0]), h = parseInt(wh[wh.length-1]);
       if (''+w!='NaN' && w > h && h <= 80)
       {
          var r = 40-h/w*40;
          var yy = parseInt(fn2pos[fn[i]].replace(/.+([0-9]+)px$/,'$1')) + r;
          fn2pos[fn[i]] =  fn2pos[fn[i]].replace(/(.+)[0-9]+px$/,'$1'+yy + 'px') + ";height:" + (80*h/w) + "px";
       }
   } 
   else if (isimage(fn[i]))
       needrefresh = true;
   var arow =  '<td align=center width=' + chkwidth +'> <input type=checkbox name=checkbox' + i +' value=' + fn[i] + ' onclick="checkseq(' + i +')"> </td>'
   //+ '<td> <a href="' + wfdl  + "/" + fn[i] + '" target=blank>' + fn[i].replace(" ","&nbsp;") + '</a> </td>'
   + filelink  +   fn[i].replace(" ","&nbsp;") +  '<%=!selfile?"</a>":""%>' + ' </td>'
   + (fn2pos[fn[i]]==null?('<td  align=left><img src=image/file.jpg border=0 alt="File" /></td>'):('<td align=right valign=top ><div class=icon style="margin-top:-35px;padding:0px;margin-bottom:-35px;background-position:' + fn2pos[fn[i]] + '"><!----></div></td>')) 
   + '<td align=right><font color=<%=cachedstyle.IBGCOLOR%>>' + (fn2size[fn[i]]==null?ln[i]:(ln[i] + '<br>'+ fn2size[fn[i]])) + '</font></td>' 
   + '<td  align="left">'
   + '<select name=operation' + i +' onchange=invoke(this) style=border:0>'
   + '<option value="">' + chs + '</option>'
   + '<option value="rename(' + i +')">' + renamestr +'</option>';
   
   
    if (isimage(fn[i])) 
    arow += '<option value="resizepic(' + i + ')">' + textmsg[1294] +'</option>';
    
   
   if (fn[i].toUpperCase().indexOf(".ZIP") > 0) 
   {   
      arow +='<option  value="unzip(' + i + ')">' + unzipstr + '</option>';
   }
   else
   {
      if (fn[i].indexOf('.jpg') < 0 && fn[i].indexOf('.png')<0 && 
          fn[i].indexOf('.gif') <0  && fn[i].indexOf('.word')<0 &&
          fn[i].indexOf('.pdf')<0   && fn[i].indexOf('.xsl')<0 &&
          fn[i].indexOf('.ppt')<0
                )
         arow +='<option  value="editFile(' + i + ')">' + edited + '</option>';
      arow +='<option  value="zip(' + i + ')">' + zipstr + '</option>';
      fileext = fn[i].replace(/^[^\.]+\./,''); 
     
      procs  = getProc(fileext);
       
      if (procs!=null)
      for (var k=0; k < procs.length; k++)
      {
          if (procs[k]!='' && captions[procs[k]] !=null)
          {
              arow +='<option value="webservice(' + i + ',\'' + procs[k] + '\',\'' + allopts[procs[k]]  +  '\')">' + captions[procs[k]] + '</option>';
          }
      }
      arow +='<option  value="download(' + i + ',1)">' + downloadit + '</option>';
   }
   arow +='</select>' 
   + '</td>'
   + '<td  align=center><input type=checkbox name=lockit' + i +' value="' + fn[i] + '"  onclick="changedlock=true;lockseq(' + i + ')"></td>'
   + '<td  align=right> <font color=<%=cachedstyle.IBGCOLOR%> ><nobr>' + timestr(tstr[i]) + '</nobr></font></td>'
   + '<td  align="left"> <font color=<%=cachedstyle.IBGCOLOR%> ><NOBR><a href=javascript:hin(\'' + i + '\')>' + textmsg[543] +'</a></NOBR></font></td>'
   ; 
   
   return arow;
} 
for (var i = nf; i < N; i++)
{   
   document.write('<tr bgcolor=<%=cachedstyle.TBGCOLOR%> >' + addFileRow(i)    + '</tr>');  
}
var uid = "<%=user.id%>";
var sek = "<%=SessionCount.enq(session.getId())%>";
var filerestore = "<%=LongFilePro.chatunzip%>";
</script>
<tr bgcolor=#FFFFC0>
   <td ></td>
   <td  align="left"><%=Toolbox.emsgs(orgnum,225)%>:<font color=<%=cachedstyle.IBGCOLOR%> ><%=""+N%></font></td>
   <td onclick="updateimg()" align="middle"><script>if (NN < Object.keys(fn2pos).length) needrefresh = true; if(needrefresh) document.write('&#10227;');</script></td><td   align="right"><font color=<%=cachedstyle.IBGCOLOR%> ><%=""+filesize%></font>   
   </td><td  align="left" colspan=1>
<% if (spaceleft>=0) {%>  
<nobr><%=(spaceleft>0)?"+":""%><font color=<%=cachedstyle.IBGCOLOR%> ><%=unitb(spaceleft)%></font></nobr>
<%} else {%>
<nobr><%=Toolbox.emsgs(orgnum,1120)%>:<font color=<%=cachedstyle.IBGCOLOR%> ><%=-spaceleft%></font></nobr>
<%}%></td><td align="center">
<input type="checkbox" name="checkall" style="background-color:transparent" onclick="checklocks(this)">
</td>
    <td  align=right><font color=<%=cachedstyle.IBGCOLOR%> > <%=Toolbox.timestr(totallast/1000)%></font></td>
    <td  align="left"> &nbsp;</td>
</tr> 

</table> 
<script type="text/javascript" >document.write(round2);</script>
<input type=hidden name=securitytoken value="<%=Toolbox.gentoken("webfolder.jsp","form1")%>">
<input type=hidden   name=allcourse value="<%=allcourse%>" >
</form>


<%

if (islect)
{
    File furl = new File(realfolder,"wwwresurls.html");
    if (furl.exists() == false)
         furl.createNewFile();
%>
<form rel=opener name="form6" action="FileOperation" method="post" target="w<%=tstmp%>">
 
<script type="text/javascript" >document.write(round1('100%') );</script>
<table width=100%  cellpadding=3 cellspacing=1 class=outset3 border=0  id="theurltbl">
<tr style="background:<%=Toolbox.dbadmin[orgnum%65536].beheading(cachedstyle)%>">
<td width=<%=5+cachedstyle.fontsize%>  align=center>
<input type=checkbox style="background-color:<%=cachedstyle.BBGCOLOR%>" name=check1 onclick="checkall2()">
</td>
 <td  align="left" > <nobr> <%=Toolbox.emsgs(orgnum,1368)%>  (URL <%=Toolbox.emsgs(orgnum,890)%>)</nobr> </td>

  </td>
   <td  align="left"> <nobr>
       <div ><%=Toolbox.emsgs(orgnum,41)%></nobr> </div>
  </td>
   <td   align=center>
        <nobr> <%=Toolbox.emsgs(orgnum,1227)%>  </nobr>  
  </td>
   <td  align="left"> <nobr>
       <div >URL<%=Toolbox.emsgs(orgnum,321)%> </nobr> </div>
  </td>
  </tr>
 <%
    java.io.BufferedReader br = new BufferedReader(new FileReader(furl));
    String line, lockl, captionstr, urllink;
    int urlk = 0; boolean done = false;
    String cellbgcolor = "black";
    while (true)
    {
        line = br.readLine();
        if (line == null)
        {
            done = true;
            cellbgcolor = "#aaaaaa";
        }
        else
            line = line.trim();
        if (line!=null && line.equals(""))continue;
        lockl = "";
        if (line!=null)
            lockl = (line.charAt(0) == 'x')?"checked":"";
        int i = -1;
        if (line==null)
        {
            urllink = request.getRequestURL().toString();
            int jj = urllink.indexOf("//");
            urllink = urllink.substring(0,jj+2);//   "http://";
            captionstr = "about ";
        }
        else if ((i = line.indexOf("href="))==-1)
        {
            i = line.indexOf("http");
            if (i==-1) i = line.indexOf("ftp");
            if (i==-1)  continue;

            urllink = line.substring(i);
            captionstr = urllink;

        }
        else
        {
        j = line.indexOf(">", i);
        if (j==-1)
        {
            urllink = line.substring(i+5).replaceAll("\"", "").trim().replaceFirst(" .*$","");
            captionstr = urllink;
        }
        else
        {
            urllink = line.substring(i+5, j).replaceAll("\"", "").trim().replaceFirst(" .*$","");
            int  k = line.indexOf("<", j);
            if (k ==-1)
                captionstr = line.substring(j+1);
            else
                captionstr = line.substring(j+1,k);
        }
        }
        %>
    <tr><td width=<%=5+cachedstyle.fontsize%> bgcolor="<%=cachedstyle.TBGCOLOR%>" align=center>
<input type=checkbox style="background-color:<%=cachedstyle.TBGCOLOR%>" name=urlchecks  >
   </td>

   <td  bgcolor="<%=cachedstyle.TBGCOLOR%>"  align="left"><input type="TEXT" style="border:0px;background-color:<%=cachedstyle.TBGCOLOR%>;color:<%=cellbgcolor%>" name="cell1<%=urlk%>" <%if (done){%> onfocus="textboxhint(this, 0)"  onblur="textboxhint(this, 1,'http://')" <%}%> value="<%=urllink%>" size="10"></td>
   
   <td  bgcolor="<%=cachedstyle.TBGCOLOR%>"  align="left"><input type="TEXT" style="border:0px;background-color:<%=cachedstyle.TBGCOLOR%>;color:<%=cellbgcolor%>" name="cell2<%=urlk%>" <%if (done){%> onfocus="textboxhint(this, 0)"  onblur="textboxhint(this, 1,'about')"   <%}%>  value="<%=captionstr%>" size="10"></td>
   <td width=<%=5+cachedstyle.fontsize%>  bgcolor="<%=cachedstyle.TBGCOLOR%>"  align=center>
<input type=checkbox style="background-color:<%=cachedstyle.TBGCOLOR%>" name=urllocks <%=lockl%> >
   </td>
   <td  bgcolor="<%=cachedstyle.TBGCOLOR%>"  align="left"><a href="javascript:openthisurl(<%=urlk%>)" ><%=Toolbox.emsgs(orgnum,1197)%> </a></td>
   </tr>
        <%
      urlk++;
      if (done) break;
    }
    br.close();
%>
<!--tr bgcolor="lightyellow"><td width=<%=5+cachedstyle.fontsize%>  align=center  valign>
    <img width="<%=3+cachedstyle.fontsize%>" height="<%=3+cachedstyle.fontsize%>" onclick="addline()" src="image/addopt.png">
   </td>

   <td align="right"> <%=urlk%></td>

   <td> </td>
   <td width=<%=5+cachedstyle.fontsize%>  align=center>
<input type=checkbox style=background-color:<%=cachedstyle.TBGCOLOR%> name=urllocks <%=lockl%> >
   </td>
   <td > </td>
   </tr -->
</table>
<script type="text/javascript" >document.write(round2);</script>
<input name=filedir type=hidden value="wwwresurls.html">
<input name=folder type=hidden  value="<%=folder%>">
<input name=operation type=hidden value=save>
<input type=hidden name=subfolder value="<%=folder%>">
<input name=destination type="hidden">
<input name=tstmp type="hidden" value="<%=tstmp%>">
<input type=hidden name=securitytoken value="<%=Toolbox.gentoken("webfolder.jsp","form6")%>">
<input type=hidden   name=allcourse value="<%=allcourse%>">
 
</form>
<%}%>

<form rel=opener name=form2 style="margin:0px 0px 0px 0px"  method=post action=FileOperation target=fileoperation   >
<input type=hidden name=folder value=<%=folder%> >
<input type=hidden name=filedir>
<input type=hidden name=destination>
<input type=hidden name=operation>
<input type=hidden name=securitytoken value="<%=Toolbox.gentoken("webfolder.jsp","form2")%>">
<input type=hidden   name=allcourse value="<%=allcourse%>">
 
<input type=hidden   name=option value="" >
</form>

<form rel=opener name=form3 style="margin:0px 0px 0px 0px" method=post action=UploadFile target=w<%=tstmp%>  enctype="multipart/form-data" >
<div id="pathfather"><input type=file name=localpath  value=Browse multiple="true"  style="width:1px;visibility:hidden" onchange="clickedhere(this);douploadm()" ></div>       
<input type=hidden   name=saveindir value="<%=folder%>">
<input type=hidden name=maximumsize value=10000000>
<input type=hidden name=dummy value=4000000>
<input type=hidden name=securitytoken value="<%=Toolbox.gentoken("webfolder.jsp","form3")%>">
<input type=hidden   name=allcourse value="<%=allcourse%>">
 
</form>

<form rel=opener name=form4 style="margin-bottom:0pt;margin-top:0pt;" method=post action=webfolder.jsp  >
 
<% if (selfile){%> <input type=hidden name=selfile value=1> <%} %>
<input  type=hidden   name=folder>
<input  type=hidden   name=sortField value="<%=sortField%>">
<input  type=hidden   name=sel> 
<input type=hidden   name=allcourse value="<%=allcourse%>">
 
<input type=hidden name=securitytoken value="<%=Toolbox.gentoken("webfolder.jsp","form4")%>">
</form>
<form rel=opener name=form5 style="margin-bottom:0pt;margin-top:0pt;"  method=post target=fileoperation   >
     <input type=hidden   name=allcourse value="<%=allcourse%>">
     
    <input type=hidden name=folder  value="<%=folder%>" >
    <input type=hidden name=subfolder value="<%=folder%>" >
    <input type=hidden name=file>
    <input type=hidden name=filename>
    <input type=hidden name=content>    
    <input type=hidden name=securitytoken value="<%=Toolbox.gentoken("webfolder.jsp","form5")%>">
</form>

<form rel=opener name=form7 style="margin-bottom:0pt;margin-top:0pt;"  method=post target=fileoperation   >
    <input type=hidden   name=allcourse value="<%=allcourse%>">
     
    <input type=hidden name=folder  value="<%=folder%>" >
    <input type=hidden name=subfolder value="<%=folder%>" >
    <input type=hidden name=file>
    <input type=hidden name=filename>
    <input type=hidden name=attach>
    <input type=hidden name=securitytoken value="<%=Toolbox.gentoken("webfolder.jsp","form5")%>">
</form>
<form rel=opener name=form8 style="margin-bottom:0pt;margin-top:0pt;"  method=post target=_self action="webfolder.jsp"  >
<input name="updateimg" type="hidden" value="1">
<%= paramv.toString()%>     
</form>
</center>
 
<script type="text/javascript" >
var oldbutton = null;
function isimage(fn)
{
    var ext = fn.replace(/.*\.([^\.]+)$/,'$1').toLowerCase();
    if (ext=='jpg' || ext =='jpeg' || ext == 'gif' || ext == 'png' || ext == 'svg' ||ext =='tiff')
        return true;
    return false;
}
function updateimg()
{
    if (needrefresh)
    document.form8.submit();
}
function sinkbut(btn)
{
   if (oldbutton!=null) oldbutton.style.borderStyle = "outset";
   btn.style.borderStyle = "inset";
   oldbutton = btn;
    
   return true;
}

function getFolder()
{
    return "<%=folder%>";
}
function getSubdb()
{
    return "<%=user.id%>";
}
var helpstr = "<%=Generic.handle(Toolbox.emsgs(orgnum,660))%>" + "<!---->";
var iid = "<%= user.id %>";
var numFolders = <%=nf%>;
var BBGCOLOR = "<%=cachedstyle.BBGCOLOR%>";
var f1 = document.form1;
var locks = new Array(N);
for (var i=0; i < N; i++) locks[i] = f1.elements[3*(1+i)+1];
var cb = new Array(N);
for (var i=0; i < N; i++) cb[i] =  f1.elements[3*i+2];

  
function makebut(cl)
{
     
    return "<tr><td valign=top> <input  type=button class=" + cl + " style=font-family:" + myfontname + ";width:" + Math.round(charwidthrate()*font_size+10)
    +  ";px;height:" + (6+font_size) +"px;overflow:hidden value=";
}
var selhint = "<%=Toolbox.emsgs(orgnum,663)%>";
var toolmsg68  = "<%=Toolbox.emsgs(orgnum,68)%>";
var toolmsg34  = "<%=Toolbox.emsgs(orgnum,34)%>";
var toolmsg665 = "<%=Toolbox.emsgs(orgnum,665)%>";
var toolmsg767 = "<%=Toolbox.emsgs(orgnum,767)%>";
var toolmsg766 = "<%=Toolbox.emsgs(orgnum,766)%>";
var toolmsg647 = "<%=Toolbox.emsgs(orgnum,647)%>";
var toolmsg664 = "<%=Toolbox.emsgs(orgnum,664)%>";
var toolmsg666 = "<%=Toolbox.emsgs(orgnum,666)%>";
var toolmsg667 = "<%=Toolbox.emsgs(orgnum,667)%>";
var toolmsg768 = "<%=Toolbox.emsgs(orgnum,768)%>";
var toolmsg659 = "<%=Toolbox.emsgs(orgnum,659)%>";
var toolmsg668 = "<%=Toolbox.emsgs(orgnum,668)%>";
var toolmsg648 = "<%=Toolbox.emsgs(orgnum,648)%>";
var toolmsg769 = "<%=Toolbox.emsgs(orgnum,769)%>";
var toolmsg771 = "<%=Toolbox.emsgs(orgnum,771)%>";
var toolmsg229 = "<%=Toolbox.emsgs(orgnum,229)%>";
var toolmsg660 = "<%=Toolbox.emsgs(orgnum,660).replaceAll("\n","@")%>";
var toolmsg649 = "<%=Toolbox.emsgs(orgnum,649)%>";
var toolmsg653 = "<%=Toolbox.emsgs(orgnum,653)%>";
var toolmsg1587 = "<%=Toolbox.emsgs(orgnum,1587)%>";
var toolmsg1588 = "<%=Toolbox.emsgs(orgnum,1588)%>";
var toolmsg1227= "<%=Toolbox.emsgs(orgnum,1227)%>";
var toolmsg71 = "<%=Toolbox.emsgs(orgnum,71)%>";
var toolmsg78 = "<%=Toolbox.emsgs(orgnum,78)%>";
var toolmsg80 = "<%=Toolbox.emsgs(orgnum,80)%>";
var toolmsg366 = "<%=Toolbox.emsgs(orgnum,366)%>";
var toolmsg400 = "<%=Toolbox.emsgs(orgnum,400)%>".replace(/.*([^ ]+)$/,'$1');
var toolmsg402 = "<%=Toolbox.emsgs(orgnum,402)%>";
var backupperiod = <%=user.backupperiod  %>; 
if(backupperiod==-1)backupperiod = 0;     

var toolmsg1228=  "<%=Toolbox.emsgs(orgnum,1228)%>";
var helpinstro = "<br><b><font color=purple>" + textmsg[51] +"</font></b><br><table>"
+ makebut("OrangeButton") +"\"<%=Toolbox.emsgs(orgnum,647)%>\"> </td><td><%=Toolbox.emsgs(orgnum,653)%></td></tr>"
+ makebut("GreenButton") +"\"<%=Toolbox.emsgs(orgnum,646)%>\"></td><td><%=Toolbox.emsgs(orgnum,772)%></td></tr>"
+ makebut("GreenButton") +"\"<%=Toolbox.emsgs(orgnum,766)%>\"></td><td><%=Toolbox.emsgs(orgnum,651)%></td></tr>"
+ makebut("GreenButton") +"\"<%=Toolbox.emsgs(orgnum,644)%>\"> </td><td><%=Toolbox.emsgs(orgnum,1587)%></td></tr>"
+ makebut("GreenButton") +"\"<%=Toolbox.emsgs(orgnum,645)%>\"></td><td><%=Toolbox.emsgs(orgnum,1588)%></td></tr>"
+ makebut("GreenButton") +"\"<%=Toolbox.emsgs(orgnum,644)%>\"> </td><td><%=Toolbox.emsgs(orgnum,649)%></td></tr>"
+ makebut("GreenButton") +"\"<%=Toolbox.emsgs(orgnum,645)%>\"></td><td><%=Toolbox.emsgs(orgnum,650)%></td></tr>"
+ makebut("RedButton") + "\"<%=Toolbox.emsgs(orgnum,30)%>\"></td><td><%=Toolbox.emsgs(orgnum,652)%></td></tr>"
+ makebut("OrangeButton") +"\"<%=Toolbox.emsgs(orgnum,607)%>\"></td><td><%=Toolbox.emsgs(orgnum,608)%></td></tr></table>"
<% if (folder.equals("") || folder.indexOf("/")>0 ){
String xx[] = Toolbox.emsgs(orgnum,1398).split(",");
%>
+ "<br><b><font color=purple><%=Toolbox.emsgs(orgnum,586)%></font></b><br><table><tr><td valign=top style=color:blue><nobr><%=xx[0]%></nobr></td><td> <%=Toolbox.emsgs(orgnum,589)%></td></tr>"
+ "<tr><td valign=top style=color:blue><nobr><%=xx[1]%></nobr></td><td>  <%=Toolbox.emsgs(orgnum,609)%></td></tr> "
+ "<tr><td valign=top  style=color:blue><nobr><%=xx[2]%></nobr></td><td><%=Toolbox.emsgs(orgnum,587)%> </td></tr>"
+ "<tr><td valign=top  style=color:blue><nobr><%=xx[3]%></nobr></td><td>  <%=Toolbox.emsgs(orgnum,588)%></td></tr>"
+ "</table>"
<%}%>
+"<br><b><font color=purple><%=Toolbox.emsgs(orgnum,770)%></font></b><br><table>";
 
//if (parent == window)   document.write('<br><nobr><font size=-1 color=<%=cachedstyle.IBGCOLOR%> > <%= Toolbox.copyright[orgnum>>16]%></font></nobr>');
<%= Toolbox.msgjspout((orgnum%65536)+user.id, true)%>
<% if (selfile == false) {%> resizebut(document.form3,<%=cachedstyle.fontsize%>); <%}%>

//document.getElementById("tbl0").rows[0].cells[0].style.width = "<%=(int)(8*Toolbox.charwidthrate()*cachedstyle.fontsize)%>px";
//document.getElementById("tbl0").rows[1].cells[0].style.width = "<%=(int)(8*Toolbox.charwidthrate()*cachedstyle.fontsize)%>px";
 
 
var ZQ8="<%=Toolbox.decrsa[Toolbox.locales[orgnum>>16].charsize-1].publickey()%>";
var ZQ10="<%=Toolbox.locales[orgnum>>16].charsize%>";
if  (typeof(websiteurl)!='undefined' && websiteurl!=null)
    theurl = websiteurl; 
var keystr = sek + '<%='_' +DataRestore.chatcourse%>';
</script>

<script type="text/javascript"  src=timeformat.js></script>
<script type="text/javascript"  src=encryption.js></script>
<script type="text/javascript"  src=helpformat.js></script>
<script type="text/javascript"  src=hints.js></script>
<script type="text/javascript"  src=findrep.js></script>
<script type="text/javascript"  src=webfolder.js></script>
<script type="text/javascript"  src=downloadm.js></script>
<script type="text/javascript"  src=attachment.js></script>
<script type="text/javascript"  src=curve.js></script>
 
 <div id="copyright" style="text-align:center;color:#4d5ddd;font-size:12px"> 
<%= Toolbox.copyright[orgnum>>16]%> 
</div>
<iframe name="w<%=tstmp%>" width="1" height="1" scrolling="no" style="visibility:hidden" />
</body>
</html>
<% 
    
%>
