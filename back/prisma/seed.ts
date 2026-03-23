import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const BOOKS_DATA = [
    { title: 'El Quijote', author: 'Miguel de Cervantes', description: 'La historia del ingenioso hidalgo Don Quijote de la Mancha.', price: 12.99 },
    { title: 'Cien años de soledad', author: 'Gabriel García Márquez', description: 'La saga de la familia Buendía en el pueblo de Macondo.', price: 14.99 },
    { title: 'El amor en los tiempos del cólera', author: 'Gabriel García Márquez', description: 'Historia de amor que desafía el tiempo.', price: 13.99 },
    { title: 'La sombra del viento', author: 'Carlos Ruiz Zafón', description: 'Un joven descubre un libro misterioso en el Cementerio de los Libros Olvidados.', price: 15.99 },
    { title: 'El juego del ángel', author: 'Carlos Ruiz Zafón', description: 'Segunda entrega del Cementerio de los Libros Olvidados.', price: 15.99 },
    { title: '1984', author: 'George Orwell', description: 'Distopía sobre un régimen totalitario que controla la realidad.', price: 11.99 },
    { title: 'Rebelión en la granja', author: 'George Orwell', description: 'Alegoría política sobre los animales que se rebelan contra sus dueños.', price: 9.99 },
    { title: 'El gran Gatsby', author: 'F. Scott Fitzgerald', description: 'El sueño americano y la decadencia de la alta sociedad en los años 20.', price: 10.99 },
    { title: 'Matar un ruiseñor', author: 'Harper Lee', description: 'La injusticia racial en el sur de Estados Unidos vista por los ojos de una niña.', price: 12.99 },
    { title: 'El señor de los anillos', author: 'J.R.R. Tolkien', description: 'La épica lucha por el Anillo Único en la Tierra Media.', price: 29.99 },
    { title: 'El hobbit', author: 'J.R.R. Tolkien', description: 'La aventura de Bilbo Bolsón con enanos y un dragón.', price: 14.99 },
    { title: 'Harry Potter y la piedra filosofal', author: 'J.K. Rowling', description: 'El inicio de las aventuras de un joven mago en Hogwarts.', price: 16.99 },
    { title: 'Harry Potter y la cámara secreta', author: 'J.K. Rowling', description: 'El segundo año de Harry en Hogwarts con misterios oscuros.', price: 16.99 },
    { title: 'Harry Potter y el prisionero de Azkaban', author: 'J.K. Rowling', description: 'Un prisionero escapa de Azkaban y Harry descubre secretos del pasado.', price: 17.99 },
    { title: 'El código Da Vinci', author: 'Dan Brown', description: 'Un símbolo grabado en el cuerpo de un curador conduce a una red de secretos.', price: 13.99 },
    { title: 'Ángeles y demonios', author: 'Dan Brown', description: 'Robert Langdon investiga el robo de antimateria en el Vaticano.', price: 13.99 },
    { title: 'El alquimista', author: 'Paulo Coelho', description: 'La historia de un pastor andaluz en busca de su leyenda personal.', price: 11.99 },
    { title: 'Once minutos', author: 'Paulo Coelho', description: 'Una joven brasileña en busca del amor verdadero en Ginebra.', price: 11.99 },
    { title: 'Crimen y castigo', author: 'Fiódor Dostoyevski', description: 'Un estudiante ruso comete un crimen y lidia con la culpa.', price: 12.99 },
    { title: 'Los hermanos Karamazov', author: 'Fiódor Dostoyevski', description: 'Una familia disfuncional y un asesinato en la Rusia del siglo XIX.', price: 15.99 },
    { title: 'El idiota', author: 'Fiódor Dostoyevski', description: 'Un príncipe inocente navega la sociedad rusa corrupta.', price: 13.99 },
    { title: 'Guerra y paz', author: 'León Tolstói', description: 'La vida en Rusia durante las guerras napoleónicas.', price: 18.99 },
    { title: 'Anna Karenina', author: 'León Tolstói', description: 'Tragedia de amor y sociedad en la Rusia imperial.', price: 14.99 },
    { title: 'La metamorfosis', author: 'Franz Kafka', description: 'Un hombre se despierta convertido en un insecto gigante.', price: 9.99 },
    { title: 'El proceso', author: 'Franz Kafka', description: 'Un hombre es arrestado sin conocer su crimen.', price: 10.99 },
    { title: 'Ulises', author: 'James Joyce', description: 'Un día en la vida de Leopold Bloom en Dublín.', price: 16.99 },
    { title: 'En busca del tiempo perdido', author: 'Marcel Proust', description: 'Una exploración de la memoria y el tiempo en la Francia del siglo XIX.', price: 19.99 },
    { title: 'El extranjero', author: 'Albert Camus', description: 'Un hombre indiferente comete un asesinato en Argelia.', price: 10.99 },
    { title: 'La peste', author: 'Albert Camus', description: 'Una epidemia de peste azota una ciudad argelina.', price: 11.99 },
    { title: 'El guardián entre el centeno', author: 'J.D. Salinger', description: 'Las andanzas de Holden Caulfield en Nueva York.', price: 11.99 },
    { title: 'Las uvas de la ira', author: 'John Steinbeck', description: 'Una familia de Oklahoma emigra a California durante la Gran Depresión.', price: 13.99 },
    { title: 'De ratones y hombres', author: 'John Steinbeck', description: 'Dos amigos sueñan con tener su propia granja.', price: 9.99 },
    { title: 'Moby Dick', author: 'Herman Melville', description: 'El capitán Ahab persigue obsesivamente a la ballena blanca.', price: 13.99 },
    { title: 'Las aventuras de Huckleberry Finn', author: 'Mark Twain', description: 'Un joven huye de su padre abusivo y navega el Mississippi.', price: 10.99 },
    { title: 'Orgullo y prejuicio', author: 'Jane Austen', description: 'Elizabeth Bennet y el señor Darcy en la Inglaterra del siglo XIX.', price: 11.99 },
    { title: 'Sentido y sensibilidad', author: 'Jane Austen', description: 'Dos hermanas buscan el amor en la sociedad inglesa.', price: 11.99 },
    { title: 'Emma', author: 'Jane Austen', description: 'Una joven casamentera aprende sobre el amor y la humildad.', price: 11.99 },
    { title: 'Cumbres borrascosas', author: 'Emily Brontë', description: 'Una historia de amor apasionado y venganza en los páramos ingleses.', price: 11.99 },
    { title: 'Jane Eyre', author: 'Charlotte Brontë', description: 'La historia de una institutriz y el misterioso señor Rochester.', price: 12.99 },
    { title: 'Frankenstein', author: 'Mary Shelley', description: 'Un científico crea vida y debe afrontar las consecuencias.', price: 10.99 },
    { title: 'Drácula', author: 'Bram Stoker', description: 'El conde Drácula busca nueva sangre en Inglaterra.', price: 11.99 },
    { title: 'El retrato de Dorian Gray', author: 'Oscar Wilde', description: 'Un joven vende su alma por la eterna juventud.', price: 10.99 },
    { title: 'La importancia de llamarse Ernesto', author: 'Oscar Wilde', description: 'Una comedia satírica sobre la hipocresía victoriana.', price: 9.99 },
    { title: 'Los miserables', author: 'Victor Hugo', description: 'La redención de Jean Valjean en la Francia del siglo XIX.', price: 17.99 },
    { title: 'Notre-Dame de París', author: 'Victor Hugo', description: 'La historia del jorobado Quasimodo y Esmeralda.', price: 14.99 },
    { title: 'El conde de Montecristo', author: 'Alexandre Dumas', description: 'Un hombre escapa de prisión y busca venganza.', price: 16.99 },
    { title: 'Los tres mosqueteros', author: 'Alexandre Dumas', description: 'Las aventuras de D\'Artagnan y los mosqueteros.', price: 14.99 },
    { title: 'Madame Bovary', author: 'Gustave Flaubert', description: 'Una mujer romántica busca escapar de su vida aburrida.', price: 12.99 },
    { title: 'Rojo y negro', author: 'Stendhal', description: 'El ascenso social de Julien Sorel en la Francia post-napoleónica.', price: 12.99 },
    { title: 'Don Juan', author: 'Lord Byron', description: 'Las aventuras del famoso seductor en verso.', price: 11.99 },
    { title: 'La divina comedia', author: 'Dante Alighieri', description: 'El viaje de Dante por el Infierno, el Purgatorio y el Paraíso.', price: 14.99 },
    { title: 'La Odisea', author: 'Homero', description: 'El viaje de Ulises de regreso a Ítaca tras la guerra de Troya.', price: 12.99 },
    { title: 'La Ilíada', author: 'Homero', description: 'La guerra de Troya y la cólera de Aquiles.', price: 12.99 },
    { title: 'Edipo Rey', author: 'Sófocles', description: 'Un rey descubre una verdad terrible sobre su propio destino.', price: 9.99 },
    { title: 'El nombre de la rosa', author: 'Umberto Eco', description: 'Un monje medieval investiga una serie de muertes en una abadía.', price: 15.99 },
    { title: 'El péndulo de Foucault', author: 'Umberto Eco', description: 'Tres editores crean una conspiración secreta que cobra vida propia.', price: 15.99 },
    { title: 'Ficciones', author: 'Jorge Luis Borges', description: 'Cuentos que exploran laberintos, bibliotecas y realidades paralelas.', price: 13.99 },
    { title: 'El Aleph', author: 'Jorge Luis Borges', description: 'Cuentos sobre el infinito, los espejos y el tiempo circular.', price: 13.99 },
    { title: 'Rayuela', author: 'Julio Cortázar', description: 'Una novela experimental que puede leerse en diferente orden.', price: 14.99 },
    { title: 'Bestiario', author: 'Julio Cortázar', description: 'Cuentos donde lo fantástico irrumpe en la vida cotidiana.', price: 12.99 },
    { title: 'La ciudad y los perros', author: 'Mario Vargas Llosa', description: 'La violencia y la corrupción en un colegio militar peruano.', price: 14.99 },
    { title: 'La casa verde', author: 'Mario Vargas Llosa', description: 'Múltiples historias entrelazadas en la selva y el desierto peruano.', price: 14.99 },
    { title: 'Pedro Páramo', author: 'Juan Rulfo', description: 'Un hombre busca a su padre en un pueblo fantasma.', price: 11.99 },
    { title: 'El llano en llamas', author: 'Juan Rulfo', description: 'Cuentos sobre la vida rural en México.', price: 10.99 },
    { title: 'El túnel', author: 'Ernesto Sabato', description: 'Un pintor obsesionado mata a la única persona que lo entendía.', price: 11.99 },
    { title: 'Sobre héroes y tumbas', author: 'Ernesto Sabato', description: 'El amor y la locura en el Buenos Aires de los años 50.', price: 13.99 },
    { title: 'El señor presidente', author: 'Miguel Ángel Asturias', description: 'El terror bajo una dictadura latinoamericana.', price: 12.99 },
    { title: 'El otoño del patriarca', author: 'Gabriel García Márquez', description: 'La soledad y decadencia de un dictador caribeño.', price: 14.99 },
    { title: 'El coronel no tiene quien le escriba', author: 'Gabriel García Márquez', description: 'Un coronel espera durante años una pensión que nunca llega.', price: 10.99 },
    { title: 'La hojarasca', author: 'Gabriel García Márquez', description: 'Primera novela de García Márquez, preludio de Macondo.', price: 11.99 },
    { title: 'Conversación en la catedral', author: 'Mario Vargas Llosa', description: 'Dos peruanos hablan sobre cómo se jodió el Perú.', price: 15.99 },
    { title: 'La fiesta del chivo', author: 'Mario Vargas Llosa', description: 'Los últimos días de la dictadura de Trujillo en República Dominicana.', price: 15.99 },
    { title: 'Paradiso', author: 'José Lezama Lima', description: 'La formación de un poeta cubano a principios del siglo XX.', price: 14.99 },
    { title: 'Tres tristes tigres', author: 'Guillermo Cabrera Infante', description: 'La vida nocturna de La Habana antes de la revolución.', price: 13.99 },
    { title: 'Terra Nostra', author: 'Carlos Fuentes', description: 'Una visión mítica de la historia de España e Hispanoamérica.', price: 16.99 },
    { title: 'Aura', author: 'Carlos Fuentes', description: 'Un joven es contratado para trabajar en una casa con una anciana misteriosa.', price: 10.99 },
    { title: 'El obsceno pájaro de la noche', author: 'José Donoso', description: 'Un mundo de monstruosidades y marginados en Chile.', price: 14.99 },
    { title: 'Coronación', author: 'José Donoso', description: 'La decadencia de una familia de la alta burguesía chilena.', price: 12.99 },
    { title: 'Los ríos profundos', author: 'José María Arguedas', description: 'Un joven mestizo entre dos mundos en los Andes peruanos.', price: 12.99 },
    { title: 'El zorro de arriba y el zorro de abajo', author: 'José María Arguedas', description: 'La última novela de Arguedas sobre la modernización del Perú.', price: 13.99 },
    { title: 'La vorágine', author: 'José Eustasio Rivera', description: 'Un poeta colombiano se adentra en la selva amazónica.', price: 12.99 },
    { title: 'Doña Bárbara', author: 'Rómulo Gallegos', description: 'El choque entre civilización y barbarie en los llanos venezolanos.', price: 12.99 },
    { title: 'Don Segundo Sombra', author: 'Ricardo Güiraldes', description: 'La vida gaucha en las pampas argentinas.', price: 11.99 },
    { title: 'Martín Fierro', author: 'José Hernández', description: 'El poema épico del gaucho argentino perseguido por la justicia.', price: 10.99 },
    { title: 'Amalia', author: 'José Mármol', description: 'Primera novela argentina, ambientada en la época de Rosas.', price: 11.99 },
    { title: 'La cautiva', author: 'Esteban Echeverría', description: 'Un poema épico sobre cautivos en la pampa durante las guerras.', price: 9.99 },
    { title: 'El matadero', author: 'Esteban Echeverría', description: 'Una alegoría política sobre la violencia en Argentina.', price: 9.99 },
    { title: 'Facundo', author: 'Domingo Faustino Sarmiento', description: 'Civilización y barbarie en la Argentina del siglo XIX.', price: 12.99 },
    { title: 'María', author: 'Jorge Isaacs', description: 'Historia de amor trágico en las haciendas colombianas del siglo XIX.', price: 11.99 },
    { title: 'Cumandá', author: 'Juan León Mera', description: 'Romance entre un misionero y una joven indígena en el Amazonas.', price: 10.99 },
    { title: 'Tabaré', author: 'Juan Zorrilla de San Martín', description: 'El drama del mestizaje en el Uruguay colonial.', price: 10.99 },
    { title: 'La vorágine', author: 'José Eustasio Rivera', description: 'Aventura y tragedia en la selva colombiana.', price: 12.99 },
    { title: 'El mundo es ancho y ajeno', author: 'Ciro Alegría', description: 'La lucha de una comunidad indígena peruana por sus tierras.', price: 13.99 },
    { title: 'Huasipungo', author: 'Jorge Icaza', description: 'La explotación del indígena ecuatoriano por terratenientes.', price: 11.99 },
    { title: 'El tungsteno', author: 'César Vallejo', description: 'La explotación minera en los Andes peruanos.', price: 11.99 },
    { title: 'Trilce', author: 'César Vallejo', description: 'Poemario vanguardista del poeta peruano.', price: 12.99 },
    { title: 'Veinte poemas de amor', author: 'Pablo Neruda', description: 'Los poemas de amor más famosos de la lengua española.', price: 11.99 },
    { title: 'Canto general', author: 'Pablo Neruda', description: 'Poema épico sobre la historia y la naturaleza de América Latina.', price: 14.99 },
    { title: 'Residencia en la tierra', author: 'Pablo Neruda', description: 'Poesía surrealista sobre la angustia existencial.', price: 12.99 },
    { title: 'Poema de Chile', author: 'Gabriela Mistral', description: 'Último libro de la Nobel chilena, un viaje poético por Chile.', price: 12.99 },
    { title: 'Desolación', author: 'Gabriela Mistral', description: 'Primer libro de la Nobel chilena, marcado por el dolor y la fe.', price: 11.99 },
    { title: 'Platero y yo', author: 'Juan Ramón Jiménez', description: 'La relación poética entre un poeta y su burro Platero en Andalucía.', price: 10.99 },
    { title: 'Campos de Castilla', author: 'Antonio Machado', description: 'Poesía sobre el paisaje y el alma de Castilla.', price: 11.99 },
    { title: 'La casa de Bernarda Alba', author: 'Federico García Lorca', description: 'El tiránico dominio de una madre sobre sus cinco hijas.', price: 10.99 },
    { title: 'Romancero gitano', author: 'Federico García Lorca', description: 'Poemas sobre el pueblo gitano y la cultura andaluza.', price: 11.99 },
    { title: 'Yerma', author: 'Federico García Lorca', description: 'El drama de una mujer que no puede tener hijos.', price: 10.99 },
    { title: 'Bodas de sangre', author: 'Federico García Lorca', description: 'El honor y la pasión en el campo andaluz terminan en tragedia.', price: 10.99 },
    { title: 'La colmena', author: 'Camilo José Cela', description: 'La vida cotidiana en el Madrid de la posguerra española.', price: 13.99 },
    { title: 'La familia de Pascual Duarte', author: 'Camilo José Cela', description: 'Un criminal confiesa sus crímenes desde la cárcel.', price: 12.99 },
    { title: 'Nada', author: 'Carmen Laforet', description: 'Una joven llega a Barcelona de posguerra a estudiar en la universidad.', price: 11.99 },
    { title: 'El Jarama', author: 'Rafael Sánchez Ferlosio', description: 'Un día de domingo en el río Jarama en los años 50.', price: 11.99 },
    { title: 'Tiempo de silencio', author: 'Luis Martín-Santos', description: 'Un médico se enreda en los bajos fondos del Madrid franquista.', price: 13.99 },
    { title: 'Cinco horas con Mario', author: 'Miguel Delibes', description: 'Una mujer vela el cadáver de su marido y le habla.', price: 12.99 },
    { title: 'El camino', author: 'Miguel Delibes', description: 'Un niño de pueblo recuerda su infancia antes de marcharse a la ciudad.', price: 11.99 },
    { title: 'Los santos inocentes', author: 'Miguel Delibes', description: 'La vida de una familia de campesinos bajo el caciquismo.', price: 12.99 },
    { title: 'Crónica de una muerte anunciada', author: 'Gabriel García Márquez', description: 'Todo el pueblo sabe que van a matar a Santiago Nasar.', price: 12.99 },
    { title: 'El general en su laberinto', author: 'Gabriel García Márquez', description: 'Los últimos días de Simón Bolívar navegando el río Magdalena.', price: 13.99 },
    { title: 'El amor en los tiempos del cólera - Edición especial', author: 'Gabriel García Márquez', description: 'Edición ilustrada de la novela de amor.', price: 24.99 },
    { title: 'La increíble y triste historia de la cándida Eréndira', author: 'Gabriel García Márquez', description: 'Cuentos de realismo mágico del Nobel colombiano.', price: 11.99 },
    { title: 'Pantaleón y las visitadoras', author: 'Mario Vargas Llosa', description: 'Una sátira sobre el ejército peruano y la prostitución.', price: 13.99 },
    { title: 'La tía Julia y el escribidor', author: 'Mario Vargas Llosa', description: 'Autobiografía novelada sobre el primer amor de Vargas Llosa.', price: 13.99 },
    { title: 'El hablador', author: 'Mario Vargas Llosa', description: 'Un escritor busca a un amigo que se convirtió en hablador indígena.', price: 12.99 },
    { title: 'Historia de Mayta', author: 'Mario Vargas Llosa', description: 'Un escritor reconstruye la historia de un revolucionario fracasado.', price: 13.99 },
    { title: 'El paraíso en la otra esquina', author: 'Mario Vargas Llosa', description: 'Las vidas paralelas de Flora Tristán y Paul Gauguin.', price: 14.99 },
    { title: 'Travesuras de la niña mala', author: 'Mario Vargas Llosa', description: 'Un amor obsesivo que dura cuarenta años.', price: 14.99 },
    { title: 'El sueño del celta', author: 'Mario Vargas Llosa', description: 'La vida de Roger Casement, activista de derechos humanos.', price: 14.99 },
    { title: 'Lituma en los Andes', author: 'Mario Vargas Llosa', description: 'Un policía investiga desapariciones en los Andes peruanos.', price: 13.99 },
    { title: 'La guerra del fin del mundo', author: 'Mario Vargas Llosa', description: 'La guerra de Canudos en el nordeste brasileño.', price: 15.99 },
    { title: 'Conversación en Milán', author: 'Umberto Eco', description: 'Ensayos y reflexiones del pensador italiano.', price: 14.99 },
    { title: 'Baudolino', author: 'Umberto Eco', description: 'Las aventuras de un mentiroso en la Edad Media.', price: 15.99 },
    { title: 'La isla del día antes', author: 'Umberto Eco', description: 'Un hombre naufragado reflexiona sobre el tiempo y el espacio.', price: 15.99 },
    { title: 'Apostillas al nombre de la rosa', author: 'Umberto Eco', description: 'Reflexiones del autor sobre la creación de su novela más famosa.', price: 12.99 },
    { title: 'El cementerio de Praga', author: 'Umberto Eco', description: 'La historia de los Protocolos de los Sabios de Sión.', price: 15.99 },
    { title: 'Número cero', author: 'Umberto Eco', description: 'Una sátira sobre el periodismo y las conspiraciones.', price: 13.99 },
    { title: 'Lolita', author: 'Vladimir Nabokov', description: 'La obsesión de un hombre por una niña de doce años.', price: 12.99 },
    { title: 'Pálido fuego', author: 'Vladimir Nabokov', description: 'Un poema y el comentario de un lector que lo transforma.', price: 13.99 },
    { title: 'Ada o el ardor', author: 'Vladimir Nabokov', description: 'Un romance incestuoso en una Rusia alternativa.', price: 14.99 },
    { title: 'El maestro y Margarita', author: 'Mijaíl Bulgákov', description: 'El diablo visita la Moscú soviética de los años 30.', price: 14.99 },
    { title: 'El doctor Zhivago', author: 'Boris Pasternak', description: 'Un médico poeta vive la Revolución Rusa y sus consecuencias.', price: 15.99 },
    { title: 'Archipiélago Gulag', author: 'Alexandr Solzhenitsin', description: 'La historia de los campos de trabajo soviéticos.', price: 17.99 },
    { title: 'Un día en la vida de Iván Denísovich', author: 'Alexandr Solzhenitsin', description: 'Un día en un campo de trabajo estalinista.', price: 11.99 },
    { title: 'El jugador', author: 'Fiódor Dostoyevski', description: 'Las memorias de un adicto al juego en un casino europeo.', price: 10.99 },
    { title: 'Noches blancas', author: 'Fiódor Dostoyevski', description: 'Un soñador solitario se enamora de una joven durante las noches blancas.', price: 9.99 },
    { title: 'Pobres gentes', author: 'Fiódor Dostoyevski', description: 'Una novela epistolar sobre la pobreza y la dignidad.', price: 10.99 },
    { title: 'La sonata a Kreutzer', author: 'León Tolstói', description: 'Un hombre confiesa haber matado a su esposa por celos.', price: 10.99 },
    { title: 'Hadji Murat', author: 'León Tolstói', description: 'Un guerrero checheno entre dos fuerzas enemigas.', price: 11.99 },
    { title: 'La muerte de Iván Ilich', author: 'León Tolstói', description: 'Un juez moribundo reflexiona sobre el sentido de su vida.', price: 9.99 },
    { title: 'El corazón de las tinieblas', author: 'Joseph Conrad', description: 'Un viaje por el río Congo y la oscuridad del colonialismo.', price: 11.99 },
    { title: 'Lord Jim', author: 'Joseph Conrad', description: 'Un marino busca redención tras un acto de cobardía.', price: 12.99 },
    { title: 'Nostromo', author: 'Joseph Conrad', description: 'La política y la corrupción en una república sudamericana ficticia.', price: 13.99 },
    { title: 'El agente secreto', author: 'Joseph Conrad', description: 'Un espía debe llevar a cabo un atentado en Londres.', price: 12.99 },
    { title: 'Retrato del artista adolescente', author: 'James Joyce', description: 'La formación intelectual y espiritual del joven Stephen Dedalus.', price: 12.99 },
    { title: 'Dublineses', author: 'James Joyce', description: 'Quince cuentos sobre la vida en Dublín a principios del siglo XX.', price: 12.99 },
    { title: 'Finnegans Wake', author: 'James Joyce', description: 'La obra más experimental y enigmática de la literatura universal.', price: 16.99 },
    { title: 'Las olas', author: 'Virginia Woolf', description: 'Seis voces narran sus vidas en monólogos interiores.', price: 12.99 },
    { title: 'La señora Dalloway', author: 'Virginia Woolf', description: 'Un día en la vida de Clarissa Dalloway en el Londres de los años 20.', price: 11.99 },
    { title: 'Al faro', author: 'Virginia Woolf', description: 'Una familia espera poder visitar el faro en una isla escocesa.', price: 11.99 },
    { title: 'Orlando', author: 'Virginia Woolf', description: 'Un noble inglés cambia de sexo y vive cuatro siglos de historia.', price: 12.99 },
    { title: 'Contrapunto', author: 'Aldous Huxley', description: 'Las intrigas y relaciones de la sociedad intelectual inglesa.', price: 13.99 },
    { title: 'Un mundo feliz', author: 'Aldous Huxley', description: 'Una sociedad distópica donde la felicidad es obligatoria.', price: 12.99 },
    { title: 'Punto contrapunto', author: 'Aldous Huxley', description: 'Una novela sobre la decadencia moral de la intelectualidad.', price: 13.99 },
    { title: 'El fin de la aventura', author: 'Graham Greene', description: 'Una historia de amor marcada por la culpa y la fe.', price: 12.99 },
    { title: 'El poder y la gloria', author: 'Graham Greene', description: 'Un sacerdote alcohólico perseguido en el México anticlerical.', price: 12.99 },
    { title: 'El americano tranquilo', author: 'Graham Greene', description: 'La guerra de Indochina y el imperialismo norteamericano.', price: 12.99 },
    { title: 'Brighton Rock', author: 'Graham Greene', description: 'Un joven criminal deambula por el Brighton de los años 30.', price: 11.99 },
    { title: 'El tercer hombre', author: 'Graham Greene', description: 'Un escritor busca a su amigo en el Viena de posguerra.', price: 11.99 },
    { title: 'El sol también sale', author: 'Ernest Hemingway', description: 'La generación perdida en París y los sanfermines de Pamplona.', price: 12.99 },
    { title: 'Adiós a las armas', author: 'Ernest Hemingway', description: 'Un amor en medio de la Primera Guerra Mundial.', price: 12.99 },
    { title: 'Por quién doblan las campanas', author: 'Ernest Hemingway', description: 'Un americano lucha en la Guerra Civil española.', price: 13.99 },
    { title: 'El viejo y el mar', author: 'Ernest Hemingway', description: 'Un pescador cubano lucha durante días con un gran pez.', price: 11.99 },
    { title: 'Fiesta y otros cuentos', author: 'Ernest Hemingway', description: 'Cuentos del maestro del iceberg narrativo.', price: 12.99 },
];

