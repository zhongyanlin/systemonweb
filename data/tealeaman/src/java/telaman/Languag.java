/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package telaman;

/**
 *
 * @author zhong
 */
public class Languag {
    public String langcode = "en";
    public String encoding = "utf-8";
    public String langname = "English";
    public String worddelimiter = "";
    public int charsize = 1;
    public boolean hasjs = false;
    public boolean hasmsg = false;
    public boolean hasfront = false;
    public boolean hasinstru = false; 
    public boolean hasform = false;
    public String timeformat = "MM/DD/YYYY hh:mm";
    public Languag(String [] x)
    {
        if (x != null) 
        {
        langcode = x[0].trim();
        if (x.length> 1)
           encoding = x[1].trim();
        if (x.length> 2)
           langname = x[2].trim();
        if (x.length> 3)
           charsize = Integer.parseInt(x[3].trim());
        if (x.length> 4)
           worddelimiter = x[4];
        if (worddelimiter==null) worddelimiter = "";
        }
    }
    public String toString()
    {
        return langcode + "," + encoding + "," + langname + "," + charsize + ",\"" + worddelimiter + "\","
                + hasjs + "," + hasmsg + "," + hasfront + "," + hasinstru + "," + hasform + "," + timeformat;
    }
}
