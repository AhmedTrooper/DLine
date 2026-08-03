import { createSignal, onMount } from "solid-js";
import { invoke } from "@tauri-apps/api/core";
import { TitleBar } from "./components/TitleBar";
import { NavigationSidebar, TabType } from "./components/NavigationSidebar";
import { AgentIslandWidget } from "./components/AgentIslandWidget";
import { MainPanel } from "./components/MainPanel";
import "./App.css";

interface InstanceRecord {
  status: string;
  instanceId: string;
  pid: number;
}

function App() {
  const [activeTab, setActiveTab] = createSignal<TabType>("chat");
  const [appStatus, setAppStatus] = createSignal<string>("starting");
  const [isDark, setIsDark] = createSignal<boolean>(true);

  onMount(async () => {
    // Set initial theme
    if (isDark()) {
      document.documentElement.classList.add('dark');
    }

    try {
      const record = await invoke<InstanceRecord>("get_app_instance_record");
      if (record && record.status) {
        setAppStatus(record.status);
      }

      await invoke("mark_app_window_ready");
      setAppStatus("windowReady");

      await invoke("mark_app_ready");
      setAppStatus("ready");
    } catch (e) {
      console.error("App init error:", e);
      setAppStatus("failed");
    }
  });

  const toggleTheme = () => {
    setIsDark(!isDark());
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div class="app-root">
      <TitleBar status={appStatus()} toggleTheme={toggleTheme} isDark={isDark()} />

      <div class="app-container">
        <NavigationSidebar activeTab={activeTab()} setActiveTab={setActiveTab} />

        <main class="main-workspace">
          <header class="workspace-header">
            <div class="breadcrumb-path">
              <span>DLine</span>
              <span>/</span>
              <span class="breadcrumb-active">{activeTab().toUpperCase()}</span>
            </div>

            <AgentIslandWidget />
          </header>

          <MainPanel activeTab={activeTab()} />
        </main>
      </div>
    </div>
  );
}

export default App;
