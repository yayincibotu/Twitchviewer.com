import { useQuery } from "@tanstack/react-query";
import { Loader2, Shield, Lock, CreditCard, Eye } from "lucide-react";

type SecurityBadge = {
  id: number;
  name: string;
  icon: string; 
  description: string | null;
  isActive: boolean;
  order: number;
};

// İkon eşleştirmesi
const iconMap: Record<string, React.ReactNode> = {
  "shield": <Shield className="h-8 w-8 text-primary" />,
  "lock": <Lock className="h-8 w-8 text-primary" />,
  "credit-card": <CreditCard className="h-8 w-8 text-primary" />,
  "eye": <Eye className="h-8 w-8 text-primary" />
};

export default function SecurityBadgesSection() {
  // API'den güvenlik rozetlerini çek
  const { data: badges, isLoading, error } = useQuery<SecurityBadge[]>({
    queryKey: ['/api/security-badges'],
  });

  if (isLoading) {
    return (
      <div className="py-8 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (error || !badges || badges.length === 0) {
    return null;
  }

  // Sıralanmış rozetler
  const sortedBadges = [...badges].sort((a, b) => a.order - b.order);

  return (
    <section className="py-10 bg-neutral-50 border-t border-b border-neutral-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sortedBadges.map((badge) => (
            <div 
              key={badge.id}
              className="flex items-center gap-3 p-4"
            >
              <div className="flex-shrink-0 bg-white p-2 rounded-full shadow-sm">
                {iconMap[badge.icon] || (
                  <div className="h-8 w-8 bg-primary rounded-full" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">{badge.name}</h3>
                {badge.description && (
                  <p className="text-xs text-neutral-600">{badge.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}