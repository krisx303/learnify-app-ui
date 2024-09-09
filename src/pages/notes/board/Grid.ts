import Two from "two.js";

export const createGrid = (s: number): string => {
    const size = s || 30;
    const two = new Two({
        type: Two.Types.canvas,
        width: size,
        height: size
    });

    // Create grid lines
    const a = two.makeLine(two.width / 2, 0, two.width / 2, two.height);
    const b = two.makeLine(0, two.height / 2, two.width, two.height / 2);
    a.stroke = b.stroke = '#6dcff6';
    two.update();
    return two.renderer.domElement.toDataURL('image/png');
};