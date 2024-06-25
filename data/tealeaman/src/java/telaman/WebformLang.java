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
public class WebformLang {
    public String fieldlabels,ctypes,orders,title,help,keywords,defaultv;
    public WebformLang(String fieldlabels,String ctypes,String orders,String title,String help,String keywords,String defaultv)
    {
       this.fieldlabels = fieldlabels;this.ctypes = ctypes; this.orders=orders; this.title=title; 
       this.help =help; this.keywords = keywords; this.defaultv = defaultv;
    }
    public String toString()
    {
        return fieldlabels + "   " + title;
    }
}
