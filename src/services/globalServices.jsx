export const baseURL = process.env.NODE_ENV === "development" ? "http://localhost:8080" : "https://pixel-brawl.herokuapp.com";

export function colOverlap(rect1, rect2) {
    // Calculate the right and bottom coordinates of the rectangles
    const rect1Right = rect1.left + rect1.width;
    const rect1Bottom = rect1.top + rect1.height;
    const rect2Right = rect2.left + rect2.width;
    const rect2Bottom = rect2.top + rect2.height;

    // Check for overlap
    if (
        rect1.left < rect2Right &&
        rect1Right > rect2.left &&
        rect1.top < rect2Bottom &&
        rect1Bottom > rect2.top
    ) {
        return true;
    } else {
        return false;
    }
}
