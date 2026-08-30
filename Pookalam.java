import javax.swing.*;
import java.awt.*;
import java.awt.geom.*;

public class Pookalam extends JPanel {

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2d = (Graphics2D) g;

        // Turn on Anti-aliasing for beautifully smooth geometric edges
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        // Fill background with rich dark charcoal color
        int width = getWidth();
        int height = getHeight();
        g2d.setColor(Color.decode("#111111"));
        g2d.fillRect(0, 0, width, height);

        // Move coordinate center coordinate grid to the exact middle of the screen
        int centerX = width / 2;
        int centerY = height / 2;
        g2d.translate(centerX, centerY);

        // --- DRAWING POOKALAM LAYERS (Outer to Inner) ---

        // Layer 1: Outer Base Ring (Orange)
        drawCircle(g2d, 280, "#FF4500");

        // Layer 2: Major Exterior Floral Ring (Bright Yellow Petals)
        drawPetalLayer(g2d, 270, 24, "#FFD700", 0);

        // Layer 3: Contrast Separation Ring (White)
        drawCircle(g2d, 210, "#FFFFFF");

        // Layer 4: Primary Accent Medallion Base (Deep Maroon)
        drawCircle(g2d, 195, "#8B0000");

        // Layer 5: Geometric Star Network (Interlocking Gold Array)
        drawStarLayer(g2d, 130, 12, "#FFA500");

        // Layer 6: Core Boundary Isolation Ring (Yellow)
        drawCircle(g2d, 110, "#FFD700");

        // Layer 7: Internal Floral Core Ring (Red Petals)
        drawPetalLayer(g2d, 100, 16, "#D2143A", 11.25);

        // Layer 8: Center Focal Point (Thumbakudam Core)
        drawCircle(g2d, 45, "#FF4500"); // Inner Orange Band
        drawCircle(g2d, 25, "#FFFFFF"); // Sacred Inner White Core
        drawCircle(g2d, 10, "#FFD700"); // Bindu Central Point
    }

    private void drawCircle(Graphics2D g2d, int radius, String hexColor) {
        g2d.setColor(Color.decode(hexColor));
        g2d.fillOval(-radius, -radius, radius * 2, radius * 2);
    }

    private void drawPetalLayer(Graphics2D g2d, int radius, int petalCount, String hexColor, double offsetAngle) {
        g2d.setColor(Color.decode(hexColor));
        double angleStep = 360.0 / petalCount;

        for (int i = 0; i < petalCount; i++) {
            // Save initial matrix layout system state
            AffineTransform oldTransform = g2d.getTransform();
            
            double currentAngle = Math.toRadians((i * angleStep) + offsetAngle);
            g2d.rotate(currentAngle);

            // Construct mathematical diamond petal vectors
            Path2D petal = new Path2D.Double();
            petal.moveTo(0, 0);
            petal.lineTo(-radius * 0.15, radius * 0.7);
            petal.lineTo(0, radius);
            petal.lineTo(radius * 0.15, radius * 0.7);
            petal.closePath();
            g2d.fill(petal);

            // Restore canvas matrix transform coordinate position
            g2d.setTransform(oldTransform);
        }
    }

    private void drawStarLayer(Graphics2D g2d, int radius, int points, String hexColor) {
        g2d.setColor(Color.decode(hexColor));
        double angleStep = 360.0 / points;

        for (int i = 0; i < points; i++) {
            AffineTransform oldTransform = g2d.getTransform();
            g2d.rotate(Math.toRadians(i * angleStep));

            // Create crisp, structural triangular overlay rays
            Path2D triangle = new Path2D.Double();
            triangle.moveTo(0, radius);
            triangle.lineTo(-radius * 0.3, radius * 0.4);
            triangle.lineTo(radius * 0.3, radius * 0.4);
            triangle.closePath();
            g2d.fill(triangle);

            g2d.setTransform(oldTransform);
        }
    }

    public static void main(String[] args) {
        JFrame frame = new JFrame("Traditional Java Athapookalam");
        Pookalam pookalamPanel = new Pookalam();
        
        frame.add(pookalamPanel);
        frame.setSize(800, 800);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setLocationRelativeTo(null); // Center window panel display matrix layout 
        frame.setVisible(true);
    }
}
