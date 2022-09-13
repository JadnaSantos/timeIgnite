import { ThemeProvider } from 'styled-components'
import { Router } from './Router.'
import {BrowserRouter} from 'react-router-dom'
import { defaultTheme } from './styles/themes/defauld'
import { GlobalStyle } from './styles/themes/global'
import { CyclesContextProvider } from './contexts/CycleContext'

export function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <BrowserRouter>
        <CyclesContextProvider>
          <Router/>
        </CyclesContextProvider>
      </BrowserRouter>
      <GlobalStyle />
    </ThemeProvider>
  )
}
