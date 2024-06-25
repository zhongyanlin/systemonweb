/*
 * Decompiled with CFR 0_87.
 */
package telaman;

import telaman.BinaryNode;
 

public class BinarySearchTree {
    private BinaryNode root = null;

    public void insert(String x) {
        this.root = this.insert(x, this.root);
    }

    public void remove(String x) {
        this.root = this.remove(x, this.root);
    }

    public void removeMin() {
        this.root = this.removeMin(this.root);
    }

    public String findMin() {
        return this.elementAt(this.findMin(this.root));
    }

    public String findMax() {
        return this.elementAt(this.findMax(this.root));
    }

    public String find(String x) {
        return this.elementAt(this.find(x, this.root));
    }

    public void makeEmpty() {
        this.root = null;
    }

    public boolean isEmpty() {
        return this.root == null;
    }

    private String elementAt(BinaryNode t) {
        return t == null ? null : t.element;
    }

    private BinaryNode insert(String x, BinaryNode t) {
        if (t == null) {
            t = new BinaryNode(x);
        } else if (x.compareTo(t.element) < 0) {
            t.left = this.insert(x, t.left);
        } else if (x.compareTo(t.element) > 0) {
            t.right = this.insert(x, t.right);
        } else {
            throw new DuplicateItem(x.toString());
        }
        return t;
    }

    private BinaryNode remove(String x, BinaryNode t) {
        if (x == null) {
            return t;
        }
        if (t == null) {
            throw new ItemNotFound(x.toString());
        }
        if (x.compareTo(t.element) < 0) {
            t.left = this.remove(x, t.left);
        } else if (x.compareTo(t.element) > 0) {
            t.right = this.remove(x, t.right);
        } else if (t.left != null && t.right != null) {
            t.element = this.findMin((BinaryNode)t.right).element;
            t.right = this.removeMin(t.right);
        } else {
            t = t.left != null ? t.left : t.right;
        }
        return t;
    }

    private BinaryNode removeMin(BinaryNode t) {
        if (t == null) {
            throw new ItemNotFound();
        }
        if (t.left != null) {
            t.left = this.removeMin(t.left);
            return t;
        }
        return t.right;
    }

    protected BinaryNode findMin(BinaryNode t) {
        if (t != null) {
            while (t.left != null) {
                t = t.left;
            }
        }
        return t;
    }

    private BinaryNode findMax(BinaryNode t) {
        if (t != null) {
            while (t.right != null) {
                t = t.right;
            }
        }
        return t;
    }

    private BinaryNode find(String x, BinaryNode t) {
        while (t != null) {
            if (x.compareTo(t.element) < 0) {
                t = t.left;
                continue;
            }
            if (x.compareTo(t.element) > 0) {
                t = t.right;
                continue;
            }
            return t;
        }
        return null;
    }
}
