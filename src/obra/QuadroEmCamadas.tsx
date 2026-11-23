// Uma pintura em aguarela feita de camadas a profundidades diferentes, numa folha de papel creme de bordas rasgadas.
// As camadas mexem-se a velocidades diferentes (a câmara respira e aproxima-se do que se desbloqueia), o que dá a
// sensação de 3D. Cada zona começa desfocada, desbotada e escura; ao desbloquear, abre por manchas, com a orla da
// tinta a secar. WebGL puro, sem bibliotecas. Sem WebGL, mostra a composição com desfoque CSS.

import { useEffect, useRef, useState, type CSSProperties } from 'react';

type Ponto = [number, number];

export type CamadaDoQuadro = {
  id: string;
  src: string;
  profundidade: number;
  verde: boolean;
  recorte?: Ponto[][];
};

export type ZonaDoQuadro = { camada: string; formas: Ponto[][] };

type Props = {
  camadas: CamadaDoQuadro[];
  /** Todas as zonas possíveis, numa ordem fixa. */
  zonas: ZonaDoQuadro[];
  /** Para cada zona (mesma ordem), se já está desbloqueada. */
  abertas: boolean[];
  /** Desbloqueia tudo (o fim). */
  tudo?: boolean;
  /** Para onde a câmara olha: centro (0–1) e aproximação (1 = quadro inteiro). */
  foco: { x: number; y: number; zoom: number };
  /** 0 → 1: o quadro inteiro aquece e satura. */
  vida?: number;
  /** 0 → 1: mistura de camadas alternativas (ids em `acesas`) por cima das normais. */
  aceso?: number;
  acesas?: string[];
  /** 0–3: o ato em que vamos; o que ainda está bloqueado vai ganhando um pouco de cor. */
  ato?: number;
  largura: number;
  altura: number;
  /** Imagem de recurso sem WebGL. */
  composicao: string;
  style?: CSSProperties;
};

const VERTICE = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  vUv.y = 1.0 - vUv.y;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAGMENTO = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uImg;
uniform sampler2D uMascara;
uniform sampler2D uRecorte;
uniform float uVerde;
uniform float uPapel;
uniform float uProf;
uniform float uMistura;
uniform vec3 uCam;
uniform vec2 uDeriva;
uniform float uTime;
uniform float uVida;
uniform float uAto;
uniform float uTudo;
uniform vec2 uTexel;
uniform vec2 uAspeto;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}
float bordo(vec2 uv, float escala, float semente) {
  vec2 d = abs(uv - 0.5) * 2.0;
  d.x = 1.0 - (1.0 - d.x) * uAspeto.x;
  d.y = 1.0 - (1.0 - d.y) * uAspeto.y;
  return max(d.x, d.y) + (fbm(uv * escala + semente) - 0.5) * 0.06;
}
// Lê a camada já sem o fundo verde (e sem a orla esverdeada), cortada pelo recorte; devolve pré-multiplicado.
vec4 amostra(vec2 p) {
  vec3 c = texture2D(uImg, p).rgb;
  float outro = max(c.r, c.b);
  float verde = c.g - outro;
  float a = 1.0 - uVerde * smoothstep(0.09, 0.24, verde);
  c.g = mix(c.g, min(c.g, outro + 0.03), uVerde);
  a *= texture2D(uRecorte, p).r;
  vec2 dentro = step(vec2(0.0), p) * step(p, vec2(1.0));
  a *= dentro.x * dentro.y;
  return vec4(c * a, a);
}

