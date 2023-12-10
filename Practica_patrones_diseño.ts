// Interfaz para productos comestibles
interface Comestible {
    obtenerDescripcion(): string;
  }
  
  // Implementación básica de un producto comestible
  class ProductoComestible implements Comestible {
    constructor(private nombre: string) {}
  
    obtenerDescripcion() {
      return this.nombre;
    }
  }
  
  // Interfaz para Combos (Decorador)
  interface Combo extends Comestible {
    agregarExtra(extra: Comestible): void;
  }
  
  // Implementación base para Combos (Decorador Base)
  class ComboBase implements Combo {
    protected extras: Comestible[] = [];
  
    constructor(private comestible: Comestible) {}
  
    agregarExtra(extra: Comestible) {
      this.extras.push(extra);
    }
  
    obtenerDescripcion() {
      const descripcionBase = this.comestible.obtenerDescripcion();
      const extrasDescripcion = this.extras.map((extra) => extra.obtenerDescripcion()).join(", ");
      return `${descripcionBase} con: ${extrasDescripcion}`;
    }
  }
  
  // Implementación de Combo específico (Bebida)
  class ComboBebida extends ComboBase {
    constructor(comestible: Comestible, private bebida: Comestible) {
      super(comestible);
      this.agregarExtra(bebida);
    }
  }
  
  // Implementación de Combo específico (Postre)
  class ComboPostre extends ComboBase {
    constructor(comestible: Comestible, private postre: Comestible) {
      super(comestible);
      this.agregarExtra(postre);
    }
  }
  
  // Interfaz Observer
  interface Observer {
    actualizar(accion: string, pelicula: Pelicula): void;
  }
  
  // Clase Subject
  class Subject {
    private observadores: Observer[] = [];
  
    agregarObservador(observador: Observer) {
      this.observadores.push(observador);
    }
  
    eliminarObservador(observador: Observer) {
      this.observadores = this.observadores.filter((obs) => obs !== observador);
    }
  
    notificarObservadores(accion: string, pelicula: Pelicula) {
      this.observadores.forEach((observador) => observador.actualizar(accion, pelicula));
    }
  }
  
  // Clase Cliente
  class Cliente {
    constructor(public nombre: string) {}
  }
  
  // Clase Pelicula
  class Pelicula {
    constructor(public titulo: string) {}
  }
  
  // Clase SalaCine
  class SalaCine {
    static ASIENTE_NO_DISPONIBLE = "No disponible";
    public asientosDisponibles: string[];
  
    constructor(public numeroSala: number, public aperitivos: string[]) {
      if (numeroSala <= 0) {
        throw new Error("El número de sala debe ser mayor que cero.");
      }
      this.asientosDisponibles = ["A1", "A2", "B1", "B2", "C1", "C2"];
    }
  }
  
  // Clase DetalleCompraPrinter
  class DetalleCompraPrinter {
    static mostrarDetalleCompra(compra: Compra, productosDescripcion: string) {
      console.log(`
        Cliente: ${compra.cliente.nombre}
        Película: ${compra.pelicula.titulo}
        Sala de Cine: ${compra.sala.numeroSala}
        Asiento: ${compra.asiento}
        Aperitivos Gratis: ${compra.sala.aperitivos.join(", ")}
        Productos Comestibles: ${productosDescripcion}
      `);
    }
  }
  
  // Clase Compra
  class Compra extends Subject {
    constructor(
      public cliente: Cliente,
      public pelicula: Pelicula,
      public sala: SalaCine,
      public asiento: string,
      public productosComestibles: Comestible[]
    ) {
      super();
    }
  
    mostrarDetalleCompra() {
      const productosDescripcion = this.productosComestibles.map((producto) => producto.obtenerDescripcion()).join(", ");
      DetalleCompraPrinter.mostrarDetalleCompra(this, productosDescripcion);
    }
  }
  
  // Clase ListaPeliculas
  class ListaPeliculas extends Subject {
    private static instance: ListaPeliculas;
    private peliculas: Pelicula[];
  
    private constructor() {
      super();
      this.peliculas = [];
    }
  
    static getInstance(): ListaPeliculas {
      if (!ListaPeliculas.instance) {
        ListaPeliculas.instance = new ListaPeliculas();
      }
      return ListaPeliculas.instance;
    }
  
    agregarPelicula(pelicula: Pelicula) {
      this.peliculas.push(pelicula);
      this.notificarObservadores("agregar", pelicula);
    }
  
    obtenerPeliculas(): Pelicula[] {
      return this.peliculas;
    }
  }
  
  // Nuevo observador para manejar cambios en las películas
  class CambioPeliculaObserver implements Observer {
    actualizar(accion: string, pelicula: Pelicula) {
      console.log(`Película ${pelicula.titulo} ha sido ${accion}`);
    }
  }
  
  // Ejemplo de uso
  
  const listaPeliculas = ListaPeliculas.getInstance();
  
  const observadorCambioPelicula = new CambioPeliculaObserver();
  listaPeliculas.agregarObservador(observadorCambioPelicula);
  
  const pelicula1 = new Pelicula("John Wick");
  const pelicula2 = new Pelicula("Aladdin");
  const pelicula3 = new Pelicula("Avengers");
  
  listaPeliculas.agregarPelicula(pelicula1);
  listaPeliculas.agregarPelicula(pelicula2);
  listaPeliculas.agregarPelicula(pelicula3);
  
  console.log("Listado de Películas:");
  listaPeliculas.obtenerPeliculas().forEach((pelicula) => {
    console.log(pelicula.titulo);
  });
  
  const cliente1 = new Cliente("Juan");
  const sala1 = new SalaCine(1, ["Canguil", "Hot-dog", "Bebidas"]);
  const asientoCliente1 = sala1.asientosDisponibles.pop() || SalaCine.ASIENTE_NO_DISPONIBLE;
  
  // Crear productos comestibles básicos
  const canguil = new ProductoComestible("Canguil");
  const bebida = new ProductoComestible("Bebida");
  const postre = new ProductoComestible("Postre");
  
  // Crear combo de canguil con bebida y postre
  const comboCanguilBebida = new ComboBebida(canguil, bebida);
  const comboCompleto = new ComboPostre(comboCanguilBebida, postre);
  
  const productosCliente1: Comestible[] = [comboCompleto];
  
  const compraCliente1 = new Compra(
    cliente1,
    pelicula1,
    sala1,
    asientoCliente1,
    productosCliente1
  );
  
  compraCliente1.mostrarDetalleCompra();
  