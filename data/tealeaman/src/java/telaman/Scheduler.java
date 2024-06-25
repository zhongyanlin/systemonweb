 
package telaman;

import java.io.PrintStream;
import java.util.Date;
import java.util.HashMap;
import telaman.JDBCAdapter;
import telaman.Through;
import telaman.Toolbox;
import telaman.Triple;
import telaman.Webform;

public class Scheduler 
{
    int orgnum = Toolbox.langnum<<16;
    public boolean debug = false;
    private String err = "";
    String opterr = "";
    public String dept;
    public String semester;
    public String semesterName;
    boolean hasfix;
    boolean hascandidate;
    boolean hasgoodtime;
    boolean hasexclusion;
    boolean hastimeshare;
    public boolean[][] isjiao;
    public int C = 4;
    public String[] sessions;
    public String[] sessionnums;
    public byte[] credits;
    public int[] seats;
    Triple[] fixed;
    int otherC = 0;
    Triple[] others = null;
    String[] othersessions = null;
    public int P = 3;
    public String[] professors;
    public String[] professorids;
    public byte[] load;
    public byte[] realload;
    public int S = 10;
    public String[] slots;
    public String[] slotnums;
    public byte[] hours;
    public int R = 3;
    public String[] rooms;
    public String[] roomnums;
    public int[] roomseats;
    public int[][] sessionOnlyProfessor = null;
    public int[] sessionOnlyProfessor1 = null;
    public int[][] sessionNotProfessor = null;
    public int[] sessionNotProfessor1 = null;
    private Through[] thrProf = null;
    public int[][] sessionOnlyRoom = null;
    public int[] sessionOnlyRoom1 = null;
    public int[][] sessionNotRoom = null;
    public int[] sessionNotRoom1 = null;
    private Through[] thrRoom = null;
    public int[][] sessionOnlySlot = null;
    public int[] sessionOnlySlot1 = null;
    private int[] SS = null;
    public int[][] sessionNotSlot = null;
    public int[] sessionNotSlot1 = null;
    private Through[] thrSlot = null;
    public int[][] professorOnlySlot = null;
    public int[] professorOnlySlot1 = null;
    public int[][] professorNotSlot = null;
    public int[] professorNotSlot1 = null;
    public int[][] exclusions = null;
    public int[] exclusions1 = null;
    public int[][] roomNotSlot = null;
    public int[] roomNotSlot1 = null;
    public int[][] roomOnlySlot = null;
    public int[] roomOnlySlot1 = null;
    public int E = 0;
    public Triple[] exists = null;
    public boolean isbuilt = true;
    Triple[] ims;
    int maxk = -1;
    public Triple[] best;
    public int[] bestload;
    public long[] vk;
    boolean more = true;
    boolean hasdept = true;
    public int[] orders;
    static String[] tian = new String[20];
    static int[] start = new int[20];
    static int[] end = new int[20];
    int ll;
    String tmpstr = "";
    int[] transfer;
    String emsg(int j)
    {
        return Toolbox.emsgs(orgnum, j);
    }
    String showstr(Triple x)
    {
        return professors[x.p] + " " + rooms[x.r] + " " + slots[x.s];
    }
    public boolean initfromdb(String semester, String semesterName, boolean hasfix, boolean hascandidate, boolean hasgoodtime, boolean hasexclusion, boolean hastimeshare, JDBCAdapter adapter) {
        int rr;
        int i;
        int pp;
        int tt;
        int numT;
        if (semester.equals("-1") || semester.equals("")) {
            return false;
        }
        this.semester = semester;
        this.semesterName = semesterName;
        this.hasfix = hasfix;
        this.hascandidate = hascandidate;
        this.hasexclusion = hasexclusion;
        this.hasgoodtime = hasgoodtime;
        this.hastimeshare = hastimeshare;
        if (adapter.error().length() > 0) {
            this.err = this.err + "\n" + adapter.error();
            return false;
        }
        String deptstr = "";
        String sql = "";
        if (this.hasdept) {
            deptstr = " AND  Schuser.dept='" + this.dept + "' ";
            sql = "SELECT AppUser.id, maxload, preference, AppUser.lastname,AppUser.firstname  FROM Schuser,AppUser WHERE Schuser.id=AppUser.id AND preference > 0 AND semester=" + semester + deptstr + "  ORDER BY 3 DESC,Schuser.id";
        } else {
            sql = "SELECT AppUser.id,SUM(maxload),MAX(preference),AppUser.lastname,AppUser.firstname  FROM Schuser,AppUser WHERE Schuser.id=AppUser.id AND preference > 0 AND semester=" + semester + " group by AppUser.id ORDER BY 3 DESC,Schuser.id";
        }
        this.P = adapter.executeQuery(sql);
        if (this.P < 0) {
            this.err = this.err + "\n" + emsg(1485) + sql;
            adapter.close();
            return false;
        }
        HashMap<String, Integer> mapp = new HashMap<String, Integer>();
        this.load = new byte[this.P];
        this.realload = new byte[this.P];
        this.professors = new String[this.P];
        this.professorids = new String[this.P];
        for (int i2 = 0; i2 < this.P; ++i2) {
            mapp.put(adapter.getValueAt(i2, 0), new Integer(i2));
            this.load[i2] = (byte)Integer.parseInt(adapter.getValueAt(i2, 1));
            this.professors[i2] = Toolbox.makeFullName(adapter.getValueAt(i2, 3),"",adapter.getValueAt(i2, 4));
            this.professorids[i2] = adapter.getValueAt(i2, 0);
            this.realload[i2] = 0;
        }
        deptstr = "";
        if (this.hasdept) {
            deptstr = " AND  Schroom.dept='" + this.dept + "' ";
            sql = "SELECT Schroom.num,Classroom.seats,Classroom.building,Classroom.roomNumber, preference  FROM Schroom,Classroom WHERE semester=" + semester + " AND Classroom.num=Schroom.num AND preference > 0 " + deptstr + "   ORDER BY -preference,Schroom.num";
        } else {
            sql = "SELECT Schroom.num,Classroom.seats,Classroom.building,Classroom.roomNumber,MAX(preference) FROM Schroom,Classroom WHERE semester=" + semester + " AND Classroom.num=Schroom.num AND preference > 0   group BY Classroom.num ORDER BY 5 DESC,Schroom.num";
        }
        this.R = adapter.executeQuery(sql);
        if (this.R < 0) {
            this.err = this.err + emsg(1486) + sql;
            adapter.close();
            return false;
        }
        HashMap<String, Integer> mapr = new HashMap<String, Integer>();
        this.roomseats = new int[this.R];
        this.rooms = new String[this.R];
        this.roomnums = new String[this.R];
        for (int i3 = 0; i3 < this.R; ++i3) {
            mapr.put(adapter.getValueAt(i3, 0), new Integer(i3));
            this.roomseats[i3] = Integer.parseInt(adapter.getValueAt(i3, 1));
            this.rooms[i3] = adapter.getValueAt(i3, 0);
            this.roomnums[i3] = adapter.getValueAt(i3, 0);
        }
        if ((numT = adapter.executeQuery(sql = "select count(*) FROM TimeSlot")) != 1) {
            this.err = this.err + "\n" + emsg(1487)  + sql;
            adapter.close();
            return false;
        }
        numT = 40;
        try {
            numT = Integer.parseInt(adapter.getValueAt(0, 0));
        }
        catch (Exception e) {
            // empty catch block
        }
        deptstr = "";
        if (this.hasdept) {
            deptstr = " AND  Schtime.dept='" + this.dept + "' ";
            sql = "SELECT Schtime.num,TimeSlot.timeSlot,TimeSlot.hours,  preference  FROM Schtime,TimeSlot WHERE semester=" + semester + " AND TimeSlot.num=Schtime.num AND preference > 0 " + deptstr + "  ORDER BY -preference,Schtime.num";
        } else {
            sql = "SELECT Schtime.num,TimeSlot.timeSlot,TimeSlot.hours, MAX(preference)  FROM Schtime,TimeSlot WHERE semester=" + semester + " AND TimeSlot.num=Schtime.num AND preference > 0  GROUP by Schtime.num ORDER BY 4 DESC,1";
        }
        this.S = adapter.executeQuery(sql);
        if (this.S < 0) {
            this.err = this.err + "\n" + emsg(1488)  + sql;
            adapter.close();
            return false;
        }
        HashMap<String, Integer> mapt = new HashMap<String, Integer>();
        if (!this.hasdept) {
            numT = this.S;
        }
        this.slots = new String[numT];
        this.slotnums = new String[numT];
        this.hours = new byte[numT];
        this.isjiao = new boolean[this.S][];
        for (int i4 = 0; i4 < this.S; ++i4) {
            mapt.put(adapter.getValueAt(i4, 0), new Integer(i4));
            this.slots[i4] = adapter.getValueAt(i4, 1);
            this.slotnums[i4] = adapter.getValueAt(i4, 0);
            try {
                this.hours[i4] = (byte)Integer.parseInt(adapter.getValueAt(i4, 2));
            }
            catch (Exception e) {
                this.hours[i4] = 3;
            }
            this.isjiao[i4] = new boolean[numT];
        }
        if (this.hasdept) 
        {
            int numtdiff;
            deptstr = " AND  Schtime.dept='" + this.dept + "' ";
            sql = "SELECT Schtime.num,TimeSlot.timeSlot,TimeSlot.hours  FROM  TimeSlot LEFT JOIN Schtime ON TimeSlot.num=Schtime.num WHERE semester=" + semester + " AND  preference = 0 " 
                    +  deptstr;
            if (( numtdiff = adapter.executeQuery(sql) ) != numT - this.S) 
            {
                this.err = this.err + "\n" + "Schtime Table collapsed. " + sql + "\nnumtdiff=" + numtdiff + "\nnumT=" + numT + "\n+S=" + this.S;
                adapter.close();
                return false;
            }
            for (int i5 = 0; i5 < numtdiff; ++i5) {
                int iS = i5 + this.S;
                mapt.put(adapter.getValueAt(i5, 0), new Integer(iS));
                this.slots[iS] = adapter.getValueAt(i5, 1);
                this.slotnums[iS] = adapter.getValueAt(i5, 0);
                try {
                    this.hours[iS] = (byte)Integer.parseInt(adapter.getValueAt(i5, 2));
                    continue;
                }
                catch (Exception e) {
                    this.hours[iS] = 3;
                }
            }
        }
        String[] xx = new String[2];
        for (int i6 = 0; i6 < this.S; ++i6) {
            for (int j = 0; j < numT; ++j) {
                xx[0] = this.slots[i6];
                xx[1] = this.slots[j];
                this.isjiao[i6][j] = this.isjiao1(xx);
                if (!(i6 != 0 || xx[1].equals(this.slots[j]))) {
                    adapter.executeUpdate("UPDATE TimeSlot SET timeSlot='" + xx[1].replaceAll("'", "''") + "' WHERE timeSlot='" + this.slots[j].replaceAll("'", "''") + "'");
                }
                this.slots[i6] = xx[0];
                this.slots[j] = xx[1];
            }
        }
        deptstr = "";
        if (this.hasdept) {
            deptstr = " AND  Course.department='" + this.dept + "' ";
        }
        String sql0 = "Update Session, Schfixed SET Session.schedule=Schfixed.schedule where Session.courseid=Schfixed.courseid and Session.semester=CONCAT('',Schfixed.semester) and Session.name=Schfixed.name and   (not Schfixed.schedule = '')   and Session.semester='" + semester + "'";
        int nn = adapter.executeUpdate(sql0);
        sql0 = "Update Session, Schfixed SET Session.room=Schfixed.room where Session.courseid=Schfixed.courseid and Session.semester=CONCAT('',Schfixed.semester) and Session.name=Schfixed.name and   (not Schfixed.room = '')   and Session.semester='" + semester + "'";
        nn = adapter.executeUpdate(sql0);
        sql0 = "Update Session, Schfixed SET Session.instructor=Schfixed.instructor where Session.courseid=Schfixed.courseid and Session.semester=CONCAT('',Schfixed.semester) and Session.name=Schfixed.name  and (not Schfixed.instructor = '')   and Session.semester='" + semester + "'";
        nn = adapter.executeUpdate(sql0);
        sql = "SELECT  Session.courseid, Session.name, Course.credit,Session.seats, Session.instructor,room,schedule,title FROM Course, Session WHERE Session.semester='" + semester + "' AND Course.id=Session.courseid " + deptstr + "  ORDER BY 1,2";
        this.C = adapter.executeQuery(sql);
        if (this.C < 0) {
            this.err = this.err + "\n" + "Session Table collapsed. " + sql;
            adapter.close();
            return false;
        }
        HashMap<String, Integer> maps = new HashMap<String, Integer>();
        this.credits = new byte[this.C];
        this.seats = new int[this.C];
        this.sessions = new String[this.C];
        this.sessionnums = new String[this.C];
        this.fixed = new Triple[this.C];
        for (i = 0; i < this.C; ++i) {
            this.sessionnums[i] = adapter.getValueAt(i, 0) + "-" + adapter.getValueAt(i, 1);
            maps.put(adapter.getValueAt(i, 0) + "-" + adapter.getValueAt(i, 1), new Integer(i));
            try {
                this.credits[i] = (byte)Integer.parseInt(adapter.getValueAt(i, 2));
            }
            catch (Exception fe) {
                this.err = this.err + adapter.getValueAt(i, 0) + "'s credit is invalid";
                return false;
            }
            try {
                this.seats[i] = Integer.parseInt(adapter.getValueAt(i, 3));
            }
            catch (Exception fe) {
                this.err = this.err + adapter.getValueAt(i, 0) + "'s seat is invalid";
                return false;
            }
            if (hasfix) {
                pp = this.fixedv(adapter, i, 4, mapp);
                rr = this.fixedv(adapter, i, 5, mapr);
                tt = this.fixedv(adapter, i, 6, mapt);
                this.fixed[i] = new Triple(pp, rr, tt);
            }
            this.sessions[i] = adapter.getValueAt(i, 0) + " " + adapter.getValueAt(i, 1) + " " + adapter.getValueAt(i, 7);
        }
        if (this.hasdept) {
            sql = "SELECT  Session.courseid, Session.name, Course.credit,Session.seats, Session.instructor,Session.room,Session.schedule,Course.title FROM Course, Session, Schuser, Schroom WHERE Schuser.id=Session.instructor  AND Schroom.num=Session.room AND Schuser.semester=Schroom.semester AND Schroom.semester=" + semester + " AND Schuser.dept =  Schroom.dept AND Schroom.dept='" + this.dept + "' AND Session.semester='" + semester + "' AND Course.id=Session.courseid  AND  (NOT Course.department='" + this.dept + "')   ORDER BY Session.courseid,Session.name";
            this.otherC = adapter.executeQuery(sql);
            if (this.otherC == -1) {
                this.err = this.err + "\n" + emsg(990) + ": " + sql;
                return false;
            }
            this.others = new Triple[this.otherC];
            this.othersessions = new String[this.otherC];
            for (i = 0; i < this.otherC; ++i) 
            {
                pp = this.fixedv(adapter, i, 4, mapp);
                rr = this.fixedv(adapter, i, 5, mapr);
                tt =  fixedv(adapter, i, 6, mapt);
                if (pp != -1 || rr != -1 || (tt = this.fixedv(adapter, i, 6, mapt)) != -1) {
                    this.others[i] = new Triple(pp, rr, tt);
                }
                this.othersessions[i] = adapter.getValueAt(i, 0) + " " + adapter.getValueAt(i, 1) + " " + adapter.getValueAt(i, 7);
            }
        }
        if (hascandidate) {
            deptstr = "  ";
            if (this.hasdept) {
                deptstr = deptstr + "   AND  Schuser.dept = '" + this.dept + "' ";
            }
            sql = "SELECT  num1, num2, Scheduler.preference,Schuser.preference  FROM Scheduler,Schuser WHERE Schuser.semester=" + semester + " AND Scheduler.semester=" + semester + " AND   Scheduler.num2=Schuser.id AND which='p' AND  Scheduler.preference > 0 " + deptstr + " ORDER by num1, -Scheduler.preference, -Schuser.preference, num2";
            if ((this.sessionOnlyProfessor = this.read(sql, adapter, maps, mapp)) != null) {
                this.sessionOnlyProfessor1 = this.copyarray(this.transfer);
            }
            sql = "SELECT  num1, num2, Schuser.preference  FROM Schuser, Scheduler WHERE  Scheduler.semester=" + semester + " AND Schuser.semester=" + semester + " AND  Schuser.id=Scheduler.num2 AND which='p' AND  Scheduler.preference = 0 " + deptstr + "  ORDER by num1, -Schuser.preference, num2";
            if ((this.sessionNotProfessor = this.read(sql, adapter, maps, mapp)) != null) {
                this.sessionNotProfessor1 = this.copyarray(this.transfer);
            }
            deptstr = "   ";
            if (this.hasdept) {
                deptstr = deptstr + " AND Schroom.dept = '" + this.dept + "' ";
            }
            sql = "SELECT  num1, num2,Scheduler.preference,Schroom.preference  FROM Scheduler,Schroom WHERE Scheduler.semester=" + semester + " AND Schroom.semester=" + semester + " AND  Scheduler.num2=Schroom.num AND which='r' AND  Scheduler.preference > 0 " + deptstr + " ORDER by num1, -Scheduler.preference, -Schroom.preference, num2";
            if ((this.sessionOnlyRoom = this.read(sql, adapter, maps, mapr)) != null) {
                this.sessionOnlyRoom1 = this.copyarray(this.transfer);
            }
            deptstr = "   ";
            if (this.hasdept) {
                deptstr = " AND  Schroom.dept='" + this.dept + "' ";
            }
            sql = "SELECT  num1, num2,   Schroom.preference  FROM Schroom, Scheduler  WHERE  Scheduler.semester=" + semester + " AND Schroom.semester=" + semester + " AND  (Schroom.num)= Scheduler.num2 AND which='r' AND  Scheduler.preference = 0 " + deptstr + " ORDER by num1, -Schroom.preference, num2";
            if ((this.sessionNotRoom = this.read(sql, adapter, maps, mapr)) != null) {
                this.sessionNotRoom1 = this.copyarray(this.transfer);
            }
            deptstr = "    ";
            if (this.hasdept) {
                deptstr = deptstr + " AND  Schtime.dept='" + this.dept + "' ";
            }
            sql = "SELECT  num1, num2,Scheduler.preference,Schtime.preference  FROM Scheduler,Schtime WHERE  Scheduler.semester=" + semester + " AND Schtime.semester=" + semester + " AND  Scheduler.num2= (Schtime.num) AND which='t' AND  Scheduler.preference > 0 " + deptstr + " ORDER by num1, -Scheduler.preference, -Schtime.preference,num2";
            if ((this.sessionOnlySlot = this.read(sql, adapter, maps, mapt)) != null) {
                this.sessionOnlySlot1 = this.copyarray(this.transfer);
            }
            deptstr = "  ";
            if (this.hasdept) {
                deptstr = deptstr + " AND Schtime.dept='" + this.dept + "' ";
            }
            sql = "SELECT  num1, num2, Schtime.preference  FROM Schtime, Scheduler WHERE Scheduler.semester=" + semester + " AND Schtime.semester=" + semester + " AND  (Schtime.num)= Scheduler.num2 AND which='t' AND  Scheduler.preference = 0 " + deptstr + " ORDER by num1, -Schtime.preference,Schtime.num";
            if ((this.sessionNotSlot = this.read(sql, adapter, maps, mapt)) != null) {
                this.sessionNotSlot1 = this.copyarray(this.transfer);
            }
        }
        if (hasgoodtime) {
            deptstr = "   ";
            if (this.hasdept) {
                deptstr = deptstr + " AND Schuser.dept=Schtime.dept AND Schtime.dept='" + this.dept + "' ";
            }
            sql = "SELECT  num2, num1,Scheduler.preference, Schtime.preference,Schuser.preference  FROM Schuser, Schtime, Scheduler WHERE Scheduler.semester=" + semester + " AND Schtime.semester=" + semester + " AND Schuser.semester=" + semester + " AND  Schuser.id=Scheduler.num2 AND Schtime.num=Scheduler.num1 AND which='g' AND  Scheduler.preference > 0 " + deptstr + " ORDER by  -Schuser.preference, num2,-Scheduler.preference, -Schtime.preference,num1";
            if ((this.professorOnlySlot = this.read(sql, adapter, mapp, mapt)) != null) {
                this.professorOnlySlot1 = this.copyarray(this.transfer);
            }
            sql = "SELECT  num2, num1, Schtime.preference,Schuser.preference  FROM Schuser, Schtime, Scheduler WHERE   Schuser.semester=" + semester + "  AND Schtime.semester=" + semester + "  AND Scheduler.semester=" + semester + " AND Schuser.id=Scheduler.num2 AND Schtime.num=Scheduler.num1 AND which='g' AND  Scheduler" + ".preference = 0 " + deptstr + "   ORDER by  -Schuser.preference,Schuser.id, -Schtime.preference,Schtime.num";
            if ((this.professorNotSlot = this.read(sql, adapter, mapp, mapt)) != null) {
                this.professorNotSlot1 = this.copyarray(this.transfer);
            }
        }
        sql = "SELECT  num1, num2,preference  FROM  Scheduler  WHERE   which='e'  AND Scheduler.semester=" + semester + " AND  Scheduler.preference = 0   ORDER by  num1, num2";
        if (hasexclusion && (this.exclusions = this.read(sql, adapter, maps, maps)) != null) {
            this.exclusions1 = this.copyarray(this.transfer);
        }
        if (hastimeshare) 
        {
            deptstr = "   ";
            if (this.hasdept) 
            {
                deptstr = deptstr + "  AND Schroom.dept = Schtime.dept AND   Schtime.dept='" + this.dept + "' ";
            }
            sql = "SELECT   num2, num1, Scheduler.preference, Schtime.preference,Schroom.preference  FROM Schroom, Schtime, Scheduler WHERE    Schtime.semester=" + semester + "  AND Schroom.semester=" + semester + "  AND Scheduler.semester=" + semester + " AND (Schroom.num)=Scheduler.num2 AND Schtime.num=Scheduler.num1 AND which='s' AND Schroom.semester=Schtime.semester AND Schroom.semester=" + semester + " AND Scheduler" + ".preference > 0 " + deptstr + " ORDER by  -Schroom.preference,num2,-Scheduler.preference,-Schtime.preference,num1";
            if ((this.roomOnlySlot = this.read(sql, adapter, mapr, mapt)) != null) {
                this.roomOnlySlot1 = this.copyarray(this.transfer);
            }
            sql = "SELECT   num2, num1, Schtime.preference,Schroom.preference  FROM Schroom, Schtime, Scheduler WHERE    Schtime.semester=" + semester + "  AND Schroom.semester=" + semester + "  AND Scheduler.semester=" + semester + " and (Schroom.num)=Scheduler.num2 AND Schtime.num=Scheduler.num1 AND which='s'  AND Schroom.semester=Schtime.semester AND Schroom.semester=" + semester + "  AND  Scheduler" + ".preference = 0 " + deptstr + " ORDER by   -Schroom.preference,Schroom.num, -Schtime.preference,Schtime.num";
            if ((this.roomNotSlot = this.read(sql, adapter, mapr, mapt)) != null) {
                this.roomNotSlot1 = this.copyarray(this.transfer);
            }
        }
        return this.checkmono1(this.sessionNotProfessor1) 
                && this.checkmono(this.sessionNotProfessor) 
                && this.checkmono1(this.sessionNotRoom1) 
                && this.checkmono(this.sessionNotRoom) 
                && this.checkmono1(this.sessionNotSlot1) 
                && this.checkmono(this.sessionNotSlot) 
                && this.checkmono1(this.professorNotSlot1) 
                && this.checkmono(this.professorNotSlot) 
                && this.checkmono1(this.exclusions1) 
                && this.checkmono(this.exclusions) 
                && this.checkmono1(this.roomNotSlot1) 
                && this.checkmono(this.roomNotSlot);
    }

