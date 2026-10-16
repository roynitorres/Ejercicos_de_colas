import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.Stack;

/**
 * Práctica de Colas (Queue) - Implementación en Java
 * Algoritmos y Estructuras de Datos
 * Compilar y ejecutar: javac PracticaColas.java && java PracticaColas
 */
public class PracticaColas {

    // ==========================================
    // EJERCICIO 1: Implementa la cola (BASE)
    // ==========================================

    static class Nodo<T> {
        T valor;
        Nodo<T> siguiente;

        Nodo(T valor) {
            this.valor = valor;
            this.siguiente = null;
        }
    }

    public static class Queue<T> {
        private Nodo<T> frente = null;
        private Nodo<T> finalCola = null;
        private int cantidad = 0;

        // Agrega al final en O(1)
        public void enqueue(T valor) {
            Nodo<T> nuevoNodo = new Nodo<>(valor);
            if (this.finalCola == null) {
                this.frente = nuevoNodo;
                this.finalCola = nuevoNodo;
            } else {
                this.finalCola.siguiente = nuevoNodo;
                this.finalCola = nuevoNodo;
            }
            this.cantidad++;
        }

        // Saca y devuelve el elemento del frente en O(1) (o null si está vacía)
        public T dequeue() {
            if (this.frente == null) {
                return null;
            }
            T valor = this.frente.valor;
            this.frente = this.frente.siguiente;
            if (this.frente == null) {
                this.finalCola = null;
            }
            this.cantidad--;
            return valor;
        }

        // Devuelve el frente sin sacarlo en O(1)
        public T peek() {
            return (this.frente != null) ? this.frente.valor : null;
        }

        // Indica si está vacía en O(1)
        public boolean isEmpty() {
            return this.cantidad == 0;
        }

        // Devuelve la cantidad de elementos en O(1)
        public int size() {
            return this.cantidad;
        }

        // Método auxiliar para visualizar la cola
        public List<T> toList() {
            List<T> resultado = new ArrayList<>();
            Nodo<T> actual = this.frente;
            while (actual != null) {
                resultado.add(actual.valor);
                actual = actual.siguiente;
            }
            return resultado;
        }
    }

    // ==========================================
    // EJERCICIO 2: Invertir una cola (FÁCIL)
    // ==========================================

    public static <T> void invertir(Queue<T> q) {
        Stack<T> pila = new Stack<>(); // Solo usamos push() y pop()
        while (!q.isEmpty()) {
            pila.push(q.dequeue());
        }
        while (!pila.isEmpty()) {
            q.enqueue(pila.pop());
        }
    }

    // ==========================================
    // EJERCICIO 3: Simulación de banco (MEDIO)
    // ==========================================

    public static double esperaPromedio(int[] clientes) {
        if (clientes.length == 0) return 0.0;

        Queue<Integer> cola = new Queue<>();
        for (int duracion : clientes) {
            cola.enqueue(duracion);
        }

        int tiempoActual = 0;
        double sumaEsperas = 0;
        int totalClientes = cola.size();

        while (!cola.isEmpty()) {
            int duracionCliente = cola.dequeue();
            sumaEsperas += tiempoActual;
            tiempoActual += duracionCliente;
        }

        return Math.round((sumaEsperas / totalClientes) * 100.0) / 100.0;
    }

    // ==========================================
    // EJERCICIO 4: Números binarios con una cola (MEDIO)
    // ==========================================

    public static List<String> generarBinarios(int n) {
        List<String> resultado = new ArrayList<>();
        if (n <= 0) return resultado;

        Queue<String> cola = new Queue<>();
        cola.enqueue("1");

        for (int i = 0; i < n; i++) {
            String actual = cola.dequeue();
            resultado.add(actual);
            cola.enqueue(actual + "0");
            cola.enqueue(actual + "1");
        }

        return resultado;
    }

    // ==========================================
    // EJERCICIO 5: Papa caliente (DIFÍCIL)
    // ==========================================

    public static String papaCaliente(String[] nombres, int n) {
        if (nombres.length == 0) return "";

        Queue<String> cola = new Queue<>();
        for (String nombre : nombres) {
            cola.enqueue(nombre);
        }

        while (cola.size() > 1) {
            for (int i = 0; i < n; i++) {
                cola.enqueue(cola.dequeue());
            }
            cola.dequeue(); // Sale del juego quien tiene la papa
        }

        return cola.dequeue();
    }

    // ==========================================
    // PRUEBAS Y MENÚ DINÁMICO EN CONSOLA
    // ==========================================

    public static void main(String[] args) {
        System.out.println("=== PRUEBAS OFICIALES DEL PDF (JAVA) ===");

        Queue<String> q1 = new Queue<>();
        q1.enqueue("A");
        q1.enqueue("B");
        System.out.println("Ej 1 -> dequeue(): " + q1.dequeue() + ", peek(): " + q1.peek() + ", size(): " + q1.size());

        Queue<Integer> q2 = new Queue<>();
        for (int x : new int[]{1, 2, 3, 4}) q2.enqueue(x);
        invertir(q2);
        System.out.println("Ej 2 -> Invertir [1, 2, 3, 4]: " + q2.toList());

        System.out.println("Ej 3 -> Banco [5, 3, 8]: " + esperaPromedio(new int[]{5, 3, 8}));
        System.out.println("Ej 4 -> Binarios(5): " + generarBinarios(5));
        System.out.println("Ej 5 -> Papa Caliente: " + papaCaliente(new String[]{"Ana", "Luis", "Marta", "Pedro", "Sofia"}, 3));
    }
}
