import { HashRouter, Route } from "@solidjs/router";
import { AppShell } from "./components/layout/AppShell";
import { TimerProvider } from "./context/TimerContext";
import { AudioProvider } from "./context/AudioContext";
import { PreferencesProvider } from "./context/PreferencesContext";
import { TimerPage } from "./pages/TimerPage";
import { SoundscapePage } from "./pages/SoundscapePage";
import { PreferencesPage } from "./pages/PreferencesPage";

export default function App() {
  return (
    <PreferencesProvider>
      <AudioProvider>
        <TimerProvider>
          <HashRouter root={AppShell}>
            <Route path="/" component={TimerPage} />
            <Route path="/timer" component={TimerPage} />
            <Route path="/soundscape" component={SoundscapePage} />
            <Route path="/preferences" component={PreferencesPage} />
          </HashRouter>
        </TimerProvider>
      </AudioProvider>
    </PreferencesProvider>
  );
}
