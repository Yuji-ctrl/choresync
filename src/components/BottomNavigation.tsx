import React from 'react';
import { BarChart3, Users, List, BookOpen, Home } from 'lucide-react';
import { Button } from './ui/button';

export type NavigationTab = 'home' | 'stats' | 'game' | 'album' | 'messages' | 'chores' | 'tips' | 'settings';

interface BottomNavigationProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: 'chores' as const, icon: List, label: '家事' },
    { id: 'stats' as const, icon: BarChart3, label: '統計' },
    { id: 'home' as const, icon: Home, label: 'ホーム' },
    { id: 'messages' as const, icon: Users, label: 'つながる' },
    { id: 'tips' as const, icon: BookOpen, label: '知恵袋' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-orange-100 border-t border-orange-200 shadow-lg">
      <div className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              className={`
                flex-1 flex-col h-16 gap-1 rounded-none text-xs px-1 relative
                ${isActive 
                  ? 'text-orange-700 bg-orange-200' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-orange-50'
                }
              `}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.id === 'home' ? (
                <div className={`
                  w-14 h-14 rounded-full flex items-center justify-center -mt-4 shadow-lg
                  ${isActive 
                    ? 'bg-orange-600 text-white shadow-orange-300' 
                    : 'bg-orange-500 text-white shadow-orange-200'
                  }
                  transform transition-all duration-200 hover:scale-105
                `}>
                  <Icon className="w-6 h-6" />
                </div>
              ) : (
                <Icon className="w-4 h-4" />
              )}
              <span className={`text-xs leading-tight ${tab.id === 'home' ? '-mt-1' : ''}`}>{tab.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}