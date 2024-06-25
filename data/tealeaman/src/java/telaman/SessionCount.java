/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package telaman;

import javax.servlet.http.*;
import java.util.*;
        
public class SessionCount  implements HttpSessionListener 
{
    private static Vector<String> sessions = new Vector<>();
    public static int c = 0;
    synchronized public static int enq(String sid) 
    {
        if (sid == null) return -1;
        for (int i=0; i < sessions.size(); i++)
        {
            if (sessions.elementAt(i)!=null && sessions.elementAt(i).equals(sid)) 
                return i;
        }
        for (int i=0; i < sessions.size(); i++)
        {
            if (sessions.elementAt(i)==null) 
            {
               sessions.setElementAt(sid, i);
               return i;
            }
        }
        int i = sessions.size();
        sessions.addElement(sid);
        return i;
    }
    synchronized static int deq(String sid) 
    {
        if (sid == null ) return -1;
        for (int i=0; i < sessions.size(); i++)
        {
            if (sessions.elementAt(i)!=null && sessions.elementAt(i).equals(sid)) 
            {
                if (i < sessions.size() - 1)
                    sessions.setElementAt(null,i);
                else
                    sessions.remove(i);
                return i;
            }
        }
        return -1;
    }
  @Override
  public void sessionCreated(HttpSessionEvent ev) 
  {
	 c++;
  }

  @Override
  public void sessionDestroyed(HttpSessionEvent ev) 
  {  
    HttpSession s = ev.getSession();
    String ss = s.getId();
    User user = (User)(s.getAttribute("User"));
    int j = deq(ss);
    if (user!=null)
    {
       int orgnum = user.orgnum;
       s.removeAttribute("User");
	   if (j>-1 &&user!=null) 
           Msghold.expire(orgnum,ss);
       c--;
    }
  }	
}
