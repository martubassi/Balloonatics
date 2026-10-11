# Balloonatics

## Descripción y Temática
**Balloonatics** es un juego de plataformas cooperativo en 2D donde dos jugadores deben mantener a flote un globo compartido a lo largo de niveles de pantalla fija. Si el globo toca el suelo o se revienta, se pierde una vida, lo que exige una gran coordinación, saltos precisos y reflejos rápidos para sobrevivir.

---

## Integrantes del Equipo

| Nombre | Correo institucional | Usuario de GitHub |
| :--- | :--- | :--- |
| **Martina Bassi** | [m.bassi.2026@alumnos.urjc.es](mailto:m.bassi.2026@alumnos.urjc.es) | [@martubassi](https://github.com/martubassi) |
| **Darío Ayala Alocén** | [d.ayala.2023@alumnos.urjc.es](mailto:d.ayala.2023@alumnos.urjc.es) | [@RubaXY](https://github.com/RubaXY) |
| **Mateo González Falquina** | [m.gonzalezfa.2024@alumnos.urjc.es](mailto:m.gonzalezfa.2024@alumnos.urjc.es) | [@Kirby7805](https://github.com/Kirby7805) |
| **Arturo de María García Díaz** | [am.garciad.2024@alumnos.urjc.es](mailto:am.garciad.2024@alumnos.urjc.es) | [@ElPapiVikG](https://github.com/ElPapiVikG) |


![Rey Juan Carlos Logo][image1]

**Balloonatics**   
**Game Design Document**

**Autores**

Martina Bassi

Dario Ayala Alocén

Mateo González Falquina

Arturo de María García Díaz

Sep 2026 **|** Business Confidential

# **ÍNDICE** {#índice}

[**ÍNDICE	2**](#índice)

[1.1. Concepto del juego	3](#concepto-del-juego)

[1.2. Propuesta de valor	3](#propuesta-de-valor)

[3.1. Objetivo del juego	4](#objetivo-del-juego)

[3.2. Controles	4](#controles)

[3.3. Mecánicas	5](#mecánicas)

[3.3.1. Mecánicas principales	5](#mecánicas-principales)

[3.3.2. Objetos y power-ups	5](#objetos-y-power-ups)

[3.4. Físicas y dificultad	6](#físicas-y-dificultad)

[3.5. Escenario	7](#escenario)

[4.1. Historia	7](#historia)

[4.2. Personajes	7](#personajes)

[**5\. Imagen y diseño visual	9**](#imagen-y-diseño-visual)

[5.1. Logotipo	9](#logotipo)

[5.2. Estilo visual	9](#estilo-visual)

[5.3. Uso de colores	9](#uso-de-colores)

[5.4. Aspectos técnicos: cámara y representación	9](#aspectos-técnicos:-cámara-y-representación)

[5.5. Inspiración artística y cultural	9](#inspiración-artística-y-cultural)

[5.6. Bocetos de personajes y pantallas	10](#bocetos-de-personajes-y-pantallas)

[**6\. Sonido	10**](#sonido)

[6.1. Banda sonora	10](#banda-sonora)

[6.2. Efectos de sonido	10](#efectos-de-sonido)

[**7\. Interfaz y diagrama de flujo	12**](#interfaz-y-diagrama-de-flujo)

[7.1. Pantallas	12](#pantallas)

[7.1.1. Arte principal \+ Logo	12](#arte-principal-+-logo)

[7.1.2. Menú principal	12](#menú-principal)

[7.1.3. Seleccionar Mapa	12](#seleccionar-mapa)

[7.1.4. Selector local/online	13](#selector-local/online)

[7.1.5. Gameplay	13](#gameplay)

[7.1.6. Resultado	14](#resultado)

[7.1.7. Pausa	15](#pausa)

[7.1.8. Opciones	16](#opciones)

[7.1.9. Salir	17](#salir)

[7.1.10. Créditos	17](#créditos)

[7.2. Diagrama de flujo	18](#diagrama-de-flujo)

[**8\. Comunicación y marketing	18**](#comunicación-y-marketing)

[**9\. Referencias	19**](#referencias)

1. **Introducción**

   1. ## Concepto del juego {#concepto-del-juego}

**“Balloonatics”** es un juego de **plataformas competitivo 2D** donde dos jugadores deben enfrentarse para no ser los últimos en tocar el globo una vez haya caído al suelo. Si el globo toca el suelo o se revienta, el jugador más reciente en tocar el globo pierde una vida, lo que exige combinación de estrategia competitiva, anticipación de los movimientos del rival, saltos precisos y reflejos rápidos.

2. ## Propuesta de valor {#propuesta-de-valor}

Balloonatics transforma el clásico reto de «que no caiga el globo» en un **party-platformer competitivo 2D** de ritmo frenético. A diferencia de los juegos centrados en el combate directo, combina la dinámica del volleyball con el parkour en una arena llena de plataformas y paredes que permiten realizar saltos e intercepciones aéreas. Los jugadores deben golpear el globo hacia el terreno rival y anticiparse a los movimientos del oponente para provocar sus errores. Cada caída o explosión del globo en el sector de un jugador le hace perder una vida, convirtiendo cada intercambio en una lucha por la supervivencia hasta que uno de los dos se queda sin vidas.

**\- Característica diferencial 1:** Confrontación indirecta basada en control de parábolas: no eliminas al rival golpeándolo directamente, sino forzando ángulos, rebotes difíciles y errores en su zona para drenar sus vidas.  
**\- Característica diferencial 2:** Escalado frenético de velocidad por toques: cada golpe consecutivo incrementa la velocidad del globo, reduciendo el tiempo de reacción y elevando exponencialmente la tensión en cada intercambio.  
**\- Característica diferencial 3:** Plataformeo ágil asistido en arenas cerradas: las plataformas y paredes permiten realizar saltos, reposicionamientos e intercepciones aéreas para disputar el globo, convirtiendo el movimiento y el dominio del escenario en elementos clave de la competición.

2. **Especificaciones básicas**

   

| Aspecto | Descripción |
| :---- | :---- |
| **Título** | **Balloonatics** |
| **Género** | **Plataformas competitivo** |
| **Número de jugadores** | **2** |
| **Público objetivo** | **jugadores casuales o competitivos**  |
| **Clasificación PEGI** | **PEGI 7 (tiene elementos que no son aptos para niños menores de 5 años)** |
| **Plataforma** | **PC** |
| **Duración de la partida** | **10 \- 15 minutos** |
| **Representación** | **2D** |
| **Licencia** | **Apache 2.0** |

   

3. **Jugabilidad**

   1. ## Objetivo del juego {#objetivo-del-juego}

El objetivo de cada jugador es mantener el globo en el aire golpeándolo hacia el terreno rival y obligar al contrincante a cometer un fallo para arrebatarle todas sus vidas. La partida termina cuando uno de los dos jugadores agota por completo su reserva de vidas al permitir que el globo caiga al suelo o explote en su sector. Gana el jugador que logre conservar al menos una vida intacta tras la eliminación del oponente. 

2. ## Controles {#controles}

| Acción  | Jugador 1 | Jugador 2 |
| :---- | :---- | :---- |
| **Saltar** | W | ⬆ |
| **Agacharse/descender rápido** | S | ⬇ |
| **Moverse a la derecha** | D | ⮕ |
| **Moverse a la izquierda** | A | ⬅ |
| **Usar potenciador** | Shift Derecho | Shift Izquierdo |
| **Pausar** | ESC | ESC |

# 

   3. ## Mecánicas {#mecánicas}

      1. ### Mecánicas principales {#mecánicas-principales}

\- \*\*Aceleración progresiva por impacto:\*\* El multiplicador de velocidad del globo inicia en 1x y aumenta en \+0.2 con cada golpe de un jugador hasta un tope de 10x. Si el globo cae al suelo o explota, la velocidad se reinicia a su valor base. Esto reduce el tiempo de reacción en cada intercambio, forzando a los jugadores a anticipar rebotes y optimizar sus rutas.  
\- \*\*Movimiento y control de plataforma:\*\* Los personajes cuentan con velocidad constante, salto preciso y la capacidad de agacharse para modular su desplazamiento o pasar bajo obstáculos. El movimiento está referenciado al plano de la arena 2D, permitiendo reaccionar rápidamente a la trayectoria del globo en las plataformas.  
\- \*\*Coyote Timing:\*\* Margen de gracia invisible de 0.2 segundos que permite ejecutar un salto justo después de haber abandonado el borde de una plataforma sin tocarla. Funciona de manera independiente para cada jugador y garantiza que el control se sienta responsivo y justo ante velocidades altas.  
![][image2]  
\- \*\*Condición de victoria y derrota por rondas:\*\* La ronda termina cuando el globo toca el suelo o impacta contra un obstáculo letal. El jugador en cuyo sector caiga el globo (o el último en fallar la intercepción) pierde 1 vida. Gana la partida el jugador que logre vaciar las vidas de su contrincante manteniendo las suyas.

2. ### Objetos y power-ups {#objetos-y-power-ups}

| Título | Descripción | Duración | Obtención |
| ----- | ----- | ----- | ----- |
| **Globo Pesado** | Aumenta el peso del globo, haciendo que caiga más rápido hacia el campo rival. | 6 s (o hasta finalizar el punto) | Aleatoria en plataformas aéreas cada 20 s |
| **Dash (Impulso)** | Otorga 3 cargas de aceleración lateral rápida para interceptar el globo en trayectorias limitadas. | 3 usos (hasta consumirse o 10 s) | Zona central del mapa tras 5 rebotes consecutivos |
| **Calzado Antideslizante** | Vuelve el suelo resbaladizo para el adversario, mientras el portador conserva tracción normal. | 8 s | Plataformas inferiores cada 25 s |

   

   4. ## Físicas y dificultad {#físicas-y-dificultad}

\- \*\*Gravedad y salto:\*\* Los jugadores cuentan con una gravedad constante y predecible que permite un control aéreo responsivo, complementado con \*Coyote Timing\* (margen de 0.2 s tras dejar una plataforma) para garantizar saltos justos al borde de los salientes. En contraste, el globo posee una flotabilidad inicial con baja gravedad y resistencia al aire simulada, lo que genera trayectorias en parábola lenta durante los primeros compases del punto.  
\- \*\*Colisiones:\*\*   
  \- \*Con plataformas:\* Los personajes y el globo colisionan de forma sólida con los límites del escenario y los salientes. Ciertas plataformas permiten atravesarse desde abajo saltando a través de ellas.  
  \- \*Entre jugadores:\* Existe colisión elástica leve (o traspaso sin bloqueo para evitar atascos injustos), impidiendo que se empujen fuera del mapa directamente pero compitiendo físicamente por el espacio bajo el globo.  
  \- \*Con el globo:\* El impacto del jugador transfiere un impulso vectorial directo cuya dirección depende del punto de contacto (centro, lateral o remate desde arriba). El contacto con el suelo o pinchos destruye el globo o finaliza la ronda.  
\- \*\*Rebotes / fricción / empujes:\*\* El globo cuenta con un coeficiente de restitución alto contra paredes y techos, rebotando en ángulos geométricos que cambian según la velocidad acumulada. En el suelo, la fricción de los personajes es inmediata para frenadas secas, alterándose drásticamente cuando se activan efectos de deslizamiento.  
\- \*\*Plataformas móviles o superficies especiales (hielo, rebote...):\*\* Se incorporan plataformas flotantes con movimiento cíclico (horizontal y vertical), camas elásticas/resortes en esquinas que proyectan el globo a gran velocidad, y zonas de baja fricción (hielo activado mediante el power-up \*Calzado Antideslizante\*) que reducen drásticamente la capacidad de frenado del rival.  
\- \*\*Progresión de la dificultad:\*\* A medida que avanza la ronda, cada impacto exitoso sobre el globo eleva su multiplicador de velocidad en \+0.2x (desde 1.0x hasta un tope de 10.0x), comprimiendo los tiempos de reacción, acelerando las parábolas y volviendo los rebotes contra paredes mucho más caóticos y difíciles de interceptar.

5. ## Escenario {#escenario}

El escenario representa la cámara de pruebas principal del laboratorio del excéntrico Doctor Inflatus, una arena competitiva de pantalla fija con estética retrofuturista, repleta de maquinaria científica, bobinas de energía y tuberías de helio. En ella, Pip y Beto deben enfrentarse en un duelo de supervivencia donde el objetivo es mantener el globo en el aire y desviarlo hacia el sector rival para provocar sus errores y agotar sus vidas.				

4. **Narrativa**

   1. ## Historia {#historia}

En las profundidades del laboratorio subterráneo del excéntrico Doctor Inflatus, un experimento destinado a condensar energía pura se sale de control: la sustancia ultra volátil Helio-X queda atrapada dentro de un frágil globo de látex. Al activarse el protocolo de emergencia, las compuertas blindadas sellan la cámara de pruebas, dejando atrapados a dos empleados del complejo: Pip, el torpe y nervioso asistente científico, y Beto, el conserje todoterreno del laboratorio.

El sistema de contención activa entonces un protocolo experimental de supervivencia: el globo debe permanecer en el aire y ser desviado hacia el sector opuesto antes de que toque el suelo o detone. Cada fallo compromete la seguridad del sector correspondiente, y las reservas de energía de sus ocupantes disminuyen con cada accidente. Sin posibilidad de escapar ni tiempo para buscar otra solución, Pip y Beto se ven obligados a competir por su supervivencia, utilizando las plataformas, las paredes y sus reflejos para mantener el globo fuera de su territorio y provocar errores en su rival.

Lo que comienza como una prueba de reflejos se convierte en un duelo frenético donde cada golpe aumenta la velocidad del globo y cada rebote puede cambiar el rumbo de la partida. Solo quien consiga conservar al menos una reserva de energía podrá superar el protocolo, desbloquear la salida y escapar del laboratorio antes de que el experimento alcance su punto crítico.

2. ## Personajes {#personajes}

\#\#\#\# Pip (Jugador 1\)

![][image3]

\- \*\*Edad / origen:\*\* 20 años, asistente de laboratorio júnior originario de Nueva Neumática.  
\- \*\*Personalidad:\*\* Neurótico, calculador y propenso al pánico bajo presión, aunque sumamente metódico.  
\- \*\*Motivación:\*\* Sobrevivir al colapso del experimento y demostrarle al Doctor Inflatus que merece un ascenso.  
\- \*\*Trasfondo:\*\* Contratado recientemente como becario de investigación, Pip pasa sus días calibrando válvulas de presión y limpiando los tubos de ensayo del complejo subterráneo antes del accidente con el Helio-X.

\#\#\#\# Beto (Jugador 2\)

![][image4]

\- \*\*Edad / origen:\*\* 40 años, jefe de mantenimiento e intendencia del complejo subterráneo.  
\- \*\*Personalidad:\*\* Tranquilo, pragmático, sarcástico y con reflejos curtidos por años de resolver chapuzas al instante.  
\- \*\*Motivación:\*\* Salir ileso de la cámara de pruebas para terminar su turno laboral y llegar a cenar a casa.  
\- \*\*Trasfondo:\*\* Veterano de mantenimiento que conoce cada rincón y cableado del laboratorio. Se encontraba encerando el suelo de contención justo cuando la alarma de emergencia selló los accesos con el globo suelto.

\#\#\#\# Doctor Inflatus (personaje no jugable / supervisor del experimento)

![][image5]

Científico excéntrico y creador de la sustancia Helio-X. No participa físicamente en la arena, pero supervisa el duelo a través de los monitores blindados de la cámara de pruebas. Su voz interviene por megafonía anunciando la cuenta atrás, la aceleración de las partículas y la activación aleatoria de los potenciadores en el mapa. 

5. # **Imagen y diseño visual** {#imagen-y-diseño-visual}

   1. ## Logotipo {#logotipo}

![][image6]

2. ## Estilo visual {#estilo-visual}

El juego utiliza un estilo \*\*cartoon 2D de trazo grueso y colores saturados\*\* porque refuerza la identidad desenfadada y frenética de la jugabilidad competitiva. Este tratamiento gráfico estilizado y de alto contraste permite que los personajes, las plataformas y, especialmente, la trayectoria del globo destaquen con total claridad sobre el fondo del laboratorio durante los compases de máxima velocidad y aceleración por rebote.  
![][image7]

3. ## Uso de colores {#uso-de-colores}

\- \*\*Fondo (\`\#1B1F3B\`):\*\* Azul oscuro y tonos pizarra metálicos desaturados que representan las paredes y maquinaria del laboratorio, garantizando que el primer plano resalte con nitidez.  
\- \*\*Jugador 1 (\`\#E94560\`) / Jugador 2 (\`\#0F9BD7\`):\*\* colores complementarios para distinguir fácilmente a cada jugador. Pip utiliza tonos rojo / anaranjados en su indumentaria, mientras que Beto viste tonos azul/cian, permitiendo una rápida identificación visual en mitad del caos.  
\- \*\*Objetos (\`\#F5C518\`):\*\* Amarillo brillante y dorado de alta luminiscencia para el globo energético, indicadores de alerta y cajas de \*power-ups\*, asegurando que la atención del jugador se dirija de inmediato a los elementos interactivos críticos.  
![][image8]![][image9]![][image10]![][image11]

4. ## Aspectos técnicos: cámara y representación {#aspectos-técnicos:-cámara-y-representación}

\- \*\*Representación:\*\* 2D, vista lateral  
\- \*\*Cámara:\*\* Fija mostrando todo el escenario en pantalla única  
\- \*\*Resolución base:\*\* 1920 × 1080 píxeles

5. ## Inspiración artística y cultural {#inspiración-artística-y-cultural}

\- \*\*TowerFall Ascension:\*\* tomamos la legibilidad en arenas cerradas de pantalla fija, el ritmo frenético de los saltos y la claridad espacial del plataformero 2D \[1\].  
![][image12]  
\- \*\*Laboratorio de Dexter / Animación slapstick de Cartoon Network (serie / estilo artístico):\*\* estética retrofuturista de laboratorio caricaturesco, con maquinaria exagerada, colores saturados, líneas de contorno marcadas y comedia física basada en el caos \[2\].  
![][image13]  
\- \*\*Juego popular "Que no caiga el globo" / Keepy Uppy (referencia cultural):\*\* el reto intuitivo universal de perseguir y golpear un objeto ligero para evitar que toque el suelo, reinterpretado aquí como un duelo competitivo dentro de un entorno científico inestable \[3\].  
![][image14]

6. ## Bocetos de personajes y pantallas {#bocetos-de-personajes-y-pantallas}

Los bocetos de los personajes se encuentran en el apartado \[4.2\](\#42-personajes) y los de las pantallas en el apartado \[7.1\](\#71-interfaz-de-usuario-ui).

6. # **Sonido** {#sonido}

   1. ## Banda sonora  {#banda-sonora}

| Pista | Escena | Estilo/ambiente | Fuente/licencia |
| ----- | ----- | ----- | ----- |
| Tema del Laboratorio  | Menú principal  | Jazz / funk retro cómico con sintetizadores ligeros, tempo medio (110 BPM), distendido y alegre.  | CC0 (Dominio público)  |
| Helio Frenético  | Partida  | Electro-swing acelerado con percusión enérgica (140 BPM), aumentando sutilmente de pitch según sube la velocidad del globo.  | CC-BY 4.0  |
| Fin del Experimento  | Victoria / derrota  | Jingle breve de fanfarria cómica para el vencedor y sonido de cortina de trombón caricaturesca para la derrota.  | CC0 (Dominio público)  |

      

   2. ## Efectos de sonido {#efectos-de-sonido}

      

| Efecto | Se reproduce al.. |
| ----- | ----- |
| Salto | Pulsar la tecla de salto |
| Golpe al globo | Colisionar con el globo |
| Recoger objeto  | Al entrar en contacto con una caja de *power-up* o activar una bonificación (campanilla electrónica).  |
| Botones de la interfaz  | Al pasar el ratón (clic sutil) y al hacer clic (pop de burbuja).  |
| Cuenta atrás  | En los 3 segundos previos al inicio de la ronda (bips electrónicos seguidos de bocina de laboratorio).  |
| Explosión del globo  | Cuando el globo toca el suelo o la zona de fallo (*pop* seco con eco de cristales rotos).  |
| Activación de Dash  | Al consumir una carga de impulso lateral (*whoosh* rápido de aire comprimido).  |

      

7. # **Interfaz y diagrama de flujo** {#interfaz-y-diagrama-de-flujo}

   1. ## Pantallas {#pantallas}

      1. ### Arte principal \+ Logo {#arte-principal-+-logo}

![][image6]

2. ### Menú principal {#menú-principal}

*![][image15]*

3. ### Seleccionar Mapa {#seleccionar-mapa}

![][image16]

4. ### Selector local/online {#selector-local/online}

![][image17]

5. ### Gameplay {#gameplay}

![][image18]

6. ### Resultado {#resultado}

![][image19]

7. ### Pausa {#pausa}

   ![][image20]

   8. ### Opciones {#opciones}

*![][image21]*

*![][image22]*

9. ### Salir {#salir}

![][image23]

10. ### Créditos {#créditos}

![][image24]

2. ## Diagrama de flujo {#diagrama-de-flujo}

![][image25]

8. # **Comunicación y marketing** {#comunicación-y-marketing}

\- \*\*Público y mensaje clave:\*\* Jóvenes y adultos jóvenes aficionados a los \*party games\* competitivos locales y de navegador. El mensaje clave destaca la tensión inmediata, el pique entre rivales y la diversión caótica: \*un reto simple de entender, frenético de jugar y donde cada toque al globo puede sellar tu derrota\*.  
\- \*\*Canales:\*\* Redes sociales dinámicas, comunidades de desarrollo indie en Discord / Reddit, y plataformas de distribución web indie como \[itch.io\](https\://itch.io), \[Newgrounds\](https\://www\.newgrounds.com) y \[Game Jolt\](https\://gamejolt.com).  
\- \*\*Calendario:\*\*   
  \- \*Teaser:\* Octubre 2026 (presentación del concepto visual, personajes y logo en redes).  
  \- \*Devblog semanal:\* Noviembre 2026 (avances de físicas, arquitectura cliente-servidor y pruebas multijugador).  
  \- \*Lanzamiento / Release:\* Diciembre 2026 (publicación de la versión multijugador jugable en la web).  
\- \*\*Material:\*\* Tráiler dinámico de 30 segundos centrado en momentos tensos de rebote rápido, capturas de pantalla de la arena del laboratorio, GIFs animados de jugabilidad en bucle destacando el \*Coyote Timing\* y los \*power-ups\*, y un \*press kit\* digital descargable con logotipo, recursos gráficos y sinopsis.  
\- \*\*Eslogan:\*\* «¡Rebota, esquiva y que no caiga de tu lado\!»

9. # **Referencias** {#referencias}

\[1\] Thorson, M. (2013). \*TowerFall Ascension\*. Matt Makes Games. https\://www\.towerfallgame.com

\[2\] Tartakovsky, G. (1996). \*Dexter's Laboratory\* \[Serie de televisión\]. Cartoon Network Studios / Hanna-Barbera.

\[3\] Bartle, R. (1996). Hearts, clubs, diamonds, spades: Players who suit MUDs. \*Journal of MUD Research\*, 1(1), 19\.

\[4\] Schell, J. (2019). \*The Art of Game Design: A Book of Lenses\* (3.ª ed.). CRC Press.

