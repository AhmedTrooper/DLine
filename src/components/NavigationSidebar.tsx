import { MessageSquare, Folder, Terminal, Bot, Settings } from "lucide-solid";

export type TabType = 'chat' | 'files' | 'terminal' | 'island' | 'settings';

interface NavigationSidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export function NavigationSidebar(props: NavigationSidebarProps) {
  return (
    <aside class="nav-sidebar">
      <div class="nav-group">
        <button
          class={`nav-item ${props.activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => props.setActiveTab('chat')}
          title="Chat"
        >
          <MessageSquare size={18} />
        </button>

        <button
          class={`nav-item ${props.activeTab === 'files' ? 'active' : ''}`}
          onClick={() => props.setActiveTab('files')}
          title="Files"
        >
          <Folder size={18} />
        </button>

        <button
          class={`nav-item ${props.activeTab === 'terminal' ? 'active' : ''}`}
          onClick={() => props.setActiveTab('terminal')}
          title="Terminal"
        >
          <Terminal size={18} />
        </button>

        <button
          class={`nav-item ${props.activeTab === 'island' ? 'active' : ''}`}
          onClick={() => props.setActiveTab('island')}
          title="Agent"
        >
          <Bot size={18} />
        </button>
      </div>

      <div class="nav-group">
        <button
          class={`nav-item ${props.activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => props.setActiveTab('settings')}
          title="Settings"
        >
          <Settings size={18} />
        </button>
      </div>
    </aside>
  );
}
