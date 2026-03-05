import React from 'react';
import { motion } from 'framer-motion';

const topicInsights = {
    "Array": { time: "O(1) Access, O(n) Search", space: "O(n)", tip: "Two pointers, Sliding window, Hashing." },
    "Matrix": { time: "O(m*n) Traversal", space: "O(1) to O(m*n)", tip: "Think of it as a 2D array or graph. BFS/DFS work great." },
    "String": { time: "O(n) Traversal", space: "O(n)", tip: "Understand ASCII, Palindromes, KMP, Rabin-Karp." },
    "Search & Sort": { time: "O(n log n) Sort", space: "O(1) to O(n)", tip: "Binary Search is the most powerful tool." },
    "Linked List": { time: "O(n) Traversal", space: "O(1)", tip: "Fast/Slow Pointers (Floyd's), Dummy Nodes." },
    "Binary Trees": { time: "O(n) Traversal", space: "O(h) where h is height", tip: "Recursion! Inorder, Preorder, Postorder." },
    "BST": { time: "O(h) Search", space: "O(h)", tip: "Inorder traversal gives sorted order." },
    "Greedy": { time: "O(n log n)", space: "O(1)", tip: "Local optimum leads to global optimum." },
    "Backtracking": { time: "Exponential", space: "O(n)", tip: "Explore all paths. 'Choose, explore, un-choose'." },
    "Stacks & Queues": { time: "O(1) Push/Pop", space: "O(n)", tip: "LIFO vs FIFO. Monotonic Stacks." },
    "Heap": { time: "O(log n) Push/Pop", space: "O(n)", tip: "Priority Queues! Top K elements." },
    "Graph": { time: "O(V + E)", space: "O(V)", tip: "Dijkstra, MST, Topological Sort." },
    "Trie": { time: "O(L) string length", space: "O(N * L)", tip: "Prefix matching, Autocomplete." },
    "Dynamic Programming": { time: "Polynomial", space: "O(n) to O(n^2)", tip: "Optimal substructure. Memoize." },
    "Bit Manipulation": { time: "O(bits)", space: "O(1)", tip: "XOR properties, checking set bits." }
};

const CheatSheet = ({ topicName }) => {
    const currentInsight = topicInsights[topicName] || { time: "Varies", space: "Varies", tip: "Practice makes perfect!" };

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden xl:block w-80 h-fit sticky top-8"
        >
            <div className="bento-glass rounded-3xl p-6 border-l-4 border-l-warning-color">
                <h4 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                    <span>💡</span> Quick Cheat Sheet
                </h4>

                <div className="space-y-4">
                    <div className="bg-surface-dark p-3 rounded-xl border border-border-color-light">
                        <span className="text-xs font-bold text-accent-color uppercase tracking-wider block mb-1">Time</span>
                        <span className="text-sm text-text-primary-light font-bold font-mono">{currentInsight.time}</span>
                    </div>
                    <div className="bg-surface-dark p-3 rounded-xl border border-border-color-light">
                        <span className="text-xs font-bold text-accent-color uppercase tracking-wider block mb-1">Space</span>
                        <span className="text-sm text-text-primary-light font-bold font-mono">{currentInsight.space}</span>
                    </div>
                    <div className="bg-surface-dark p-3 rounded-xl border border-border-color-light">
                        <span className="text-xs font-bold text-warning-color uppercase tracking-wider block mb-1">Pro Tip</span>
                        <span className="text-sm text-text-secondary-light leading-relaxed">{currentInsight.tip}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CheatSheet;
