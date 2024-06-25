/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package telaman;

/**
 *
 * @author Zhongyan Lin
 */
public class Submission 
{
    public String assess;  //csv
    public String receipt =""; //html
    public String text = "";    //pure
    public float score = 0;    //raw 
  
    public float curved = -1;   //after formula
    public String leas= "0";     //number of seconds leaving
    public String content;
    public boolean testing;
    public boolean embedquiz;
    public String error= ""; 
    public int orgnum = Toolbox.langnum<<16;
    public String sol = "";
    public Submission(String assess, String content, String leas, boolean testing, boolean embedquiz, int orgnum)
    {
        this.assess = assess;
        this.content = content;
        this.testing = testing;
        this.embedquiz = embedquiz;
        this.leas = leas;
        this.orgnum = orgnum;
    }
}
