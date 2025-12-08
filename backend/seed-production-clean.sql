-- Seed limpio para producción
-- Solo usuarios de prueba y administradores

-- Usuario Admin
INSERT INTO users (email, password_hash, full_name, phone, role) VALUES
('admin@katze.com', '$2b$10$YourHashedPasswordHere', 'Administrador Katze', '1234567890', 'admin');

-- Usuario Rescatista de prueba
INSERT INTO users (email, password_hash, full_name, phone, role) VALUES
('rescatista@test.com', '$2b$10$YourHashedPasswordHere', 'Rescatista Test', '0987654321', 'rescatista');

-- Usuario Adoptante de prueba
INSERT INTO users (email, password_hash, full_name, phone, role) VALUES
('adoptante@test.com', '$2b$10$YourHashedPasswordHere', 'Adoptante Test', '5555555555', 'adoptante');

-- La base de datos está lista para recibir gatos reales de rescatistas
