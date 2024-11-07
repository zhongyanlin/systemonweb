
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author zlin
 */
public class Graph {
    static class Triple
    {
        int start,end,weight;
        public Triple(int s, int e,int w){start = s; end = e; weight = w;}
    }
    Triple [] edges = null;
    int V = 0;
    int E = 0;
    public Graph(int [][] weights)
    {
       V = weights.length;
       for (int i=0; i < V; i++)
       for (int j=0; j < V; j++)
           if (weights[i][j]!=0)
               E++;
       edges = new Triple[E];
       E = 0;
       for (int i=0; i < V; i++)
       for (int j=0; j < V; j++)
           if (weights[i][j]!=0)
               edges[E++] = new Triple(i,j,weights[i][j]);
    }
    class CompareWeight implements Comparator<Triple>
    {
        public int compare(Triple x, Triple y)
        {
            if (x.weight != y.weight)
                return x.weight- y.weight;
            if (x.start != y.start)
                return x.start- y.start;
            return x.end- y.end;
        }
    }
    int findroot(int parent[], int u)
    {
       if (parent[u]==-1) return u;
       return findroot(parent, parent[u]);
    }
    ArrayList<Triple> MST;
    int [][] kruskal()
    {
        MST = new ArrayList();
        int parent[] = new int[V];
        int size[] = new int[V];
        int ancestor[] = new int[V];
        int sumweight[] = new int[V];
        for (int i =0; i < V; i++)
        {
            parent[i] = -1;
            size[i] = 1;
            ancestor[i] = i;
            sumweight[i] = 0;
        }
        Arrays.sort(edges,new CompareWeight());
        for (Triple e : edges)
        {
            int u = e.start;
            int v = e.end;
            int w = e.weight;
            int a = findroot(parent,u);
            int b = findroot(parent,v);
            if (a == b) continue;
            MST.add(e);
            if (size[a] > size[b])
            {
                parent[b] =a;
                size[a] += size[b];
                sumweight[a] += sumweight[b] + w;
                ancestor[u] = ancestor[v] = ancestor[b] = a;
            }
            else
                {
                parent[a] = b;
                size[b] += size[a];
                sumweight[b] += sumweight[a] + w;
                ancestor[u] = ancestor[v] = ancestor[a] = b;
            }
        }
        int result[][] = new int[4][];
        result[0] = parent;
        result[1] = size;
        result[2] = sumweight;
        result[3] = ancestor;
        return result;
    }
    public static void main(String [] args)
    {
         int weights[][] = new int[][]{{0, 4, 0, 0, 0, 0, 0, 8, 0},
                            {4, 0, 8, 0, 0, 0, 0, 11, 0},
                            {0, 8, 0, 7, 0, 4, 0, 0, 2},
                            {0, 0, 7, 0, 9, 14, 0, 0, 0},
                            {0, 0, 0, 9, 0, 10, 0, 0, 0},
                            {0, 0, 4, 14, 10, 0, 2, 0, 0},
                            {0, 0, 0, 0, 0, 2, 0, 1, 6},
                            {8, 11, 0, 0, 0, 0, 1, 0, 7},
                            {0, 0, 2, 0, 0, 0, 6, 7, 0} };
        Graph g =  new Graph(weights);
        int r[][] = g.kruskal();
        System.out.println("edge  weight");
        for (int j=0; j < g.E; j++)
            System.out.format("%1d-%1d: %6d\n", g.edges[j].start, g.edges[j].end,g.edges[j].weight);
            
        System.out.println(" N parent   size sumweight ancestor");
        for (int i=0; i < r[0].length; i++)
        System.out.format("%2d %6d %6d %9d %8d\n", i, r[0][i], r[1][i], r[2][i], r[3][i]);
        
        System.out.println("edge weight");
        for (int j=0; j < g.MST.size(); j++)
            System.out.format("%1d-%1d: %6d\n", g.MST.get(j).start, g.MST.get(j).end,g.MST.get(j).weight);
            
    }
}
