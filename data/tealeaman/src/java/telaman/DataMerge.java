package telaman;

import java.io.*;
import java.net.*;
import java.util.*;
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
 
import javax.servlet.http.*;
@WebServlet(name = "DataMerge", urlPatterns = {"/DataMerge"},   asyncSupported = false)
public class DataMerge extends Generic {

   final int maxRowBufSize = 600;

    

   public void processMerge(User user, Webform w, HttpServletResponse response, JDBCAdapter adapter, HttpServletRequest  request) {
      boolean hasdelete = false;
      boolean hasupdate = false;
      boolean hasnew = false;
      boolean status = true;
      byte[] subrow = new byte[600];
      int subRowLen = 0;
      int subrowIndex = 0;
      
      status = false;
      HttpSession session = request.getSession(true);
      int orgnum = Toolbox.setcharset(request, response);
      if (orgnum == -1) return;
CachedStyle cachedstyle = new CachedStyle(request, orgnum);
      String timeformat = cachedstyle.timeformat;
      String encoding = Toolbox.encodings[orgnum>>16];
      if(w.query != null && w.query.length() >= 5) {
         w.query = w.query.trim();
         String[] var56 = w.query.split("\n[\r]*\n+");

         int numquery;
         for(numquery = 0; numquery < var56.length; ++numquery) {
            var56[numquery] = var56[numquery].trim();
         }

         numquery = var56.length;
         adapter = Toolbox.getUserAdapter(user,orgnum);
         String err = adapter.error();
         PrintWriter var58;
         if(err != null && err.length() != 0) 
         {
            adapter.close();
            try {
               var58 = response.getWriter();
               var58.println(err + height(err.length()) + closebutton);
               var58.close();
            } catch (Exception var49) 
            {
               ;
            }

         } else {
            boolean b = adapter.executeQuery2(var56[0],true);
            if(b && adapter.getValueAt(0,0)==null) 
            {
               err = "Query returns empty dataset.";
              
               try {
                  var58 = response.getWriter();
                  var58.println(err + height(err.length()) + closebutton);
                  var58.close();
               } catch (Exception var50) {
                  ;
               }

               adapter.close();
            } else if(!b) {
               err = "Incorrect query:<br><font color=red>" + var56[0];
               response.setContentType("text/html;charset=" +  encoding);

               try {
                  var58 = response.getWriter();
                  var58.println(err + height(err.length()) + closebutton);
                  var58.close();
               } catch (Exception var51) {
                  ;
               }

               adapter.close();
            } else {
               int numCols = adapter.getColumnCount();
               String[] fields = w.fields;
               char[] types = new char[w.ctypes.length];

               for(int i = 0; i < types.length; ++i) {
                  types[i] = w.ctypes[i].charAt(0);
               }

               URL template = null;
               String tempstr = "";
               Object urlinput = null;
               boolean localfile = w.title.indexOf("http") < 0;
               boolean userfile = false;
               if(!localfile) {
                  try {
                     URL abyte = new URL(w.title);
                     String numBytes = InetAddress.getByName(abyte.getHost()).getHostAddress();
                     String N = InetAddress.getLocalHost().getHostAddress();
                     boolean field = false;
                     int var65;
                     if(numBytes.equals(N) && (var65 = w.title.indexOf("FileOperation?did=")) > 0) {
                        Encode6b e = new Encode6b(user.orgnum);
                        w.title = e.rto6b(w.title.substring(var65 + 18));
                        localfile = true;
                        userfile = true;
                     }
                  } catch (Exception var52) {
                     ;
                  }
               }

               boolean var61 = false;
               byte var60 = 100;
               byte[] var66 = new byte[2 * var60];

               try {
                  if(localfile) {
                     if(!userfile) {
                        urlinput = new FileInputStream(new File(Toolbox.installpath + File.separator + w.title));
                     } else {
                        urlinput = new FileInputStream(new File(w.title));
                     }
                  } else {
                     template = new URL(w.title);
                     urlinput = template.openStream();
                  }

                  String var63 = "merged.html";
                  String var68 = "html";
                  if(w.title.charAt(w.title.length() - 1) == 47) {
                     var63 = "merged.html";
                     var68 = ".html";
                  } else {
                     int fle = w.title.lastIndexOf("/");
                     var63 = w.title.substring(fle + 1);
                     var68 = var63;
                     if(var63.length() > 10) {
                        var63 = "merged.txt";
                        var68 = ".txt";
                     }
                  }

                  String[] var67 = FileOperation.typedes((String)null, var68).split(",");
                  response.setContentType(var67[1]);
                  response.setHeader("Content-Disposition", var67[0] + ";filename=" + var63);
                  ServletOutputStream biout = response.getOutputStream();
                  CellHandle cellHandle = new CellHandle(biout, adapter, var56, fields, user.id);

                  for(int k = 0; adapter.getValueAt(k,0)!=null; ++k) {
                     if(k > 0) {
                        ((InputStream)urlinput).close();
                        if(localfile) {
                           urlinput = new FileInputStream(new File(Toolbox.installpath + File.separator + w.title));
                        } else {
                           urlinput = template.openStream();
                        }
                     }

                     cellHandle.setRowNum(k);
                     int state = 0;
                     boolean state1 = true;
                     boolean state2 = true;
                     boolean outquota = true;
                     boolean brace = false;
                     int var59 = 0;
                     boolean jj = false;
                     boolean var57 = false;
                     boolean repeat = false;

                     while(true) {
                        int var62;
                        if(!repeat) {
                           try {
                              var62 = ((InputStream)urlinput).read();
                              if(var62 == -1) {
                                 break;
                              }
                           } catch (Exception var54) {
                              break;
                           }

                           if(subRowLen < 600) {
                              subrow[subRowLen++] = (byte)var62;
                           }
                        } else {
                           if(subrowIndex >= subRowLen) {
                              break;
                           }

                           var62 = subrow[subrowIndex++];
                        }

                        char aschar = (char)var62;
                        String fieldstr;
                        if(aschar != 37) {
                           if(aschar == 36) {
                              switch(state) {
                              case 0:
                                 state = 11;
                                 break;
                              case 1:
                                 state = 11;
                                 biout.write(37);
                                 break;
                              case 2:
                                 state = 11;
                                 biout.write(37);
                                 biout.write(37);
                                 biout.write(var66, 0, var59);
                                 var59 = 0;
                                 break;
                              case 3:
                                 state = 11;
                                 biout.write(37);
                                 biout.write(37);
                                 biout.write(var66, 0, var59);
                                 biout.write(37);
                                 var59 = 0;
                              case 4:
                              case 5:
                              case 6:
                              case 7:
                              case 8:
                              case 9:
                              case 10:
                              default:
                                 break;
                              case 11:
                              case 12:
                                 ++state;
                                 break;
                              case 13:
                                 fieldstr = new String(var66, 0, var59, encoding);
                                 int var69 = cellHandle.outstr(fieldstr);
                                 if(var69 == 2) {
                                    subRowLen = 0;
                                 } else if(var69 == 4) {
                                    repeat = false;
                                 } else if(var69 == 6) {
                                    repeat = true;
                                    subrowIndex = 0;
                                 }

                                 state = 0;
                                 var59 = 0;
                              }
                           } else {
                              switch(state) {
                              case 0:
                                 state = 0;
                                 biout.write(var62);
                                 break;
                              case 1:
                                 state = 0;
                                 biout.write(37);
                                 biout.write(var62);
                                 break;
                              case 2:
                              case 12:
                                 var66[var59++] = (byte)var62;
                                 break;
                              case 3:
                                 state = 0;
                                 biout.write(37);
                                 biout.write(37);
                                 biout.write(var66, 0, var59);
                                 biout.write(37);
                                 biout.write(var62);
                                 var59 = 0;
                              case 4:
                              case 5:
                              case 6:
                              case 7:
                              case 8:
                              case 9:
                              case 10:
                              default:
                                 break;
                              case 11:
                                 state = 0;
                                 biout.write(36);
                                 biout.write(var62);
                                 break;
                              case 13:
                                 state = 0;
                                 biout.write(36);
                                 biout.write(36);
                                 biout.write(var66, 0, var59);
                                 biout.write(36);
                                 biout.write(var62);
                                 var59 = 0;
                              }
                           }
                        } else {
                           switch(state) {
                           case 0:
                           case 1:
                           case 2:
                              ++state;
                              break;
                           case 3:
                              fieldstr = new String(var66, 0, var59,  encoding);
                              int order;
                              if(fieldstr.matches("[0-9]+")) {
                                 order = Integer.parseInt(fieldstr);
                              } else {
                                 order = this.getOrder(fieldstr, fields);
                              }

                              if(order >= 0 && order < numCols) {
                                 String pos = adapter.getValueAt(k, order);
                                 if(types[order] == 109) {
                                    pos = Toolbox.timestr(Long.parseLong(pos));
                                 } else if(types[order] == 99) {
                                    if(pos.equals("1")) {
                                       pos = Toolbox.emsgs(orgnum,415);
                                    } else {
                                       pos = Toolbox.emsgs(orgnum,418);
                                    }
                                 }

                                 biout.print(pos);
                              } else if(order == -2) {
                                 biout.print(Toolbox.timestr((new Date()).getTime() / 1000L));
                              } else if(order == -3) {
                                 biout.print(user.id);
                              } else if(order == -1) {
                                 
                                 biout.write(var66, 0, var59);
                                 biout.write(var62);
                               
                              }

                              state = 0;
                              var59 = 0;
                           case 4:
                           case 5:
                           case 6:
                           case 7:
                           case 8:
                           case 9:
                           case 10:
                           default:
                              break;
                           case 11:
                              state = 1;
                              biout.write(36);
                              break;
                           case 12:
                              state = 1;
                              biout.write(36);
                              biout.write(36);
                              biout.write(var66, 0, var59);
                              var59 = 0;
                              break;
                           case 13:
                              state = 1;
                              biout.write(36);
                              biout.write(36);
                              biout.write(var66, 0, var59);
                              biout.write(36);
                              var59 = 0;
                           }
                        }
                     }
                  }

                  adapter.close();
                  ((InputStream)urlinput).close();
                  biout.close();
               } catch (Exception var55) {
                  Exception var64 = var55;
                  err = w.title + " may not an accessible URL<br>" + Toolbox.getInstallPath() + File.separator + w.title;
                  response.setContentType("text/html;charset=" + encoding);

                  try {
                     PrintWriter e1 = response.getWriter();
                     e1.println(Toolbox.removescript(var64.toString() + "<br>" + err + height(err.length())));
                     e1.close();
                  } catch (Exception var48) {
                     ;
                  }

               }
                
            }
         }
      } else {
         response.setContentType("text/html;charset=" +  encoding);

         try {
            PrintWriter querys = response.getWriter();
            querys.println(Toolbox.emsgs(orgnum,88) + height(30) + closebutton);
            querys.close();
         } catch (Exception var53) {
            ;
         }

      }
      adapter.close();
   }

   public String getformat() {
      return "DataMerge";
   }

   int getOrder(String fd, String[] fields) {
      if(fd == null) {
         return -1;
      } else {
         int i = fields.length - 1;
         if(fd.equals("CURRENT_TIME")) {
            return -2;
         } else if(fd.equals("CURRENT_USER")) {
            return -3;
         } else {
            while(i >= 0 && !fd.equals(fields[i])) {
               --i;
            }

            return i;
         }
      }
   }
   protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
      this.processRequest(request, response, true);
   }

   protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
      this.processRequest(request, response, false);
   }

   public String getServletInfo() {
      return "Short description";
   }
}
