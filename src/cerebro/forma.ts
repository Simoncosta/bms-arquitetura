// A forma orgânica de cada lobo: um contorno suave com pequenas irregularidades e as
// «circunvoluções» por dentro. Determinístico: a mesma semente dá sempre a mesma forma.

function aleatorio(semente: number) {
  const x = Math.sin(semente * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

type P = [number, number];

/** Curva fechada que passa pelos pontos (Catmull-Rom → Bézier). */
function curvaFechada(pontos: P[]) {
  const n = pontos.length;
  let d = `M ${pontos[0][0].toFixed(1)} ${pontos[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pontos[(i - 1 + n) % n];
    const p1 = pontos[i];
    const p2 = pontos[(i + 1) % n];
    const p3 = pontos[(i + 2) % n];
    const c1: P = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: P = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return `${d} Z`;
}

/**
 * Uma superelipse (mais «cheia» nos cantos do que uma elipse) com pequenas irregularidades:
 * a grelha de pontos cabe lá dentro e a forma continua orgânica.
 */
export function contornoDoLobo(largura: number, altura: number, semente: number) {
  const n = 22;
  const expoente = 2 / 3; // superelipse de grau 3
  const cx = largura / 2;
  const cy = altura / 2;
  const pontos: P[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    const r = 0.985 + (aleatorio(semente + i) - 0.5) * 0.05;
    pontos.push([
      cx + Math.sign(c) * Math.abs(c) ** expoente * (largura / 2) * r,
      cy + Math.sign(s) * Math.abs(s) ** expoente * (altura / 2) * r,
    ]);
  }
  return curvaFechada(pontos);
}

/** Linhas onduladas por dentro do lobo, que lembram as dobras do cérebro. */
export function circunvolucoes(largura: number, altura: number, semente: number) {
  const linhas: string[] = [];
  const quantas = 7;
  for (let k = 0; k < quantas; k++) {
    const y0 = altura * (0.14 + (k / (quantas - 1)) * 0.72);
    const amplitude = 26 + aleatorio(semente * 3 + k) * 34;
    const onda = 2.2 + aleatorio(semente * 5 + k) * 1.6;
    const fase = aleatorio(semente * 7 + k) * Math.PI * 2;
    let d = '';
    for (let s = 0; s <= 40; s++) {
      const x = largura * (0.04 + (s / 40) * 0.92);
      const y = y0 + Math.sin((s / 40) * Math.PI * 2 * onda + fase) * amplitude;
      d += `${s === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)} `;
    }
    linhas.push(d);
  }
  return linhas;
}
