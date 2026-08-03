import { createSignal } from "solid-js";
import { invoke } from "@tauri-apps/api/core";
import { TabType } from "./NavigationSidebar";
import { Presence, Motion } from "@motionone/solid";
import { Send, Settings, Bot, Terminal, Folder } from "lucide-solid";

interface MainPanelProps {
  activeTab: TabType;
}

export function MainPanel(props: MainPanelProps) {
  const [greetName, setGreetName] = createSignal("");
  const [greetResponse, setGreetResponse] = createSignal("");

  const handleGreet = async (e: Event) => {
    e.preventDefault();
    if (!greetName().trim()) return;
    try {
      const res = await invoke<string>("greet", { name: greetName() });
      setGreetResponse(res);
    } catch (err) {
      setGreetResponse(String(err));
    }
  };

  return (
    <div class="panel-view">
      <Presence exitBeforeEnter>
        {props.activeTab === 'chat' && (
          <Motion
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ easing: "spring", stiffness: 300, damping: 25 }}
            class="ui-card"
          >
            <h2 class="ui-title">System Communication</h2>
            <p class="ui-subtitle">Initialize a low-level IPC socket payload to the Rust backend.</p>
            
            <form class="form-group" onSubmit={handleGreet}>
              <input
                class="input-minimal"
                type="text"
                placeholder="Enter payload data..."
                value={greetName()}
                onInput={(e) => setGreetName(e.currentTarget.value)}
              />
              <Motion.button 
                class="btn-minimal" 
                type="submit" 
                title="Transmit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send size={16} />
              </Motion.button>
            </form>

            {greetResponse() && (
              <Motion 
                initial={{ opacity: 0, y: -10, height: 0 }} 
                animate={{ opacity: 1, y: 0, height: "auto" }}
                transition={{ easing: "spring", stiffness: 400, damping: 25 }}
                class="result-message"
              >
                {greetResponse()}
              </Motion>
            )}
          </Motion>
        )}

        {props.activeTab === 'files' && (
          <Motion
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ easing: "spring", stiffness: 300, damping: 25 }}
            class="ui-card"
          >
            <Folder size={32} class="mb-4" />
            <h2 class="ui-title">Workspace Index</h2>
            <p class="ui-subtitle">Local file system mapping.</p>
          </Motion>
        )}

        {props.activeTab === 'terminal' && (
          <Motion
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ easing: "spring", stiffness: 300, damping: 25 }}
            class="ui-card"
          >
            <Terminal size={32} class="mb-4" />
            <h2 class="ui-title">Terminal Process</h2>
            <p class="ui-subtitle">TTY interface active.</p>
          </Motion>
        )}

        {props.activeTab === 'island' && (
          <Motion
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ easing: "spring", stiffness: 300, damping: 25 }}
            class="ui-card"
          >
            <Bot size={32} class="mb-4" />
            <h2 class="ui-title">Agent State</h2>
            <p class="ui-subtitle">Configuration parameters for autonomous procedures.</p>
          </Motion>
        )}

        {props.activeTab === 'settings' && (
          <Motion
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ easing: "spring", stiffness: 300, damping: 25 }}
            class="ui-card"
          >
            <Settings size={32} class="mb-4" />
            <h2 class="ui-title">Engine Preferences</h2>
            <p class="ui-subtitle">System tunings and display metrics.</p>
          </Motion>
        )}
      </Presence>
    </div>
  );
}
