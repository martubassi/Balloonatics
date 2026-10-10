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



**Balloonatics**   
**Game Design Document**

by Arturo de Maria Garcia, Bassi Martina, Dario Ayala and Mateo Gonzalez

Sep 2026 **|** Business Confidential

**Índice**

**[● Descripción general	3](#descripción-general)**

[**● Premisa principal	4**](#premisa-principal)

[A Concepto del juego	4](#concepto-del-juego)

[B Experiencia deseada	4](#experiencia-deseada)

[C Diferencias con juegos similares	4](#diferencias-con-juegos-similares)

[D Género	6](#género)

[E Inspiración	6](#inspiración)

[F Público objetivo	6](#público-objetivo)

[**● Interfaz de usuario y controles	8**](#interfaz-de-usuario-y-controles)

[A Descripción general	8](#descripción-general-1)

[B Interfaz de usuario	8](#interfaz-de-usuario)

[C Asignación de controles	10](#asignación-de-controles)

[**● Gameplay	11**](#gameplay)

[A Descripción general	11](#descripción-general-2)

[B Mecánica de velocidad	11](#mecánica-de-velocidad)

[C Movimiento	13](#movimiento)

[D Coyote Timing	13](#coyote-timing)

[E Power Ups	15](#power-ups)

[F Dynamics and expected situations	15](#heading=h.hkpnlwv2jq3a)

[G Condición de Victoria	16](#condición-de-victoria-/-derrota)

[H Condición de Derrota	17](#heading=h.e5zwc3wm5hdv)

[**● Dirección de Arte	18**](#dirección-de-arte)

[A Descripción general	18](#descripción-general-3)

[**● Musica y Sonido	19**](#musica-y-sonido)

[A Descripción general	19](#descripción-general-4)

[B Sonido	19](#sonido)

* # **Descripción general** {#descripción-general}

El propósito de este documento es planificar de manera organizada el desarrollo del videojuego **Balloonatics**, guardar las ideas para pulirlas, dar acceso al equipo de desarrollo a la información clave, y en caso de que se añada un nuevo miembro al equipo.

* # **Premisa principal** {#premisa-principal}

  1. ## ***Concepto del juego*** {#concepto-del-juego}

**“Balloonatics”** es un juego de plataformas cooperativo en 2D donde dos jugadores deben mantener a flote un globo compartido a lo largo de niveles de pantalla fija. Si el globo toca el suelo o se revienta, se pierde una vida, lo que exige una gran coordinación, saltos precisos y reflejos rápidos para sobrevivir.

2. ## ***Experiencia deseada*** {#experiencia-deseada}

Al jugar a **Balloonatics**, los jugadores deben sentir la emoción intensa y caótica de una coordinación de alto riesgo y reflejos rápidos. Mantener el globo en el aire con éxito mientras navegan por la arena debe hacer que los jugadores se sientan sincronizados, ágiles y eufóricos bajo presión.

Las mecánicas centrales que impulsan esta sensación incluyen un plataformeo 2D preciso, físicas dinámicas para la trayectoria del globo y una constante comunicación verbal o no verbal entre ambos jugadores. Para ofrecer un desafío significativo y un alto nivel de enganche, el juego se apoya en diseños de arena ajustados de pantalla fija, obstáculos peligrosos en los escenarios y una velocidad creciente combinada con rebotes impredecibles que exigen conciencia espacial y toma de decisiones en fracciones de segundo.

Resumir cómo debería sentirse el jugador en una sola frase sería: **“Electrizado, en perfecta sincronía y al borde del asiento”**. Cada decisión de diseño debe reforzar esta tensión trepidante y una gratificante sinergia de equipo.

3. ## ***Diferencias con juegos similares*** {#diferencias-con-juegos-similares}

"La competencia directa de **Balloonatics** no se encuentra en las aventuras complejas de puzles, sino entre los *party-platformers* 2D de ritmo frenético y los arcades cooperativos basados en físicas, centrados en la coordinación compartida, la comunicación inmediata y los reflejos bajo alta tensión. " 

**Referencias:** 

                                  **TowerFall Ascension  ([steam](https://store.steampowered.com/app/251470/TowerFall_Ascension/))**

Destaca por el diseño de sus arenas de pantalla fija y unas mecánicas de plataformas 2D precisas y responsivas que exigen una gran exactitud y una rápida percepción espacial.

**Balloonatics**  sustituye el combate competitivo por un objetivo compartido: en lugar de eliminar a otros jugadores, la arena y sus peligros actúan como obstáculos mientras ambos jugadores recorren las plataformas para interceptar y mantener el globo en el aire.

![][image1]

**Heave Ho  ([Steam](https://store.steampowered.com/app/905340/Heave_Ho/))**	

Combina una jugabilidad cooperativa basada en físicas con una comunicación caótica, donde un solo error o una acción a destiempo de cualquiera de los jugadores puede provocar un fallo inmediato.

**Balloonatics** introduce físicas dinámicas para la trayectoria del globo y una sincronización estricta de intercepción aérea, cambiando el foco de cadenas físicas estáticas hacia un movimiento ágil y continuo, y la preservación de vidas a lo largo del escenario.

![][image2]

4. ## ***Género*** {#género}

**Balloonatics** es un *party-platformer* cooperativo en 2D donde dos jugadores recorren arenas de pantalla fija, coordinando saltos precisos y tiempos de trayectoria para evitar que un frágil globo toque el suelo o reviente contra los peligros del entorno. 

5. ## ***Inspiración*** {#inspiración}

La principal inspiración para la jugabilidad de **Balloonatics** es el clásico juego popular **"Que no caiga el globo" (Keepy Uppy)**, combinado con el ritmo frenético de micro desafíos propio de juegos tipo **WarioWare**. El concepto central se basa en una tensión física inmediata e intuitiva: perseguir un objeto frágil de caída lenta usando posicionamiento, saltos y colisiones para mantenerlo en el aire a toda costa.

Mientras que **"Que no caiga el globo"** funciona como un juego informal de la vida cotidiana delimitado por espacios domésticos, **Balloonatics** traslada esta tensión a arenas de plataformas en 2D con obstáculos ambientales, plataformas móviles y una economía estricta de vidas, exigiendo reflejos cooperativos precisos en lugar de un juego casual libre.

6. ## ***Público objetivo*** {#público-objetivo}

La investigación de público objetivo a partir de títulos comparables indica que **Balloonatics** apela principalmente a adolescentes y jóvenes adultos atraídos por juegos arcade cooperativos locales, party games y títulos de plataformas dinámicos centrados en reflejos y coordinación. Bajo la Taxonomía de Jugadores de Bartle, nuestro perfil demográfico se alinea con el arquetipo **'Socializer'** (y secundariamente **'Achiever'**): jugadores motivados por la interacción directa, la cooperación y la risa compartida ante situaciones caóticas, así como por la satisfacción de superar escenarios cada vez más exigentes manteniendo todas las vidas intactas

* # **Interfaz de usuario y controles** {#interfaz-de-usuario-y-controles}

  1. ## ***Descripción general*** {#descripción-general-1}

Esta sección del documento detalla el UI y los controles.

2. ## ***Interfaz de usuario*** {#interfaz-de-usuario}

La interfaz del juego es simple, contando con un indicador de las vidas restantes y en la parte inferior un espacio que indicará la bonificación que tiene el jugador en cuestión

El resto de interfaces son menús, contando con el menú principal, el de fin del juego y el de ajustes.

3. ## ***Asignación de controles*** {#asignación-de-controles}

La asignación de controles será la siguiente: 

| Acción  | Tecla/Acción |
| :---- | :---- |
| **Jump** | W /  up arrow |
| **Move backward**  | S / down arrow |
| **Move Right** | D / right arrow |
| **Move Left** | A / left arrow |
| **Usar potenciador** | Right Shift / Left Shift |
| **Pausar** | ESC |

* # **Gameplay** {#gameplay}

  1. ## ***Descripción general*** {#descripción-general-2}

Esta parte del documento explica cómo funcionan las mecánicas, las dinámicas y el ciclo principal de juego. 

2. ## ***Mecánica de velocidad*** {#mecánica-de-velocidad}

**Multiplicador:**

El multiplicador de velocidad del globo, aumenta con cada toque o golpe que reciba de un jugador. Su valor inicial es 1 y por cada golpe aumenta un 0.2, hasta un máximo de 10\.

**Reinicio:**

Cuando el globo cae al suelo, o explota, la velocidad del globo vuelve a su estado inicial.

**Desafio:**

Lo desafiante de esta mecánica se basa en que cuantos más toques lleve el globo más rápido se moverá, haciendo más difícil llegar a tiempo a su ubicación y reduciendo el tiempo de reacción del jugador.

Los jugadores deberían preguntarse:  

* ¿Debería anticiparme al globo?  
* ¿Cómo puedo llegar más rápido?   
* ¿Cual es el mejor momento para golpear el globo?

   
**¿Cómo ayuda a la experiencia deseada?**

Aumentando la velocidad del globo de manera progresiva, mejora el ritmo y la diversión del juego, sin complicarlo demasiado de manera abrupta y permitiendo al jugador adaptarse de manera natural.

Esta mecánica le da dificultad al juego evitando que sea monótono y relativamente fácil, convirtiéndolo en un juego más rápido y caótico.

3. ## ***Movimiento*** {#movimiento}

Cuando los jugadores pulsan una tecla:

* “W” / “ up arrow “ el jugador 1 / jugador 2 salta.  
* “A” / “ left arrow “ el jugador 1 / jugador 2 se mueve a la izquierda.  
* “D” / “ right arrow “ el jugador 1 / jugador 2 se mueve a la derecha.  
* “S” / “ down arrow “ el jugador 1 / jugador 2 desciende o se agacha.

All these movements (except jumping) are in relation to where the first person camera is looking. Jumping is in relation to where the ground is. 

La velocidad de los jugadores es constante y solamente es modificada por algunos bonificadores durante la ronda y el estado de agachado**.**

**Desafio:**

El desafío relacionado a esta mecánica es optimizar el movimiento para poder seguir continuando la partida a pesar del aumento constante de velocidad del juego.

Los jugadores deberían preguntarse: 

* ¿Debería subir por estas plataformas o ir por debajo de ellas?   
* ¿Podré llegar a tocar el globo?  
* ¿Me merece la pena reducir mi velocidad agachándome para llegar al destino?


**¿Cómo ayuda a la experiencia deseada?**

El movimiento debe hacer que el jugador sienta que tiene un control rápido y preciso sobre el personaje. Los controles deben ser sencillos y permitir reaccionar rápidamente a la posición del globo y a las plataformas.

La intención es que el movimiento sea fácil de aprender, pero que requiera práctica para aprovecharlo al máximo a medida que aumenta la velocidad del juego.

4. ## ***Coyote Timing*** {#coyote-timing}

El jugador puede saltar durante un breve periodo de tiempo después de haber abandonado una plataforma, siempre que hayan pasado menos de **0,2 segundos**.

Esta mecánica es conocida en los juegos de plataformas como **“Coyote Timing”**. Hace que el juego se perciba más justo, ya que puede ser difícil calcular exactamente cuándo el personaje está en el borde de una plataforma. Sin esta mecánica, el jugador puede intentar saltar cuando el personaje ya ha salido de la plataforma, haciendo que el salto falle y dando la sensación de que el juego no ha respondido correctamente.

En **Balloonatics**, esta mecánica permite a ambos jugadores tener un pequeño margen de error al calcular cuándo han llegado al borde de una plataforma, algo especialmente importante cuando la velocidad del juego aumenta.

El Coyote Timing funcionará de forma independiente para cada jugador, tanto en partidas locales como online.

**Desafío:**

No hay un desafío directamente relacionado con esta mecánica, ya que idealmente debe ser completamente invisible para el jugador y solo notarse cuando no está presente.

**¿Cómo ayuda a la experiencia deseada?**

Esta mecánica ayuda a que el movimiento se sienta preciso y justo. El jugador debe poder saltar cuando percibe que todavía está a tiempo de hacerlo, evitando que pequeños errores de cálculo hagan que pierda una oportunidad de alcanzar el globo.

Un ejemplo visual del Coyote timing en el videojuego Celeste:

![][image3]

5. ## ***Power Ups*** {#power-ups}

Los Power Ups es una mecánica introducida dentro del videojuego para dar una sensación de variabilidad y dinamismo al gameplay, haciendo que los comportamientos de los elementos cambien o adquieran nuevas acciones.

* Globo Pesado:  El globo se vuelve más denso haciendo que caiga con mucha más velocidad durante cierto tiempo o hasta que se obtenga el punto.  
* Dash: Se le da al jugador que obtenga este Power Up 3 dashes, movimientos de gran velocidad hacia los lados para alcanzar más fácilmente al globo.  
* Calzado AntiDeslizante: El suelo se vuelve una zona deslizante para todos los jugadores excepto para aquel que obtenga este Power Up.

  6. ## ***Condición de Victoria / Derrota*** {#condición-de-victoria-/-derrota}

Una ronda finalizará cuando el globo toque el suelo, aquel jugador que haya tocado el globo 

* # **Dirección de Arte** {#dirección-de-arte}

  1. ## ***Descripción general*** {#descripción-general-3}

La dirección de arte de **Balloonatics** propone gráficos 2D de estilo cartoon, inspirados en los juegos icónicos de Friv. El juego presenta colores vivos y un diseño de interfaz sencillo e intuitivo.

* # **Musica y Sonido** {#musica-y-sonido}

  1. ## ***Descripción general*** {#descripción-general-4}

Esta sección del documento detalla los efectos de sonido y música que se usarán para **Balloonatics**.

2. ## ***Sonido*** {#sonido}

