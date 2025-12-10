# 🍰 Dolce Miga - Sistema de Gestión de Pastelería

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)

**Dolce Miga** es una aplicación web moderna diseñada para la administración integral de una pastelería. Permite gestionar ventas, controlar el inventario en tiempo real, administrar pedidos de clientes y generar reportes financieros detallados.

El proyecto está construido con una arquitectura modular basada en **Features**, asegurando escalabilidad y mantenimiento limpio.

---


## ✨ Características Principales

* **📊 Dashboard Interactivo:** Métricas en tiempo real, gráficos de ventas mensuales y productos populares.
* **📦 Gestión de Inventario (CRUD):** Control de stock, categorías, alertas de stock bajo y valoración del inventario.
* **🛒 Punto de Venta:** Registro de pedidos con cálculo automático de totales.
* **📄 Reportes PDF:** Generación automática de reportes de ventas, inventario y comprobantes de pago (Boletas).
* **👥 Gestión de Usuarios:** Control de acceso basado en roles (Administrador vs. Vendedor).
* **🔐 Seguridad:** Rutas protegidas y autenticación persistente.

---

## 🛠️ Tecnologías Utilizadas

* **Frontend:** React 18 + TypeScript + Vite
* **Estilos:** Tailwind CSS + Lucide React (Iconos)
* **Backend (Simulado):** JSON Server (Simulación de API REST completa)
* **Herramientas:** jsPDF (Generación de documentos), Chart.js (Gráficos), React Router DOM.

---

## 🚀 Instrucciones de Instalación

Sigue estos pasos para ejecutar el proyecto en tu entorno local. Necesitarás tener instalado [Node.js](https://nodejs.org/).

### 1. Clonar el repositorio


git clone [https://github.com/TU_USUARIO/dolcemiga-proyecto.git](https://github.com/TU_USUARIO/dolcemiga-proyecto.git)
cd dolcemiga-proyecto

Instalar dependencias:
npm install

Ejecutar el Servidor (Backend Mock):
npm run server

Ejecutar la Aplicación (Frontend):
npm run dev

Abre tu navegador en la dirección que te indique (http://localhost:5173).


Rol,Usuario,Contraseña
Administrador,admin,admin123
Vendedor,vendedor,vendedor123
