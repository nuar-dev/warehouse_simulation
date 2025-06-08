// src/App.tsx
import AppTheme from '@/components/shared-theme/AppTheme';
import { NotificationProvider } from '@/contexts/NotificationContext';
import LayoutProvider from '@/contexts/LayoutProvider';
import SnackbarProvider from '@/contexts/SnackbarProvider';
import AppRouter from '@/router/AppRouter';

export default function App() {
  return (
    <AppTheme>
      <NotificationProvider>
        <SnackbarProvider
          maxSnack={3}
          autoHideDuration={4000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <LayoutProvider>
            <AppRouter />
          </LayoutProvider>
        </SnackbarProvider>
      </NotificationProvider>
    </AppTheme>
  );
}