async function main() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool, { schema: 'public' });
    const prisma = new PrismaClient({ adapter });

    console.log('🌱 Iniciando seed...');

    // Limpiar datos existentes
    await prisma.book.deleteMany();
    await prisma.user.deleteMany();
    console.log('🗑️  Tablas limpiadas');

    // Crear usuarios
    const hashedPassword = await bcrypt.hash('Password123!', 10);

    const [user1, user2] = await Promise.all([
        prisma.user.create({
            data: {
                name: 'Admin User',
                email: 'admin@bookstore.com',
                password: hashedPassword,
            },
        }),
        prisma.user.create({
            data: {
                name: 'Test User',
                email: 'test@bookstore.com',
                password: hashedPassword,
            },
        }),
    ]);
    console.log(`✅ Usuarios creados: ${user1.email}, ${user2.email}`);

    // Crear 200 libros con fechas escalonadas para paginación por cursores
    const now = new Date();
    const booksData = BOOKS_DATA.map((book, index) => ({
        ...book,
        status: (index % 5 === 0 ? 'reserved' : 'available') as 'available' | 'reserved',
        published_at: new Date(now.getTime() - (200 - index) * 24 * 60 * 60 * 1000),
        created_at: new Date(now.getTime() - (200 - index) * 60 * 60 * 1000), // 1 hora de diferencia entre cada libro
        created_by_id: index % 2 === 0 ? user1.id : user2.id,
    }));

    await prisma.book.createMany({ data: booksData });
    console.log(`✅ 200 libros creados`);

    console.log('🎉 Seed completado');

    await prisma.$disconnect();
    await pool.end();
}

main().catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
});
