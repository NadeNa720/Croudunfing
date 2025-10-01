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
import { Link, useLocation } from "wouter";

interface HeaderProps {
  onScrollToBooking: () => void;
}

export default function Header({ onScrollToBooking }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const isActive = (href: string) => location === href;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsOpen(false);
  };

  const navigationItems = [
    { label: "Strona główna", onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
    { label: "Nasze usługi", onClick: () => scrollToSection("services") },
    { label: "Jak pracujemy", onClick: () => scrollToSection("video") },
    { label: "FAQ", onClick: () => scrollToSection("faq") },
    { label: "Prezent", onClick: () => scrollToSection("gift") },
    { label: "Kontakt", onClick: () => scrollToSection("kontakt") },
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
                    className={navigationMenuTriggerStyle()}
                    onClick={item.onClick}
                    style={{ cursor: "pointer" }}
                    data-testid={`nav-link-${index}`}
                  >
                    {item.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}

              {/* Ссылка на страницу примеров */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/realizacje"
                    className={
                      navigationMenuTriggerStyle() +
                      (isActive("/realizacje") ? " text-blue-600" : "")
                    }
                    data-testid="nav-link-realizacje"
                  >
                    Realizacje
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
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
                      onClick={item.onClick}
                      data-testid={`mobile-nav-link-${index}`}
                    >
                      {item.label}
                    </Button>
                  ))}

                  {/* Мобильная ссылка Realizacje */}
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => {
                      setLocation("/realizacje");
                      setIsOpen(false);
                    }}
                    data-testid="mobile-nav-link-realizacje"
                  >
                    Realizacje
                  </Button>

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
