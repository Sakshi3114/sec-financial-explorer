import { useApp } from "../../context/AppContext";
import { TABS } from "../../constants";

export default function TabNav() {
  const { activeTab, setActiveTab } = useApp();

  return (
    <div className="flex items-center gap-0 border-b border-white/[0.07] overflow-x-auto">
      {TABS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => setActiveTab(key)}
          className={`tab-btn ${
            activeTab === key ? "tab-btn-active" : "tab-btn-idle"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
