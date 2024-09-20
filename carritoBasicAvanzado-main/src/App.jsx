// Importación de React y hooks necesarios
import React, { useState, useEffect } from 'react'; // Importar useState y useEffect para manejar el estado y efectos secundarios
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'; // Importar useNavigate y useLocation para navegación y ubicación actual
import Header from './components/Header'; // Importar el componente Header
import ProductList from './components/ProductList'; // Importar el componente ProductList
import CartMenu from './components/CartMenu'; // Importar el componente CartMenu
import CartPage from './components/CartPage'; // Importar el componente CartPage
import SalesReport from './components/SalesReport'; // Importar el componente SalesReport
import InvoiceForm from './components/InvoiceForm'; // Importar el componente InvoiceForm
import InvoicePDF from './components/InvoicePDF'; // Importar el componente InvoicePDF
import axios from 'axios'; // Importar axios para hacer solicitudes HTTP
import Register from './components/Register'; // Importar el componente Register
import Login from './components/Login'; // Importar el componente Login
import ManageProducts from './components/ManageProducts'; // Importar el componente ManageProducts
import Pedidos from './components/Pedidos'; //importamos el modulo pedidos aca
import ManageOrders from './components/ManageOrders'; // Importar componente de gestión de pedidos
import UpdateUser from './components/UpdateUser'; // Importar el componente de actualización de usuario

// Datos iniciales para productos (vacío al principio)
const initialProducts = [];

// Datos iniciales de ventas (para el gráfico o reporte de ventas)
const initialSalesData = [
  { time: '2023-01-01', value: 100 },
  { time: '2023-02-01', value: 200 },
  { time: '2023-03-01', value: 150 },
  { time: '2023-04-01', value: 400 },
  { time: '2023-05-01', value: 300 },
  { time: '2023-06-01', value: 250 },
  { time: '2023-07-01', value: 350 },
  { time: '2024-01-01', value: 450 },
  { time: '2024-02-01', value: 500 },
  { time: '2024-03-01', value: 550 },
  { time: '2024-04-01', value: 600 },
  { time: '2024-05-01', value: 650 },
  { time: '2024-06-01', value: 700 },
];

// Función de mapeo para transformar los datos del producto obtenidos de la API
const mapProductData = (product) => {
  return {
    id: product._id, // Mapea el ID del producto
    name: product.nombre, // Mapea el nombre del producto
    price: product.precio, // Mapea el precio del producto
    imagen: product.imagen, // Mapea la imagen del producto
    // Agrega más mapeos según sea necesario
  };
};

const App = () => {
  // Estado para manejar los productos, datos de ventas, items del carrito, visibilidad del carrito y datos de pago
  const [products, setProducts] = useState(initialProducts);
  const [salesData] = useState(initialSalesData);
  const [cartItems, setCartItems] = useState([]);
  const [showCartMenu, setShowCartMenu] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({});
  
  const navigate = useNavigate(); // Hook para la navegación programática
  const location = useLocation(); // Hook para obtener la ubicación actual

  useEffect(() => {
    // Función asíncrona para obtener productos de la API
    const fetchProducts = async () => {
      try {
        // Solicita los productos al backend
        const response = await axios.get('http://localhost:5000/api/productos');
        console.log('Productos desde la API:', response.data);
        // Mapea los productos antes de establecerlos en el estado
        const mappedProducts = response.data.map(mapProductData);
        setProducts(mappedProducts);
      } catch (error) {
        console.error('Error al obtener los productos', error);
      }
    };

    // Obtiene los productos solo cuando la ruta es la principal ('/')
    if (location.pathname === '/') {
      fetchProducts();
    }
  }, [location.pathname]); // Dependencia para que useEffect se ejecute al cambiar la ruta

  // Función para agregar un producto al carrito
  const handleAddToCart = (product, quantity) => {
    const existingItem = cartItems.find(item => item.product.id === product.id);
    if (existingItem) {
      // Actualiza la cantidad del producto en el carrito si ya existe
      setCartItems(cartItems.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      // Agrega un nuevo producto al carrito
      setCartItems([...cartItems, { product, quantity }]);
    }
    setShowCartMenu(true); // Muestra el menú del carrito
  };

  // Función para eliminar un producto del carrito
  const handleRemoveFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.product.id !== productId));
  };

  // Función para reducir la cantidad de un producto en el carrito
  const handleReduceQuantity = (productId) => {
    const existingItem = cartItems.find(item => item.product.id === productId);
    if (existingItem.quantity > 1) {
      // Reduce la cantidad del producto si es mayor que 1
      setCartItems(cartItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ));
    } else {
      handleRemoveFromCart(productId); // Elimina el producto si la cantidad es 1
    }
  };

  // Función para cerrar el menú del carrito
  const handleCloseCartMenu = () => {
    setShowCartMenu(false);
  };

  // Función para manejar la información de pago
  const handlePaymentInfo = (info) => {
    setPaymentInfo(info);
  };

  // Componente de ruta privada para proteger rutas basadas en el rol del usuario
  const PrivateRoute = ({ children }) => {
    const role = localStorage.getItem('role');
    return role === 'admin' ? children : <div>No tienes acceso a esta página</div>;
  };

  return (
    <div className="app">
      {/* Componente de encabezado que recibe el conteo de items en el carrito */}
      <Header cartCount={cartItems.length} />
  
      {/* Rutas y componentes para diferentes páginas */}
      <Routes>
        <Route
          path="/"
          element={<ProductList products={products} onAddToCart={handleAddToCart} />}
        />
        <Route
          path="/cart"
          element={<CartPage
            cartItems={cartItems}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onReduceQuantity={handleReduceQuantity}
          />}
        />
        <Route path="/sales-report" element={<SalesReport data={salesData} />} />
        <Route path="/invoice" element={<InvoiceForm cartItems={cartItems} />} />
        <Route path="/invoice-pdf" element={<InvoicePDF />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/manage-products" element={<PrivateRoute><ManageProducts /></PrivateRoute>} />
        <Route path="/pedidos" element={<Pedidos />} /> {/* Nueva ruta para el componente Pedidos */}
        <Route path="/manage-orders" element={<PrivateRoute><ManageOrders /></PrivateRoute>} /> {/* Ruta para gestionar pedidos */}
        <Route path="/update-user" element={<UpdateUser />} /> {/* Nueva ruta para actualizar el usuario */}
        
      </Routes>

      {/* Menú del carrito que se muestra según el estado de visibilidad */}
      {showCartMenu && (
        <CartMenu
          cartItems={cartItems}
          onClose={handleCloseCartMenu}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
          onReduceQuantity={handleReduceQuantity}
        />
      )}
    </div>
  );
};

export default App;
