// @ts-ignore
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
// @ts-ignore
const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    <App />
  );
} else {
  console.error("Elemento root não encontrado no HTML");
}