    private void print(String s) {
    }

    public int firstNull() {
        int i = 0;
        while ( i < this.C && this.ims[this.orders[i]] != null ) 
        {
            i++;
        }
        if (i < this.C) 
        {
            return this.orders[i];
        }
        return this.C;
    }

    public int firstNull1() {
        int i;
        if (this.best == null || this.best.length == 0 || this.orders == null || this.orders.length == 0) {
            return 0;
        }
        for (i = 0; i < this.C && this.best[this.orders[i]] != null && this.best[this.orders[i]].p != -1 && this.best[this.orders[i]].r != -1 && this.best[this.orders[i]].s != -1; ++i) {
        }
        if (i < this.C) {
            return this.orders[i];
        }
        return this.C;
    }

    private boolean meetOptions(Triple x, int k, boolean debug) {
        boolean b = true;
        if (this.hasdept && this.hasfix && (this.fixed[k].p != x.p && this.fixed[k].p != -1 || this.fixed[k].r != x.r && this.fixed[k].r != -1 || this.fixed[k].s != x.s && this.fixed[k].s != -1)) {
            if (debug) {
                this.err = this.err + emsg(1007) + ": <b>" + this.sessions[k] + "</b>\n";
            }
            b = false;
        }
        if (this.roomseats[x.r] < this.seats[k]) {
            if (debug) {
                this.err = this.err + "<b>" + this.rooms[x.r] + " </b>(" + this.roomseats[x.r] + ") " + emsg(1008) + " <b>" + this.sessions[k] + "(" + this.seats[k] + ")</b>\n";
            }
            b = false;
        }
        if (this.hours[x.s] != this.credits[k]) {
            if (debug) {
                this.err = this.err + emsg(1009) + " <b>" + this.slots[x.s] + "</b> (" + this.hours[x.s] + ") " + emsg(1010) + " <b>" + this.sessions[k] + "(" + this.credits[k] + ")</b>\n";
            }
            b = false;
        }
        if (this.hasdept && this.contains(this.professorOnlySlot1, x.p, this.professorOnlySlot, x.s) == -1) {
            if (debug) {
                this.err = this.err + "<b>" + this.professors[x.p] + "</b> " + emsg(1011) + " <b>" + this.slots[x.s] + "</b>\n";
            }
            b = false;
        }
        if (this.containsb(this.professorNotSlot1, x.p, this.professorNotSlot, x.s) == 1) {
            if (debug) {
                this.err = this.err + "<b>" + this.professors[x.p] + "</b> " + emsg(1011) + " <b>" + this.slots[x.s] + "</b>\n";
            }
            b = false;
        }
        if (this.hasdept && -1 == this.contains(this.roomOnlySlot1, x.r, this.roomOnlySlot, x.s)) {
            if (debug) {
                this.err = this.err + emsg(1018) + "<b>" + this.rooms[x.r] + " </b>" + emsg(1019) + "<b>" + this.slots[x.s] + "</b>\n";
            }
            b = false;
        }
        if (this.containsb(this.roomNotSlot1, x.r, this.roomNotSlot, x.s) == 1) {
            if (debug) {
                this.err = this.err + emsg(1018) + " <b>" + this.rooms[x.r] + "</b> " + emsg(1019) + " <b>" + this.slots[x.s] + "</b> \n";
            }
            b = false;
        }
        if (this.hasdept && this.contains(this.sessionOnlyProfessor1, k, this.sessionOnlyProfessor, x.p) == -1) {
            if (debug) {
                this.err = this.err + "<b>" + this.professors[x.p] + "</b> " + emsg(1012) + " <b>" + this.sessions[k] + "</b>\n";
            }
            b = false;
        }
        if (this.containsb(this.sessionNotProfessor1, k, this.sessionNotProfessor, x.p) == 1) {
            if (debug) {
                this.err = this.err + "<b>" + this.professors[x.p] + "</b> " + emsg(1013) + " <b>" + this.sessions[k] + "</b> \n";
            }
            b = false;
        }
        if (this.hasdept && this.contains(this.sessionOnlyRoom1, k, this.sessionOnlyRoom, x.r) == -1 && debug) {
            this.err = this.err + "<b>" + this.rooms[x.r] + "</b> " + emsg(1014) + " <b>" + this.sessions[k] + "</b>\n";
        }
        if (this.containsb(this.sessionNotRoom1, k, this.sessionNotRoom, x.r) == 1 && debug) {
            this.err = this.err + "<b>" + this.sessions[k] + "</b> " + emsg(1015) + " <b>" + this.rooms[x.r] + "</b> \n";
        }
        if (this.hasdept && -1 == this.contains(this.sessionOnlySlot1, k, this.sessionOnlySlot, x.s)) {
            if (debug) {
                this.err = this.err + "<b>" + this.slots[x.s] + " </b>" + emsg(1016) + "<b>" + this.sessions[k] + "</b>\n";
            }
            b = false;
        }
        if (this.containsb(this.sessionNotSlot1, k, this.sessionNotSlot, x.s) == 1) {
            if (debug) {
                this.err = this.err + "<b>" + this.sessions[k] + " </b>" + emsg(1017) + " <b>" + this.slots[x.s] + "</b>\n";
            }
            b = false;
        }
        return b;
    }

