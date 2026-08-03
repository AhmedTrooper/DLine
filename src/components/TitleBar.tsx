import { invoke } from "@tauri-apps/api/core";
import { Minus, Square, X, Moon, Sun, TerminalSquare } from "lucide-solid";

interface TitleBarProps {
  status: string;
  toggleTheme: () => void;
  isDark: boolean;
}

export function TitleBar(props: TitleBarProps) {
  const minimize = async () => invoke("minimize_app_window");
  const toggleMaximize = async () => invoke("toggle_maximize_app_window");
  const close = async () => invoke("close_app_window");

  return (
    <header class="titlebar">
      <div class="titlebar-left">
        <div class="titlebar-brand">
          <TerminalSquare size={16} />
          <span>DLine</span>
        </div>
        <div class="status-badge">
          <span class={`status-dot ${props.status}`} />
          <span>{props.status}</span>
        </div>
      </div>

      <div class="titlebar-center">
        <span>TAURI V2</span>
      </div>

      <div class="titlebar-controls">
        <button class="theme-toggle" onClick={props.toggleTheme} title="Toggle Theme">
          {props.isDark ? <Sun size={14} /> : <Moon size={14} />}
        </button>
        <button class="win-btn" onClick={minimize} title="Minimize">
          <Minus size={14} />
        </button>
        <button class="win-btn" onClick={toggleMaximize} title="Maximize">
          <Square size={12} />
        </button>
        <button class="win-btn close" onClick={close} title="Close">
          <X size={14} />
        </button>
      </div>
    </header>
  );
}
