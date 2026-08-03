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
          <div class="brand-icon">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <span class="brand-text">DLine</span>
        </div>
        <div class="status-badge">
          <span class={`status-dot ${props.status}`} />
          <span>{props.status}</span>
        </div>
      </div>

      <div class="titlebar-center">
        <span>FOCUS ENGINE • TAURI V2</span>
      </div>

      <div class="titlebar-controls">
        <button class="win-btn" onClick={minimize} title="Minimize">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button class="win-btn" onClick={toggleMaximize} title="Maximize">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          </svg>
        </button>
        <button class="win-btn close" onClick={close} title="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </header>
  );
}
