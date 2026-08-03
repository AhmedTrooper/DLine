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
        <div class="glass-card">
          <h2>🤖 DLine AI Agent Workspace</h2>
          <p>Next-generation high-performance desktop environment powered by Tauri v2 Rust runtime and SolidJS frontend.</p>
          
          <form style={{ "margin-top": "20px", display: "flex", gap: "10px" }} onSubmit={handleGreet}>
            <input
              class="input-field"
              type="text"
              placeholder="Test IPC greeting..."
              value={greetName()}
              onInput={(e) => setGreetName(e.currentTarget.value)}
            />
            <button class="btn-primary" type="submit">
              Send IPC Command
            </button>
          </form>

          {greetResponse() && (
            <p style={{ "margin-top": "14px", color: "#a5b4fc", "font-weight": "500" }}>
              {greetResponse()}
            </p>
          )}
        </div>
      )}

      {props.activeTab === 'files' && (
        <div class="glass-card">
          <h2>📁 Workspace File Browser</h2>
          <p>Browse workspace directory files, inspect diffs, preview media, and manage project code.</p>
        </div>
      )}

      {props.activeTab === 'terminal' && (
        <div class="glass-card">
          <h2>💻 Terminal Emulator</h2>
          <p>Integrated terminal session for executing shell commands and background tasks.</p>
        </div>
      )}

      {props.activeTab === 'island' && (
        <div class="glass-card">
          <h2>🏝️ Agent Island Mascot</h2>
          <p>Floating mascot dynamic overlay, customizable skins, and audio feedback notifications.</p>
        </div>
      )}

      {props.activeTab === 'settings' && (
        <div class="glass-card">
          <h2>⚙️ Preferences & Security</h2>
          <p>Manage API keys, model parameters, local database backups, and interface themes.</p>
        </div>
      )}
    </div>
  );
}
