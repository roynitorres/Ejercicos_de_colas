/**
 * Práctica de Colas (Queue) - Lógica e Interfaz en JavaScript
 * Algoritmos y Estructuras de Datos
 * Prohibido usar Array.shift() — Lista Enlazada en O(1)
 */

// =====================================================
// EJERCICIO 1: Implementa la cola (Lista Enlazada O(1))
// =====================================================

class Nodo {
  constructor(valor) {
    this.valor = valor;
    this.siguiente = null;
  }
}

class Queue {
  constructor() {
    this.frente = null;
    this.final = null;
    this.cantidad = 0;
  }

  // Agrega al final en O(1)
  enqueue(valor) {
    const nuevoNodo = new Nodo(valor);
    if (this.final === null) {
      this.frente = nuevoNodo;
      this.final = nuevoNodo;
    } else {
      this.final.siguiente = nuevoNodo;
      this.final = nuevoNodo;
    }
    this.cantidad++;
  }

  // Saca y devuelve el elemento del frente en O(1) (o undefined si está vacía)
  dequeue() {
    if (this.frente === null) {
      return undefined;
    }
    const valor = this.frente.valor;
    this.frente = this.frente.siguiente;
    if (this.frente === null) {
      this.final = null;
    }
    this.cantidad--;
    return valor;
  }

  // Devuelve el frente sin sacarlo en O(1)
  peek() {
    return this.frente !== null ? this.frente.valor : undefined;
  }

  // Indica si la cola está vacía en O(1)
  isEmpty() {
    return this.cantidad === 0;
  }

  // Devuelve la cantidad de elementos en O(1)
  size() {
    return this.cantidad;
  }

  // Método auxiliar para recorrer y dibujar los nodos en pantalla
  toArray() {
    const resultado = [];
    let actual = this.frente;
    while (actual !== null) {
      resultado.push(actual.valor);
      actual = actual.siguiente;
    }
    return resultado;
  }
}

// =====================================================
// EJERCICIO 2: Invertir una cola (FÁCIL)
// =====================================================

function invertir(q) {
  const pila = []; // Solo usamos push() y pop()
  while (!q.isEmpty()) {
    pila.push(q.dequeue());
  }
  while (pila.length > 0) {
    q.enqueue(pila.pop());
  }
}

// =====================================================
// EJERCICIO 3: Simulación de banco (MEDIO)
// =====================================================

function esperaPromedio(clientes) {
  if (clientes.length === 0) return 0;

  const cola = new Queue();
  for (const duracion of clientes) {
    cola.enqueue(duracion);
  }

  let tiempoActual = 0;
  let sumaEsperas = 0;
  const totalClientes = cola.size();

  while (!cola.isEmpty()) {
    const duracionCliente = cola.dequeue();
    sumaEsperas += tiempoActual;
    tiempoActual += duracionCliente;
  }

  return Number((sumaEsperas / totalClientes).toFixed(2));
}

// =====================================================
// EJERCICIO 4: Números binarios con una cola (MEDIO)
// =====================================================

function generarBinarios(n) {
  const resultado = [];
  if (n <= 0) return resultado;

  const cola = new Queue();
  cola.enqueue("1");

  for (let i = 0; i < n; i++) {
    const actual = cola.dequeue();
    resultado.push(actual);
    cola.enqueue(actual + "0");
    cola.enqueue(actual + "1");
  }

  return resultado;
}

// =====================================================
// EJERCICIO 5: Papa caliente (DIFÍCIL)
// =====================================================

function papaCaliente(nombres, n) {
  if (nombres.length === 0) return "";

  const cola = new Queue();
  for (const nombre of nombres) {
    cola.enqueue(nombre);
  }

  while (cola.size() > 1) {
    for (let i = 0; i < n; i++) {
      cola.enqueue(cola.dequeue());
    }
    cola.dequeue(); // Sale quien tiene la papa
  }

  return cola.dequeue();
}

