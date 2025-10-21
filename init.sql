-- Crear usuario (si no existe)
CREATE USER IF NOT EXISTS 'appuser'@'%' IDENTIFIED BY 'app123';

-- Dar todos los permisos sobre la base de datos appdb
GRANT ALL PRIVILEGES ON appdb.* TO 'appuser'@'%';

-- Aplicar cambios
FLUSH PRIVILEGES;
