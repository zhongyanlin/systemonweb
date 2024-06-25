<%@ page contentType="text/html; charset=utf-8" import="telaman.*,java.sql.*,java.util.*,java.util.regex.*" %>

\section{Budget and Justification}



\noindent {\large A. Requisition of Equipment and Software}

\bigskip

We need to acquire some software and hardware for the project.
\begin{center}
\begin{tabular}[h]{ |l|l|l|r|r|}
 \hline
 Item & Unit &   Vendor & Unit Price & Amount \\
 \hline
 Laptop PC     & 1 &  IBM &        \\$1500 &    \\$1500 \\
 \hline
 Server for hosting websites for clients initially& 1 &  Dell &        \\$600 &    \\$600 \\
 \hline
 Desktop for classroom podium & 1 &  Dell &        \\$500 &    \\$500 \\
 \hline
 Software & 1 & Micromedia & \\$500 &   \\$500 \\
\hline &&& Total& \\$3100 \\ \hline
\end{tabular}

\end{center}


\noindent {\large B. Conference and Travel}

\bigskip


   Zhongyan Lin plans to attend conferences for  three  times for this project
   in the two year period. The estimated average cost for attending
one {\bf three-day} conference is

  \begin{center}
\begin{tabular}[h]{|l|r|}
\hline
    Air Tickets:& \\$350     \\
    \hline
   Hotel:      &  3 $\times$ \\$100 = \\$300   \\ \hline
    Meal:      &  3 $\times$ \\$30 = \\$90  \\ \hline
    Registration:&\\$200   \\ \hline
    Total:& \\$940  \\ \hline
\end{tabular}
\end{center}

In addition, Zhongyan Lin will have to travel to local high
schools frequently for the   two years, about 30 times, 50
miles per around trip, costs 1500 $\times$ 0.4 = \\$600.



  The total amount for conference and travel in the {\bf two-year} period will be
  \\$1540 + \\$1586  =\\$3126.

\bigskip

