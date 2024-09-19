import colors from '@/constants/colors';
import React, { createContext, PropsWithChildren, useCallback, useState } from 'react';
import { Snackbar } from 'react-native-paper';

interface SnackbarProps {
  id: string;
  message: string;
  duration: number;
  varient: TColorSchema;
}

interface SnackbarContextProps {
  showSnackbar: (options: SnackbarOptions) => void;
}

export const SnackbarContext = createContext<SnackbarContextProps | null>(null);

export function SnackbarProvider({ children }: PropsWithChildren) {
  const [snackbars, setSnackbars] = useState<SnackbarProps[]>([]);

  const showSnackbar = useCallback(
    ({ message, duration = Snackbar.DURATION_SHORT, varient = 'inherit' }: SnackbarOptions) => {
      const id = Date.now().toString();
      setSnackbars(prev => [...prev, { id, message, duration, varient }]);

      setTimeout(() => {
        setSnackbars(prev => prev.filter(snackbar => snackbar.id !== id));
      }, duration);
    },
    [],
  );

  function getBackgroundColor(color: TColorSchema) {
    if (color !== 'inherit') {
      return { backgroundColor: colors[color].main };
    }
    return {};
  }

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {snackbars.map(snackbar => (
        <Snackbar
          key={snackbar.id}
          wrapperStyle={{ top: 24 }}
          style={[getBackgroundColor(snackbar.varient)]}
          visible={true}
          onDismiss={() => setSnackbars(prev => prev.filter(s => s.id !== snackbar.id))}
          duration={snackbar.duration}>
          {snackbar.message}
        </Snackbar>
      ))}
    </SnackbarContext.Provider>
  );
}
