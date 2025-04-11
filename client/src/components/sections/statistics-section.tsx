import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { 
  Users, 
  Video, 
  TrendingUp, 
  Heart, 
  Loader2 
} from "lucide-react";

// İkon eşleştirmesi
const iconMap: Record<string, React.ReactNode> = {
  "users": <Users className="h-8 w-8 text-primary" />,
  "video": <Video className="h-8 w-8 text-primary" />,
  "trending-up": <TrendingUp className="h-8 w-8 text-primary" />,
  "heart": <Heart className="h-8 w-8 text-primary" />
};

type StatisticItem = {
  id: number;
  name: string;
  value: number;
  icon: string;
  description: string;
  isActive: boolean;
  order: number;
};

export default function StatisticsSection() {
  // API'den istatistikleri çek
  const { data: statistics, isLoading, error } = useQuery<StatisticItem[]>({
    queryKey: ['/api/statistics'],
  });

  // Animasyonlu sayaçlar için durum
  const [animatedValues, setAnimatedValues] = useState<Record<number, number>>({});

  // İstatistikleri yükledikten sonra animasyonu başlat
  useEffect(() => {
    if (!statistics) return;

    // Başlangıç değerlerini 0 olarak ayarla
    const initialValues: Record<number, number> = {};
    statistics.forEach(stat => {
      initialValues[stat.id] = 0;
    });
    setAnimatedValues(initialValues);

    // Animasyon için zamanlayıcı oluştur
    const interval = setInterval(() => {
      setAnimatedValues(prev => {
        const newValues = { ...prev };
        let allComplete = true;

        statistics.forEach(stat => {
          // Eğer sayaç hedef değerine ulaşmadıysa artır
          if (newValues[stat.id] < stat.value) {
            // Büyük sayılar için daha hızlı artış
            const increment = Math.max(1, Math.floor(stat.value / 50));
            newValues[stat.id] = Math.min(stat.value, newValues[stat.id] + increment);
            allComplete = false;
          }
        });

        // Tüm sayaçlar tamamlandıysa interval'i temizle
        if (allComplete) {
          clearInterval(interval);
        }

        return newValues;
      });
    }, 30); // 30ms'de bir güncelle

    // Temizleme fonksiyonu
    return () => clearInterval(interval);
  }, [statistics]);

  if (isLoading) {
    return (
      <div className="py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !statistics || statistics.length === 0) {
    return null; // Hata durumunda veya veri yoksa bileşeni gösterme
  }

  // İstatistikleri sırala
  const sortedStatistics = [...statistics].sort((a, b) => a.order - b.order);

  return (
    <section className="py-16 bg-white" id="statistics">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">Kanıtlanmış Sonuçlar</h2>
          <p className="text-neutral-600 max-w-3xl mx-auto">
            Binlerce yayıncı kanallarını büyütmek için Twitch Viewer'a güveniyor. 
            İşte bugüne kadar elde ettiğimiz sonuçlar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sortedStatistics.map((stat) => (
            <div 
              key={stat.id} 
              className="bg-white rounded-lg p-6 shadow-lg border border-neutral-200 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                {iconMap[stat.icon] || <div className="h-8 w-8 bg-primary rounded-full" />}
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                {stat.name === "Client Satisfaction" 
                  ? `${animatedValues[stat.id] || 0}%` 
                  : animatedValues[stat.id]?.toLocaleString() || '0'}
              </h3>
              <p className="text-neutral-600">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}