# Guía de Pruebas Automatizadas - El Yugoslavo

## Descripción

Este documento describe cómo ejecutar y entender las pruebas automatizadas del sistema de gestión de restaurante.

## Instalación de Dependencias

Las dependencias de testing ya están incluidas en `package.json`:
- `@jest/globals`: Framework de testing
- `jest`: Test runner

## Ejecutar las Pruebas

### Ejecutar todas las pruebas
\`\`\`bash
npm test
\`\`\`

### Ejecutar pruebas en modo watch (se re-ejecutan al hacer cambios)
\`\`\`bash
npm run test:watch
\`\`\`

### Ejecutar pruebas con cobertura
\`\`\`bash
npm test -- --coverage
\`\`\`

## Estructura de las Pruebas

### 1. Authentication Tests (`__tests__/auth.test.ts`)
Valida el sistema de autenticación:
- ✓ Login con credenciales válidas (admin y mesero)
- ✓ Rechazo de credenciales inválidas
- ✓ Validación de campos vacíos
- ✓ Asignación correcta de roles

### 2. Table Management Tests (`__tests__/tables.test.ts`)
Valida la gestión de mesas:
- ✓ Obtención de todas las mesas (12 mesas)
- ✓ Capacidades correctas por mesa
- ✓ Cambio de estado a "ocupado" al crear pedido
- ✓ Liberación de mesas
- ✓ Validación de IDs de pedido al liberar

### 3. Order Management Tests (`__tests__/orders.test.ts`)
Valida el sistema de pedidos:
- ✓ Creación de pedidos
- ✓ Cálculo correcto de totales
- ✓ Agregar items a pedidos existentes
- ✓ Actualización de totales al agregar items
- ✓ Validación de mesas inválidas
- ✓ Prevención de pedidos en mesas ocupadas

### 4. Inventory Management Tests (`__tests__/inventory.test.ts`)
Valida el sistema de inventario:
- ✓ Obtención de items de inventario
- ✓ Actualización de cantidades
- ✓ Descuento automático al crear pedidos
- ✓ Validación de stock insuficiente
- ✓ Identificación de items con stock bajo

### 5. Sales Reports Tests (`__tests__/reports.test.ts`)
Valida el sistema de reportes:
- ✓ Generación de reportes (diario, semanal, mensual, anual)
- ✓ Inclusión solo de pedidos pagados
- ✓ Cálculo correcto de totales
- ✓ Conteo correcto de pedidos

## Cobertura de Pruebas

Las pruebas cubren:
- **Autenticación**: 100% de funciones críticas
- **Gestión de Mesas**: 100% de operaciones CRUD
- **Gestión de Pedidos**: 100% de flujos principales
- **Inventario**: 100% de operaciones y validaciones
- **Reportes**: 100% de tipos de reportes

## Casos de Prueba Importantes

### Flujo Completo de Mesero
1. Login como mesero
2. Seleccionar mesa disponible
3. Crear pedido con múltiples items
4. Verificar que mesa queda ocupada
5. Verificar descuento de inventario

### Flujo Completo de Administrador
1. Login como admin
2. Crear pedido
3. Liberar mesa (marcar como pagado)
4. Verificar reporte de ventas
5. Verificar inventario actualizado

### Compartir Datos entre Roles
1. Mesero crea pedido
2. Admin puede ver el pedido
3. Admin libera la mesa
4. Mesero puede ver mesa disponible

## Solución de Problemas

### Error: "Cannot find module"
\`\`\`bash
npm install
\`\`\`

### Tests fallan por timeout
Aumenta el timeout en jest.config.js:
\`\`\`javascript
testTimeout: 10000
\`\`\`

### Base de datos no se resetea
Verifica que `db.reset()` se llame en `beforeEach()`

## Mejores Prácticas

1. **Siempre resetear la base de datos** antes de cada test
2. **Usar nombres descriptivos** para los tests
3. **Probar casos exitosos y de error**
4. **Verificar efectos secundarios** (ej: inventario descontado)
5. **Mantener tests independientes** entre sí

## Próximos Pasos

Para agregar más tests:
1. Crear archivo en `__tests__/nombre.test.ts`
2. Importar funciones a probar
3. Escribir casos de prueba con `describe` e `it`
4. Ejecutar `npm test` para validar

## Contacto

Para preguntas sobre las pruebas, consulta la documentación en README.md
