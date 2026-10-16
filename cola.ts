/**
 * Práctica de Colas - Algoritmos y Estructuras de Datos
 * Ejecutar con: npx tsx cola.ts
 */

// ==========================================
// EJERCICIO 1: Implementa la cola (BASE)
// ==========================================

class Nodo<T> {
  valor: T;
  siguiente: Nodo<T> | null = null;

  constructor(valor: T) {
    this.valor = valor;
  }
}

export class Queue<T> {
  private frente: Nodo<T> | null = null;
  private final: Nodo<T> | null = null;
  private cantidad: number = 0;

  // Agrega un elemento al final de la cola en O(1)
  enqueue(valor: T): void {
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

  // Saca y devuelve el elemento del frente en O(1)
  dequeue(): T | undefined {
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
  peek(): T | undefined {
    return this.frente ? this.frente.valor : undefined;
  }

  // Verifica si la cola está vacía en O(1)
  isEmpty(): boolean {
    return this.cantidad === 0;
  }

  // Devuelve el número de elementos en O(1)
  size(): number {
    return this.cantidad;
  }

  // Método auxiliar para visualizar la cola (no usa shift)
  toArray(): T[] {
    const resultado: T[] = [];
    let actual = this.frente;
    while (actual !== null) {
      resultado.push(actual.valor);
      actual = actual.siguiente;
    }
    return resultado;
  }
}

// ==========================================
// EJERCICIO 2: Invertir una cola (FÁCIL)
// ==========================================

export function invertir<T>(q: Queue<T>): void {
  const pila: T[] = []; // Solo usamos push() y pop()

  // Paso 1: Vaciar la cola en la pila
  while (!q.isEmpty()) {
    pila.push(q.dequeue()!);
  }

  // Paso 2: Vaciar la pila de regreso a la cola
  while (pila.length > 0) {
    q.enqueue(pila.pop()!);
  }
}

// ==========================================
// EJERCICIO 3: Simulación de banco (MEDIO)
// ==========================================

export function esperaPromedio(clientes: number[]): number {
  if (clientes.length === 0) return 0;

  const cola = new Queue<number>();
  for (const duracion of clientes) {
    cola.enqueue(duracion);
  }

  let tiempoActual = 0;
  let sumaEsperas = 0;
  const totalClientes = cola.size();

  while (!cola.isEmpty()) {
    const duracionCliente = cola.dequeue()!;
    // El cliente actual tuvo que esperar todo el 'tiempoActual' acumulado antes de ser atendido
    sumaEsperas += tiempoActual;
    // La caja tarda 'duracionCliente' minutos en atenderlo
    tiempoActual += duracionCliente;
  }

  return Number((sumaEsperas / totalClientes).toFixed(2));
}

// ==========================================
// EJERCICIO 4: Números binarios con una cola (MEDIO)
// ==========================================

export function generarBinarios(n: number): string[] {
  const resultado: string[] = [];
  if (n <= 0) return resultado;

  const cola = new Queue<string>();
  cola.enqueue("1");

  for (let i = 0; i < n; i++) {
    const actual = cola.dequeue()!;
    resultado.push(actual);

    // Generamos los siguientes dos números binarios agregando "0" y "1" al final
    cola.enqueue(actual + "0");
    cola.enqueue(actual + "1");
  }

  return resultado;
}

// ==========================================
// EJERCICIO 5: Papa caliente (DIFÍCIL)
// ==========================================

export function papaCaliente(nombres: string[], n: number): string {
  if (nombres.length === 0) return "";

  const cola = new Queue<string>();
  for (const nombre of nombres) {
    cola.enqueue(nombre);
  }

  while (cola.size() > 1) {
    // La papa pasa n veces: quien la tiene la pasa al siguiente y va al final de la fila
    for (let i = 0; i < n; i++) {
      cola.enqueue(cola.dequeue()!);
    }
    // Quien tiene la papa después de n pases sale del juego
    cola.dequeue();
  }

  return cola.dequeue()!;
}

// ==========================================
// PRUEBAS DE CONSOLA (Ejemplos del PDF)
// ==========================================

console.log("=== EJERCICIO 1: Queue Base ===");
const q1 = new Queue<string>();
q1.enqueue("A");
q1.enqueue("B");
console.log("dequeue() ->", q1.dequeue()); // "A"
console.log("peek()    ->", q1.peek());    // "B"
console.log("size()    ->", q1.size());    // 1
console.log("dequeue() ->", q1.dequeue()); // "B"
console.log("isEmpty() ->", q1.isEmpty()); // true
console.log("dequeue() ->", q1.dequeue()); // undefined

console.log("\n=== EJERCICIO 2: Invertir Cola ===");
const q2 = new Queue<number>();
[1, 2, 3, 4].forEach((n) => q2.enqueue(n));
console.log("Antes de invertir:  ", q2.toArray().join(", "));
invertir(q2);
console.log("Después de invertir:", q2.toArray().join(", "));

console.log("\n=== EJERCICIO 3: Simulación de Banco ===");
console.log("Duraciones [5, 3, 8]    -> Promedio:", esperaPromedio([5, 3, 8]));
console.log("Duraciones [4, 4, 4, 4] -> Promedio:", esperaPromedio([4, 4, 4, 4]));

console.log("\n=== EJERCICIO 4: Números Binarios ===");
console.log("generarBinarios(5)  ->", generarBinarios(5));
console.log("generarBinarios(10) ->", generarBinarios(10));

console.log("\n=== EJERCICIO 5: Papa Caliente ===");
console.log('["Ana", "Luis", "Marta", "Pedro", "Sofia"], 3 ->', papaCaliente(["Ana", "Luis", "Marta", "Pedro", "Sofia"], 3));
console.log('["A", "B", "C", "D"], 1 ->', papaCaliente(["A", "B", "C", "D"], 1));
console.log('["A", "B", "C", "D", "E", "F", "G"], 2 ->', papaCaliente(["A", "B", "C", "D", "E", "F", "G"], 2));
