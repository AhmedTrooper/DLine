import { createSignal } from "solid-js";
import { invoke } from "@tauri-apps/api/core";
import { TabType } from "./NavigationSidebar";

interface MainPanelProps {
  activeTab: TabType;
}

export function MainPanel(props: MainPanelProps) {
  const [greetName, setGreetName] = createSignal("");
  const [greetResponse, setGreetResponse] = createSignal("");

  const handleGreet = async (e: Event) => {
    e.preventDefault();
    try {
      const res = await invoke<string>("greet", { name: greetName() });
      setGreetResponse(res);
    } catch (err) {
      setGreetResponse(String(err));
    }
  };

  return (
    <div class="panel-view">
      {props.activeTab === 'chat' && (
        <div class="hero-card">
          <h2 class="hero-title">Welcome to DLine</h2>
          <p class="hero-subtitle">
            A next-generation desktop agentic workspace powered by Tauri v2 and SolidJS.
            Experience unprecedented performance wrapped in a stunning glassmorphic UI.
          </p>
          
          <form class="form-group" onSubmit={handleGreet}>
            <input
              class="input-premium"
              type="text"
              placeholder="Test IPC greeting..."
              value={greetName()}
              onInput={(e) => setGreetName(e.currentTarget.value)}
            />
            <button class="btn-premium" type="submit">
              Initialize IPC Link
            </button>
          </form>

          {greetResponse() && (
            <div class="result-message">
              {greetResponse()}
            </div>
          )}
        </div>
      )}

      {props.activeTab === 'files' && (
        <div class="hero-card">
          <h2 class="hero-title">File Browser</h2>
          <p class="hero-subtitle">
            Navigate through your workspace with unparalleled speed.
          </p>
        </div>
      )}

      {props.activeTab === 'terminal' && (
        <div class="hero-card">
          <h2 class="hero-title">Terminal Emulator</h2>
          <p class="hero-subtitle">
            Integrated high-performance shell session.
          </p>
        </div>
      )}

      {props.activeTab === 'island' && (
        <div class="hero-card">
          <h2 class="hero-title">Agent Island</h2>
          <p class="hero-subtitle">
            Configure your AI companion's appearance, behavior, and voice modules.
          </p>
        </div>
      )}

      {props.activeTab === 'settings' && (
        <div class="hero-card">
          <h2 class="hero-title">Preferences</h2>
          <p class="hero-subtitle">
            Tune your experience. Adjust themes, manage keys, and tweak system performance.
          </p>
        </div>
      )}
    </div>
  );
}
