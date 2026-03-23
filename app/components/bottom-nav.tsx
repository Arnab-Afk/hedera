import Link from "next/link";
import { Home, Search, Bell, User } from "lucide-react";

export function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 w-full items-center justify-around border-t bg-background px-4 pb-2 pt-2 sm:hidden">
      <Link href="/" className="flex flex-col items-center justify-center space-y-1 text-muted-foreground hover:text-foreground">
        <Home className="h-5 w-5" />
        <span className="text-[10px] font-medium">Home</span>
      </Link>
      <Link href="/" className="flex flex-col items-center justify-center space-y-1 text-muted-foreground hover:text-foreground">
        <Search className="h-5 w-5" />
        <span className="text-[10px] font-medium">Search</span>
      </Link>
      <Link href="/" className="flex flex-col items-center justify-center space-y-1 text-muted-foreground hover:text-foreground">
        <Bell className="h-5 w-5" />
        <span className="text-[10px] font-medium">Alerts</span>
      </Link>
      <Link href="/" className="flex flex-col items-center justify-center space-y-1 text-muted-foreground hover:text-foreground">
        <User className="h-5 w-5" />
        <span className="text-[10px] font-medium">Profile</span>
      </Link>
    </div>
  );
}
