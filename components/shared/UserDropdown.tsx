"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";

interface UserDropdownProps {
  userName: string;
  avatar?: string;
  onLogout: () => void;
  onProfileClick?: () => void;
}

export function UserDropdown({
  userName,
  avatar,
  onLogout,
  onProfileClick,
}: UserDropdownProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="h-10 w-10 cursor-pointer ring-2 ring-transparent hover:ring-blue-400 transition-all">
          <AvatarImage src={avatar} alt={userName} className="object-cover" />
          <AvatarFallback className="text-sm">
            {getInitials(userName)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center gap-2 p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatar} alt={userName} className="object-cover" />
            <AvatarFallback className="text-xs">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">{userName}</span>
            <span className="text-xs text-gray-400">View profile</span>
          </div>
        </div>
        <DropdownMenuSeparator />
        {onProfileClick && (
          <>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={onProfileClick}
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem
          className="cursor-pointer text-red-400 focus:text-red-400"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