\noindent {\large C. Participant's Salary}

\bigskip

In each year, Zhongyan Lin will work in summer for three months  for
this project  and devote 25\% of his time during regular semesters
(one course release).

<% double x1 = 5.25; int x2=7350;int x3=(int)(x1*x2);%>
 \centerline{The participant's salary for the first year }
\begin{center}
\begin{tabular}[h]{|l|l|r|r|}
 \hline
 Name & Time &Rate & Amount \\
 \hline
 Zhongyan Lin & <%=x1%> months  & \\$<%=x2%>  /month & \\$ <%=x3%>      \\
 \hline
  
\end{tabular}
\end{center}
<% double x4 = 5.25; int x5=(int)(x2*1.02);int x6=(int)(x4*x5);%>
 \centerline{The participant's salary for the second year }
\begin{center}
\begin{tabular}[h]{|l|l|r|r|}
 \hline
 Name & Time &Rate & Amount \\
 \hline
 Zhongyan Lin & <%=x4%> months  & \\$<%=x5%> /month & \\$<%=x6%>     \\
   \hline
\end{tabular}
\end{center}

 


\bigskip

\noindent {\large D. Postdoctoral Fellow and Student Scholarship}

\bigskip

<%int x7=4000,x8=6000,x9=3*(x7+x8); int x10=40000;%>

We will create a scholarship for three students each year.
This scholarship offers student opportunities to learn using
cutting edge technology and develop information systems and web
services. The money will be paid as research assistant stipend (\\$ <%=x7%> )
 and tuition assistance (\\$<%=x8%> ) and normally the students are supposed
to work for up to 10 hours a week for the project as a research
assistant. This scholarship will help us to retain good students.
Total annual amount is 3$\times$(<%=x7%> + <%=x8%> ) = \\$<%=x9%>  with 2\% increase annually.

A postdoctoral scholar will be hired for one year. The cost will be \\$<%=x10%> 
\bigskip

\noindent {\large E. Fringe Benefits}

\bigskip

 According to the policy of
Delaware State University, 38\% fringe benefits must be included
with the salary for faculty and 1.6\% for student or visitor.







<%int x11 = (int)(x3*.38), x12=(int)(x6*.38); 
      int x13 = (int)((x8+x10)*.016);int x14 = (int) (x13*(1.02));%>

\begin{center}
\begin{tabular}[h]{|l|l|r|r|}
 \hline
        & First Year                   & Second Year             \\ \hline
Faculty & 38 \% $\times$ \\$<%=x3%> =\\$<%=x11%>  &
38\%$\times$\\$<%=x6%> =\\$<%=x12%>   \hline

Student and Visitor & 1.6 \% $\times$(\\$<%=x8%> +\\$<%=x10%> ) =\\$<%=x13%> 
              & 1.6 \% $\times$(\\$<%=x8%> +\\$<%=x10%> ) $\times$ 1.02=\\$<%=x14%>  

 \\ \hline

 \end{tabular}
\end{center}


\noindent {\large F. Indirect Cost}

\bigskip
<% int x15 = (int)(.43*(x3 + x11)); int x16 = (int)(.43*(x6 + x12)); %>

According to the Delaware State University's policy, the indirect
cost will be \%43 of the total salary and benefits of
participants, which makes (\\$<%=x3%> + \\$<%=x11%>)   $\times$ \%43 = \\$<%=x15%>  for the
first year, and  (\\$<%=x6%> + \\$<%=x12%>)   $\times$ \%43 = \\$<%=x16%>  for the second year.

\bigskip

\noindent {\large G. Other Direct Cost} Total \%0.5 audit fee will be needed
for this budget.

\bigskip

\noindent {\large H. Summary}

\bigskip
<% int x17 = 3100 + 1540 + x3 + x11 + x15 + 30000 + x10 + x13;
      int x18= (int)(0.005*x17);
      int x19 = x17 + x18;%>
\centerline{The Budget for the First Year}
\begin{center}
\begin{tabular}[h]{|l|r|}
 \hline
 Item & Amount \\ \hline
 Hardware and Software & \\$3100 \\ \hline
 Travel &               \\$1540 \\ \hline
 Participant's Salary & \\$<%=x3%>   \\ \hline
 Participant's Fringe Benefit & \\$<%=x11%>  \\ \hline
 Indirect Cost &        \\$<%=x15%>  \\ \hline
 Student Scholarship  & \\$30000 \\ \hline
 Visitor Stipend  &  \\$<%=x10%>  \\ \hline
 Student and visitor  Fringe Benefit &  \\$<%=x13%>   \\ \hline
 Audit Fee & above$\times$ 0.5\%= \\$<%=x18%>   \\ \hline
 Total & \\$<%=x19%>   
 \\ \hline
 \end{tabular}
\end{center}

<% int x20 =  1586+ x6 + x12 + x16 + (int)(30000*1.02)  + x14;
      int x21= (int)(0.005*x20);
      int x22 = x20 + x21;
      int x23 = x19 + x22;
%>



\centerline{The Budget for the  Second Year}
\begin{center}
\begin{tabular}[h]{|l|r|}
 \hline
 Item & Amount \\ \hline
 Hardware and Software & \\$0 \\ \hline
 Travel & \\$1586 \\ \hline
 Participant's Salary & \\$<%=x6%>   \\ \hline
Participant's Fringe Benefit & \\$<%=x12%>   \\ \hline
 Indirect Cost & \\$<%=x16%>   \\ \hline
 Student Scholarship  & \\$30600 \\ \hline
 Student's Fringe Benefit & \\$<%=x14%>   \\ \hline
 Audit Fee & above $\times$ 0.5\% = \\$<%=x21%>   \\ \hline
 Total & \\$<%=x22%>   \\ \hline
\end{tabular}
\end{center}

The total budget for the three year period will be  \\$<%=x23%>.
 