    private boolean isgood(Triple x, int k) {
        if (k < 0 || k >= this.C || x == null || this.roomseats[x.r] < this.seats[k] || this.hours[x.s] != this.credits[k] || this.credits[k] + this.realload[x.p] > this.load[x.p] || this.hasgoodtime && (this.containsb(this.professorOnlySlot1, x.p, this.professorOnlySlot, x.s) == -1 || this.containsb(this.professorNotSlot1, x.p, this.professorNotSlot, x.s) == 1) || this.hastimeshare && (this.containsb(this.roomOnlySlot1, x.r, this.roomOnlySlot, x.s) == -1 || this.containsb(this.roomNotSlot1, x.r, this.roomNotSlot, x.s) == 1)) {
            return false;
        }
        int i = 0;
        for (i = 0; i < this.C; ++i) {
            if (i == k || this.ims[i] == null) continue;
            if (this.ims[i].r == x.r && this.isjiao[x.s][this.ims[i].s]) {
                if (!this.isbuilt) {
                    this.opterr = this.sessions[k] + " has time-room comflict with the course that uses  " + this.rooms[this.ims[i].r] + " during " + this.slots[this.ims[i].s];
                }
                return false;
            }
            if (this.ims[i].p != x.p || !this.isjiao[x.s][this.ims[i].s]) continue;
            if (!this.isbuilt) {
                this.opterr = this.sessions[k] + " has time-instructor comflict with the course that taught by " + this.rooms[this.ims[i].p] + " during " + this.slots[this.ims[i].s];
            }
            return false;
        }
        for (i = 0; i < this.otherC; ++i) {
            if (this.others[i] == null || (this.others[i].r != x.r || !this.isjiao[x.s][this.others[i].s]) && (this.others[i].p != x.p || !this.isjiao[x.s][this.others[i].s])) continue;
            return false;
        }
        if (this.hasexclusion) {
            for (i = 0; i < this.C; ++i) {
                if (i == k || this.ims[i] == null || !this.isjiao[this.ims[i].s][x.s] || this.containsb(this.exclusions1, i, this.exclusions, k) != 1 && this.containsb(this.exclusions1, k, this.exclusions, i) != 1) continue;
                return false;
            }
        }
        return true;
    }

