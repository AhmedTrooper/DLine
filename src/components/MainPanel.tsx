import { createSignal } from "solid-js";
import { invoke } from "@tauri-apps/api/core";
import { TabType } from "./NavigationSidebar";
import { Presence, Motion } from "@motionone/solid";
import { Send } from "lucide-solid";

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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            class="ui-card"
          >
            <h2 class="ui-title">Chat IPC Link</h2>
            <p class="ui-subtitle">Initialize a connection to the Rust backend.</p>
            
            <form class="form-group" onSubmit={handleGreet}>
              <input
                class="input-minimal"
                type="text"
                placeholder="Enter payload..."
                value={greetName()}
                onInput={(e) => setGreetName(e.currentTarget.value)}
              />
              <button class="btn-minimal" type="submit" title="Send">
                <Send size={16} />
              </button>
            </form>

            {greetResponse() && (
              <Motion 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: "auto" }} 
                class="result-message"
              >
                {greetResponse()}
              </Motion>
            )}
          </Motion>
        )}

        {props.activeTab === 'files' && (
          <Motion
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            class="ui-card"
          >
            <h2 class="ui-title">Files</h2>
            <p class="ui-subtitle">Workspace browser.</p>
          </Motion>
        )}

        {props.activeTab === 'terminal' && (
          <Motion
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            class="ui-card"
          >
            <h2 class="ui-title">Terminal</h2>
            <p class="ui-subtitle">Integrated shell session.</p>
          </Motion>
        )}

        {props.activeTab === 'island' && (
          <Motion
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            class="ui-card"
          >
            <h2 class="ui-title">Agent Island</h2>
            <p class="ui-subtitle">Configuration and state.</p>
          </Motion>
        )}

        {props.activeTab === 'settings' && (
          <Motion
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            class="ui-card"
          >
            <h2 class="ui-title">Settings</h2>
            <p class="ui-subtitle">Manage preferences.</p>
          </Motion>
        )}
      </Presence>
    </div>
  );
}
