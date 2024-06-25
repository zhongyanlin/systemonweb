/*
 * Decompiled with CFR 0_87.
 */
package telaman;

class LogicalExp {
   
    
    public static boolean eval1(String exp) {
        char v = ' ';
        boolean startpar = true;
        int n = exp.length();
        char[] literal = new char[n];
        StringBuffer output = new StringBuffer(n);
        int top = -1;
        if (exp == null || exp.length() == 0) {
            return false;
        }
        block11 : for (int i = 0; i < n; ++i) {
            v = exp.charAt(i);
            switch (v) {
                case '{': {
                    literal[++top] = v;
                    startpar = true;
                    continue block11;
                }
                case '}': {
                    while (top >= 0 && literal[top] != '{') {
                        output.append(literal[top--]);
                    }
                    if (top == -1) {
                        return false;
                    }
                    if (--top >= 0 && literal[top] == '!') {
                        output.append(literal[top--]);
                    }
                    startpar = false;
                    continue block11;
                }
                case '!': {
                    literal[++top] = v;
                    startpar = false;
                    continue block11;
                }
                case '&': 
                case '|': {
                    int k = LogicalExp.precedence(v);
                    while (top >= 0 && literal[top] != '{' && LogicalExp.precedence(literal[top]) >= k) {
                        output.append(literal[top--]);
                    }
                    literal[++top] = v;
                    startpar = false;
                    continue block11;
                }
                default: {
                    output.append(v);
                    startpar = false;
                }
            }
        }
        while (top >= 0 && literal[top] != '{') {
            output.append(literal[top--]);
        }
        if (top != -1) {
            return false;
        }
        boolean[] middle = new boolean[n];
        exp = output.toString();
        n = exp.length();
        block15 : for (int i2 = 0; i2 < n; ++i2) {
            v = exp.charAt(i2);
            switch (v) {
                case '&': {
                    boolean[] arrbl = middle;
                    int n2 = top - 1;
                    arrbl[n2] = arrbl[n2] & middle[top--];
                    continue block15;
                }
                case '|': {
                    boolean[] arrbl = middle;
                    int n3 = top - 1;
                    arrbl[n3] = arrbl[n3] | middle[top--];
                    continue block15;
                }
                case '!': {
                    middle[top] = !middle[top];
                    continue block15;
                }
                default: {
                    middle[++top] = v == '1';
                }
            }
        }
        return middle[0];
    }
    public static boolean eval(String exp) {
        int k;
        int m = exp.indexOf("{");
        if (m == -1) {
            return LogicalExp.evaln(exp);
        }
        int l = 1;
        for (k = m + 1; k < exp.length() && l > 0; ++k) {
            if (exp.charAt(k) == '{') {
                ++l;
                continue;
            }
            if (exp.charAt(k) != '}') continue;
            --l;
        }
        String tt = exp.substring(m + 1);
        if (l == 0) {
            tt = exp.substring(m + 1, k - 1);
        }
        boolean b = LogicalExp.eval(tt);
        tt = "";
        if (m > 0) {
            tt = exp.substring(0, m);
        }
        tt = b ? tt + "1" : tt + "0";
        if (k < exp.length()) {
            tt = tt + exp.substring(k);
        }
        return LogicalExp.eval(tt);
    }

    LogicalExp() {}
     
    public static boolean evaln(String exp) {
        exp = exp.replaceAll(" ", "");
        exp = exp.replaceAll("!1", "0").replaceAll("!0", "1");
        exp = exp.replaceAll("1#1", "1").replaceAll("0#1", "0").replaceAll("1#0", "0").replaceAll("0#0", "0");
        exp = exp.replaceAll("1#1", "1").replaceAll("0#1", "0").replaceAll("1#0", "0").replaceAll("0#0", "0");
        return exp.indexOf("1") >= 0;
    }

    private static int precedence(char a) {
        switch (a) {
            case '|': {
                return 1;
            }
            case '&': {
                return 2;
            }
            case '{': 
            case '}': {
                return 4;
            }
        }
        return 3;
    }

}