    public boolean verify() {
        boolean b = true;
        if (this.hasdept) {
            for (int k = 0; k < this.C; ++k) {
                if (this.ims[k] == null) {
                    this.err = this.err + emsg(1020) + ".";
                    return false;
                }
                if (this.meetOptions(this.ims[k], k, true)) continue;
                b = false;
            }
            byte[] tt = new byte[this.P];
            for (int k2 = 0; k2 < this.C; ++k2) {
                if (this.ims[k2] == null) continue;
                byte[] arrby = tt;
                int n = this.ims[k2].p;
                arrby[n] = (byte)(arrby[n] + this.credits[k2]);
                if (tt[this.ims[k2].p] <= this.load[this.ims[k2].p]) continue;
                this.err = this.err + this.professors[this.ims[k2].p] + emsg(1021) + "\n";
                b = false;
            }
        }
        for (int i = 0; i < this.C; ++i) {
            for (int j = 0; j < this.C; ++j) {
                if (i == j || this.ims[i] == null || this.ims[j] == null) continue;
                if (this.isjiao[this.ims[i].s][this.ims[j].s] && (this.ims[i].r == this.ims[j].r || this.ims[i].p == this.ims[j].p)) {
                    this.err = this.err + "(" + emsg(1022) + ") " + this.professors[this.ims[i].p] + " " + this.rooms[this.ims[i].r] + " " + this.slots[this.ims[i].s] + " " + emsg(1023) + " " + this.professors[this.ims[j].p] + " " + this.rooms[this.ims[j].r] + " " + this.slots[this.ims[j].s] + "\n";
                    b = false;
                }
                if (!this.hasexclusion || !this.isjiao[this.ims[i].s][this.ims[j].s] || this.containsb(this.exclusions1, i, this.exclusions, j) != 1 && this.containsb(this.exclusions1, j, this.exclusions, i) != 1) continue;
                this.err = this.err + "(" + emsg(1024) + ")   <b>" + this.sessions[i] + "</b> and <b>" + this.sessions[j] + "</b> " + emsg(1025) + "\n";
                b = false;
            }
        }
        return b;
    }

