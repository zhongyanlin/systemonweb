/************************************************************************** 
* (C) Copyright 2004-2014 by Systems on Web, Inc.  All Rights Reserved.  *
* Author: Zhongyan Lin                                                   *
**************************************************************************/



var  apthead = 
"import java.applet.Applet;\n"
+"import java.awt.*;\n"
+"public class MyProg";

function apt(fontw)
{
return " extends Applet\n"
+"{"
+"public void paint(Graphics g)\n"
+"{\n" 
+"this.g = g;\n"
+"Font ft = \nnew Font(\"monospaced\", Font.BOLD, " + fontw +");\n"
+"g.setFont(ft);\n";
}

 
 
function aptp(x,y)
{
return   "\n}\n"
+"int x = 0, y = " + y +";\n" 
+"final int FONTWIDTH=" + x +";\n"
+"final int FONTHEIGHT=" + y +";\n"
+"Graphics g = null;\n"

+"private void print(String s)\n"
+"{\n"
+"   g.drawString(s,x,y);\n"
+"   x += FONTWIDTH*s.length();\n"
+"}\n"
+"\n"
+"private void println(String s)\n"
+"{\n"
+"   g.drawString(s,x,y);\n"
+"   x=0;y += FONTHEIGHT;\n"
+"}\n"
+"private void print(double x){print(String.valueOf(x));}\n"
+"private void println(double x){println(String.valueOf(x));}\n"
+"private void print(int x){print(String.valueOf(x));}\n"
+"private void println(int x){println(String.valueOf(x));}\n"
+"private void print(char x){print(String.valueOf(x));}\n"
+"private void println(char x){println(String.valueOf(x));}\n"
+"private void print(long x){print(String.valueOf(x));}\n"
+"private void println(long x){println(String.valueOf(x));}\n"
+"private void print(byte x){print(String.valueOf(x));}\n"
+"private void println(byte x){println(String.valueOf(x));}\n"
+"}\n";
}
 

function appletexe(codes)
{
  var nav3 = window.open("Javac3?isapplet=yes&content=" + encodeComponent(codes),'_blank');
  nav3.focus();
}