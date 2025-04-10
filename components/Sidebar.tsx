import { Home, BookOpen, BarChart2, FlashlightIcon as FlashCard, ShoppingCart, LogOut } from "lucide-react"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import UpgradeCard from "@/components/upgrade-card"

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: BookOpen, label: "My Quizzes", href: "/my-quizzes" },
  { icon: BarChart2, label: "Practice", href: "/practice" },
  { icon: FlashCard, label: "Flashcards", href: "/flashcards" },
  { icon: ShoppingCart, label: "Quiz Marketplace", href: "/marketplace" },
]

export default function SidebarComponent() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h2 className="text-2xl font-bold">AWS Cert Prep</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild>
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 space-y-4">
        {/* Upgrade Card */}
        <UpgradeCard />
        
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

