# Plan de Pruebas - Sistema de Gestión de Restaurante

## 1. Objetivo
Validar todas las funcionalidades del sistema incluyendo:
- Creación de pedidos por meseros
- Visualización y edición de pedidos por administradores
- Descuento automático de inventario
- Generación de reportes
- Liberación de mesas y persistencia en reportes
- Gestión de usuarios (crear, editar, eliminar meseros)
- Gestión de mesas (agregar mesas con capacidad personalizada)

---

## 2. Alcance de Pruebas

### 2.1 Funcionalidades Críticas
- ✅ Autenticación (admin y mesero)
- ✅ Gestión de pedidos (crear, ver, editar)
- ✅ Gestión de inventario (ver, actualizar, descuento automático)
- ✅ Gestión de mesas (ocupar, liberar, capacidades)
- ✅ Pagos y cierre de pedidos
- ✅ Reportes de ventas
- ✅ Gestión de usuarios (crear, editar, eliminar meseros)

### 2.2 Roles y Permisos
| Funcionalidad | Mesero | Admin |
|--------------|--------|-------|
| Crear pedidos | ✅ | ✅ |
| Ver pedidos | ⚠️ Solo propios | ✅ Todos |
| Editar pedidos | ❌ | ✅ |
| Ver inventario | ❌ | ✅ |
| Actualizar inventario | ❌ | ✅ |
| Marcar como pagado | ❌ | ✅ |
| Ver reportes | ❌ | ✅ |
| Gestionar usuarios | ❌ | ✅ |
| Agregar mesas | ❌ | ✅ |
| Cambiar contraseñas | ❌ | ✅ |

---

## 3. Casos de Prueba

### CP-001: Login Mesero
**Precondición:** Usuario mesero existe en BD  
**Pasos:**
1. Navegar a /login
2. Ingresar usuario: "mesero", contraseña: "mesero123"
3. Hacer clic en "Iniciar Sesión"

**Resultado esperado:**
- Redirección a /waiter
- Ver lista de mesas disponibles
- Ver formulario para tomar pedidos

---

### CP-002: Login Administrador
**Precondición:** Usuario admin existe en BD  
**Pasos:**
1. Navegar a /login
2. Ingresar usuario: "admin", contraseña: "admin123"
3. Hacer clic en "Iniciar Sesión"

**Resultado esperado:**
- Redirección a /admin
- Ver tabs: Pedidos, Tomar Pedido, Inventario, Reportes, Usuarios, Mesas
- Ver lista de pedidos activos

---

### CP-003: Crear Pedido como Mesero
**Precondición:** Sesión iniciada como mesero  
**Pasos:**
1. Seleccionar Mesa 1
2. Agregar items:
   - 2x Hamburguesa Clásica ($8.000 c/u)
   - 1x Coca Cola ($2.000)
3. Confirmar pedido

**Resultado esperado:**
- Pedido creado exitosamente
- Mesa 1 marcada como ocupada (color cambiado)
- Total: $18.000
- Inventario descontado:
  - Carne de Res: -2 unidades necesarias
  - Pan: -2 unidades
  - Coca Cola: -1 unidad
- Mensaje de éxito mostrado

**Validaciones:**
1. Verificar en BD: tabla `orders` tiene nuevo registro
2. Verificar en BD: tabla `order_items` tiene 2 registros
3. Verificar en BD: tabla `tables` - Mesa 1 con status "occupied"
4. Verificar en BD: tabla `inventory_items` - cantidades reducidas

---

### CP-004: Ver Pedido como Admin (Creado por Mesero)
**Precondición:** 
- Pedido CP-003 creado por mesero
- Cerrar sesión de mesero
- Iniciar sesión como admin

**Pasos:**
1. Navegar a tab "Pedidos"
2. Buscar pedido de Mesa 1

**Resultado esperado:**
- Ver pedido en lista de "Pedidos Activos"
- Detalles visibles:
  - Mesa: 1
  - Mesero: "mesero"
  - Items: 2x Hamburguesa Clásica, 1x Coca Cola
  - Total: $18.000
  - Estado: "pending"
  - Hora de creación

---

### CP-005: Editar Pedido - Admin Agrega Productos
**Precondición:** Sesión iniciada como admin, pedido CP-003 existe  
**Pasos:**
1. En tab "Pedidos", seleccionar pedido de Mesa 1
2. Hacer clic en "Agregar Items"
3. Agregar:
   - 1x Papas Fritas ($4.000)
   - 2x Coca Cola ($2.000 c/u)
