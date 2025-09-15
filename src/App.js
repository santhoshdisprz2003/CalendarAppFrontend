// src/App.js
import React from 'react';
import Calendar from './components/Calendar';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Toolbar, Typography, Container } from '@mui/material';


const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <Calendar />
            </Container>
        </ThemeProvider>
    );
}

export default App;