    Triple next(Triple x, int k) {
        if (x == null) {
            Triple y = new Triple();
            y.p = this.thrProf[k].init();
            y.r = this.thrRoom[k].init();
            y.s = this.thrSlot[k].init();
            if (y.p >= 0 && y.r >= 0 && y.s >= 0) {
                return y;
            }
            return null;
        }
        Triple y = new Triple(x);
        y.s = this.thrSlot[k].next();
        if (y.s >= 0) {
            return y;
        }
        y.s = this.thrSlot[k].init();
        if (y.s < 0) {
            return null;
        }
        y.r = this.thrRoom[k].next();
        if (y.r >= 0) {
            return y;
        }
        y.r = this.thrRoom[k].init();
        if (y.r < 0) {
            return null;
        }
        y.p = this.thrProf[k].next();
        if (y.p >= 0) {
            return y;
        }
        return null;
    }

    void get1(Through[] z, int[] c, int[][] cx, int[] nc, int[][] ncx, int L, int which) {
        String[] names = new String[]{"staff", "room", "time"};
        for (int i = 0; i < this.C; ++i) {
            int x = -1;
            if (which == 0) {
                if (this.hasfix && this.fixed[i].p >= 0) {
                    x = this.fixed[i].p;
                }
            } else if (which == 1) {
                if (this.hasfix && this.fixed[i].r >= 0) {
                    x = this.fixed[i].r;
                }
            } else if (which == 2 && this.hasfix && this.fixed[i].s >= 0) {
                x = this.fixed[i].s;
            }
            int onlyindex = Scheduler.indexOf(c, i);
            int notindex = Scheduler.indexOf(nc, i);
            if (onlyindex >= 0) {
                if (x != -1 && Scheduler.indexOf(cx[onlyindex], x) == -1) {
                    this.err = this.err + emsg(1026) + " " + names[which] + " " + emsg(1027) + " " + this.sessions[i] + "\n";
                }
                notindex = -1;
                z[i] = new Through(L, onlyindex, notindex, cx[onlyindex], null, x, names[which] + i);
            } else {
                z[i] = notindex >= 0 ? new Through(L, onlyindex, notindex, null, ncx[notindex], x, names[which] + i) : new Through(L, onlyindex, notindex, null, null, x, names[which] + i);
            }
            if (notindex < 0 || Scheduler.indexOf(ncx[notindex], x) != 1) continue;
            this.err = this.err + emsg(1026) + " " + names[which] + " " + emsg(1028) + " " + this.sessions[i] + "\n";
        }
    }

    private void get1() {
        this.thrProf = new Through[this.C];
        this.thrRoom = new Through[this.C];
        this.thrSlot = new Through[this.C];
        this.get1(this.thrProf, this.sessionOnlyProfessor1, this.sessionOnlyProfessor, this.sessionNotProfessor1, this.sessionNotProfessor, this.P, 0);
        this.get1(this.thrRoom, this.sessionOnlyRoom1, this.sessionOnlyRoom, this.sessionNotRoom1, this.sessionNotRoom, this.R, 1);
        this.get1(this.thrSlot, this.sessionOnlySlot1, this.sessionOnlySlot, this.sessionNotSlot1, this.sessionNotSlot, this.S, 2);
    }

    public static int indexOf(int[] ar, int t) {
        if (ar == null || ar.length == 0) {
            return -1;
        }
        int a = 0;
        int b = ar.length - 1;
        if (t > ar[b] || t < ar[a]) {
            return -1;
        }
        while (b > a + 1) {
            int m;
            if (ar[m = (a + b) / 2] == t) {
                return m;
            }
            if (ar[m] < t) {
                a = m;
                continue;
            }
            b = m;
        }
        if (ar[a] == t) {
            return a;
        }
        if (ar[b] == t) {
            return b;
        }
        return -1;
    }

    int contains(int[] cr, int i, int[][] cx, int j) {
        int k = Scheduler.indexOf(cr, i);
        if (k == -1) {
            return 0;
        }
        if (cx == null || cx[k] == null) {
            return -1;
        }
        int m = 0;
        for (m = 0; m < cx[k].length && j != cx[k][m]; ++m) {
        }
        return m == cx[k].length ? -1 : 1;
    }

    int containsb(int[] cr, int i, int[][] cx, int j) {
        int k = Scheduler.indexOf(cr, i);
        if (k == -1) {
            return 0;
        }
        if (cx == null || cx[k] == null) {
            return -1;
        }
        return Scheduler.indexOf(cx[k], j) > -1 ? 1 : -1;
    }

    void inittest() {
        int c;
        this.C = 20;
        this.P = 5;
        this.R = 2;
        this.S = 14;
        this.sessions = new String[this.C];
        this.credits = new byte[this.C];
        this.seats = new int[this.C];
        this.roomseats = new int[this.R];
        for (c = 0; c < this.C; ++c) {
            this.sessions[c] = "C" + c;
            this.credits[c] = 3;
            this.seats[c] = 25;
        }
        this.professors = new String[this.P];
        this.load = new byte[this.P];
        for (c = 0; c < this.P; ++c) {
            this.professors[c] = "P" + c;
            this.load[c] = 12;
        }
        this.rooms = new String[this.R];
        for (c = 0; c < this.R; ++c) {
            this.rooms[c] = "R" + c;
            this.roomseats[c] = 30;
        }
        this.slots = new String[this.S];
        for (c = 0; c < this.S; ++c) {
            this.slots[c] = "S" + c;
        }
        this.credits[1] = 2;
        this.credits[2] = 2;
    }