void main() {
  vec2 uv = vUv;
  // A folha de papel (rasgada por fora) e a pintura dentro dela (rasgada por dentro).
  float papel = smoothstep(1.0, 0.985, bordo(uv, 7.0, 0.0));
  float pintura = smoothstep(0.962, 0.94, bordo(uv, 11.0, 4.2));

  if (uPapel > 0.5) {
    vec3 creme = vec3(0.965, 0.935, 0.87) * (0.95 + 0.05 * noise(uv * 500.0)) * (0.97 + 0.03 * fbm(uv * 8.0));
    gl_FragColor = vec4(creme * papel, papel);
    return;
  }

  // A câmara: cada camada aproxima-se e desloca-se na proporção da sua profundidade (é isto que dá o 3D).
  float k = 0.25 + 0.75 * uProf;
  float zoom = 1.035 * (1.0 + (uCam.z - 1.0) * k);
  vec2 luv = (uv - 0.5) / zoom + 0.5 + (uCam.xy - 0.5) * k * 0.55 * clamp((uCam.z - 1.0) * 6.0, 0.0, 1.0) + uDeriva * k;

  vec4 nitido = amostra(luv);
  vec4 desf = vec4(0.0);
  for (int i = 0; i < 12; i++) {
    float a = float(i) * 2.39996;
    float r = sqrt(float(i) / 12.0) * 13.0;
    desf += amostra(luv + vec2(cos(a), sin(a)) * r * uTexel);
  }
  desf /= 12.0;

  // Bloqueado: desfocado, desbotado e escuro; ganha um pouco de cor a cada ato.
  float lum = dot(desf.rgb, vec3(0.299, 0.587, 0.114));
  vec4 bloqueado = vec4(mix(vec3(lum), desf.rgb, 0.18 + 0.1 * uAto) * (0.72 + 0.05 * uAto), desf.a);

  // Desbloqueado: nítido; no fim (vida), mais quente e saturado.
  float ln = dot(nitido.rgb, vec3(0.299, 0.587, 0.114));
  nitido.rgb = mix(nitido.rgb, mix(vec3(ln), nitido.rgb, 1.2) * vec3(1.04, 1.0, 0.95), uVida);

  float m = max(texture2D(uMascara, luv).r, uTudo);
  float limiar = 0.1 + 0.8 * fbm(luv * 7.0 + uProf * 3.1);
  float aberto = smoothstep(limiar - 0.07, limiar + 0.07, m);
  float orla = aberto * (1.0 - aberto) * 4.0;

  vec4 cor = mix(bloqueado, nitido, aberto);
  cor.rgb *= 1.0 - orla * 0.22;
  gl_FragColor = cor * pintura * uMistura;
}`;

const ESTATICO = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('estatico');

function compilar(gl: WebGLRenderingContext, tipo: number, fonte: string) {
  const s = gl.createShader(tipo)!;
  gl.shaderSource(s, fonte);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader');
  return s;
}

function caminho(ctx: CanvasRenderingContext2D, forma: Ponto[], sx: number, sy: number) {
  ctx.beginPath();
  forma.forEach(([x, y], i) => (i ? ctx.lineTo(x * sx, y * sy) : ctx.moveTo(x * sx, y * sy)));
  ctx.closePath();
}

async function carregar(src: string) {
  const img = new Image();
  img.src = src;
  await img.decode();
  return img;
}

/** O recorte de uma camada, numa textura pequena: branco onde a camada conta, preto onde é lixo da IA. */
function desenharRecorte(c: CamadaDoQuadro, largura: number, altura: number) {
  const tela = document.createElement('canvas');
  tela.width = 480;
  tela.height = 270;
  const ctx = tela.getContext('2d')!;
  ctx.fillStyle = c.recorte ? '#000' : '#fff';
  ctx.fillRect(0, 0, tela.width, tela.height);
  if (c.recorte) {
    ctx.filter = 'blur(2px)';
    ctx.fillStyle = '#fff';
    for (const forma of c.recorte) { caminho(ctx, forma, tela.width / largura, tela.height / altura); ctx.fill(); }
  }
  return tela;
}

export function QuadroEmCamadas(props: Props) {
  const tela = useRef<HTMLCanvasElement>(null);
  const alvo = useRef(props);
  const [semWebGL, setSemWebGL] = useState(false);
  alvo.current = props;
  const { camadas, largura, altura, zonas } = props;

  useEffect(() => {
    const canvas = tela.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!gl) { setSemWebGL(true); return; }
    let vivo = true;
    let quadro = 0;

    let programa: WebGLProgram;
    try {
      programa = gl.createProgram()!;
      gl.attachShader(programa, compilar(gl, gl.VERTEX_SHADER, VERTICE));
      gl.attachShader(programa, compilar(gl, gl.FRAGMENT_SHADER, FRAGMENTO));
      gl.linkProgram(programa);
      gl.useProgram(programa);
    } catch {
      setSemWebGL(true);
      return;
    }
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(programa, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    const u = (n: string) => gl.getUniformLocation(programa, n);
    const uni = {
      papel: u('uPapel'), prof: u('uProf'), mistura: u('uMistura'), cam: u('uCam'), deriva: u('uDeriva'), time: u('uTime'),
      vida: u('uVida'), ato: u('uAto'), tudo: u('uTudo'), texel: u('uTexel'), aspeto: u('uAspeto'),
    };
    gl.uniform1i(u('uImg'), 0);
    gl.uniform1i(u('uMascara'), 1);
    gl.uniform1i(u('uRecorte'), 2);
    const uVerde = u('uVerde');
    gl.uniform2f(uni.texel, 1 / largura, 1 / altura);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const novaTextura = () => {
      const t = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return t;
    };

    // Uma máscara por camada: cada zona é pintada a branco com a força com que já está aberta.
    const ML = 480, MA = 270;
    const mascaras = camadas.map(() => {
      const c = document.createElement('canvas');
      c.width = ML;
      c.height = MA;
      return { canvas: c, ctx: c.getContext('2d')!, textura: null as WebGLTexture | null, suja: true };
    });
    const forcas: number[] = zonas.map(() => 0);
    const pintarMascara = (i: number) => {
      const { ctx } = mascaras[i];
      ctx.globalAlpha = 1;
      ctx.filter = 'none';
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, ML, MA);
      ctx.filter = 'blur(3px)';
      ctx.fillStyle = '#fff';
      zonas.forEach((z, j) => {
        if (z.camada !== camadas[i].id || forcas[j] < 0.002) return;
        ctx.globalAlpha = Math.min(1, forcas[j]);
        for (const forma of z.formas) { caminho(ctx, forma, ML / largura, MA / altura); ctx.fill(); }
      });
      ctx.filter = 'none';
    };

    const ajustar = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const estado = {
      cam: { ...alvo.current.foco },
      vida: alvo.current.vida ?? 0,
      aceso: alvo.current.aceso ?? 0,
      ato: alvo.current.ato ?? 0,
      tudo: alvo.current.tudo ? 1 : 0,
    };
    const aproximar = (atual: number, destino: number, f: number) => {
      if (ESTATICO) return destino;
      const v = atual + (destino - atual) * f;
      return Math.abs(destino - v) < 0.0005 ? destino : v;
    };

    Promise.all(camadas.map((c) => carregar(c.src))).then((imagens) => {
      if (!vivo) return;
      gl.activeTexture(gl.TEXTURE0);
      const texturas = imagens.map((img) => {
        const t = novaTextura();
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        return t;
      });
      gl.activeTexture(gl.TEXTURE2);
      const recortes = camadas.map((c) => {
        const t = novaTextura();
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, desenharRecorte(c, largura, altura));
        return t;
      });
      gl.activeTexture(gl.TEXTURE1);
      mascaras.forEach((m) => { m.textura = novaTextura(); });
      ajustar();
      const inicio = performance.now();
      const desenhar = (agora: number) => {
        if (!vivo) return;
        const a = alvo.current;
        // As zonas abrem (ou fecham, ao recuar) em ~1,5 s.
        zonas.forEach((z, j) => {
          const destino = a.abertas[j] ? 1 : 0;
          if (forcas[j] === destino) return;
          let prox = ESTATICO ? destino : forcas[j] + (destino - forcas[j]) * 0.04;
          if (Math.abs(destino - prox) < 0.003) prox = destino;
          forcas[j] = prox;
          const i = camadas.findIndex((c) => c.id === z.camada);
          if (i >= 0) mascaras[i].suja = true;
        });
        estado.cam.x = aproximar(estado.cam.x, a.foco.x, 0.025);
        estado.cam.y = aproximar(estado.cam.y, a.foco.y, 0.025);
        estado.cam.zoom = aproximar(estado.cam.zoom, a.foco.zoom, 0.025);
        estado.vida = aproximar(estado.vida, a.vida ?? 0, 0.02);
        estado.aceso = aproximar(estado.aceso, a.aceso ?? 0, 0.015);
        estado.ato = aproximar(estado.ato, a.ato ?? 0, 0.02);
        estado.tudo = aproximar(estado.tudo, a.tudo ? 1 : 0, 0.015);

        const t = (agora - inicio) / 1000;
        const deriva = ESTATICO ? [0, 0] : [Math.sin(t * 0.13) * 0.006, Math.cos(t * 0.1) * 0.004];
        const asp = canvas.clientWidth / Math.max(1, canvas.clientHeight);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform3f(uni.cam, estado.cam.x, estado.cam.y, estado.cam.zoom);
        gl.uniform2f(uni.deriva, deriva[0], deriva[1]);
        gl.uniform1f(uni.time, t);
        gl.uniform1f(uni.vida, estado.vida);
        gl.uniform1f(uni.ato, estado.ato);
        gl.uniform1f(uni.tudo, estado.tudo);
        gl.uniform2f(uni.aspeto, asp >= 1 ? 1 : asp, asp >= 1 ? 1 / asp : 1);

        // A folha de papel primeiro, depois as camadas do fundo para a frente.
        gl.uniform1f(uni.papel, 1);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.uniform1f(uni.papel, 0);
        camadas.forEach((c, i) => {
          const m = mascaras[i];
          if (m.suja) {
            pintarMascara(i);
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, m.textura);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, m.canvas);
            m.suja = false;
          }
          const mistura = a.acesas?.includes(c.id) ? estado.aceso : 1;
          if (mistura < 0.002) return;
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, texturas[i]);
          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, m.textura);
          gl.activeTexture(gl.TEXTURE2);
          gl.bindTexture(gl.TEXTURE_2D, recortes[i]);
          gl.uniform1f(uVerde, c.verde ? 1 : 0);
          gl.uniform1f(uni.prof, c.profundidade);
          gl.uniform1f(uni.mistura, mistura);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        });
        quadro = requestAnimationFrame(desenhar);
      };
      quadro = requestAnimationFrame(desenhar);
    }).catch(() => setSemWebGL(true));

    window.addEventListener('resize', ajustar);
    return () => {
      vivo = false;
      cancelAnimationFrame(quadro);
      window.removeEventListener('resize', ajustar);
    };
  }, [camadas, zonas, largura, altura]);

  if (semWebGL) {
    const n = props.abertas.filter(Boolean).length;
    const progresso = props.tudo ? 1 : n / Math.max(1, props.abertas.length);
    return (
      <img src={props.composicao} alt="" style={{
        ...props.style, objectFit: 'cover', borderRadius: 24,
        filter: `blur(${(1 - progresso) * 10}px) saturate(${0.4 + progresso * 0.6})`, transition: 'filter 1.6s ease',
      }} />
    );
  }
  return <canvas ref={tela} style={props.style} />;
}
