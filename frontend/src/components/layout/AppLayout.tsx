import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useAppSelector } from '@/store/hooks'

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useAppSelector((s) => s.ui.theme)

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="flex h-screen bg-background">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-64 shrink-0 flex-col h-full">
          <Sidebar />
        </aside>

        {/* Mobile sidebar via Sheet */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-3 left-3 z-40 md:hidden"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <Sidebar onClose={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="md:ml-0 ml-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
