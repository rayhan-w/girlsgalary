'use client';

import React, { useState, useEffect } from 'react';
import { TopBar } from './TopBar';
import { Header } from './Header';
import { CategoryBar } from './CategoryBar';
import { BottomNav } from './BottomNav';
import { CartDrawer } from './CartDrawer';
import { FloatingWhatsApp } from './FloatingWhatsApp';
import { Footer } from './Footer';

interface StorefrontLayoutProps {
  children: React.ReactNode;
}

export const StorefrontLayout: React.FC<StorefrontLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setSettings(data);
      })
      .catch((err) => console.error('Error fetching settings in layout', err));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-zinc-900 font-sans antialiased selection:bg-[#D4AF37] selection:text-black">
      {/* Top Notification Bar */}
      <TopBar
        hotline={settings?.hotline}
        whatsappNumber={settings?.whatsappNumber}
        topBarOffer={settings?.topBarOffer}
      />

      {/* Main Sticky Header */}
      <Header onToggleMobileMenu={() => setIsMobileMenuOpen(true)} />

      {/* Categories Bar & Mobile Drawer */}
      <CategoryBar
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
      />

      {/* Page Content */}
      <main className="flex-1 pb-16 lg:pb-0">
        {children}
      </main>

      {/* Slide-in Cart Drawer */}
      <CartDrawer freeDeliveryThreshold={settings?.freeDeliveryThreshold ?? 2000} />

      {/* Floating WhatsApp Button */}
      <FloatingWhatsApp whatsappNumber={settings?.whatsappNumber} />

      {/* Mobile Fixed Bottom Navigation Bar */}
      <BottomNav onOpenCategories={() => setIsMobileMenuOpen(true)} />

      {/* Footer */}
      <Footer
        hotline={settings?.hotline}
        whatsappNumber={settings?.whatsappNumber}
        address={settings?.address}
        email={settings?.email}
        facebookUrl={settings?.facebookUrl}
        footerAbout={settings?.footerAbout}
        copyright={settings?.footerCopyright}
      />
    </div>
  );
};
