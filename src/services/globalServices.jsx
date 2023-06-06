export const baseURL = `http://localhost:8080`

export function colOverlap(col1, col2) {
    const {top: x1, left: y1, width: width1, height: height1} = col1;
    const {top: x2, left: y2, width: width2, height: height2} = col2;
    const xOverlap = x1 + width1 >= x2 && x2 + width2 >= x1;  
    const yOverlap = y1 + height1 >= y2 && y2 + height2 >= y1;  
    return xOverlap && yOverlap;
}
