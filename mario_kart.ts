import * as fs from 'fs';
import { Matrix, exportMap } from './map_generation';

const rows = parseInt(process.argv[3]); 
const cols = parseInt(process.argv[4]); 
const randomMap = Matrix(rows, cols);
const mapRandom = 'map_random.map';
exportMap(randomMap, mapRandom);

const words = fs.readFileSync('map_random.map', 'utf-8');
const map = JSON.stringify(words);
//const array = JSON.parse(map);

type Node = {
    x: number;
    y: number;
    cost: number;
    heuristic: number;
    parent?: Node;
};

class PriorityQueue {
    private elements: Node[] = [];

    add(node: Node) {
        this.elements.push(node);
        this.elements.sort((a, b) => (a.cost + a.heuristic) - (b.cost + b.heuristic));
    }

    dequeue(): Node {
        return this.elements.shift()!;
    }

    isEmpty(): boolean {
        return this.elements.length === 0;
    }

    contains(node: Node): boolean {
        return this.elements.some(el => el.x === node.x && el.y === node.y);
    }
}

function distance(a: [number, number], b: [number, number]): number {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

function parseMap(filePath: string): { map: string[][], start: Node, end: Node } {
    const content = fs.readFileSync(filePath, 'utf-8').trim().split('\n');
    const map: string[][] = [];
    let start: Node | null = null;
    let end: Node | null = null;

    content.forEach((line, y) => {
        const row = line.split('');
        map.push(row);
        row.forEach((cell, x) => {
            if (cell === 'S') {
                start = { x, y, cost: 0, heuristic: 0 };
            } else if (cell === 'E') {
                end = { x, y, cost: 0, heuristic: 0 };
            }
        });
    });

    if (!start || !end) {
        throw new Error("S or E point not found in the map");
    }

    return { map, start, end };
}

function search(map: string[][], start: Node, end: Node): Node[] | null {
    const closedList: string[] = [];
    const openList = new PriorityQueue();
    
    openList.add(start);

    while (!openList.isEmpty()) {
        const current = openList.dequeue();

        if (current.x === end.x && current.y === end.y) {
            const path: Node[] = [];
            let node: Node | undefined = current;

            while (node) {
                path.push(node);
                node = node.parent;
            }
            return path.reverse();
        }

        closedList.add(`${current.x},${current.y}`);

        const neighbors = [
            { x: current.x, y: current.y - 1 }, 
            { x: current.x, y: current.y + 1 }, 
            { x: current.x - 1, y: current.y }, 
            { x: current.x + 1, y: current.y }, 
        ];

        for (const neighbor of neighbors) {
            if (neighbor.y < 0 || neighbor.y >= map.length || neighbor.x < 0 || neighbor.x >= map.length) {
                continue; 
            }

            const cell = map[neighbor.y][neighbor.x];

            if (cell === 'o' || closedList.has(`${neighbor.x},${neighbor.y}`)) {
                continue; 
            }

            const newCost = current.cost + 1;
            const heuristic = distance([neighbor.x, neighbor.y], [end.x, end.y]);

            const neighborNode: Node = { x, y, cost: newCost, heuristic, parent: current };

            if (!openList.contains(neighborNode)) {
                openList.add(neighborNode);
            }
        }
    }
    return null;
}

function markPath(map: string[][], path: Node[]) {
    for (const node of path) {
        if (map[node.y][node.x] !== 'S' && map[node.y][node.x] !== 'E') {
            map[node.y][node.x] = '\x1b[43m.\x1b[0m'; 
        }
    }
}

function showMap(map: string[][]) {
    for (const row of map) {
        console.log(row.join(''));
    }
}

function showPath(path: Node[]) {
    const result = path.map(node => `${node.y}:${node.x}`).join(' ');
    console.log(result);
}

const filePath = process.argv[2];

try {
    const { map, start, end } = parseMap(filePath);
    const path = search(map, start, end);
    
    if (path) {
        markPath(map, path);
        showMap(map); 
        showPath(path); 
    } else {
        console.log("No path found");
    }
} catch (error) {
    console.error(error);
}


