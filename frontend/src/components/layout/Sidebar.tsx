import { Link, useLocation } from 'react-router-dom'
import {
  BookOpen,
  Megaphone,
  MessageSquare,
  LogOut,
  Sun,
  Moon,
  Menu,
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'
import { toggleTheme } from '@/store/slices/uiSlice'
import { UserAvatar } from '@/components/shared/UserAvatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { disconnectSocket } from '@/lib/socket'
import { api } from '@/lib/api'

const navItems = [
  { label: 'Lectures', href: '/lectures', icon: BookOpen },
  { label: 'Announcements', href: '/announcements', icon: Megaphone },
  { label: 'Discussion', href: '/discussion', icon: MessageSquare },
]

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const user = useAppSelector((s) => s.auth.user)
  const theme = useAppSelector((s) => s.ui.theme)

  const handleLogout = () => {
    disconnectSocket()
    dispatch(api.util.resetApiState())
    dispatch(logout())
  }

  return (
    <nav className="flex h-full flex-col bg-sidebar border-r border-sidebar-border">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <Link
          to="/lectures"
          className="flex items-center gap-2 font-bold text-lg text-sidebar-foreground"
          onClick={onClose}
        >
          <BookOpen className="size-5 text-sidebar-primary" />
          <span>Pro Learning Hub</span>
        </Link>
      </div>

      <Separator />

      {/* Nav Items */}
      <div className="flex flex-col gap-1 px-2 py-4 flex-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive =
            location.pathname === href ||
            (href !== '/' && location.pathname.startsWith(href))
          return (
            <Link
              key={href}
              to={href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </div>

      <Separator />

      {/* Bottom: theme toggle + user profile */}
      <div className="p-4 flex flex-col gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => dispatch(toggleTheme())}
          className="justify-start gap-2 text-sidebar-foreground"
        >
          {theme === 'light' ? (
            <>
              <Moon className="size-4" /> Dark mode
            </>
          ) : (
            <>
              <Sun className="size-4" /> Light mode
            </>
          )}
        </Button>

        {user && (
          <div className="flex items-center gap-3 rounded-md p-2 bg-sidebar-accent">
            <UserAvatar src={user.pictureThumbnail} name={user.name} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-sidebar-foreground">
                {user.name}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {user.role}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="shrink-0 text-sidebar-foreground hover:text-destructive"
              title="Logout"
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
