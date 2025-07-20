import React, { createContext, useState, useMemo, useContext } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const ThemeModeContext = createContext({
  mode: "light",
  toggleMode: () => {},
});

export function useThemeMode() {
  return useContext(ThemeModeContext);
}

// Enhanced palette configurations for both light and dark modes
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light mode palette
          primary: {
            main: "#6366F1",
            light: "#818CF8",
            dark: "#4F46E5",
            contrastText: "#FFFFFF"
          },
          secondary: {
            main: "#F59E0B",
            light: "#FBBF24",
            dark: "#D97706",
            contrastText: "#FFFFFF"
          },
          background: {
            default: "#FAFAFA",
            paper: "#FFFFFF"
          },
          text: {
            primary: "#1F2937",
            secondary: "#6B7280"
          },
          divider: "#E5E7EB",
          success: {
            main: "#10B981",
            light: "#34D399",
            dark: "#059669"
          },
          info: {
            main: "#3B82F6",
            light: "#60A5FA",
            dark: "#2563EB"
          },
          warning: {
            main: "#F59E0B",
            light: "#FBBF24",
            dark: "#D97706"
          },
          error: {
            main: "#EF4444",
            light: "#F87171",
            dark: "#DC2626"
          }
        }
      : {
          // Dark mode palette
          primary: {
            main: "#818CF8",
            light: "#A5B4FC",
            dark: "#6366F1",
            contrastText: "#000000"
          },
          secondary: {
            main: "#FBBF24",
            light: "#FCD34D",
            dark: "#F59E0B",
            contrastText: "#000000"
          },
          background: {
            default: "#0F172A",
            paper: "#1E293B"
          },
          text: {
            primary: "#F1F5F9",
            secondary: "#94A3B8"
          },
          divider: "#334155",
          success: {
            main: "#34D399",
            light: "#6EE7B7",
            dark: "#10B981"
          },
          info: {
            main: "#60A5FA",
            light: "#93C5FD",
            dark: "#3B82F6"
          },
          warning: {
            main: "#FBBF24",
            light: "#FCD34D",
            dark: "#F59E0B"
          },
          error: {
            main: "#F87171",
            light: "#FCA5A5",
            dark: "#EF4444"
          }
        })
  },
  typography: {
    fontFamily: `"Inter", "Roboto", "Helvetica", "Arial", sans-serif`,
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.025em"
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: "-0.025em"
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: "-0.025em"
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.4
    },
    h5: {
      fontSize: "1.125rem",
      fontWeight: 600,
      lineHeight: 1.4
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.4
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.6
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: 1.5
    },
    caption: {
      fontSize: "0.75rem",
      fontWeight: 400,
      lineHeight: 1.4
    },
    button: {
      fontSize: "0.875rem",
      fontWeight: 500,
      textTransform: "none",
      letterSpacing: "0.025em"
    }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
          padding: "8px 16px",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: mode === 'light' 
              ? "0 4px 12px rgba(0, 0, 0, 0.15)"
              : "0 4px 12px rgba(0, 0, 0, 0.4)"
          }
        },
        contained: {
          boxShadow: mode === 'light'
            ? "0 1px 3px rgba(0, 0, 0, 0.1)"
            : "0 1px 3px rgba(0, 0, 0, 0.3)",
          "&:hover": {
            boxShadow: mode === 'light'
              ? "0 4px 12px rgba(0, 0, 0, 0.15)"
              : "0 4px 12px rgba(0, 0, 0, 0.4)"
          }
        },
        outlined: {
          borderWidth: "1.5px",
          "&:hover": {
            borderWidth: "1.5px"
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: mode === 'light'
            ? "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)"
            : "0 4px 6px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: mode === 'light'
              ? "0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)"
              : "0 8px 16px rgba(0, 0, 0, 0.4), 0 4px 8px rgba(0, 0, 0, 0.3)",
            transform: "translateY(-2px)"
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: mode === 'light'
            ? "0 1px 3px rgba(0, 0, 0, 0.1)"
            : "0 1px 3px rgba(0, 0, 0, 0.3)",
          borderBottom: mode === 'light' ? "1px solid #E5E7EB" : "1px solid #334155"
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: mode === 'light' ? "1px solid #E5E7EB" : "1px solid #334155",
          boxShadow: mode === 'light'
            ? "2px 0 8px rgba(0, 0, 0, 0.1)"
            : "2px 0 8px rgba(0, 0, 0, 0.3)"
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            transition: "all 0.2s ease-in-out",
            "&.Mui-focused": {
              "& .MuiOutlinedInput-notchedOutline": {
                borderWidth: "2px"
              }
            }
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 500,
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.05)"
          }
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.1)"
          }
        }
      }
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          borderRadius: 8
        }
      }
    }
  }
});

export function CustomThemeProvider({ children }) {
  const [mode, setMode] = useState("light");
  
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  
  const toggleMode = () =>
    setMode((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