4. Confirmar

**Resultado esperado:**
- Items agregados al pedido existente
- Nuevo total: $26.000 ($18.000 + $8.000)
- Inventario descontado por nuevos items
- Mesa 1 sigue ocupada
- Pedido actualizado en tiempo real

**Validaciones:**
1. Verificar en BD: `order_items` tiene 4 registros para este order_id
2. Verificar en BD: `orders.total` = 26000
3. Verificar inventario descontado correctamente

---

### CP-006: Validación de Stock Insuficiente
**Precondición:** Sesión iniciada (mesero o admin)  
**Pasos:**
1. Reducir inventario de "Carne de Res" a 0.5 kg manualmente
2. Intentar crear pedido con 5x Hamburguesa Clásica

**Resultado esperado:**
- Error mostrado: "Stock insuficiente para: Hamburguesa Clásica: falta Carne de Res"
- Pedido NO creado
- Mesa NO ocupada
- Inventario NO modificado

---

### CP-007: Marcar Pedido como Pagado
**Precondición:** Sesión iniciada como admin, pedido CP-005 existe  
**Pasos:**
1. En lista de "Pedidos Activos"
2. Localizar pedido de Mesa 1
3. Hacer clic en "Marcar como Pagado"
4. Confirmar acción

**Resultado esperado:**
- Pedido marcado como "paid"
- Mesa 1 liberada (status "available")
- Pedido removido de lista "Pedidos Activos"
- Mensaje de éxito: "Pedido marcado como pagado"

**Validaciones:**
1. Verificar en BD: `orders.status` = 'paid'
2. Verificar en BD: `tables.status` = 'available'
3. Verificar en BD: `tables.current_order_id` = null

---

### CP-008: Reporte de Ventas - Pedido Pagado Aparece
**Precondición:** Pedido CP-007 marcado como pagado  
**Pasos:**
1. Como admin, navegar a tab "Reportes"
2. Seleccionar periodo: "Día"
3. Revisar lista de ventas

**Resultado esperado:**
- Reporte muestra pedido de Mesa 1
- Detalles visibles:
  - Mesa: 1
  - Mesero: mesero
  - Items: Lista completa de items
  - Total: $26.000
  - Estado: paid
  - Fecha/hora de creación
- Total de ventas del día: $26.000
- Cantidad de órdenes: 1

**Validaciones:**
1. Verificar suma correcta de totales
2. Verificar filtro por fecha funciona
3. Verificar pedidos "pending" NO aparecen en reporte

---

### CP-009: Múltiples Pedidos - Reporte Semanal
**Precondición:** Varios pedidos pagados en la semana  
**Pasos:**
1. Crear 5 pedidos diferentes en diferentes mesas
2. Marcar 3 como pagados
3. Dejar 2 como pending
4. Ir a Reportes → Seleccionar "Semana"

**Resultado esperado:**
- Solo 3 pedidos pagados aparecen
- Total calculado correctamente
- Gráfico muestra distribución por día
- Pedidos pending NO incluidos

---

### CP-010: Inventario - Alerta de Stock Bajo
**Precondición:** Sesión como admin  
**Pasos:**
1. Navegar a tab "Inventario"
2. Localizar items con cantidad < min_quantity

**Resultado esperado:**
- Items con stock bajo resaltados en rojo/amarillo
- Alerta visible: "⚠️ Stock bajo"
- Barra de progreso indica nivel crítico
- Lista ordenada con críticos primero

---

### CP-011: Actualizar Inventario
**Precondición:** Sesión como admin  
**Pasos:**
1. En tab "Inventario"
2. Seleccionar "Carne de Res"
3. Hacer clic en "Ajustar Stock"
4. Ingresar nueva cantidad: 50 kg
5. Guardar

**Resultado esperado:**
- Cantidad actualizada a 50 kg
- Alerta de stock bajo removida (si aplica)
- Timestamp "updated_at" actualizado
- Mensaje de éxito

---

### CP-012: Persistencia de Sesión
**Precondición:** Usuario logueado  
**Pasos:**
1. Iniciar sesión como mesero
2. Crear pedido
3. Cerrar navegador completamente
4. Abrir navegador
5. Navegar a la app