    private boolean addone(Triple after, int k) {
        Triple x = this.next(after, k);
        while (!(x == null || this.isgood(x, k))) {
            x = this.next(x, k);
        }
        if (x == null) {
            return false;
        }
        this.ims[k] = x;
        
        byte[] arrby = this.realload;
        int n = x.p;
        arrby[n] = (byte)(arrby[n] + this.credits[k]);
        if (this.maxk == -1 || this.vk[k] > this.vk[this.maxk] || this.vk[k] == this.vk[this.maxk] && k > this.maxk) 
        {
            this.maxk = k;
            this.copy();
        }
        return true;
    }

    void copy() {
        int k;
        for (k = 0; k < this.C; ++k) {
            this.best[k] = this.ims[k] != null ? new Triple(this.ims[k]) : (this.fixed[k] != null ? new Triple(this.fixed[k]) : null);
        }
        for (k = 0; k < this.P; ++k) {
            this.bestload[k] = this.realload[k];
        }
    }

    long numcombinations(int k) {
        Triple x = null;
        long count = 0;
        boolean numx = false;
        StringBuffer s = new StringBuffer();
        while ((x = this.next(x, k)) != null) 
        {
            boolean b1 = this.roomseats[x.r] >= this.seats[k]; if (!b1) {s.append(showstr(x) + ": room size(" +this.roomseats[x.r] + ") < class size(" +this.seats[k] + ")\n");continue;}
            boolean b2 = this.hours[x.s] == this.credits[k];   if (!b2) {s.append(showstr(x) + ": time len(" +this.hours[x.s] + ")!=class hour(" +this.credits[k] + ")\n");continue;}
            boolean b3 = this.credits[k] <= this.load[x.p];    if (!b3) {s.append(showstr(x) + ": prof load(" +this.load[x.p] + ") < class hour(" + this.credits[k]+ ")\n");continue;}
            boolean b4 = !this.hasgoodtime || this.contains(this.professorOnlySlot1, x.p, this.professorOnlySlot, x.s) != -1 
                                           && this.containsb(this.professorNotSlot1, x.p, this.professorNotSlot, x.s) != 1;
                                                               if (!b4) {s.append(showstr(x) + ": fail prof preferred\n");continue;}
            boolean b5 = !this.hastimeshare || this.contains(this.roomOnlySlot1, x.r, this.roomOnlySlot, x.s) != -1 
                                           && this.containsb(this.roomNotSlot1, x.r, this.roomNotSlot, x.s) != 1;
                                                               if (!b5) {s.append(showstr(x) + ": fail roomtime share\n");continue;}
            ++count;
        }
        if (count == 0) 
        {
            if ((x = this.next(null, k)) == null) 
            {
                this.err = this.err + emsg(1029) + " " + this.sessions[k] + "\n";
            } 
            else 
            {
                this.err += s.toString();
                while ((x = this.next(x, k)) != null) 
                {
                    this.meetOptions(x, k, false);
                }
            }
        }
        
        return count;
    }

    public void gothrough() {
        this.get1();
        this.show(this.sessionOnlyProfessor1, this.sessionOnlyProfessor, this.sessions, this.professors);
        int k = 0;
        Triple x = null;
        while ((x = this.next(x, k)) != null) {
            Toolbox.println(1,x.toString());
        }
    }

    public String items(int k, int j) {
        if (k >= this.C) {
            return "";
        }
        Triple x = this.best[k];
        if (this.maxk == -1 && this.hasfix) {
            x = this.fixed[k];
        }
        if (j == 0) {
            return this.sessions[k];
        }
        if (j == 1) {
            int m;
            if (x == null) {
                return "";
            }
            if ((m = x.p) >= 0) {
                return this.professors[m];
            }
            return "";
        }
        if (j == 2) {
            int m;
            if (x == null) {
                return "";
            }
            if ((m = x.r) >= 0) {
                return this.rooms[m];
            }
            return "";
        }
        if (j == 3) {
            int m;
            if (x == null) {
                return "";
            }
            if ((m = x.s) >= 0) {
                return this.slots[m];
            }
            return "";
        }
        return "";
    }

    private boolean analyze() {
        boolean b = true;
        int tl = this.sum(this.load);
        int tc = this.sum(this.credits);
        if (tl < tc) {
            this.err = this.err + "(" + emsg(1022) + ")" + emsg(1030) + "(" + tc + ") " + emsg(1031) + "(" + tl + "). " + emsg(1032) + ".\n";
            b = false;
        }
        if (this.R * this.S < this.C) {
            this.err = this.err + "(" + emsg(1022) + ") " + this.R + " " + emsg(1033) + " " + this.S + " " + emsg(1034) + " " + this.C + " " + emsg(1035) + ".\n";
            b = false;
        }
        return b;
    }

    private int sum(byte[] ar) {
        if (ar == null || ar.length == 0) {
            return 0;
        }
        int s = 0;
        for (int j = 0; j < ar.length; ++j) {
            s+=ar[j];
        }
        return s;
    }

    private int sum(int[] ar) {
        if (ar == null || ar.length == 0) {
            return 0;
        }
        int s = 0;
        for (int j = 0; j < ar.length; ++j) {
            s+=ar[j];
        }
        return s;
    }
    
    public static final String runscheduling(int orgnum)
    { return Toolbox.emsgs(orgnum,911) + " " + Toolbox.emsgs(orgnum,965);}
    
    public static void  leaveMessage(int orgnum,int tid, Msgboxrun mq, String sek, String ms)
    {
       //if (tid!=-1)
        {
            Msg m= new Msg(tid,  "Scheduler", Toolbox.emsgs(orgnum,1548), sek, "plain", ms, System.currentTimeMillis(), 1);
            mq.dropmsg(m.toString());
        }
    }
    public void printsch() {
        for (int i = 0; i < this.C; ++i) {
            this.print(this.sessions[i] + " " + this.professors[this.ims[i].p] + " " + this.slots[this.ims[i].s] + " " + this.rooms[this.ims[i].r] + "\n");
        }
    }
    int tid = -1;
    int NN=0;
    int k11 = -1;
    public boolean run(Msgboxrun mq, String sek) 
    {
        mq = Msgboxrun.get(sek + "scheduler"); 
        boolean j = false;
        int k = this.firstNull();
        leaveMessage(orgnum, tid,  mq,  sek,  "+"+ k + ", ");
        if (k >= this.C) 
        {
            return true;
        }
        else if (k11!=-1)
            k11 = k;
        Triple x = null; 
        boolean b = false;
        
        while (NN++<20000  && b==false) 
        {
            
            b = this.addone(x, k);
             
           
            if ( b== false) 
            {
                return false;
            }
            x = new Triple(this.ims[k]);
            
            b = this.run(mq,sek);
            
            if ( b == false)
            {
                Triple y = this.next(x, k);
                if (k == k11 && y == null) return false;  
                leaveMessage(orgnum, tid,  mq,  sek,   "-"+ k + ", ");
                byte[] arrby = this.realload;
                int n = x.p;
                arrby[n] = (byte)(arrby[n] - this.credits[k]);
                this.ims[k] = null;
              
            }
        }
        mq.remove();
        return true;
    }

    public Scheduler(String dept, int orgnum) {
        this.dept = dept;
        this.hasdept = !dept.equals("");
        this.orgnum = orgnum;
    }

    void show(int[] x, int[][] y, String[] str1, String[] str2) {
        if (x == null) {
            return;
        }
        for (int i = 0; i < x.length; ++i) {
            int j;
            Toolbox.print(0, " { ");
            for (j = 0; j < y[i].length; ++j) {
                Toolbox.print(0, "" + y[i][j] + ",   ");
            }
            Toolbox.println(0, "  } ");
            Toolbox.print(0, " { ");
            for (j = 0; j < y[i].length; ++j) {
                Toolbox.print(1,str2[y[i][j]] + ",   ");
            }
            Toolbox.println(0, "  } ");
        }
    }

