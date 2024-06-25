 
package telaman;

import java.util.Stack;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import telaman.Toolbox;

class SyntaxFormat {
    public static final String[] kw1 = new String[]{"asm", "auto", "break", "case", "catch", "char", "class", "const", "const_cast", "continue", "default", "delete", "do", "double", "dynamic_cast", "else", "enum", "explicit", "export", "extern", "false", "float", "for", "friend", "goto", "if", "inline", "int", "long", "mutable", "namespace", "new", "operator", "private", "protected", "public", "register", "reinterpret_cast", "return", "short", "signed", "sizeof", "static", "static_cast", "struct", "switch", "template", "this", "throw", "true", "try", "typedef", "typeid", "typename", "union", "unsigned", "using", "virtual", "void", "volatile", "wchar_t", "while"};
    public static final String[] kw2 = new String[]{"abstract", "boolean", "break", "byte", "case", "catch", "char", "class", "const", "continue", "default", "do", "double", "else", "extends", "final", "finally", "float", "for", "goto", "if", "implements", "int", "import", "instanceof", "long", "interface", "native", "new", "null", "package", "private", "protected", "public", "return", "short", "static", "super", "switch", "synchronized", "this", "throw", "throws", "try", "transient", "volatile", "void", "while"};
    public static final String[] kw3 = new String[]{"Array", "break", "case", "catch", "continue", "default", "do", "else", "for", "function", "goto", "if", "new", "null", "return", "switch", "this", "String", "Date", "throw", "throws", "try", "var", "while"};
    public static final String[] kw4 = new String[]{"#include", "#if", "#else", "#ifdef", "#ifndef", "#else if", "#endif", "#pragma"};
    private static final Pattern p1 = Pattern.compile("^( )+");
    private static final Pattern p2 = Pattern.compile("=\\s+=");
    private static final Pattern p3 = Pattern.compile("&gt;\\s+&gt;");
    private static final Pattern p4 = Pattern.compile("&lt;\\s+&lt;");
    private static final Pattern p5 = Pattern.compile("(\\S?)\\s+,\\b*(\\S?)");
    char braceleft = 240;
    char braceright = 241;
    String prime = "\u00f2";
    String dprime = "\u00f3";
    int ns = 4;
    String[] leftd = new String[]{"//", "/*", "\"", "'", "#include"};
    String[] rightd = new String[]{"\n", "*/", "\"", "'", "\n"};
    String[] colors = new String[]{"green", "green", "red", "#FF00CC", "#FF9900"};
    String option = "";
    public String content = "";
    private static final String c = "\u00ef";
    private static final Pattern cr = Pattern.compile("(\\s*\\S+.*)\\{");
    private static final Pattern bs = Pattern.compile("(\\s*\\S+.*)\\}");
    private static final Pattern nl = Pattern.compile("(\\s*\\S+.*)\u00ef");
    private static final Pattern qu = Pattern.compile("\\{(\\s*\\S+.*)");
    private static final Pattern ss = Pattern.compile("\\}(\\s*\\S+.*)");
    private static final Pattern se = Pattern.compile("\u00ef(\\s*\\S+.*)");
    public StringBuffer lines = new StringBuffer();