**Resultado esperado:**
- Redirección a /login (sesión expirada)
- Pedido creado aún existe en BD
- Mesa ocupada persiste

---

### CP-013: Logout y Cambio de Usuario
**Precondición:** Sesión activa  
**Pasos:**
1. Como mesero, crear pedido para Mesa 2
2. Hacer logout
3. Login como admin
4. Verificar pedido de Mesa 2

**Resultado esperado:**
- Logout exitoso
- Login como admin exitoso
- Pedido de Mesa 2 visible para admin
- Atribuido correctamente a mesero creador

---

### CP-014: Concurrencia - Dos Usuarios Simultáneos
**Precondición:** Dos navegadores/sesiones  
**Pasos:**
1. Browser 1: Login como mesero
2. Browser 2: Login como admin
3. Browser 1: Crear pedido Mesa 3
4. Browser 2: Refrescar pedidos
5. Browser 2: Agregar item al pedido Mesa 3

**Resultado esperado:**
- Ambas acciones exitosas
- Pedido consolidado correctamente
- Sin conflictos de concurrencia
- Total calculado correctamente

---

### CP-015: Reporte Mensual con Gráfico
**Precondición:** Varios pedidos pagados en el mes  
**Pasos:**
1. Como admin, ir a Reportes
2. Seleccionar "Mes"

**Resultado esperado:**
- Gráfico de barras/líneas mostrando ventas por día
- Total mensual calculado
- Promedio de venta por día
- Número total de órdenes del mes

---

### CP-016: Crear Usuario Mesero
**Precondición:** Sesión iniciada como admin  
**Pasos:**
1. Navegar a tab "Usuarios"
2. Hacer clic en "Agregar Usuario"
3. Ingresar:
   - Usuario: "mesero2"
   - Contraseña: "pass123"
   - Confirmar contraseña: "pass123"
4. Hacer clic en "Crear Usuario"

**Resultado esperado:**
- Usuario creado exitosamente
- Toast de confirmación mostrado
- Usuario aparece en lista
- Contraseña hasheada en BD

**Validaciones:**
1. Verificar en BD: tabla `users` tiene nuevo registro
2. Verificar: `password_hash` no es texto plano
3. Verificar: `role` = 'waiter'

---

### CP-017: Cambiar Contraseña de Usuario
**Precondición:** Usuario "mesero2" existe  
**Pasos:**
1. Como admin, en tab "Usuarios"
2. Localizar usuario "mesero2"
3. Hacer clic en botón "Cambiar Contraseña"
4. Ingresar nueva contraseña: "nuevaPass456"
5. Confirmar

**Resultado esperado:**
- Contraseña actualizada
- Toast de éxito mostrado
- Usuario puede iniciar sesión con nueva contraseña
- Hash actualizado en BD

---

### CP-018: Eliminar Usuario con Modal Personalizado
**Precondición:** Usuario "mesero2" existe  
**Pasos:**
1. Como admin, en tab "Usuarios"
2. Hacer clic en "Eliminar" para "mesero2"
3. Ver modal de confirmación personalizado
4. Leer mensaje: "¿Estás seguro de eliminar al usuario 'mesero2'?"
5. Hacer clic en "Eliminar"

**Resultado esperado:**
- Modal personalizado mostrado (NO alerta nativa del navegador)
- Diseño coherente con la aplicación
- Usuario eliminado tras confirmación
- Toast de éxito
- Usuario removido de lista
- Permanece en tab "Usuarios" (no redirección)

**Validaciones:**
1. Verificar: NO se muestra alerta nativa del navegador
2. Verificar en BD: usuario eliminado
3. Verificar: UI permanece en gestión de usuarios

---

### CP-019: Agregar Mesa con Capacidad Personalizada
**Precondición:** Sesión iniciada como admin  
**Pasos:**
1. Navegar a tab "Mesas"
2. En sección "Agregar Mesas"
3. Seleccionar capacidad: "6 personas"
4. Hacer clic en "Agregar Mesa"

**Resultado esperado:**
- Una nueva mesa agregada
- Numeración automática (ej: si última era Mesa 10, nueva es Mesa 11)
- Capacidad: 6 personas
- Estado: Disponible
- Mesa visible en grid

**Validaciones:**
1. Verificar en BD: tabla `tables` tiene nuevo registro
2. Verificar: `table_number` correlativo correcto
3. Verificar: `capacity` = 6
4. Verificar: `status` = 'available'

