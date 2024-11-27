"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var map_generation_1 = require("./map_generation");
var rows = parseInt(process.argv[3]);
var cols = parseInt(process.argv[4]);
var randomMap = (0, map_generation_1.Matrix)(rows, cols);
var randomMapFilePath = 'map_random.map';
(0, map_generation_1.saveMapToFile)(randomMap, randomMapFilePath);
var words = fs.readFileSync('map_random.map', 'utf-8');
var map = JSON.stringify(words);
var array = JSON.parse(map);
var PriorityQueue = /** @class */ (function () {
    function PriorityQueue() {
        this.elements = [];
    }
    PriorityQueue.prototype.add = function (node) {
        this.elements.push(node);
        this.elements.sort(function (a, b) { return (a.cost + a.heuristic) - (b.cost + b.heuristic); });
    };
    PriorityQueue.prototype.dequeue = function () {
        return this.elements.shift();
    };
    PriorityQueue.prototype.isEmpty = function () {
        return this.elements.length === 0;
    };
    PriorityQueue.prototype.contains = function (node) {
        return this.elements.some(function (el) { return el.x === node.x && el.y === node.y; });
    };
    return PriorityQueue;
}());
function distance(a, b) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}
function parseMap(filePath) {
    var content = fs.readFileSync(filePath, 'utf-8').trim().split('\n');
    var map = [];
    var start = null;
    var end = null;
    content.forEach(function (line, y) {
        var row = line.split('');
        map.push(row);
        row.forEach(function (cell, x) {
            if (cell === 'S') {
                start = { x: x, y: y, cost: 0, heuristic: 0 };
            }
            else if (cell === 'E') {
                end = { x: x, y: y, cost: 0, heuristic: 0 };
            }
        });
    });
    if (!start || !end) {
        throw new Error("S or E point not found in the map");
    }
    return { map: map, start: start, end: end };
}
function search(map, start, end) {
    var closedList = new Set();
    var openList = new PriorityQueue();
    openList.add(start);
    while (!openList.isEmpty()) {
        var current = openList.dequeue();
        if (current.x === end.x && current.y === end.y) {
            var path = [];
            var node = current;
            while (node) {
                path.push(node);
                node = node.parent;
            }
            return path.reverse();
        }
        closedList.add("".concat(current.x, ",").concat(current.y));
        var neighbors = [
            { x: current.x, y: current.y - 1 },
            { x: current.x, y: current.y + 1 },
            { x: current.x - 1, y: current.y },
            { x: current.x + 1, y: current.y },
        ];
        for (var _i = 0, neighbors_1 = neighbors; _i < neighbors_1.length; _i++) {
            var neighbor = neighbors_1[_i];
            if (neighbor.y < 0 || neighbor.y >= map.length || neighbor.x < 0 || neighbor.x >= map.length) {
                continue;
            }
            var cell = map[neighbor.y][neighbor.x];
            if (cell === 'o' || closedList.has("".concat(neighbor.x, ",").concat(neighbor.y))) {
                continue;
            }
            var newCost = current.cost + 1;
            var heuristic = distance([neighbor.x, neighbor.y], [end.x, end.y]);
            var neighborNode = __assign(__assign({}, neighbor), { cost: newCost, heuristic: heuristic, parent: current });
            if (!openList.contains(neighborNode)) {
                openList.add(neighborNode);
            }
        }
    }
    return null;
}
function markPath(map, path) {
    for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
        var node = path_1[_i];
        if (map[node.y][node.x] !== 'S' && map[node.y][node.x] !== 'E') {
            map[node.y][node.x] = '\x1b[43m.\x1b[0m';
        }
    }
}
function printMap(map) {
    for (var _i = 0, map_1 = map; _i < map_1.length; _i++) {
        var row = map_1[_i];
        console.log(row.join(''));
    }
}
function printPath(path) {
    var result = path.map(function (node) { return "".concat(node.y, ":").concat(node.x); }).join(' ');
    console.log(result);
}
var filePath = process.argv[2];
try {
    var _a = parseMap(filePath), map_2 = _a.map, start = _a.start, end = _a.end;
    var path = search(map_2, start, end);
    if (path) {
        markPath(map_2, path);
        printMap(map_2);
        printPath(path);
    }
    else {
        console.log("No path found");
    }
}
catch (error) {
    console.error(error);
}
