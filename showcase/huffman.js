class MinHeap {
    constructor(comparator) {
        this.heap = [];
        this.comparator = comparator;
    }

    // Helper method to get the left child index
    getLeftChildIndex(parentIndex) {
        return 2 * parentIndex + 1;
    }

    // Helper method to get the right child index
    getRightChildIndex(parentIndex) {
        return 2 * parentIndex + 2;
    }

    // Helper method to get the parent index
    getParentIndex(childIndex) {
        return Math.floor((childIndex - 1) / 2);
    }

    // Helper method to swap two elements in the heap
    swap(index1, index2) {
        [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
    }

    // Method to maintain the min heap property by bubbling down a node
    heapifyDown() {
        let index = 0;
        const length = this.heap.length;
        const node = this.heap[index];
        while (true) {
            let leftIndex = this.getLeftChildIndex(index);
            let rightIndex = this.getRightChildIndex(index);
            let leftChild = leftIndex < length? this.heap[leftIndex] : null;
            let rightChild = rightIndex < length? this.heap[rightIndex] : null;
            let swapIndex = null;

            if (leftChild && this.comparator(leftChild, node) < 0) {
                swapIndex = leftIndex;
            }

            if (rightChild && this.comparator(rightChild, (swapIndex === null? node : leftChild)) < 0) {
                swapIndex = rightIndex;
            }

            if (swapIndex === null) {
                break;
            }

            this.swap(index, swapIndex);
            index = swapIndex;
        }
    }

    // Method to maintain the min heap property by bubbling up a node
    heapifyUp() {
        let index = this.heap.length - 1;
        const node = this.heap[index];
        while (index > 0) {
            let parentIndex = this.getParentIndex(index);
            let parent = this.heap[parentIndex];

            if (this.comparator(node, parent) >= 0) {
                break;
            }

            this.swap(index, parentIndex);
            index = parentIndex;
        }
    }

    // Method to append a new node to the heap
    append(node) {
        this.heap.push(node);
        this.heapifyUp();
    }

    // Method to extract the minimum node from the heap
    extractMin() {
        if (this.heap.length === 0) {
            return null;
        }

        if (this.heap.length === 1) {
            return this.heap.pop();
        }

        const min = this.heap[0];
        const last = this.heap.pop();
        this.heap[0] = last;
        this.heapifyDown();

        return min;
    }
}
function countCharacterFrequencies(str) {
    const frequencyMap = {};
    for (let char of str) {
        if (frequencyMap[char]) {
            frequencyMap[char]++;
        } else {
            frequencyMap[char] = 1;
        }
    }
    return frequencyMap;
}

// Step 2: Create nodes for each character and add them to the MinHeap
function createNodesAndHeap(frequencyMap, comparator) {
    const minHeap = new MinHeap(comparator);
    for (let char in frequencyMap) {
        const node = {
            char: char,
            frequency: frequencyMap[char]
        };
        minHeap.append(node);
    }
    return minHeap;
}

// Step 3: Combine nodes to build the Huffman tree
function buildHuffmanTree(minHeap) {
    while (minHeap.heap.length > 1) {
        const node1 = minHeap.extractMin();
        const node2 = minHeap.extractMin();

        const newNode = {
            frequency: node1.frequency + node2.frequency,
            left: node1,
            right: node2
        };

        minHeap.append(newNode);
    }

    return minHeap.extractMin();
}

// Step 4: Traverse the Huffman tree to generate codes
function generateHuffmanCodes(root) {
    const codes = {};
    function traverse(node, code = "") {
        if (node.char) {
            codes[node.char] = code;
            return;
        }
        traverse(node.left, code + "0");
        traverse(node.right, code + "1");
    }
    traverse(root);
    return codes;
}

// Main function to perform Huffman coding on a string
function huffmanCoding(str) {
    // Comparator function for the MinHeap
    const comparator = (node1, node2) => node1.frequency - node2.frequency;

    const frequencyMap = countCharacterFrequencies(str);
    const minHeap = createNodesAndHeap(frequencyMap, comparator);
    const huffmanTreeRoot = buildHuffmanTree(minHeap);
    const huffmanCodes = generateHuffmanCodes(huffmanTreeRoot);

    return huffmanCodes;
}

// Example usage:
const inputString = "hello world";
const huffmanCodesForString = huffmanCoding(inputString);
console.log(huffmanCodesForString);

