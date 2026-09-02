import * as React from 'react';
import { LogOut, Phone } from 'lucide-react';
import { Avatar } from '../atoms/avatar';
import { Button } from '../atoms/button';
import { User } from '@/types/auth';

export interface UserNavProps {
  user: User;
  onLogout: () => void;
}

export const UserNav: React.FC<UserNavProps> = ({ user, onLogout }) => {
  return (
    <div className="flex items-center gap-2 pl-2 border-l border-border">
      <div className="flex items-center gap-2.5 bg-muted/60 py-1 px-3 rounded-xl">
        <Avatar name={user.name} size="sm" />
        <div className="text-left hidden md:block">
          <p className="text-xs font-semibold text-foreground leading-tight">{user.name}</p>
          {user.phone && (
            <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
              <Phone className="w-2.5 h-2.5" /> {user.phone}
            </p>
          )}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onLogout}
        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
        title="Đăng xuất"
      >
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  );
};

