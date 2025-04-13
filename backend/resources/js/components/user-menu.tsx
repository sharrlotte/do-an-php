import { Link } from '@inertiajs/react';
import { LogOut, User } from 'lucide-react';

import JoinRoomButton from '@/components/join-room-button';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function UserMenu() {
    return (
        <div>
            <JoinRoomButton />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <User className="h-5 w-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link href="/logout" method="post" as="button" className="w-full cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            Đăng xuất
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
