interface MazePoint {
    x: number;
    y: number;
    /** true墙 false路 */
    wall: boolean;
    /** true访问过 false未访问 */
    visit: boolean;
}

interface MazeSize {
    width: number;
    height: number;
}

interface MazeXY {
    x: number;
    y: number;
}
