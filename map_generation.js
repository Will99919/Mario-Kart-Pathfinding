"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveMapToFile = exports.Matrix = void 0;
var fs = require("fs");
function Matrix(rows, cols) {
    var map = [];
    for (var y = 0; y < rows; y++) {
        var row = [];
        for (var x = 0; x < cols; x++) {
            var randomValue = Math.random();
            if (randomValue < 0.2) {
                row.push('o');
            }
            else {
                row.push('.');
            }
        }
        map.push(row);
    }
    map[0][0] = 'S';
    map[rows - 1][cols - 1] = 'E';
    return map;
}
exports.Matrix = Matrix;
function saveMapToFile(map, filePath) {
    var content = map.map(function (row) { return row.join(''); }).join('\n');
    fs.writeFileSync(filePath, content);
}
exports.saveMapToFile = saveMapToFile;
// export function generateRandomMap(rows: number, cols: number): string[][] {
//     const map: string[][] = [];
//     for (let y = 0; y < rows; y++) {
//         const row: string[] = [];
//         for (let x = 0; x < cols; x++) {
//             // Définir les cases : 'o' pour libre, 'x' pour obstacle
//             const randomValue = Math.random();
//             if (randomValue < 0.2) { // 20% de chances de créer un obstacle
//                 row.push('x');
//             } else {
//                 row.push('o');
//             }
//         }
//         map.push(row);
//     }
//     // Assurer un point de départ 'S' et un point d'arrivée 'E'
//     map[0][0] = 'S'; // Point de départ
//     map[rows - 1][cols - 1] = 'E'; // Point d'arrivée
//     return map;
// }
// // Fonction pour sauvegarder la carte générée dans un fichier
// export function saveMapToFile(map: string[][], filePath: string) {
//     const content = map.map(row => row.join('')).join('\n');
//     fs.writeFileSync(filePath, content);
// }