---

### CP-020: Agregar Múltiples Mesas con Diferentes Capacidades
**Precondición:** Sesión iniciada como admin  
**Pasos:**
1. Agregar mesa de 2 personas
2. Agregar mesa de 8 personas
3. Agregar mesa de 4 personas

**Resultado esperado:**
- 3 mesas agregadas con numeración correlativa
- Cada mesa con su capacidad correcta
- Todas visibles en grid mostrando:
  - "Mesa X"
  - "Y personas"
  - Estado disponible

---

### CP-021: Validar Números de Mesa en Pedidos y Reportes
**Precondición:** Mesas con diferentes números existen  
**Pasos:**
1. Crear pedido en Mesa 5
2. Marcar como pagado
3. Ir a Reportes
4. Verificar que muestra "Mesa 5" (no "Mesa 0")

**Resultado esperado:**
- En lista de pedidos activos: "Mesa 5"
- En reportes: "Mesa 5"
- Números de mesa correctos en toda la aplicación

---

### CP-022: Performance - Crear Pedido Rápido
**Precondición:** Sesión iniciada  
**Pasos:**
1. Seleccionar mesa
2. Agregar 5 items diferentes al pedido
3. Confirmar pedido
4. Medir tiempo desde confirmar hasta ver mensaje de éxito

**Resultado esperado:**
- Tiempo total: < 1.5 segundos
- Feedback optimista: carrito se limpia inmediatamente
- Toast de éxito aparece rápido
- Inventario descontado correctamente
- NO se percibe lentitud

**Validaciones:**
1. Usar Network tab: verificar queries batch (no múltiples queries individuales)
2. Verificar: operaciones paralelas en inventario
3. Verificar: UI responde inmediatamente

---

### CP-023: Toast Notifications en Lugar de Alertas Nativas
**Precondición:** Sesión iniciada  
**Pasos:**
1. Realizar acciones que generen feedback:
   - Crear pedido
   - Actualizar inventario
   - Cambiar contraseña
   - Marcar como pagado

**Resultado esperado:**
- TODAS las notificaciones usan sistema de toast elegante
- NO se muestran alertas nativas del navegador (`alert()`)
- Toasts aparecen en esquina de pantalla
- Diseño coherente con la aplicación
- Se desvanecen automáticamente

**Validaciones:**
1. Verificar: NO `window.alert()` en ningún componente
2. Verificar: Toast con variantes (success, error)
3. Verificar: Accesibilidad del toast

---

### CP-024: Detección de Pedido Existente - Evitar Duplicados
**Precondición:** Mesa 3 tiene pedido activo  
**Pasos:**
1. Como admin, ir a "Tomar Pedido"
2. Seleccionar Mesa 3
3. Intentar agregar items

**Resultado esperado:**
- Sistema detecta pedido existente
- Items se agregan al pedido actual
- NO se crea pedido duplicado
- Toast indica: "Items agregados al pedido existente"

**Validaciones:**
1. Verificar en BD: solo 1 pedido para Mesa 3 con status 'pending'
2. Verificar: `order_items` consolidados en mismo order_id

---

## 4. Matriz de Trazabilidad

| Caso de Prueba | Funcionalidad | Prioridad | Estado |
|----------------|---------------|-----------|--------|
| CP-001 | Autenticación Mesero | Alta | ⏳ Pendiente |
| CP-002 | Autenticación Admin | Alta | ⏳ Pendiente |
| CP-003 | Crear Pedido | Crítica | ⏳ Pendiente |
| CP-004 | Ver Pedido Cross-Role | Crítica | ⏳ Pendiente |
| CP-005 | Editar Pedido | Alta | ⏳ Pendiente |
| CP-006 | Validación Stock | Crítica | ⏳ Pendiente |
| CP-007 | Marcar Pagado | Alta | ⏳ Pendiente |
| CP-008 | Reporte Con Pagado | Crítica | ⏳ Pendiente |
| CP-009 | Reporte Múltiple | Media | ⏳ Pendiente |
| CP-010 | Alerta Stock | Media | ⏳ Pendiente |
| CP-011 | Actualizar Inventario | Alta | ⏳ Pendiente |
| CP-012 | Persistencia | Media | ⏳ Pendiente |
| CP-013 | Cambio Usuario | Alta | ⏳ Pendiente |
| CP-014 | Concurrencia | Baja | ⏳ Pendiente |
| CP-015 | Gráfico Reportes | Media | ⏳ Pendiente |
| CP-016 | Crear Usuario | Alta | ⏳ Pendiente |
| CP-017 | Cambiar Contraseña | Alta | ⏳ Pendiente |
| CP-018 | Eliminar Usuario | Alta | ⏳ Pendiente |
| CP-019 | Agregar Mesa | Media | ⏳ Pendiente |
| CP-020 | Múltiples Mesas | Media | ⏳ Pendiente |
| CP-021 | Números Mesa | Alta | ⏳ Pendiente |
| CP-022 | Performance Pedido | Crítica | ⏳ Pendiente |
| CP-023 | Toast Notifications | Media | ⏳ Pendiente |
| CP-024 | Detectar Duplicados | Alta | ⏳ Pendiente |

