// Smoke Effects Manager for Chicha
class SmokeManager {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId) || this.createCanvas();
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.isActive = false;
        this.animationFrame = null;
        this.intensity = 0;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }
    
    createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.id = 'smokeCanvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '9999';
        document.body.appendChild(canvas);
        return canvas;
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    toggleSmoke() {
        if (this.isActive) {
            this.stopSmoke();
        } else {
            this.startSmoke();
        }
    }
    
    startSmoke() {
        this.isActive = true;
        this.createParticles();
        this.animate();
    }
    
    stopSmoke() {
        this.isActive = false;
        this.intensity = 0;
        
        // Fade out existing particles
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        this.fadeOut();
    }
    
    createParticles() {
        if (!this.isActive) return;
        
        // Create smoke particles from bottom right (chicha position)
        const startX = window.innerWidth - 100;
        const startY = window.innerHeight - 100;
        
        for (let i = 0; i < 3; i++) {
            this.particles.push({
                x: startX + (Math.random() - 0.5) * 50,
                y: startY,
                vx: (Math.random() - 0.5) * 2,
                vy: -1 - Math.random() * 2,
                radius: 20 + Math.random() * 40,
                alpha: 0.05 + Math.random() * 0.15,
                life: 1.0
            });
        }
        
        // Limit particle count
        if (this.particles.length > 100) {
            this.particles = this.particles.slice(-100);
        }
        
        // Increase intensity gradually
        if (this.intensity < 1.0) {
            this.intensity += 0.02;
        }
        
        // Continue creating particles
        if (this.isActive) {
            setTimeout(() => this.createParticles(), 100);
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles = this.particles.filter(p => {
            // Update position
            p.x += p.vx;
            p.y += p.vy;
            p.vx += (Math.random() - 0.5) * 0.1; // Drift
            p.life -= 0.005;
            
            // Draw particle
            if (p.life > 0) {
                this.ctx.save();
                this.ctx.globalAlpha = p.alpha * p.life * this.intensity;
                
                const gradient = this.ctx.createRadialGradient(
                    p.x, p.y, 0,
                    p.x, p.y, p.radius
                );
                gradient.addColorStop(0, 'rgba(200, 200, 200, 0.8)');
                gradient.addColorStop(0.5, 'rgba(150, 150, 150, 0.4)');
                gradient.addColorStop(1, 'rgba(100, 100, 100, 0)');
                
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
                
                return true;
            }
            return false;
        });
        
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
    
    fadeOut() {
        if (this.intensity <= 0 && this.particles.length === 0) {
            cancelAnimationFrame(this.animationFrame);
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            return;
        }
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.intensity = Math.max(0, this.intensity - 0.02);
        
        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.01;
            
            if (p.life > 0) {
                this.ctx.save();
                this.ctx.globalAlpha = p.alpha * p.life * this.intensity;
                
                const gradient = this.ctx.createRadialGradient(
                    p.x, p.y, 0,
                    p.x, p.y, p.radius
                );
                gradient.addColorStop(0, 'rgba(200, 200, 200, 0.8)');
                gradient.addColorStop(1, 'rgba(100, 100, 100, 0)');
                
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
                
                return true;
            }
            return false;
        });
        
        requestAnimationFrame(() => this.fadeOut());
    }
}

// Export for use
window.smokeManager = new SmokeManager();
