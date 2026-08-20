document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("particles-canvas");
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    let particlesArray = [];

    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Cinematic Bokeh Particle
    class CinematicParticle {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * canvas.width;
            // If initial, spawn anywhere. If resetting, spawn at the bottom.
            this.y = initial ? Math.random() * canvas.height : canvas.height + 50; 
            
            // Depth of field simulation: Large = blurry & fast, Small = sharp & slow
            this.z = Math.random(); // 0 to 1
            this.baseSize = (this.z * 15) + 2; 
            
            this.speedY = -(this.z * 0.8 + 0.1); 
            this.angle = Math.random() * Math.PI * 2;
            this.angleSpeed = (Math.random() - 0.5) * 0.02;
            this.driftAmplitude = this.z * 1.5;

            // Pick a color: Mostly champagne, rarely crimson
            const isCrimson = Math.random() > 0.85;
            this.r = isCrimson ? 197 : 231;
            this.g = isCrimson ? 42 : 200;
            this.b = isCrimson ? 73 : 120;
            
            // Opacity is tied to depth
            this.maxOpacity = (1 - this.z) * 0.4 + 0.1;
            this.currentOpacity = initial ? Math.random() * this.maxOpacity : 0;
        }

        update() {
            // Sine wave drifting for organic movement
            this.angle += this.angleSpeed;
            this.x += Math.sin(this.angle) * this.driftAmplitude;
            this.y += this.speedY;

            // Fade in smoothly when spawning
            if (this.currentOpacity < this.maxOpacity) {
                this.currentOpacity += 0.005;
            }

            // Reset if out of bounds
            if (this.y < -50 || this.x < -50 || this.x > canvas.width + 50) {
                this.reset();
            }
        }

        draw() {
            // Draw a camera-lens style bokeh orb (radial gradient)
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.baseSize
            );
            
            // Core is slightly brighter, edges fade to completely transparent
            gradient.addColorStop(0, `rgba(${this.r}, ${this.g}, ${this.b}, ${this.currentOpacity})`);
            gradient.addColorStop(0.4, `rgba(${this.r}, ${this.g}, ${this.b}, ${this.currentOpacity * 0.5})`);
            gradient.addColorStop(1, `rgba(${this.r}, ${this.g}, ${this.b}, 0)`);

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.baseSize, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        particlesArray = [];
        // Adjust particle count based on screen size (keeps mobile performant)
        let numberOfParticles = Math.floor((canvas.width * canvas.height) / 12000); 
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new CinematicParticle());
        }
    }

    function animate() {
        // Clear canvas but maintain some transparency for light trails
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Use Screen blending for cinematic light overlap
        ctx.globalCompositeOperation = 'screen';
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animate);
    }

    init();
    animate();
});
