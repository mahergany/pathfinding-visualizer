
export default function simple(grid, startNode, finishNode, rows, columns) {
    const diset = new DisjointSet(rows * columns);

    while (diset.size > 1) {

    }
}

class DisjointSet {
    constructor(size) {
        // set=[];
        // sizes=[];
        // size=this.size;
        this.set = new int[size];
        this.size = size;
        this.sizes = new int[size];
        for (let i = 0; i < size; i++) {
            this.set[i] = i;
            this.sizes[i] = 1;
        }
    }

    find(item) {
        let root = item;
        while (this.set[root] != root) {
            root = this.set[root];
        }
        let curr = item;
        while (this.set[curr] !== root) {
            this.set[curr] = root;
        }
        return root;
    }

    join(item1, item2) {
        let group1 = this.find(item1);
        let group2 = this.find(item2);
        --this.size;
        if (this.sizes[group1] > this.sizes[group2]) {
            this.set[group2] = group1;
            this.sizes[group1] += sizes[group2];
            return group1;
        }
        else {
            this.set[group1] = group2;
            this.sizes[group2] += sizes[group1];
            return group2;
        }
    }
}

