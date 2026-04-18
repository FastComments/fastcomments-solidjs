/* @refresh reload */
import { render } from 'solid-js/web';
import App from './App';
import { ThemeProvider } from './theme';
import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');

render(
  () => (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  ),
  root,
);
