# Discord Clon
![discord](https://github.com/danielmateu/discord_clone/assets/76947258/cf52e647-edca-4547-ba16-7a6e69fe3b03)

Este es un clon de Discord, una aplicación de chat y voz en tiempo real. Este proyecto está construido con NextJS, TypeScript entre otras librerías.

## Librerías instaladas

1. Tailwind: un framework de CSS que permite crear diseños personalizados de manera rápida y sencilla.

2. Shadcn/ui: una librería de componentes de React que proporciona una amplia variedad de elementos de interfaz de usuario.

3. Clerk: una plataforma de autenticación y autorización que permite agregar fácilmente funciones de inicio de sesión y registro a una aplicación.

4. Next-Themes: una librería de React que permite agregar soporte para temas oscuros y claros a una aplicación.

5. Prisma: un ORM (Object-Relational Mapping) para Node.js que permite interactuar con una base de datos de manera sencilla y segura.

6. React Hook Form: una librería de React que permite crear formularios de manera sencilla y eficiente.

7. uploadthing: una librería de React que permite subir archivos a un servidor.

8. react-dropzone: una librería de React que proporciona una zona de arrastrar y soltar para subir archivos.

9. Axios: Nos permite realizar solicitudes HTTP desde el navegador o desde Node.js.

10. UUID: una librería de JavaScript que permite generar identificadores únicos.

11. Zustand: una librería de React que permite gestionar el estado de una aplicación de manera sencilla y eficiente.

12. Query-String: una librería de JavaScript que permite analizar y generar cadenas de consulta.

13. Socket.io: una librería de Node.js que permite agregar soporte para comunicación en tiempo real a una aplicación.

14. Socket.io Client: una librería de JavaScript que permite conectarse a un servidor de Socket.io desde el navegador.

15. emoji-mart, @emoji-mart/data, @emoji-mart/react: una colección de librerías de React que proporcionan una amplia variedad de emojis.

16. @tanstack/react-query: una librería de React que permite realizar solicitudes a una API de manera sencilla y eficiente.

17. LiveKit: LiveKit es una alternativa de código abierto a Twilio Video o Agora. Cree aplicaciones y funciones de audio y video en vivo utilizando una pila WebRTC moderna y de extremo a extremo.

## Cómo ejecutar el proyecto

Para ejecutar este proyecto, sigue estos pasos:

1. Clona este repositorio en tu máquina local.

2. Abre una terminal en la carpeta raíz del proyecto.

3. Ejecuta el siguiente comando para instalar las dependencias:

```
npm install
```

4. Ejecuta el siguiente comando para iniciar la aplicación:

```
npm run dev
```

5. Abre tu navegador y navega a http://localhost:3000 para ver la aplicación en funcionamiento.

## Manejo de las variables de Entorno

En el archivo .env.local se muestran las variables de entorno a tener en cuenta para el correcto funcionamiento de la aplicación en modo local. A tener en cuenta que la última variable es la url del deploy final

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=
DATABASE_URL=
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
NEXT_PUBLIC_LIVEKIT_URL=
NEXT_PUBLIC_SITE_URL=

## Cómo contribuir
Si deseas contribuir a este proyecto, sigue estos pasos:

1. Haz un fork de este repositorio.

2. Clona tu fork en tu máquina local.

3. Crea una nueva rama para tu contribución:
```
git checkout -b mi-nueva-funcionalidad
```

4. Realiza tus cambios y haz commit de tus cambios:

5. Haz push de tus cambios a tu fork:

6. Abre un pull request en este repositorio y describe tus cambios.

7. Espera a que se revise y apruebe tu pull request.

## Licencia
Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo LICENSE.md para obtener más información.

## Librerías instaladas

1. Tailwind
2. Shadcn/ui
3. Clerk
4. Next-Themes
5. Prisma
   npx prisma generate -> Cada vez que modifiquemos el schema prisma
   npx prisma db push -> Creamos las colecciones en planetscale o mysql gestion
   npx prisma studio -> Para ver las tablas

6. React Hook Form
7. uploadthing
8. react-dropzone

9. Axios
10. UUID

11. Zustand
12. Query-String

13. Socket.io
14. Socket.io CLient

15. emoji-mart @emoji-mart/data @emoji-mart/react
16. @tanstack/react-query

17. dat-fns
18. LiveKit

Referencias -> https://www.youtube.com/watch?v=ZbX4Ok9YX94&t=605s

## To fix Hydration issues

1. const [isMounted, setIsMounted] = useState(false)

2. useEffect(() => {
   setIsMounted(true)
   }, [])
3. if (!isMounted) return null
