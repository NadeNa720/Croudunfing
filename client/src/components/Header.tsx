import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useLocation } from "wouter";

interface HeaderProps {
  onScrollToBooking: () => void;
}

export default function Header({ onScrollToBooking }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useLocation();

  // Универсальный переход: если уже на "/", скроллим плавно. Иначе — переходим на /#hash
  const go = (hash: string) => {
    const id = hash.trim();
    if (location === "/") {
      if (!id) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      setLocation(id ? `/#${id}` : "/");
    }
    setIsOpen(false);
  };

  const navigationItems: Array<{ label: string; action: () => void }> = [
    { label: "Strona główna", action: () => go("") },
    { label: "Nasze usługi", action: () => go("services") },
    { label: "Jak pracujemy", action: () => go("video") },
    { label: "FAQ", action: () => go("faq") },
    { label: "Prezent", action: () => go("gift") },
    { label: "Kontakt", action: () => go("kontakt") },
    // ↓ ВАЖНО: id именно "realizacje" (нижний регистр), как в секции на главной
    { label: "Realizacje", action: () => go("realizacje") },
  ];

  return (
    <header
      className="sticky top-0 z-[9999] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
      data-testid="header-navigation"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center">
            <h1 className="text-xl md:text-2xl font-bold text-primary" data-testid="brand-title">
              SprzątanieMieszkań.com
            </h1>
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navigationItems.map((item, index) => (
                <NavigationMenuItem key={index}>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                    data-testid={`nav-link-${index}`}
                  >
                    <button
                      type="button"
                      onClick={item.action}
                      style={{ cursor: "pointer" }}
                    >
                      {item.label}
                    </button>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* CTA */}
          <div className="hidden md:flex">
            <Button
              onClick={onScrollToBooking}
              size="default"
              className="bg-primary text-primary-foreground font-semibold"
              data-testid="button-quick-booking"
            >
              Szybka rezerwacja
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle className="text-left">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-6">
                  {navigationItems.map((item, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="justify-start"
                      onClick={item.action}
                      data-testid={`mobile-nav-link-${index}`}
                    >
                      {item.label}
                    </Button>
                  ))}

                  <div className="pt-4 border-t">
                    <Button
                      onClick={() => {
                        onScrollToBooking();
                        setIsOpen(false);
                      }}
                      className="w-full"
                      data-testid="button-mobile-booking"
                    >
                      Szybka rezerwacja
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
