import { Motion } from "@motionone/solid";
import { createSignal } from "solid-js";

export function AgentIslandWidget() {
  const [isHovered, setIsHovered] = createSignal(false);

  return (
    <Motion.div 
      class="agent-island-widget"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{ scale: isHovered() ? 1.05 : 1 }}
      transition={{ easing: "spring", stiffness: 400, damping: 25 }}
    >
      <Motion.span 
        class="island-avatar"
        animate={{ 
          scale: isHovered() ? [1, 1.2, 1] : 1,
          rotate: isHovered() ? 180 : 0
        }}
        transition={{ duration: 0.5, easing: "ease-in-out" }}
      />
    </Motion.div>
  );
}
