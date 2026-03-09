// Generates a smooth SVG path using cubic bezier curves with bottom padding to prevent clipping
export const generateSmoothPath = (data: number[], width: number, height: number): string => {
  if (data.length === 0) return '';
  
  // Padding so the stroke doesn't clip the bottom baseline.
  // We'll map values from 0-100 to range between (height - padding) and padding.
  const bottomPadding = 10;
  const topPadding = 5;
  const effectiveHeight = height - bottomPadding - topPadding;
  
  const stepX = width / (data.length - 1);
  
  // Helper to calculate Y coordinates ensuring padding
  const getY = (val: number) => {
    // val is assumed to be 0-100 percentage.
    // When val is 0, y is at height - bottomPadding.
    // When val is 100, y is at topPadding.
    return (height - bottomPadding) - ((val / 100) * effectiveHeight);
  };

  const points = data.map((val, i) => ({
    x: i * stepX,
    y: getY(val)
  }));

  // Start the path
  let path = `M${points[0].x},${points[0].y}`;

  // Add cubic bezier curves
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    
    // Control points to apply slight curve tension (smooth interpolation)
    const cp1x = p0.x + (stepX * 0.4);
    const cp1y = p0.y;
    const cp2x = p1.x - (stepX * 0.4);
    const cp2y = p1.y;

    path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p1.x},${p1.y}`;
  }

  return path;
};
