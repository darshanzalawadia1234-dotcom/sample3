import React, { useEffect, useRef } from 'react';

/**
 * WebGL Polar Deep Oceanic Aurora Background Shader
 * Directly ported from reference_design/stitch_polaris_dss_antarctic_operations_platform-2/code.html
 * Provides real-time simplex noise Antarctic oceanic depths, glacial aurora flows,
 * analog telemetry film grain, and radar instrumentation depth vignette.
 */
export default function PolarShaderBackground({ opacity = 0.85, interactive = true }) {
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
        float t = u_time * 0.16;
        float n1 = snoise(p * 0.45 + t);
        float n2 = snoise(p * 0.90 - t * 0.35 + n1);
        
        float light = pow(abs(n2), 2.4) * 0.65; 
        
        // Antarctic Polar Deep Oceanic Base Abyss (#04132c, #010d26)
        vec3 col = vec3(0.015, 0.075, 0.17); 
        
        // Theme Cyan & Polar Glacial Aurora Flow (#0284c7, #38bdf8, #0ea5e9)
        vec3 themeColor1 = vec3(0.01, 0.52, 0.78); // #0284c7
        vec3 themeColor2 = vec3(0.22, 0.74, 0.97); // #38bdf8
        
        col += themeColor1 * smoothstep(0.08, 0.95, n1) * 0.55;
        col += themeColor2 * light * 0.85;

        // Scientific analog film grain for polar telemetry feel
        float grain = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453 + u_time);
        col += (grain - 0.5) * 0.035;
        
        // Vignette for radar instrumentation depth
        float dist = length(uv - 0.5);
        col *= smoothstep(1.3, 0.25, dist);
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
