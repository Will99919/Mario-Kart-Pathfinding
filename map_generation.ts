import * as fs from 'fs';

export function Matrix(rows: number, cols: number): string[][] {
  const map: string[][] = [];
    for (let y = 0; y < rows; y++) {
      const row: string[] = [];
      for (let x = 0; x < cols; x++) {
        const randomValue = Math.random();
        if (randomValue < 0.2) {
            row.push('o');
        } else {
            row.push('.');
        }
      }
    map.push(row);
  }

    map[0][0] = 'S'; 
    map[rows - 1][cols - 1] = 'E';
  
    return map;
  }
  
  export function exportMap(map: string[][], filePath: string) {
      const content = map.map(row => row.join('')).join('\n');
      fs.writeFileSync(filePath, content);
}

