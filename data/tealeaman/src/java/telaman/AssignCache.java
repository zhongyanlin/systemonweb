 
package telaman;

/**
 *
 * @author User
 */
public class AssignCache 
{
    public String name,due,question,format,atype,answer, start,status,
                  courseTitle,options,assess,attach,timesplit,
                  latepermit,scale,weight,grader,sids,sessions,toolstr,keystr;
    public AssignCache(){}
    public AssignCache(JDBCAdapter a)
    { 
        name = a.getValueAt(0, 0);
        due = a.getValueAt(0, 1);
        question = a.getValueAt(0, 2);
        format = a.getValueAt(0, 3);
        atype = a.getValueAt(0, 4);
        answer = a.getValueAt(0, 5);
        start = a.getValueAt(0, 6);
        status = a.getValueAt(0, 7);
        courseTitle = a.getValueAt(0, 8);
        options = a.getValueAt(0, 9);
        assess = a.getValueAt(0, 10);
        attach = a.getValueAt(0, 11);
        timesplit = a.getValueAt(0, 12);
        latepermit = a.getValueAt(0, 13);
        scale = a.getValueAt(0, 14);
        weight = a.getValueAt(0, 15);
        grader = a.getValueAt(0, 16);
        sessions = a.getValueAt(0, 17);
        sids = ";";
        toolstr = "";
        keystr = "";
    } 
    public String toString(){return  this.courseTitle + ", " + this.sessions + ", " + this.sids;}
}
