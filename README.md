App-Internacion
==========

REST API para gestión de internaciones de pacientes

Prerequisitos
-----
* [Client GIT](https://git-scm.com/download/win)
* [Node.JS](https://nodejs.org/en/download/)
* [Bower](http://bower.io/)
* [Gulp](http://gulpjs.com/)
* [vApp](https://github.com/hospitalneuquen/vapp)

Cómo compilar
------
Crear una nueva carpeta y `cd` hasta ella:
```bash
md api-internacion
cd api-internacion
```

Clonar (descargar) el repositorio:
```bash
git clone https://github.com/hospitalneuquen/api-internacion.git
```

Instalar dependencias de Node:
```bash
npm install
```

Correr la aplicación
------
Con [vApp](https://github.com/hospitalneuquen/vapp) corriendo, invocar los métodos desde *http://localhost:81/api/internacion/...*

Documentación
---

Documentar los métodos utilizando [JSDoc para generar una especificación Swagger](https://www.npmjs.com/package/swagger-jsdoc).

Para leer la documentación navegar hasta *http://localhost:81/api/internacion/docs/?url=../docs.json*
