import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import AdminDashboard from './views/AdminDashboard';
import UserDashboard from './views/UserDashBoard';
import AccessDenied from './views/AccessDenied'; // Página de acceso denegado (opcional)
import { AppContainer, LoginBox, InputGroup, Message, LoginButton } from './styles/login';
import CustomThemeProvider from './styles/CustomThemeProvider';

const App = () => {
  const [userName, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [role, setRole] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('token') ? true : false);


  // Verificar la autenticación al cargar el componente
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    if (storedToken && storedRole) {
      setRole(storedRole); // Si está autenticado, se guarda el rol
      setIsAuthenticated(true);  // Establecer autenticación a true
    }
  }, []);

  // Efecto para escuchar los cambios en localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setIsAuthenticated(false);  // Si no hay token, no está autenticado
        setRole('');  // Limpiar el rol
      } else {
        setIsAuthenticated(true);  // Si hay token, autenticado
      }
    };

    // Escuchar cambios en localStorage
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Función para manejar el submit del formulario de login
  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage('');
    setError('');
    setRole('');

    if (!userName || !password) {
      setError('Por favor, complete todos los campos');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('token', data.token);
          const roles = data.authorities.map(auth => auth.authority);

          if (roles.includes('ROLE_ADMIN')) {
            setRole('admin');
          } else if (roles.includes('ROLE_USER')) {
            setRole('user');
          } else {
            setMessage('Usuario con rol no reconocido');
          }
          setIsAuthenticated(true);  // Establecer autenticación a true
        } else {
          setError('Token no válido recibido del servidor');
        }
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (error) {
      setError('Hubo un error al conectar con el servidor');
    }
  };

  // Función para validar acceso según el rol
  const PrivateRoute = ({ roleRequired, children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/" />;
    }

    if (role !== roleRequired) {
      return <Navigate to="/access-denied" />;
    }

    return children;
  };

  return (
    <CustomThemeProvider>
      <Router>
        <Routes>
          {/* Ruta para el login */}
          <Route path="/" element={isAuthenticated ? <Navigate to={role === 'admin' ? '/admin' : '/user'} /> : (
            <AppContainer>
              <LoginBox>
                <h2>Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                  <InputGroup>
                    <label htmlFor="username">Usuario</label>
                    <input
                      type="text"
                      id="username"
                      value={userName}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Ingrese su usuario o correo"
                    />
                  </InputGroup>
                  <InputGroup>
                    <label htmlFor="password">Contraseña</label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ingrese su contraseña"
                    />
                  </InputGroup>
                  {error && <Message type="error">{error}</Message>}
                  {message && <Message type="success">{message}</Message>}
                  <LoginButton type="submit">Iniciar Sesión</LoginButton>
                </form>
              </LoginBox>
            </AppContainer>
          )} />

          {/* Rutas protegidas por rol */}
          <Route
            path="/admin"
            element={
              <PrivateRoute roleRequired="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/user"
            element={
              <PrivateRoute roleRequired="user">
                <UserDashboard />
              </PrivateRoute>
            }
          />

          {/* Ruta para acceso denegado */}
          <Route path="/access-denied" element={<AccessDenied />} />

          {/* Si la ruta no es encontrada, redirigir al login */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </CustomThemeProvider>

  );
};

export default App;
