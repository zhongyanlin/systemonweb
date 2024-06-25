 
package telaman;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.util.Date;
import javax.servlet.ServletOutputStream;
import telaman.JDBCAdapter;
import telaman.Toolbox;

class CellHandle {
    ServletOutputStream out;
    JDBCAdapter adapter;
    String[] querys = null;
    String[] subquerys = null;
    String[] fields = null;
    int subNum;
    String userid;
    String[] subfields = null;
    char[] subtypes = null;
    boolean[] appears = null;
    int numCols;
    boolean hasmore = false;
    int filledrow = 0;

    public void setRowNum(int k) {
        for (int m = 0; m < this.querys.length - 1; ++m) {
            String s = this.querys[m + 1];
            boolean sq = false;
            int state = 0;
            int N = s.length();
            String field = "";
            String field1 = null;
            StringBuffer ans = new StringBuffer(N);
            for (int i = 0; i < N; ++i) {
                if (s.charAt(i) == '#') {
                    if (state == 3) {
                        if (field.equals("")) {
                            field1 = "####";
                        } else if (field.matches("[0-9]+")) {
                            field1 = "##" + field + "##";
                        } else if (field.equals("CURRENT_TIME")) {
                            field1 = "" + (new Date().getTime() / 1000);
                        } else {
                            int j;
                            for (j = this.fields.length - 1; !(j < 0 || field.equals(this.fields[j])); --j) {
                            }
                            field1 = j >= 0 ? this.adapter.getValueAt(k, j) : "##" + field + "##";
                        }
                        if (sq) {
                            field1 = field1.replaceAll("'", "''");
                        }
                        ans.append(field1);
                        field = "";
                    }
                    if ((state = (state + 1) % 4) != 2 || i < 2) continue;
                    sq = s.charAt(i - 2) == '\'';
                    continue;
                }
                if (state == 1) {
                    state = 0;
                    ans.append("#" + s.charAt(i));
                    continue;
                }
                if (state == 0) {
                    ans.append(s.charAt(i));
                    continue;
                }
                if (state == 2) {
                    field = field + s.charAt(i);
                    continue;
                }
                if (state != 3) continue;
                ans.append("##" + field + "#" + s.charAt(i));
                field = "";
                state = 0;
            }
            if (state == 1) {
                ans.append("#");
            } else if (state == 2) {
                ans.append("##" + field);
            } else if (state == 3) {
                ans.append("##" + field + "#");
            }
            this.subquerys[m] = ans.toString();
        }
        this.subfields = null;
        this.subNum = 0;
    }

    public CellHandle(ServletOutputStream out1, JDBCAdapter adapter1, String[] querys1, String[] fields1, String userid1) {
        this.out = out1;
        this.adapter = adapter1;
        this.querys = querys1;
        this.fields = fields1;
        this.userid = userid1;
        if (this.querys != null && this.querys.length - 1 > 0) {
            this.subquerys = new String[this.querys.length - 1];
        }
    }

    public int outstr(String field) {
        int ret = 0;
        int col = -1;
        try {
            int j;
            if (field.equals("CURRENT_TIME")) {
                this.out.write(Toolbox.timestr(new Date().getTime() / 1000).getBytes());
                return 0;
            }
            if (field.equals("CURRENT_USER")) {
                this.out.write(this.userid.getBytes());
                return 0;
            }
            if (field.matches("[0-9]+]")) {
                col = Integer.parseInt(field);
            }
            if (this.subfields != null) {
                int i;
                for (i = this.subfields.length - 1; !(i < 0 || field.equals(this.subfields[i])); --i) {
                }
                if (i == -1 && col == -1) {
                    this.subfields = null;
                }
            }
            if (this.subfields == null) {
                this.hasmore = false;
                this.filledrow = 0;
                if (this.adapter.executeQuery2(this.subquerys[this.subNum++], true)) {
                    this.numCols = this.adapter.metaData.getColumnCount();
                    this.subfields = new String[this.numCols];
                    this.subtypes = new char[this.numCols];
                    this.appears = new boolean[this.numCols];
                    for (int column = 0; column < this.numCols; ++column) {
                        String heading;
                        int kl;
                        this.appears[column] = false;
                        if ((kl = (heading = this.adapter.metaData.getColumnLabel(column + 1)).indexOf("_")) > -1) {
                            this.subfields[column] = heading.substring(0, kl);
                            this.subtypes[column] = heading.charAt(kl + 1);
                            continue;
                        }
                        this.subtypes[column] = 84;
                        this.subfields[column] = heading;
                    }
                }
            }
            if (this.subfields == null) {
                this.out.write(" ".getBytes());
                return -1;
            }
            for (j = this.subfields.length - 1; !(j < 0 || field.equals(this.subfields[j])); --j) {
            }
            if (j == -1 && (col < 0 || col >= this.numCols)) {
                this.out.write(("$$" + field + "$$").getBytes());
                return -1;
            }
            if (col >= 0 && col < this.numCols) {
                j = col;
            }
            if (j == 0) {
                ++this.filledrow;
                this.hasmore = this.filledrow <= 2 ? this.adapter.resultSet.next() : true;
                ret = !this.appears[0] ? 1 + (this.numCols == 1 ? 1 : 0) : 3 + (this.numCols == 1 ? 1 : 0);
            } else if (j == this.numCols - 1) {
                ret = !this.appears[j] ? 2 : 4;
            }
            this.appears[j] = true;
            if (this.hasmore) {
                this.out.write(this.adapter.resultSet.getString(j + 1).getBytes());
            } else if (this.filledrow <= 2) {
                this.out.write(" ".getBytes());
            }
            if (ret == 4 && this.adapter.resultSet.next()) {
                ret = 6;
            }
            return ret;
        }
        catch (Exception e) {
            return -1;
        }
    }
}