    public int init() {
        this.get1();
        this.show(this.sessionOnlyProfessor1, this.sessionOnlyProfessor, this.sessions, this.professors);
        if (!this.analyze()) {
            return -2;
        }
        this.ims = new Triple[this.C];
        this.best = new Triple[this.C];
        this.bestload = new int[this.P];
        int cc = 0;
        if (this.hasfix) {
            for (int i = 0; i < this.C; ++i) {
                if (this.fixed[i].p == -1 || this.fixed[i].r == -1 || this.fixed[i].s == -1) continue;
                this.ims[i] = new Triple(this.fixed[i]);
                byte[] arrby = this.realload;
                int n = this.ims[i].p;
                arrby[n] = (byte)(arrby[n] + this.credits[i]);
                ++cc;
            }
        }
        this.vk = new long[this.C];
        this.orders = new int[this.C];
        int ans = 0;
        int i = 0;
        while (i < this.C) {
            this.vk[i] = this.numcombinations(i);
            if (this.vk[i] == 0) {
                this.err = this.err + "(Serious) " + this.sessions[i] +  emsg(1490) + "\n";
                ans = -1;
            }
            this.orders[i] = i++;
        }
        for (int p = 1; p < this.C; ++p) {
            for (int j = 0; j < this.C - p; ++j) {
                if (this.vk[this.orders[j]] <= this.vk[this.orders[j + 1]]) continue;
                int tmp = this.orders[j];
                this.orders[j] = this.orders[j + 1];
                this.orders[j + 1] = tmp;
            }
        }
        if (cc == this.C) {
            return 0;
        }
        if (ans == -1) {
            return -1;
        }
        return 1;
    }

    
    public void printerr() {
        this.print(this.err);
    }

    static boolean isdigit(char x) {
        x = (char)(x - 48);
        return x >= '\u0000' && x <= '\t';
    }

    public static int split(String[] xx, int zz) {
        String x = xx[zz];
        String tmpstr = "";
        int i = 0;
        int l = 0;
        do {
            int tmp;
            String cc;
            Scheduler.end[l] = 0;
            Scheduler.start[l] = 0;
            for (; i < x.length() && (x.charAt(i) == ' ' || x.charAt(i) == ',' || x.charAt(i) == ';'); ++i) {
            }
            if (i == x.length()) break;
            int k = i;
            for (; !(i >= x.length() || Scheduler.isdigit(x.charAt(i)) || x.charAt(i) == ' '); ++i) {
            }
            if (i == x.length()) break;
            Scheduler.tian[l] = x.substring(k, i);
            if (Scheduler.tian[l].equals("") && l > 0) {
                Scheduler.tian[l] = Scheduler.tian[l - 1];
            }
            tmpstr = l == 0 ? tmpstr + Scheduler.tian[l] : tmpstr + "," + Scheduler.tian[l];
            for (; i < x.length() && (x.charAt(i) == ' ' || x.charAt(i) == '0'); ++i) {
            }
            k = i;
            for (; i < x.length() && Scheduler.isdigit(x.charAt(i)); ++i) {
            }
            if (i == x.length()) break;
            
            try{
            if ((tmp = Integer.parseInt(x.substring(k, i))) < 8) {
                tmp+=12;
            }
            
            tmp %= 24;
            for (; i < x.length() && x.charAt(i) == ' '; ++i) {
            }
            if (x.charAt(i) == '-' || x.charAt(i) == '~') {
                Scheduler.start[l] = tmp * 60;
                tmpstr = tmp > 9 ? tmpstr + tmp + ":00-" : (tmp != 0 ? tmpstr + "0" + tmp + ":00-" : tmpstr + "00:00-");
            } else {
                if (x.charAt(i) != ':') break;
                ++i;
                for (; i < x.length() && x.charAt(i) == ' '; ++i) {
                }
                k = i;
                for (; i < x.length() && Scheduler.isdigit(x.charAt(i)); ++i) {
                }
                if (k == i) {
                    Scheduler.start[l] = tmp * 60;
                    tmpstr = tmpstr + tmp + ":00-";
                } else {
                    cc = x.substring(k, i);
                    if (i > k + 2) {
                        cc = cc.substring(0, 2);
                    }
                    Scheduler.start[l] = tmp * 60 + Integer.parseInt(cc);
                    if (i == k + 1) {
                        cc = "0" + cc;
                    }
                    tmpstr = tmpstr + tmp + ":" + cc + "-";
                }
                for (; i < x.length() && x.charAt(i) != '-' && x.charAt(i) != '~'; ++i) {
                }
            }
            }catch(Exception e){Toolbox.println(1,x.substring(k, i)  + " is not  digit");}
            for (; !(i >= x.length() || Scheduler.isdigit(x.charAt(i)) && x.charAt(i) != '0'); ++i) {
            }
            k = i;
            for (; i < x.length() && Scheduler.isdigit(x.charAt(i)); ++i) {
            }
            if (i == k) break;
            try{
            tmp = Integer.parseInt(x.substring(k, i));
            tmpstr = tmpstr + (tmp%=24);
            if (i < x.length() && x.charAt(i) == ':') {
                k = ++i;
                for (; i < x.length() && Scheduler.isdigit(x.charAt(i)); ++i) {
                }
                if (k < i) {
                    cc = x.substring(k, i);
                    if (i > 2 + k) {
                        cc = cc.substring(0, 2);
                    }
                    int kk = Integer.parseInt(cc);
                    Scheduler.end[l] = tmp * 60 + kk;
                    tmpstr = kk < 10 && k + 2 < i ? tmpstr + ":0" + x.substring(k, i) + "" : tmpstr + ":" + cc + "";
                } else {
                    Scheduler.end[l] = tmp * 60;
                    tmpstr = tmpstr + tmp + ":00";
                }
            } else {
                Scheduler.end[l] = tmp * 60;
                tmpstr = tmpstr + ":00";
            }
            }catch(Exception e){Toolbox.println(1,x.substring(k, i)  + " is not  digit");}
            tmpstr = tmpstr.replaceAll(":000+", ":00");
            ++l;
        } while (true);
        xx[zz] = tmpstr;
        return l;
    }

    boolean jiao(String a, String b) {
        if (a != null && b != null) {
            for (int i = 0; i < a.length(); ++i) {
                for (int j = 0; j < b.length(); ++j) {
                    if (a.charAt(i) != b.charAt(j)) continue;
                    return true;
                }
            }
        }
        return false;
    }

    boolean isjiao1(String[] x) {
        int l2;
        String a = x[0];
        String b = x[1];
        int l1 = Scheduler.split(x, 0);
        String[] tian1 = new String[20];
        int[] start1 = new int[20];
        int[] end1 = new int[20];
        for (int i = 0; i < l1; ++i) {
            tian1[i] = Scheduler.tian[i];
            start1[i] = Scheduler.start[i];
            end1[i] = Scheduler.end[i];
        }
        if (l1 == 0 || (l2 = Scheduler.split(x, 1)) == 0) {
            return a.equals(b);
        }
        for (int i2 = 0; i2 < l1; ++i2) {
            for (int j = 0; j < l2; ++j) {
                if (!this.jiao(Scheduler.tian[i2], tian1[j]) || (start1[j] > Scheduler.start[i2] || Scheduler.start[i2] >= end1[j]) && (Scheduler.start[i2] > start1[j] || start1[j] >= Scheduler.end[i2])) continue;
                return true;
            }
        }
        return false;
    }