    public SyntaxFormat(String ct, String lg, User user) {
        this.content = ct;
        this.option = lg;
        this.user = user;
    }
    User user;
    private String keywords(String str1) {
        str1 = SyntaxFormat.p1.matcher((CharSequence)str1).replaceAll("");
        str1 = SyntaxFormat.p2.matcher((CharSequence)str1).replaceAll("==");
        str1 = SyntaxFormat.p3.matcher((CharSequence)str1).replaceAll("&gt;&gt;");
        str1 = SyntaxFormat.p4.matcher((CharSequence)str1).replaceAll("&lt;&lt;");
        str1 = SyntaxFormat.p5.matcher((CharSequence)str1).replaceAll("$1, $2");
        if (this.option.equals("cpp")) {
            int i;
            for (i = 0; i < SyntaxFormat.kw4.length; ++i) {
                str1 = str1.replaceAll(SyntaxFormat.kw4[i], "<font color=#FF9900>" + SyntaxFormat.kw4[i] + "</font>");
            }
            for (i = 0; i < SyntaxFormat.kw1.length; ++i) {
                String boldword = "<b>" + SyntaxFormat.kw1[i] + "</b>";
                str1 = str1.replaceAll("(\\W+?)" + SyntaxFormat.kw1[i] + "(\\W+?)", "$1" + boldword + "$2");
                str1 = str1.replaceFirst("^" + SyntaxFormat.kw1[i] + "(\\W+?)", boldword + "$1");
                str1 = str1.replaceFirst("(\\W+?)" + SyntaxFormat.kw1[i] + "$", "$1" + boldword);
            }
        } else if (this.option.equals("java")) {
            for (int i = 0; i < SyntaxFormat.kw2.length; ++i) {
                String boldword = "<b>" + SyntaxFormat.kw2[i] + "</b>";
                str1 = str1.replaceAll("(\\s+?)" + SyntaxFormat.kw2[i] + "(\\s+?)", "$1" + boldword + "$2");
                str1 = str1.replaceFirst("^" + SyntaxFormat.kw2[i] + "(\\s+?)", boldword + "$1");
                str1 = str1.replaceFirst("(\\s+?)" + SyntaxFormat.kw2[i] + "$", "$1" + boldword);
            }
        } else if (this.option.equals("js")) {
            for (int i = 0; i < SyntaxFormat.kw3.length; ++i) {
                String boldword = "<b>" + SyntaxFormat.kw3[i] + "</b>";
                str1 = str1.replaceAll("(\\s+?)" + SyntaxFormat.kw3[i] + "(\\s+?)", "$1" + boldword + "$2");
                str1 = str1.replaceFirst("^" + SyntaxFormat.kw3[i] + "(\\s+?)", boldword + "$1");
                str1 = str1.replaceFirst("(\\s+?)" + SyntaxFormat.kw3[i] + "$", "$1" + boldword);
            }
        }
        return str1;
    }

    String comments(String s, int n) {
        if (n == 2) {
            s = s.replaceAll(this.dprime, "\\\\\"");
        } else if (n == 3) {
            s = s.replaceAll(this.prime, "\\\\'");
        }
        s = n < 3 ? s.replaceAll(" ", "&nbsp;") : s.replaceAll("^[ ]+", "");
        s = s.replace('{', this.braceleft);
        s = s.replace('}', this.braceright);
        return "<font color=" + this.colors[n] + ">" + s + "</font>";
    }

    String indent(int n) {
        String str = "";
        for (int j = 0; j < n; ++j) {
            str = str + "&nbsp;";
        }
        return str;
    }

    public void highlihgt() {
        int l = 0;
        StringBuffer htext = new StringBuffer();
        int min = 0;
        this.content = this.content.replaceAll("\\\\'", this.prime);
        this.content = this.content.replaceAll("\\\\\"", this.dprime);
        this.content = this.content.replaceAll("<", "&lt;");
        this.content = this.content.replaceAll(">", "&gt;");
        int[] ind = new int[]{-2, -2, -2, -2, -2};
        int k = 0;
        do {
            int ii;
            String sstr;
            k = 0;
            if (ind[0] < l && ind[0] != -1) {
                ind[0] = this.content.indexOf(this.leftd[0], l);
            }
            min = ind[0];
            for (int i = 1; i < this.ns; ++i) {
                if (ind[i] < l && ind[i] != -1) {
                    ind[i] = this.content.indexOf(this.leftd[i], l);
                }
                if ((ii = ind[i]) < 0 || min != -1 && ii >= min) continue;
                k = i;
                min = ii;
            }
            if (min == -1) {
                htext.append(this.keywords(this.content.substring(l)));
                l = -1;
            } else if (min > l) {
                htext.append(this.keywords(this.content.substring(l, min)));
            }
            if (min <= -1) continue;
            if ((ii = this.content.indexOf(this.rightd[k], min + 1)) >= 0) {
                sstr = this.content.substring(min, ii + this.rightd[k].length());
                l = ii + this.rightd[k].length();
            } else {
                sstr = this.content.substring(min);
                l = -1;
            }
            htext.append(this.comments(sstr, k));
        } while (l > 0);
        this.content = htext.toString();
    }

