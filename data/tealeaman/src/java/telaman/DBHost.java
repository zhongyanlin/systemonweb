/*
 * Decompiled with CFR 0_87.
 */
package telaman;

import java.io.Serializable;
 

public class DBHost implements Serializable 
{
    public String dbms = "";
    public String host = "";
    public String driver = "";
    public String admindb = "";
    public String uid = "";
    public String password = "";
    public String active = "0";
    public String asmain = "0";
    private int i;
    private int j;
    private String line;

    
    public void totablerow(StringBuffer a, int orgnum, String bgcolor) {
        
        
        String passw = "";
        String passv = this.password;
        for (int i = 0; i < passv.length(); ++i) {
            passw = passw + "&bull;";
        }
        String tt = "";
        if (active.equals("1")) 
        {
            tt = "checked";
        }
        
        String tt1 = "";
        if (asmain.equals("1" )) 
        {
            tt1 = "checked";
        }
         
        a.append("<tr  bgcolor=");
        a.append(bgcolor);
        a.append("><td>" );
        a.append("<input name=dbms_N    type=hidden   value=\"" );
        a.append( dbms);
        a.append("\" ><input name=host_N type=hidden  value=\"" );
        a.append( host);
        a.append("\"  ><input name=admindb_N type=hidden  value=\"" );
        a.append(admindb );
        a.append("\"  ><input name=driver_N type=hidden  value=\"" );
        a.append(driver );
        a.append( "\"  ><input name=user_N type=hidden  value=\"" );
        a.append( uid);
        a.append( "\" ><input name=password_N type=hidden disabled=true>");
        a.append( "<input name=del_N type=checkbox style=background-color:transparent></td>");
        a.append("<td onclick=editbox('dbms_N',this)>"  );
        a.append(dbms );
        a.append("</td><td><div style=\"width:250px;overflow:hidden\"  onclick=editbox('host_N',this) >" );
        a.append( host);
        a.append( "</div></td><td onclick=editbox('admindb_N',this) >" );
        a.append( admindb);
        a.append( "</td><td ><div style=width:250px;overflow:hidden  onclick=editbox('driver_N',this) >" );
        a.append( driver);
        a.append("</div></td><td onclick=editbox('user_N',this) >"  );
        a.append( uid);
        a.append( "</td><td onclick=editbox('password_N',this) >" );
        a.append( passw);
        a.append( "</td><td><input name=test_N  type=submit value=\"");
        a.append( Toolbox.emsgs(orgnum,76));
        a.append( "\" class=GreenButton style=width:70px onclick=\"setback(_N)\"></td><td align=center><input type=radio name=active " );
        a.append( tt);
        a.append( " value=_N ></td><td align=center><input type=radio name=asmain ");
        a.append( tt1);
        a.append( " value=_N ></td></tr>");
        
    }

    public DBHost() {
    }

    public DBHost(String d, String h, String r, String z, String u, String p, String a, String m) {
        this.dbms = d;
        this.host = h;
        this.driver = r;
        this.admindb = z;
        this.uid = u;
        this.password = p;
        this.active = a;
        this.asmain = m;
    }
 

    public String toString() {
        return this.dbms + this.host + this.driver + this.uid + this.password +  this.active  +  this.asmain ;
    }

    public String tocsvlrow() 
    {
        String q1 = host.contains(",")? "\"":"";
        String q2 = password.contains(",")? "\"":"";
        return  this.dbms + "," + q1 +  host.replaceAll("\"", "\"\"") + q1 + "," 
                +  admindb + "," 
                + driver + "," 
                +  uid + ","
                + q2 +  password + q2 + "," 
                + active + "," 
                +  asmain + "\n";
    }

    public void getLine(String[] x) {
        
        this.dbms = x[0];
        this.host =  x[1];
        this.admindb =  x[2];
        this.driver =  x[3];
        this.uid =  x[4];
        this.password =  x[5];
        this.active =  x[6];
        this.asmain =  x[7];
    }
}
