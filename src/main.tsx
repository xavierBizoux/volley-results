import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import App from './App'
import theme from './theme'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    </React.StrictMode>
)
