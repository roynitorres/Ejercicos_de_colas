# -*- coding: utf-8 -*-
"""
Práctica de Colas (Queue) - Implementación en Python
Algoritmos y Estructuras de Datos
Ejecutar con: python cola.py
"""

from typing import TypeVar, Generic, Optional, List

T = TypeVar('T')


# ==========================================
# EJERCICIO 1: Implementa la cola (BASE)
# ==========================================

class Nodo(Generic[T]):
    def __init__(self, valor: T):
        self.valor: T = valor
        self.siguiente: Optional['Nodo[T]'] = None


class Queue(Generic[T]):
    def __init__(self):
        self.frente: Optional[Nodo[T]] = None
        self.final: Optional[Nodo[T]] = None
        self.cantidad: int = 0

    def enqueue(self, valor: T) -> None:
        """Agrega un elemento al final de la cola en O(1)."""
        nuevo_nodo = Nodo(valor)
        if self.final is None:
            self.frente = nuevo_nodo
            self.final = nuevo_nodo
        else:
            self.final.siguiente = nuevo_nodo
            self.final = nuevo_nodo
        self.cantidad += 1

    def dequeue(self) -> Optional[T]:
        """Saca y devuelve el elemento del frente en O(1) (o None si está vacía)."""
        if self.frente is None:
            return None
        valor = self.frente.valor
        self.frente = self.frente.siguiente
        if self.frente is None:
            self.final = None
        self.cantidad -= 1
        return valor

    def peek(self) -> Optional[T]:
        """Devuelve el frente sin sacarlo en O(1)."""
        return self.frente.valor if self.frente is not None else None

    def is_empty(self) -> bool:
        """Verifica si la cola está vacía en O(1)."""
        return self.cantidad == 0

    def size(self) -> int:
        """Devuelve la cantidad de elementos en O(1)."""
        return self.cantidad

    def to_list(self) -> List[T]:
        """Método auxiliar para mostrar el contenido de la cola."""
        resultado: List[T] = []
        actual = self.frente
        while actual is not None:
            resultado.append(actual.valor)
            actual = actual.siguiente
        return resultado


# ==========================================
# EJERCICIO 2: Invertir una cola (FÁCIL)
# ==========================================

def invertir(q: Queue[T]) -> None:
    pila: List[T] = []  # Solo usamos append (push) y pop()
    while not q.is_empty():
        elemento = q.dequeue()
        if elemento is not None:
            pila.append(elemento)

    while len(pila) > 0:
        q.enqueue(pila.pop())


# ==========================================
# EJERCICIO 3: Simulación de banco (MEDIO)
# ==========================================

def espera_promedio(clientes: List[int]) -> float:
    if len(clientes) == 0:
        return 0.0

    cola = Queue[int]()
    for duracion in clientes:
        cola.enqueue(duracion)

    tiempo_actual = 0
    suma_esperas = 0
    total_clientes = cola.size()

    while not cola.is_empty():
        duracion_cliente = cola.dequeue()
        if duracion_cliente is not None:
            suma_esperas += tiempo_actual
            tiempo_actual += duracion_cliente

    return round(suma_esperas / total_clientes, 2)


# ==========================================
# EJERCICIO 4: Números binarios con una cola (MEDIO)
# ==========================================

def generar_binarios(n: int) -> List[str]:
    resultado: List[str] = []
    if n <= 0:
        return resultado

    cola = Queue[str]()
    cola.enqueue("1")

    for _ in range(n):
        actual = cola.dequeue()
        if actual is not None:
            resultado.append(actual)
            cola.enqueue(actual + "0")
            cola.enqueue(actual + "1")

    return resultado


# ==========================================
# EJERCICIO 5: Papa caliente (DIFÍCIL)
# ==========================================

def papa_caliente(nombres: List[str], n: int) -> str:
    if len(nombres) == 0:
        return ""

    cola = Queue[str]()
    for nombre in nombres:
        cola.enqueue(nombre)

    while cola.size() > 1:
        for _ in range(n):
            persona = cola.dequeue()
            if persona is not None:
                cola.enqueue(persona)
        cola.dequeue()  # Sale quien tiene la papa

    ganador = cola.dequeue()
    return ganador if ganador is not None else ""


# ==========================================
# MENÚ INTERACTIVO Y DEMOSTRACIÓN
# ==========================================

