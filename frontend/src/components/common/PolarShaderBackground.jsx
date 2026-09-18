import React, { useEffect, useRef } from 'react';

/**
 * Continuous WebGL Background Shader
 * Retuned to match the ANTARCTIC DECISION SUPPORT SYSTEM theme:
 * Charcoal/abyssal base (#0B0D0C) with subtle, continuous moving
 * muted chartreuse/yellow-green (#C8D35A) flows and fine scientific telemetry grain.
 */
export default function PolarShaderBackground({ opacity = 0.65, interactive = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    function syncSize() {
      if (!canvas) return;
      const w = canvas.clientWidth || window.innerWidth || 1280;
      const h = canvas.clientHeight || window.innerHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    syncSize();
    window.addEventListener('resize', syncSize);

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform vec2  u_resolution;
      uniform float u_time;
      uniform vec2  u_mouse;

      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m; m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 uv = v_texCoord;
        float ratio = u_resolution.x / max(u_resolution.y, 1.0);
        vec2 p = uv * vec2(ratio, 1.0);
        float t = u_time * 0.14;
        float n1 = snoise(p * 0.42 + t);
        float n2 = snoise(p * 0.85 - t * 0.32 + n1);
        
        float light = pow(abs(n2), 2.8) * 0.55; 
        
        // Charcoal Antarctic Base (#0B0D0C / #080B09)
        vec3 col = vec3(0.043, 0.051, 0.047); 
        
        // Theme Colors: Muted Olive (#56632B) & Chartreuse (#C8D35A)
        vec3 themeOlive = vec3(0.24, 0.28, 0.12);
        vec3 themeChartreuse = vec3(0.78, 0.83, 0.35);
        
        col += themeOlive * smoothstep(0.12, 0.92, n1) * 0.48;
        col += themeChartreuse * light * 0.45;

        // Scientific fine analog film grain for polar telemetry feel
        float grain = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453 + u_time);
        col += (grain - 0.5) * 0.025;
        
        // Subtle technical vignette
        float dist = length(uv - 0.5);
        col *= smoothstep(1.35, 0.25, dist);
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function createShader(glCtx, type, source) {
      const s = glCtx.createShader(type);
      glCtx.shaderSource(s, source);
      glCtx.compileShader(s);
      return s;
    }

    const program = gl.createProgram();
    gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vs));
    gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const pos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');

    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    const handleMouseMove = (e) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        mouseX = ((e.clientX - rect.left) / rect.width) * canvas.width;
        mouseY = (1.0 - (e.clientY - rect.top) / rect.height) * canvas.height;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    function render(t) {
      if (!canvas || !gl) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouseX, mouseY);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', syncSize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [interactive]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        opacity,
        overflow: 'hidden',
        transition: 'opacity 0.5s ease'
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
}