    public void lineprocess() {
        String c = "\u00ef";
        String[] tt = this.content.split("\n");
        StringBuffer str = new StringBuffer();
        for (int i = 0; i < tt.length; ++i) {
            String s = (tt[i] + "\n").replaceFirst("\\}\\s*;", c);
            s = SyntaxFormat.cr.matcher((CharSequence)s).replaceAll("$1\n{");
            s = SyntaxFormat.bs.matcher((CharSequence)s).replaceAll("$1\n}");
            s = SyntaxFormat.nl.matcher((CharSequence)s).replaceAll("$1\n" + c);
            s = SyntaxFormat.qu.matcher((CharSequence)s).replaceAll("{\n$1");
            s = SyntaxFormat.ss.matcher((CharSequence)s).replaceAll("}\n$1");
            s = SyntaxFormat.se.matcher((CharSequence)s).replaceAll(c + "\n$1");
            s = s.replaceFirst(c, "\\};");
            str.append(s);
        }
        this.content = str.toString();
    }

    String trim(String s) {
        s = s.replaceFirst("^\\s+", "");
        s = s.replaceFirst("\\s+$", "");
        return s;
    }

    public void format() {
        int n = 0;
        int tab = 3;
        this.lines.setLength(0);
        String prev = "";
        Stack<Integer> array = new Stack<Integer>();
        boolean needindent = false;
        boolean lastindent = false;
        boolean caseindent = false;
        String[] tt = this.content.split("\n");
        StringBuffer str = new StringBuffer();
        for (int i = 0; i < tt.length; ++i) {
            String s;
            if ((s = this.trim(tt[i])).indexOf("{") == 0) {
                str.append(this.indent(n));
                array.push(new Integer(n));
                n+=tab;
                needindent = false;
            } else if (s.indexOf("}") == 0) {
                if (array.empty()) {
                    str.append("<font color =red > <h3>Fatal Error: Extra brace }. Parsor stops.</h3></font><br> ");
                    break;
                }
                n = (Integer)array.pop();
                str.append(this.indent(n));
                caseindent = false;
                needindent = false;
            } else {
                if (!(prev.equals("") && s.equals(""))) {
                    str.append(this.indent(n));
                }
                if (needindent) {
                    str.append(this.indent(tab));
                    if (Pattern.matches(".*<b>(if|else|for|while|do|switch)</b>.*", (CharSequence)s)) {
                        n+=tab;
                    }
                }
                needindent = Pattern.matches(".*<b>(if|else|for|while|do)</b>.*", (CharSequence)s);
                if (caseindent) {
                    if (!Pattern.matches(".*<b>(case|default)</b>.*", (CharSequence)s)) {
                        str.append(this.indent(tab));
                    }
                }
                if (s.indexOf("<b>switch</b>") >= 0) {
                    caseindent = false;
                }
                s = s.replace(this.braceleft, '{');
                s = s.replace(this.braceright, '}');
            }
            if (!(prev.equals("") && s.equals(""))) {
                str.append("<nobr>" + s + "</nobr><br>\n");
                this.lines.append("" + (i + 1) + "<br>\n");
            }
            prev = s;
        }
        if (n != 0) {
            str.append("<font color =red > <h3>" + Toolbox.emsg(847) + "  </h3></font><br>");
        }
        this.content = str.toString();
    }
}
