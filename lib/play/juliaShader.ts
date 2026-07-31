/* One parametrised Julia-set shader, shared by every toy in /play.
 *
 * The maths is the same z -> z² + c escape-time loop the logo was baked from.
 * What each toy varies is only uniforms: where the camera sits, which c, and
 * how the palette phase moves. Keeping a single shader means the wordmark, the
 * creature maker and the infinite zoom cannot drift out of visual agreement.
 */

import { INK_RGB, LOGO_C, type Rgb } from "./palettes";


export const VERTEX_SHADER = `attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

/* The GLSL loop bound. Must be a compile-time literal in the shader, so
   it is baked into the source string rather than passed as a uniform;
   `uIter` then breaks out early at whatever the UI asks for. Not exported
   — nothing outside this module has any use for it. */
const MAX_ITERATIONS = 220;

export const FRAGMENT_SHADER = `precision highp float;

uniform vec2  uRes;          // drawing buffer size in px
uniform vec2  uC;            // the Julia constant
uniform vec2  uCenter;       // camera centre in the complex plane
uniform float uSpan;         // half-width of the view, in complex units
uniform float uRot;          // camera rotation, radians
uniform float uT;            // animation clock, seconds
uniform float uSpeed;        // palette cycles per second
uniform float uSweep;        // phase tilt along x -> a front crossing the frame
uniform float uSwell;        // band-width modulation -> bands breathe
uniform float uInterior;     // 0 = flat uInteriorBase, 1 = orbit-trap colour
uniform vec3  uInteriorBase; // ink for full-frame toys, brand pink in letters
uniform float uPixel;        // 1 = snap to the logo's 235 x 57 cell grid
uniform float uShadeMin;     // far-field brightness floor
uniform float uShadeLo;      // mu where shading starts to lift
uniform float uShadeHi;      // mu where shading reaches full brightness
uniform float uFade;         // master fade, for the reveal sting
uniform float uIter;         // active iteration count (<= MAX)
uniform sampler2D uPal;

const float TAU = 6.28318530718;
const vec2  GRID = vec2(235.0, 57.0);

void main() {
  vec2 frag = gl_FragCoord.xy;
  if (uPixel > 0.5) {
    frag = (floor(frag / uRes * GRID) + 0.5) / GRID * uRes;
  }
  vec2 uv = frag / uRes;

  // Screen -> complex plane. y is not flipped: gl_FragCoord.y already runs
  // upward, which matches the imaginary axis.
  vec2 d = (uv - 0.5) * 2.0 * uSpan * vec2(1.0, uRes.y / uRes.x);
  float cr = cos(uRot), sr = sin(uRot);
  vec2 z = uCenter + vec2(d.x * cr - d.y * sr, d.x * sr + d.y * cr);

  float mu = -1.0;
  float trap = 1e9;
  for (int i = 0; i < ${MAX_ITERATIONS}; i++) {
    if (float(i) >= uIter) break;
    z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + uC;
    float r2 = dot(z, z);
    trap = min(trap, r2);                  // closest approach: a field for the interior
    if (r2 > 16.0) {
      mu = float(i) + 1.0 - log2(0.5 * log(r2));   // smooth escape time
      break;
    }
  }

  float t0, shade;
  if (mu >= 0.0) {
    t0 = mu * 0.032 + 0.08;
    shade = uShadeMin + (1.0 - uShadeMin) * smoothstep(uShadeLo, uShadeHi, mu);
  } else {
    t0 = 0.66 + sqrt(trap) * 0.55;
    shade = 1.0;
  }

  float phase = uSpeed * uT
              + uSweep * (uv.x - 0.5)
              + uSwell * 0.5 * sin(TAU * (uv.x * 1.8 - uT * 0.22) + t0 * TAU);

  vec3 col = texture2D(uPal, vec2(fract(t0 + phase), 0.5)).rgb * shade;
  if (mu < 0.0) col = mix(uInteriorBase, col, uInterior);

  gl_FragColor = vec4(col * uFade, 1.0);
}`;

export type JuliaUniforms = {
  c: [number, number];
  center: [number, number];
  span: number;
  rot: number;
  t: number;
  speed: number;
  sweep: number;
  swell: number;
  interior: number;
  interiorBase: Rgb;
  pixel: number;
  shadeMin: number;
  shadeLo: number;
  shadeHi: number;
  fade: number;
  iterations: number;
};

/** Full-frame defaults: the logo's constant, dark far field, gentle drift. */
export const defaultUniforms = (): JuliaUniforms => ({
  c: [LOGO_C[0], LOGO_C[1]],
  center: [0, 0],
  span: 1.45,
  rot: 0,
  t: 0,
  speed: 0.05,
  sweep: 0,
  swell: 0,
  interior: 0,
  interiorBase: [...INK_RGB] as Rgb,
  pixel: 0,
  shadeMin: 0.1,
  shadeLo: 1.5,
  shadeHi: 9,
  fade: 1,
  iterations: 160,
});

export const UNIFORM_NAMES = [
  "uRes", "uC", "uCenter", "uSpan", "uRot", "uT", "uSpeed", "uSweep", "uSwell",
  "uInterior", "uInteriorBase", "uPixel", "uShadeMin", "uShadeLo", "uShadeHi",
  "uFade", "uIter", "uPal",
] as const;

export type UniformName = (typeof UNIFORM_NAMES)[number];
