import { invoke } from "@tauri-apps/api/core";

interface TitleBarProps {
  status: string;
}

export function TitleBar(props: TitleBarProps) {
  const minimize = async () => {
    try {
      await invoke("minimize_app_window");
    } catch (e) {
      console.error(e);
    }
  };

  const toggleMaximize = async () => {
    try {
      await invoke("toggle_maximize_app_window");
    } catch (e) {
      console.error(e);
    }
  };

  const close = async () => {
    try {
      await invoke("close_app_window");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header class="titlebar">
      <div class="titlebar-left">
        <div class="titlebar-brand">
          <span class="brand-dot" />
          <span>DLine</span>
        </div>
        <div class="status-badge">
          <span class={`status-dot ${props.status}`} />
          <span>{props.status}</span>
        </div>
      </div>

      <div class="titlebar-center">
        <span>Focus Engine • Tauri v2</span>
      </div>

      <div class="titlebar-controls">
        <button class="win-btn" onClick={minimize} title="Minimize">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </button>
        <button class="win-btn" onClick={toggleMaximize} title="Maximize">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="2.5" y="2.5" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5" />
          </svg>
        </button>
        <button class="win-btn close" onClick={close} title="Close">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    </header>
  );
}