    int[][] read(String sql, JDBCAdapter adapter, HashMap map1, HashMap map2) {
        int n = adapter.executeQuery(sql);
        if (n < 0) {
            this.err = this.err + "\n" + emsg(1489) + ":" +  sql;
            adapter.close();
            return null;
        }
        if (n == 0) {
            return null;
        }
        int m = 0;
        String old = "";
        for (int i = 0; i < n; ++i) 
        {
            String numstr = adapter.getValueAt(i, 0);
            if (map1.get(numstr) == null) continue;
            if (!numstr.equals(old)) 
            {
                ++m;
            }
            old = numstr;
        }
        if (m == 0) {
            return null;
        }
        this.transfer = new int[m];
        int[][] nnq = new int[m][];
        int oldindex = -1;
        int num1 = 0;
        int k = 0;
        StringBuffer v = new StringBuffer(100);
        try {
            for (int i2 = 0; i2 < n; ++i2) {
                Object x;
                if ((x = map1.get(adapter.getValueAt(i2, 0))) == null) continue;
                if ((num1 = ((Integer)x).intValue()) != oldindex && oldindex != -1) {
                    String[] tt = v.toString().split(",");
                    this.transfer[k] = oldindex;
                    nnq[k] = new int[tt.length];
                    for (int j = 0; j < tt.length; ++j) {
                        nnq[k][j] = Integer.parseInt(tt[j]);
                    }
                    v.setLength(0);
                    ++k;
                }
                oldindex = num1;
                if ((x = map2.get(adapter.getValueAt(i2, 1))) == null) continue;
                int num2 = (Integer)x;
                if (v.length() == 0) {
                    v.append(num2);
                    continue;
                }
                v.append("," + num2);
            }
            String[] tt = v.toString().split(",");
            this.transfer[k] = oldindex;
            nnq[k] = new int[tt.length];
            for (int j = 0; j < tt.length; ++j) {
                nnq[k][j] = Integer.parseInt(tt[j]);
            }
        }
        catch (Exception e) {
            // empty catch block
        }
        return nnq;
    }

    private int fixedv(JDBCAdapter adapter, int i, int j, HashMap map) {
        Object tt;
        String str = adapter.getValueAt(i, j);
        if (str == null || str.trim().equals("")) {
            return -1;
        }
        if ((tt = map.get(str)) == null) {
            return -1;
        }
        Integer t = (Integer)tt;
        return t;
    }

    

    boolean checkmono1(int[] x) {
        if (x == null || x.length < 3) {
            return true;
        }
        for (int i = 0; i < x.length - 2; ++i) {
            if ((x[i] <= x[i + 1] || x[i + 1] >= x[i + 2]) && (x[i] >= x[i + 1] || x[i + 1] <= x[i + 2])) continue;
            return false;
        }
        return true;
    }

    boolean checkmono(int[][] x) {
        if (x == null) {
            return true;
        }
        for (int i = 0; i < x.length; ++i) {
            if (this.checkmono1(x[i])) continue;
            return false;
        }
        return true;
    }

    public void save(JDBCAdapter adapter) {
        for (int i = 0; i < this.C; ++i) {
            String sql;
            if (adapter.executeUpdate(Webform.mysql2c(adapter.dbms, sql = "Update Session SET schedule='" + this.slotnums[this.ims[i].s] + "', instructor='" + this.professorids[this.ims[i].p] + "',room='" + this.roomnums[this.ims[i].r] + "' WHERE semester='" + this.semester + "' AND CONCAT(courseid , '-' , name) ='" + this.sessionnums[i] + "'")) == 1) continue;
            this.err = this.err + adapter.error();
        }
    }

    public void save1(JDBCAdapter adapter) {
        int i;
        String deptstr = "";
        if (this.hasdept) {
            deptstr = " AND  dept='" + this.dept + "' ";
        }
        String sql = "DELETE FROM Scheduler  WHERE  Scheduler.semester=" + this.semester + " AND (which='i' OR which='j' OR which='k')" + deptstr;
        long ll = new Date().getTime() / 1000;
        if (adapter.executeUpdate(sql) < 0) {
            this.err = this.err + adapter.error();
        }
        for (i = 0; i < this.P; ++i) {
            adapter.executeUpdate("Update Schuser SET realload=0 WHERE  id='" + this.professorids[i] + "' AND semester=" + this.semester + deptstr);
        }
        for (i = 0; i < this.C; ++i) {
            Triple x = this.best[i];
            int m = 0;
            if (x == null) continue;
            if (x.p >= 0) {
                if ((m = adapter.executeUpdate(sql = "Update Schuser SET realload=" + this.bestload[x.p] + " WHERE id='" + this.professorids[x.p] + "' AND semester=" + this.semester + deptstr)) == 1) {
                    this.err = this.err + adapter.error();
                }
                if (this.hasdept && (m = adapter.executeUpdate(sql = "INSERT INTO Scheduler(lastupdate, num1, num2, preference,which,dept,semester) VALUES (" + ll + ",'" + this.sessionnums[i] + "','" + this.professorids[x.p] + "',1,'i','" + this.dept + "'," + this.semester + ")")) != 1) {
                    this.err = this.err + adapter.error();
                }
            }
            if (x.r >= 0 && this.hasdept && (m = adapter.executeUpdate(sql = "INSERT INTO Scheduler(lastupdate, num1, num2, preference,which,dept,semester) VALUES (" + ll + ",'" + this.sessionnums[i] + "','" + this.roomnums[x.r] + "'," + this.seats[i] + ",'j','" + this.dept + "'," + this.semester + ")")) != 1) {
                this.err = this.err + adapter.error();
            }
            if (x.s < 0 || !this.hasdept || adapter.executeUpdate(sql = "INSERT INTO Scheduler(lastupdate, num1, num2, preference,which,dept,semester) VALUES (" + ll + ",'" + this.sessionnums[i] + "','" + this.slotnums[x.s] + "',1,'k','" + this.dept + "'," + this.semester + ")") == 1) continue;
            this.err = this.err + adapter.error();
        }
    }

    public static void main(String[] args) {
        Scheduler s = new Scheduler("10", 0);
        JDBCAdapter adapter = new JDBCAdapter("jdbc:mysql://localhost:3306/test", "com.mysql.jdbc.Driver", "root", "tomcat", System.out, 0);
        if (s.initfromdb("20", "Fall 2013", true, false, false, false, true, adapter)) {
            s.init();
            if (s.verify()) {
                s.printerr();
            }
        }
    }

    public static void main3(String[] args) {
        String[] x = new String[]{"MWF12:-13#", "TR09-10:45,F15:00-16:15"};
        int l = Scheduler.split(x, 0);
    }

    public static void main1(String[] args) {
        Scheduler s = new Scheduler("11",0);
        JDBCAdapter adapter = new JDBCAdapter("jdbc:mysql://localhost:3306/test", "com.mysql.jdbc.Driver", "root", "tomcat", System.out,0);
        if (s.initfromdb("20", "Fall 2013", true, false, false, false, true, adapter)) {
            s.gothrough();
        }
        adapter.close();
    }

    public String error() {
        return this.err;
    }

    public void print(int[][] z) {
        if (z == null) {
            return;
        }
        for (int i = 0; i < z.length; ++i) {
            if (z[i] == null) continue;
            for (int j = 0; j < z[i].length; ++j) {
                Toolbox.print(1,"" + z[i][j] + "  ");
            }
        }
    }

    public void print(int[] z) {
        if (z == null) {
            Toolbox.println(1,"{ NUll array }");
            return;
        }
        Toolbox.print(1,"{ ");
        for (int i = 0; i < z.length; ++i) {
            Toolbox.print(1,"" + z[i] + ",  ");
        }
        Toolbox.println(1," }");
    }

    private int[] copyarray(int[] x) {
        if (x == null) {
            return null;
        }
        int[] y = new int[x.length];
        for (int i = 0; i < x.length; ++i) {
            y[i] = x[i];
        }
        return y;
    }
}