// =====================================================
// CONTROLADOR DEL SIMULADOR VISUAL (NAVEGADOR)
// =====================================================
if (typeof window !== "undefined") {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  window.switchTab = function (num) {
    document.getElementById("main-exercise-select").value = String(num);
    document.querySelectorAll(".tab-btn").forEach((btn, idx) => {
      btn.classList.toggle("active", idx + 1 === num);
    });
    document.querySelectorAll(".exercise-panel").forEach((panel, idx) => {
      panel.classList.toggle("active", idx + 1 === num);
    });
  };

  function renderQueueNodes(containerId, queue, highlightFront = false, prefixEmoji = "") {
    const container = document.getElementById(containerId);
    const items = queue.toArray();
    if (items.length === 0) {
      container.innerHTML = `<span class="null-box">frente: null | final: null (Cola vacía)</span>`;
      return;
    }

    let html = "";
    items.forEach((item, idx) => {
      const isFront = idx === 0;
      const isBack = idx === items.length - 1;
      html += `
        <div class="node-card ${isFront && highlightFront ? "highlight" : ""}">
          <div class="val">${isFront && prefixEmoji ? prefixEmoji + " " : ""}${item}</div>
          <div class="ptr-tags">
            ${isFront ? '<span class="ptr-badge ptr-front">Frente</span>' : ""}
            ${isBack ? '<span class="ptr-badge ptr-back">Final</span>' : ""}
          </div>
        </div>
        <span class="arrow">→</span>
      `;
    });
    html += `<span class="null-box">null</span>`;
    container.innerHTML = html;
  }

  function addLog(boxId, msg) {
    const box = document.getElementById(boxId);
    const div = document.createElement("div");
    div.className = "log-entry";
    div.innerHTML = msg;
    box.prepend(div);
  }

  // --- EJERCICIO 1 UI ---
  const qEx1 = new Queue();

  window.toggleEx1Input = function () {
    const op = document.getElementById("ex1-op").value;
    document.getElementById("ex1-input-wrap").style.display = op === "enqueue" ? "flex" : "none";
  };

  function updateEx1UI(lastDeq = null) {
    renderQueueNodes("ex1-nodes", qEx1);
    const p = qEx1.peek();
    document.getElementById("ex1-peek").textContent = p === undefined ? "undefined" : String(p);
    document.getElementById("ex1-size").textContent = qEx1.size();
    document.getElementById("ex1-empty").textContent = qEx1.isEmpty();
    if (lastDeq !== null) {
      document.getElementById("ex1-last-deq").textContent = String(lastDeq);
    }
  }

  window.ex1ExecuteSelected = function () {
    const op = document.getElementById("ex1-op").value;
    if (op === "enqueue") {
      const input = document.getElementById("ex1-input");
      const val = input.value.trim();
      if (!val) return;
      qEx1.enqueue(val);
      addLog("ex1-log", `<span class="tag">enqueue("${val}")</span> → Nodo agregado al final en O(1)`);
      updateEx1UI();
      if (/^[A-Ya-y]$/.test(val)) {
        input.value = String.fromCharCode(val.charCodeAt(0) + 1);
      }
    } else if (op === "dequeue") {
      const sacado = qEx1.dequeue();
      const texto = sacado === undefined ? "undefined" : `"${sacado}"`;
      addLog("ex1-log", `<span class="tag">dequeue()</span> → Devuelve <strong>${texto}</strong> en O(1)`);
      updateEx1UI(sacado === undefined ? "undefined" : sacado);
    } else if (op === "peek") {
      const frente = qEx1.peek();
      addLog("ex1-log", `<span class="tag">peek()</span> → Frente actual: <strong>${frente === undefined ? "undefined" : '"' + frente + '"'}</strong>`);
      updateEx1UI();
    } else if (op === "isEmpty") {
      addLog("ex1-log", `<span class="tag">isEmpty()</span> → Devuelve <strong>${qEx1.isEmpty()}</strong>`);
    } else if (op === "size") {
      addLog("ex1-log", `<span class="tag">size()</span> → Devuelve <strong>${qEx1.size()}</strong>`);
    }
  };

  window.ex1Clear = function () {
    while (!qEx1.isEmpty()) qEx1.dequeue();
    document.getElementById("ex1-log").innerHTML = "";
    updateEx1UI("-");
  };

  window.ex1RunDemo = async function () {
    window.ex1Clear();
    addLog("ex1-log", `<strong>--- Simulación del Ejemplo del PDF ---</strong>`);
    qEx1.enqueue("A");
    addLog("ex1-log", `<span class="tag">enqueue("A")</span>`);
    updateEx1UI();
    await sleep(500);

    qEx1.enqueue("B");
    addLog("ex1-log", `<span class="tag">enqueue("B")</span>`);
    updateEx1UI();
    await sleep(500);

    const d1 = qEx1.dequeue();
    addLog("ex1-log", `<span class="tag">dequeue()</span> → "${d1}"`);
    updateEx1UI(d1);
    await sleep(500);

    addLog("ex1-log", `<span class="tag">peek()</span> → "${qEx1.peek()}" | <span class="tag">size()</span> → ${qEx1.size()}`);
    await sleep(500);

    const d2 = qEx1.dequeue();
    addLog("ex1-log", `<span class="tag">dequeue()</span> → "${d2}"`);
    updateEx1UI(d2);
  };

  // --- EJERCICIO 2 UI ---
  let qEx2 = new Queue();
  let stackEx2 = [];
  let ex2Running = false;

  function renderStack(containerId, stack) {
    const container = document.getElementById(containerId);
    if (stack.length === 0) {
      container.innerHTML = `<span class="null-box">Pila vacía []</span>`;
      return;
    }
    container.innerHTML = stack
      .map(
        (val, idx) => `
        <div class="node-card ${idx === stack.length - 1 ? "highlight" : ""}">
          <div class="val">${val}</div>
          <div class="ptr-tags">
            ${idx === stack.length - 1 ? '<span class="ptr-badge ptr-back">Tope</span>' : ""}
          </div>
        </div>`
      )
      .join("");
  }

  window.ex2Load = function () {
    if (ex2Running) return;
    qEx2 = new Queue();
    stackEx2 = [];
    const raw = document
      .getElementById("ex2-input")
      .value.split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    raw.forEach((v) => qEx2.enqueue(v));
    document.getElementById("ex2-log").innerHTML = "";
    addLog("ex2-log", `Cola cargada: [${qEx2.toArray().join(", ")}]`);
    renderQueueNodes("ex2-queue-nodes", qEx2);
    renderStack("ex2-stack-nodes", stackEx2);
  };

  window.ex2AddSingle = function () {
    if (ex2Running) return;
    const input = document.getElementById("ex2-single");
    const val = input.value.trim();
    if (!val) return;
    qEx2.enqueue(val);
    input.value = "";
    renderQueueNodes("ex2-queue-nodes", qEx2);
    addLog("ex2-log", `Encolado "${val}". Cola actual: [${qEx2.toArray().join(", ")}]`);
  };

  window.ex2AnimateInvert = async function () {
    if (ex2Running) return;
    if (qEx2.isEmpty()) window.ex2Load();
    ex2Running = true;

    addLog("ex2-log", `<strong>Paso 1:</strong> Pasar de la Cola a la Pila con <code>pila.push(q.dequeue())</code>`);
    while (!qEx2.isEmpty()) {
      const val = qEx2.dequeue();
      stackEx2.push(val);
      addLog("ex2-log", `Se sacó <strong>${val}</strong> del frente y se apiló en el tope`);
      renderQueueNodes("ex2-queue-nodes", qEx2, true);
      renderStack("ex2-stack-nodes", stackEx2);
      await sleep(500);
    }

    addLog("ex2-log", `<strong>Paso 2:</strong> Regresar de la Pila a la Cola con <code>q.enqueue(pila.pop())</code>`);
    while (stackEx2.length > 0) {
      const val = stackEx2.pop();
      qEx2.enqueue(val);
      addLog("ex2-log", `Se sacó <strong>${val}</strong> de la pila y se encoló al final`);
      renderQueueNodes("ex2-queue-nodes", qEx2);
      renderStack("ex2-stack-nodes", stackEx2);
      await sleep(500);
    }

    addLog("ex2-log", `✅ <strong>Cola invertida con éxito:</strong> [${qEx2.toArray().join(", ")}]`);
    ex2Running = false;
  };

  // --- EJERCICIO 3 UI ---
  let ex3Running = false;

  window.ex3ApplyPreset = function () {
    const val = document.getElementById("ex3-preset").value;
    if (val !== "custom") {
      document.getElementById("ex3-input").value = val;
      window.ex3Simulate();
    }
  };

  window.ex3Simulate = async function () {
    if (ex3Running) return;
    ex3Running = true;
    document.getElementById("ex3-log").innerHTML = "";

    const duraciones = document
      .getElementById("ex3-input")
      .value.split(",")
      .map((n) => parseFloat(n.trim()))
      .filter((n) => !isNaN(n) && n >= 0);

    const cola = new Queue();
    duraciones.forEach((d) => cola.enqueue(d));
    renderQueueNodes("ex3-nodes", cola, true, "🧑");

    let tiempoActual = 0;
    let sumaEsperas = 0;
    const esperas = [];
    const total = cola.size();
    let idx = 1;

    while (!cola.isEmpty()) {
      renderQueueNodes("ex3-nodes", cola, true, "🧑");
      await sleep(550);

      const duracion = cola.dequeue();
      esperas.push(tiempoActual);
      sumaEsperas += tiempoActual;

      addLog("ex3-log", `Cliente #${idx} (tarda ${duracion}m) → esperó <strong>${tiempoActual} min</strong>`);

      tiempoActual += duracion;
      document.getElementById("ex3-clock").textContent = `${tiempoActual} min`;
      document.getElementById("ex3-waits").textContent = esperas.join(", ");
      renderQueueNodes("ex3-nodes", cola, true, "🧑");
      idx++;
      await sleep(500);
    }

    const promedio = total > 0 ? (sumaEsperas / total).toFixed(2) : "0.00";
    document.getElementById("ex3-avg").textContent = `${promedio} min`;
    addLog("ex3-log", `✅ <strong>Espera promedio:</strong> (${esperas.join(" + ")}) / ${total} = <strong>${promedio}</strong>`);
    ex3Running = false;
  };

  // --- EJERCICIO 4 UI ---
  let ex4Running = false;

  window.ex4Simulate = async function () {
    if (ex4Running) return;
    ex4Running = true;
    document.getElementById("ex4-log").innerHTML = "";

    const n = Math.min(32, Math.max(1, parseInt(document.getElementById("ex4-input").value, 10) || 5));
    const cola = new Queue();
    const resultado = [];

    cola.enqueue("1");
    renderQueueNodes("ex4-queue", cola, true);
    document.getElementById("ex4-result").innerHTML = '<span class="null-box">Iniciando...</span>';
    await sleep(450);

    for (let i = 0; i < n; i++) {
      const actual = cola.dequeue();
      resultado.push(actual);

      cola.enqueue(actual + "0");
      cola.enqueue(actual + "1");

      addLog(
        "ex4-log",
        `#${i + 1}: Sale <strong>"${actual}"</strong> → Se encolan <code>"${actual}0"</code> y <code>"${actual}1"</code>`
      );

      renderQueueNodes("ex4-queue", cola, true);
      document.getElementById("ex4-result").innerHTML = resultado
        .map(
          (b, idx) =>
            `<div class="node-card"><div class="val">"${b}"</div><div class="ptr-tags"><span class="ptr-badge ptr-front">#${idx + 1}</span></div></div>`
        )
        .join("");
      await sleep(450);
    }

    addLog("ex4-log", `✅ <strong>Binarios (${n}):</strong> ${resultado.map((x) => '"' + x + '"').join(", ")}`);
    ex4Running = false;
  };

  // --- EJERCICIO 5 UI ---
  let ex5Running = false;

  window.ex5ApplyPreset = function () {
    if (ex5Running) return;
    const p = document.getElementById("ex5-preset").value;
    if (p === "0") {
      document.getElementById("ex5-names").value = "Ana, Luis, Marta, Pedro, Sofia";
      document.getElementById("ex5-n").value = "3";
    } else if (p === "1") {
      document.getElementById("ex5-names").value = "A, B, C, D";
      document.getElementById("ex5-n").value = "1";
    } else {
      document.getElementById("ex5-names").value = "A, B, C, D, E, F, G";
      document.getElementById("ex5-n").value = "2";
    }
    window.ex5Simulate();
  };

  window.ex5Simulate = async function () {
    if (ex5Running) return;
    ex5Running = true;
    document.getElementById("ex5-log").innerHTML = "";
    document.getElementById("ex5-winner").textContent = "Jugando...";

    const nombres = document
      .getElementById("ex5-names")
      .value.split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const n = Math.max(0, parseInt(document.getElementById("ex5-n").value, 10) || 0);

    const cola = new Queue();
    nombres.forEach((nombre) => cola.enqueue(nombre));

    renderQueueNodes("ex5-nodes", cola, true, "🥔");
    document.getElementById("ex5-holder").textContent = cola.peek() || "-";
    document.getElementById("ex5-count").textContent = cola.size();
    await sleep(550);

    let ronda = 1;
    while (cola.size() > 1) {
      addLog("ex5-log", `<strong>--- Ronda ${ronda} (${n} pases) ---</strong>`);
      for (let i = 0; i < n; i++) {
        const pasa = cola.dequeue();
        cola.enqueue(pasa);
        document.getElementById("ex5-holder").textContent = cola.peek();
        addLog("ex5-log", `Pase ${i + 1}: <strong>${pasa}</strong> pasa la papa a <strong>${cola.peek()}</strong>`);
        renderQueueNodes("ex5-nodes", cola, true, "🥔");
        await sleep(400);
      }

      const eliminado = cola.dequeue();
      addLog("ex5-log", `💥 <strong>${eliminado}</strong> sale del juego.`);
      document.getElementById("ex5-holder").textContent = cola.peek();
      document.getElementById("ex5-count").textContent = cola.size();
      renderQueueNodes("ex5-nodes", cola, true, "🥔");
      ronda++;
      await sleep(600);
    }

    const ganador = cola.dequeue();
    cola.enqueue(ganador);
    renderQueueNodes("ex5-nodes", cola, true, "🏆");
    document.getElementById("ex5-winner").textContent = `🏆 ${ganador}`;
    addLog("ex5-log", `🏆 <strong>¡Ganador(a): ${ganador}!</strong>`);
    ex5Running = false;
  };

  // --- VISOR DE CÓDIGO (JAVASCRIPT Y PYTHON) ---
  const JS_CODE = `// Ejercicio 1: Implementación de Cola en JavaScript con Lista Enlazada O(1)
class Nodo {
  constructor(valor) {
    this.valor = valor;
    this.siguiente = null;
  }
}

class Queue {
  constructor() {
    this.frente = null;
    this.final = null;
    this.cantidad = 0;
  }

  enqueue(valor) {
    const nuevo = new Nodo(valor);
    if (this.final === null) {
      this.frente = nuevo;
      this.final = nuevo;
    } else {
      this.final.siguiente = nuevo;
      this.final = nuevo;
    }
    this.cantidad++;
  }

  dequeue() {
    if (this.frente === null) return undefined;
    const valor = this.frente.valor;
    this.frente = this.frente.siguiente;
    if (this.frente === null) this.final = null;
    this.cantidad--;
    return valor;
  }

  peek() { return this.frente ? this.frente.valor : undefined; }
  isEmpty() { return this.cantidad === 0; }
  size() { return this.cantidad; }
}

// Ejercicio 2: Invertir una cola
function invertir(q) {
  const pila = [];
  while (!q.isEmpty()) pila.push(q.dequeue());
  while (pila.length > 0) q.enqueue(pila.pop());
}

// Ejercicio 3: Simulación de banco
function esperaPromedio(clientes) {
  if (clientes.length === 0) return 0;
  const cola = new Queue();
  for (const c of clientes) cola.enqueue(c);
  let tiempoActual = 0, sumaEsperas = 0;
  const total = cola.size();
  while (!cola.isEmpty()) {
    const duracion = cola.dequeue();
    sumaEsperas += tiempoActual;
    tiempoActual += duracion;
  }
  return Number((sumaEsperas / total).toFixed(2));
}

// Ejercicio 4: Números binarios
function generarBinarios(n) {
  const resultado = [];
  const cola = new Queue();
  cola.enqueue("1");
  for (let i = 0; i < n; i++) {
    const actual = cola.dequeue();
    resultado.push(actual);
    cola.enqueue(actual + "0");
    cola.enqueue(actual + "1");
  }
  return resultado;
}

// Ejercicio 5: Papa caliente
function papaCaliente(nombres, n) {
  const cola = new Queue();
  for (const nombre of nombres) cola.enqueue(nombre);
  while (cola.size() > 1) {
    for (let i = 0; i < n; i++) cola.enqueue(cola.dequeue());
    cola.dequeue();
  }
  return cola.dequeue();
}`;

  const PYTHON_CODE = `# Ejercicio 1: Implementación de Cola en Python con Lista Enlazada O(1)
class Nodo:
    def __init__(self, valor):
        self.valor = valor
        self.siguiente = None

class Queue:
    def __init__(self):
        self.frente = None
        self.final = None
        self.cantidad = 0

    def enqueue(self, valor):
        nuevo = Nodo(valor)
        if self.final is None:
            self.frente = nuevo
            self.final = nuevo
        else:
            self.final.siguiente = nuevo
            self.final = nuevo
        self.cantidad += 1

    def dequeue(self):
        if self.frente is None:
            return None
        valor = self.frente.valor
        self.frente = self.frente.siguiente
        if self.frente is None:
            self.final = None
        self.cantidad -= 1
        return valor

    def peek(self):
        return self.frente.valor if self.frente else None

    def is_empty(self):
        return self.cantidad == 0

    def size(self):
        return self.cantidad

# Ejercicio 2: Invertir una cola
def invertir(q):
    pila = []
    while not q.is_empty():
        pila.append(q.dequeue())
    while len(pila) > 0:
        q.enqueue(pila.pop())

# Ejercicio 3: Simulación de banco
def espera_promedio(clientes):
    cola = Queue()
    for c in clientes:
        cola.enqueue(c)
    tiempo_actual = 0
    suma_esperas = 0
    total = cola.size()
    while not cola.is_empty():
        duracion = cola.dequeue()
        suma_esperas += tiempo_actual
        tiempo_actual += duracion
    return round(suma_esperas / total, 2)

# Ejercicio 4: Números binarios
def generar_binarios(n):
    resultado = []
    cola = Queue()
    cola.enqueue("1")
    for _ in range(n):
        actual = cola.dequeue()
        resultado.append(actual)
        cola.enqueue(actual + "0")
        cola.enqueue(actual + "1")
    return resultado

# Ejercicio 5: Papa caliente
def papa_caliente(nombres, n):
    cola = Queue()
    for nombre in nombres:
        cola.enqueue(nombre)
    while cola.size() > 1:
        for _ in range(n):
            cola.enqueue(cola.dequeue())
        cola.dequeue()
    return cola.dequeue()`;

  window.showLangCode = function (lang) {
    document.getElementById("btn-js").classList.toggle("active", lang === "js");
    document.getElementById("btn-py").classList.toggle("active", lang === "python");
    document.getElementById("code-display").textContent = lang === "js" ? JS_CODE : PYTHON_CODE;
  };

  window.addEventListener("DOMContentLoaded", () => {
    updateEx1UI();
    window.ex2Load();
    window.showLangCode("js");
  });
} else {
  // Si se ejecuta desde Node.js: node cola.js
  console.log("=== PRUEBAS OFICIALES DEL PDF (JAVASCRIPT) ===");
  const q1 = new Queue();
  q1.enqueue("A");
  q1.enqueue("B");
  console.log("Ej 1 -> dequeue():", q1.dequeue(), "| peek():", q1.peek(), "| size():", q1.size());

  const q2 = new Queue();
  [1, 2, 3, 4].forEach((x) => q2.enqueue(x));
  invertir(q2);
  console.log("Ej 2 -> Invertir [1, 2, 3, 4]:", q2.toArray());

  console.log("Ej 3 -> Banco [5, 3, 8]:", esperaPromedio([5, 3, 8]));
  console.log("Ej 4 -> Binarios(5):", generarBinarios(5));
  console.log("Ej 5 -> Papa Caliente:", papaCaliente(["Ana", "Luis", "Marta", "Pedro", "Sofia"], 3));
}
