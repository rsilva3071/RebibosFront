README para el Backend (Servidor Django).
# API de Recibos y Pagos - Backend

Este proyecto es una API RESTful desarrollada con Django y Django REST Framework que gestiona usuarios, recibos y pagos. Utiliza autenticación basada en tokens JWT (JSON Web Tokens) para proteger los endpoints.

## Características Principales

*   **Gestión de Usuarios**: Registro y listado de usuarios [1, 2].
*   **Autenticación JWT**: Sistema de login seguro con tokens de acceso y de refresco (`djangorestframework-simplejwt`) [3-5].
*   **Gestión de Recibos**: Creación y listado de recibos. Los administradores pueden ver todos los recibos, mientras que los usuarios regulares solo ven los suyos [6-8].
*   **Gestión de Pagos**: Creación de pagos asociados a un recibo. Al crear un pago, el recibo correspondiente se marca automáticamente como pagado [9, 10].
*   **Permisos por Rol**: Endpoints protegidos que diferencian entre usuarios regulares y superusuarios [8].

## Tecnologías y Librerías Utilizadas

*   **Framework**: Django 5.1.2 [5]
*   **API**: Django REST Framework 3.15.2 [5]
*   **Autenticación**: djangorestframework-simplejwt [5]
*   **CORS**: django-cors-headers [5]
*   **Utilidades**: django-extensions [5]
*   **Base de Datos**: SQLite (configuración por defecto de Django) [11]
*   **Contenerización**: Docker (`python:3.11-slim`) [5]

## Modelos de Datos

El sistema utiliza tres modelos principales [11, 12]:

1.  **User**: Modelo de usuario por defecto de Django.
2.  **Recibo**:
    *   `usuario`: Clave foránea al usuario propietario.
    *   `concepto`: Descripción del recibo.
    *   `monto`: Valor del recibo.
    *   `pagado`: Booleano que indica si el recibo ha sido pagado (`default=False`).
3.  **Pago**:
    *   `recibo`: Clave foránea al recibo que se está pagando.
    *   `monto`: Monto del pago.

## Documentación de la API

La API expone los siguientes endpoints principales:

| Método | Endpoint | Descripción | Autenticación |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/token/` | Inicia sesión y obtiene tokens JWT [3]. | Pública |
| **POST** | `/api/token/refresh/` | Refresca el token de acceso [4]. | Pública |
| **POST** | `/api/CreateUser/` | Registra un nuevo usuario [2]. | Admin |
| **GET** | `/api/user/` | Obtiene información del usuario autenticado [13].| Requerida |
| **GET** | `/api/usuarios/` | Lista todos los usuarios del sistema [1]. | Admin |
| **GET** | `/api/recibos/` | Lista recibos (todos para admin, propios para usuario) [6, 8]. | Requerida |
| **POST** | `/api/recibos/crear/` | Crea un nuevo recibo [7, 14]. | Requerida |
| **POST** | `/api/pagos/crear/` | Crea un pago y marca el recibo como pagado [9, 10]. | Requerida |

## Cómo Ejecutar el Proyecto con Docker

1.  **Clonar el repositorio**:
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd <DIRECTORIO_DEL_BACKEND>
    ```

2.  **Construir la imagen de Docker**:
    Asegúrate de tener un archivo `requirements.txt` en la raíz [5].
    ```bash
    docker build -t recibos-api .
    ```

3.  **Ejecutar el contenedor**:
    El servidor se  expondrá en el puerto 8000 [5].
    ```bash
    docker run -p 8000:8000 recibos-api
    ```

4.  **Realizar migraciones (si es la primera vez)**:
    ```bash
    docker exec -it <ID_DEL_CONTENEDOR> python manage.py migrate
    ```
