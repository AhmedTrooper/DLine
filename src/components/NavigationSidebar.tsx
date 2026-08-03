import { MessageSquare, Folder, Terminal, Bot, Settings } from "lucide-solid";
import { Motion } from "@motionone/solid";
import { createSignal } from "solid-js";

export type TabType = 'chat' | 'files' | 'terminal' | 'island' | 'settings';

interface NavigationSidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export function NavigationSidebar(props: NavigationSidebarProps) {
  return (
    <aside class="nav-sidebar">
      <div class="nav-group">
        <SidebarButton id="chat" icon={MessageSquare} active={props.activeTab === 'chat'} onClick={() => props.setActiveTab('chat')} />
        <SidebarButton id="files" icon={Folder} active={props.activeTab === 'files'} onClick={() => props.setActiveTab('files')} />
        <SidebarButton id="terminal" icon={Terminal} active={props.activeTab === 'terminal'} onClick={() => props.setActiveTab('terminal')} />
        <SidebarButton id="island" icon={Bot} active={props.activeTab === 'island'} onClick={() => props.setActiveTab('island')} />
      </div>

      <div class="nav-group">
        <SidebarButton id="settings" icon={Settings} active={props.activeTab === 'settings'} onClick={() => props.setActiveTab('settings')} />
      </div>
    </aside>
  );
}

function SidebarButton(props: { id: string, icon: any, active: boolean, onClick: () => void }) {
  const [isHovered, setIsHovered] = createSignal(false);
  
  return (
    <Motion.button
      class={`nav-item ${props.active ? 'active' : ''}`}
      onClick={props.onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={props.id}
      animate={{
        scale: props.active ? 1.05 : isHovered() ? 1.1 : 1,
      }}
      transition={{ easing: "spring", stiffness: 400, damping: 25 }}
    >
      <props.icon size={20} />
      
      {/* Active Tab Indicator Bubble */}
      {props.active && (
        <Motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ easing: "spring", stiffness: 400, damping: 25 }}
          style={{
            position: "absolute",
            inset: "0px",
            background: "var(--accent)",
            "border-radius": "var(--radius)",
            "z-index": -1,
          }}
        />
      )}
    </Motion.button>
  );
}