---

## 5. Criterios de Aceptación

### ✅ Sistema Aprobado Si:
- [ ] 100% casos críticos PASAN
- [ ] ≥90% casos alta prioridad PASAN
- [ ] ≥80% casos media prioridad PASAN
- [ ] 0 bugs críticos sin resolver
- [ ] Descuento de inventario funciona en 100% de casos
- [ ] Reportes muestran datos correctos
- [ ] Persistencia de datos garantizada
- [ ] NO alertas nativas del navegador (100% toasts)
- [ ] Tiempo creación pedido < 1.5s
- [ ] Gestión de usuarios funcional
- [ ] Números de mesa correctos en toda la app

### ❌ Sistema Rechazado Si:
- Cualquier caso crítico FALLA
- Pérdida de datos en BD
- Inventario negativo permitido
- Reportes con cálculos incorrectos
- Pedidos no visibles entre roles

---

## 6. Ambiente de Pruebas

### Configuración
- **Base de Datos:** Supabase PostgreSQL
- **Frontend:** Next.js 15 en localhost:3000
- **Usuarios de Prueba:**
  - admin / admin123
  - mesero / mesero123

### Datos de Prueba Iniciales
- 10 mesas (todas disponibles)
- 15 items en menú (precios en CLP)
- Inventario completo con stock suficiente
- 2 usuarios de prueba (admin/mesero)
- Mesas con capacidades variadas (2, 4, 6, 8 personas)

---

## 7. Riesgos Identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Concurrencia BD | Media | Alto | Transacciones ACID |
| Stock negativo | Baja | Crítico | Validación pre-pedido |
| Sesiones expiradas | Alta | Medio | Refresh automático |
| Errores red Supabase | Baja | Alto | Retry logic + mensajes |
| Cálculos incorrectos | Baja | Crítico | Unit tests + validación |
| Performance lenta | Media | Alto | Batch queries + optimización |
| RLS bloqueando admin | Media | Alto | Service role client |
| Alertas nativas feas | Baja | Medio | Sistema de toasts |

---

## 8. Ejecución de Pruebas

### Fase 1: Pruebas Unitarias (Automatizadas)
- Validar funciones de cálculo
- Validar descuento de inventario
- Validar transformación de datos

### Fase 2: Pruebas de Integración (Automatizadas)
- Flujo completo: login → pedido → pago
- Interacción BD real

### Fase 3: Pruebas Manuales (Exploratorias)
- UX/UI
- Casos edge
- Pruebas de usabilidad

### Fase 4: Pruebas de Aceptación
- Cliente/Usuario final valida
- Casos de uso reales
- Sign-off

---

## 9. Reporte de Bugs

### Template
\`\`\`
ID: BUG-XXX
Título: [Descripción corta]
Severidad: Crítico/Alto/Medio/Bajo
Caso de Prueba: CP-XXX
Pasos para Reproducir:
1. ...
2. ...
Resultado Esperado: ...
Resultado Actual: ...
Screenshots: [Si aplica]
Logs: [Si aplica]
\`\`\`

---

## 10. Métricas de Calidad

### KPIs
- **Tasa de Éxito:** % casos pasados
- **Cobertura:** % código probado
- **Densidad de Defectos:** Bugs por funcionalidad
- **Tiempo de Resolución:** Días promedio por bug

### Objetivos
- Cobertura ≥ 80%
- Tasa éxito ≥ 95%
- Bugs críticos = 0
- Tiempo resolución < 2 días
