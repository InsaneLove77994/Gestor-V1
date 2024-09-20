// Importación de React y hooks necesarios
import React, { useState, useEffect } from 'react'; // Importar useState y useEffect para manejar el estado y efectos secundarios
import { Link, useNavigate } from 'react-router-dom'; // Importar Link para la navegación entre páginas y useNavigate para la navegación programática

const Header = ({ cartCount }) => {
  // Estado para manejar la información del usuario
  const [user, setUser] = useState({
    username: localStorage.getItem('username'), // Obtener el nombre de usuario del almacenamiento local
    role: localStorage.getItem('role') // Obtener el rol del usuario del almacenamiento local
  });
  const navigate = useNavigate(); // Hook para la navegación programática

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    // Elimina los datos de sesión del almacenamiento local
    ['username', 'token', 'role', 'userId'].forEach(item => localStorage.removeItem(item));
    // Actualiza el estado del usuario para reflejar que no hay usuario autenticado
    setUser({ username: null, role: null });
    // Redirige al usuario a la página principal
    navigate('/');
  };

  useEffect(() => {
    // Función para manejar los cambios en el almacenamiento local
    const handleStorageChange = () => {
      // Actualiza el estado del usuario cuando hay un cambio en el almacenamiento local
      setUser({
        username: localStorage.getItem('username'),
        role: localStorage.getItem('role')
      });
    };

    // Añade un listener para detectar cambios en el almacenamiento local
    window.addEventListener('storage', handleStorageChange);
    // Limpia el listener cuando el componente se desmonta
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Dependencia vacía para que el efecto se ejecute solo una vez al montar el componente

  return (
    <header className="header">
      <div className="header-content">
        {/* Imagen del logo */}
        <img src="/logo.png" alt="Logo" className="header-logo" />
        <h1>SGCI EL 104</h1>
      </div>
      <nav>
        {/* Navegación con enlaces */}
        <Link to="/">Inicio</Link>
        <Link to="/cart">Carrito ({cartCount})</Link>
        <Link to="/sales-report">Reporte de Ventas</Link>
        {/* Enlace a la gestión de productos solo visible para usuarios con rol de administrador */}
        {user.role === 'admin' && <Link to="/manage-products">Gestionar</Link>}
        {user.role === 'admin' && <Link to="/manage-orders">G. Pedidos</Link>} {/* Link a la gestión de pedidos */}
        {user.username ? (
          <>
           <Link to="/pedidos">Mis Pedidos</Link> {/* Enlace a los pedidos */}
            {/* Mensaje de bienvenida y enlace para cerrar sesión */}
            <span>Bienvenido, {user.username} ({user.role})</span>
            <Link to="/" onClick={handleLogout}>Cerrar S.</Link>
          </>
        ) : (
          <>
            {/* Enlaces de registro e inicio de sesión para usuarios no autenticados */}
            <Link to="/register">Registro</Link>
            <Link to="/login">Ingresar</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
