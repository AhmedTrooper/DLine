import { invoke } from "@tauri-apps/api/core";
import { Minus, Square, X, Moon, Sun, TerminalSquare } from "lucide-solid";
import { Motion } from "@motionone/solid";
import { createSignal } from "solid-js";

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
        <Motion.div 
          class="titlebar-brand"
          whileHover={{ scale: 1.05 }}
          transition={{ easing: "spring", stiffness: 400, damping: 25 }}
        >
          <TerminalSquare size={16} />
          <span>DLine</span>
        </Motion.div>
        
        <Motion.div 
          class="status-badge"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span class={`status-dot ${props.status}`} />
          <span>{props.status}</span>
        </Motion.div>
      </div>

      <div class="titlebar-center">
        <span>TAURI V2</span>
      </div>

      <div class="titlebar-controls">
        <TitleButton onClick={props.toggleTheme} title="Toggle Theme">
          {props.isDark ? <Sun size={14} /> : <Moon size={14} />}
        </TitleButton>
        <TitleButton onClick={minimize} title="Minimize">
          <Minus size={14} />
        </TitleButton>
        <TitleButton onClick={toggleMaximize} title="Maximize">
          <Square size={12} />
        </TitleButton>
        <TitleButton onClick={close} title="Close" isClose>
          <X size={14} />
        </TitleButton>
      </div>
    </header>
  );
}

function TitleButton(props: { onClick: () => void, title: string, children: any, isClose?: boolean }) {
  const [isHovered, setIsHovered] = createSignal(false);

  return (
    <Motion.button 
      class={`win-btn ${props.isClose ? 'close' : ''}`}
      onClick={props.onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={props.title}
      animate={{ scale: isHovered() ? 1.15 : 1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ easing: "spring", stiffness: 500, damping: 25 }}
    >
      {props.children}
    </Motion.button>
  );
}