def ejecutar_pruebas_pdf() -> None:
    print("\n--- PRUEBAS OFICIALES DEL PDF ---")
    q1 = Queue[str]()
    q1.enqueue("A")
    q1.enqueue("B")
    print(f"Ej 1 -> dequeue(): {q1.dequeue()}, peek(): {q1.peek()}, size(): {q1.size()}")

    q2 = Queue[int]()
    for x in [1, 2, 3, 4]:
        q2.enqueue(x)
    invertir(q2)
    print(f"Ej 2 -> Invertir [1, 2, 3, 4]: {q2.to_list()}")

    print(f"Ej 3 -> Banco [5, 3, 8]: {espera_promedio([5, 3, 8])}")
    print(f"Ej 4 -> Binarios(5): {generar_binarios(5)}")
    print(f"Ej 5 -> Papa Caliente(['Ana','Luis','Marta','Pedro','Sofia'], 3): {papa_caliente(['Ana', 'Luis', 'Marta', 'Pedro', 'Sofia'], 3)}")


def menu_interactivo() -> None:
    cola_usuario = Queue[str]()

    while True:
        print("\n==============================================")
        print("  PRÁCTICA DE COLAS (PYTHON) - MENÚ DINÁMICO")
        print("==============================================")
        print("1. Ejercicio 1: Probar Cola (enqueue, dequeue, peek, size)")
        print("2. Ejercicio 2: Invertir una cola con valores propios")
        print("3. Ejercicio 3: Simulación de banco (espera promedio)")
        print("4. Ejercicio 4: Generar primeros n números binarios")
        print("5. Ejercicio 5: Juego de la Papa Caliente")
        print("6. Ejecutar todos los casos de prueba del PDF")
        print("0. Salir")

        opcion = input("\nSelecciona una opción (0-6): ").strip()

        if opcion == "1":
            print(f"\nCola actual: {cola_usuario.to_list()} (size={cola_usuario.size()}, isEmpty={cola_usuario.is_empty()})")
            sub = input("¿Qué deseas hacer? [1] enqueue  [2] dequeue  [3] peek: ").strip()
            if sub == "1":
                val = input("Ingresa el valor a encolar: ").strip()
                cola_usuario.enqueue(val)
                print(f"-> Encolado '{val}'. Cola: {cola_usuario.to_list()}")
            elif sub == "2":
                print(f"-> dequeue() devolvió: {cola_usuario.dequeue()}. Cola: {cola_usuario.to_list()}")
            elif sub == "3":
                print(f"-> peek() devolvió: {cola_usuario.peek()}")

        elif opcion == "2":
            entrada = input("Ingresa elementos separados por coma (ej. 1, 2, 3, 4): ")
            items = [x.strip() for x in entrada.split(",") if x.strip()]
            q = Queue[str]()
            for item in items:
                q.enqueue(item)
            print("Antes de invertir:  ", q.to_list())
            invertir(q)
            print("Después de invertir:", q.to_list())

        elif opcion == "3":
            entrada = input("Ingresa las duraciones de los clientes separadas por coma (ej. 5, 3, 8): ")
            duraciones = [int(x.strip()) for x in entrada.split(",") if x.strip().isdigit()]
            print(f"-> Tiempo de espera promedio: {espera_promedio(duraciones):.2f} minutos")

        elif opcion == "4":
            n_str = input("¿Cuántos números binarios deseas generar (n)?: ").strip()
            if n_str.isdigit():
                print(f"-> Binarios: {generar_binarios(int(n_str))}")

        elif opcion == "5":
            entrada = input("Ingresa los nombres separados por coma (ej. Ana, Luis, Marta, Pedro, Sofia): ")
            nombres = [x.strip() for x in entrada.split(",") if x.strip()]
            n_pases = int(input("Ingresa el número de pases por ronda (n): ").strip() or "0")
            print(f"-> Ganador(a): {papa_caliente(nombres, n_pases)}")

        elif opcion == "6":
            ejecutar_pruebas_pdf()

        elif opcion == "0":
            print("¡Hasta luego!")
            break


if __name__ == "__main__":
    ejecutar_pruebas_pdf()
    # Si se ejecuta en terminal interactiva, puedes descomentar la siguiente línea:
    # menu_interactivo()
