import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

type FaqCategory = {
  id: number;
  name: string;
  slug: string;
  order: number;
};

type FaqItem = {
  id: number;
  categoryId: number;
  question: string;
  answer: string;
  isSchemaFaq: boolean;
  order: number;
};

export default function EnhancedFaqSection() {
  // Kategorileri ve SSS öğelerini çek
  const { data: categories, isLoading: categoriesLoading } = useQuery<FaqCategory[]>({
    queryKey: ['/api/faq/categories'],
  });
  
  const { data: faqItems, isLoading: itemsLoading } = useQuery<FaqItem[]>({
    queryKey: ['/api/faq/items'],
  });
  
  // Aktif kategori için durum
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Yükleme durumu
  if (categoriesLoading || itemsLoading) {
    return (
      <div className="py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Veri yoksa veya hata varsa
  if (!categories || categories.length === 0 || !faqItems || faqItems.length === 0) {
    return null;
  }
  
  // Kategorileri sırala
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);
  
  // İlk kategoriye karar ver
  const defaultCategory = activeCategory || sortedCategories[0]?.slug;
  
  // Kategoriye göre SSS öğelerini filtrele
  const getItemsByCategory = (categoryId: number) => {
    return faqItems
      .filter(item => item.categoryId === categoryId)
      .sort((a, b) => a.order - b.order);
  };
  
  // JSON-LD schema verisini oluştur (SEO için)
  const getFaqSchema = () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems
        .filter(item => item.isSchemaFaq)
        .map(item => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer
          }
        }))
    };
    
    return JSON.stringify(schema);
  };

  return (
    <section className="py-16 bg-white" id="faq">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">Sıkça Sorulan Sorular</h2>
          <p className="text-neutral-600 max-w-3xl mx-auto">
            Hizmetlerimiz hakkında en çok sorulan soruların cevaplarını burada bulabilirsiniz.
            Başka sorularınız varsa, lütfen bizimle iletişime geçin.
          </p>
        </div>
        
        {/* JSON-LD Schema (SEO) */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: getFaqSchema() }}
        />
        
        <div className="max-w-4xl mx-auto">
          <Tabs 
            defaultValue={defaultCategory} 
            onValueChange={value => setActiveCategory(value)}
            className="w-full"
          >
            <TabsList className="w-full mb-8 grid grid-cols-1 md:grid-cols-3">
              {sortedCategories.map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.slug}
                  className="text-base md:text-lg py-3"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {sortedCategories.map(category => (
              <TabsContent key={category.id} value={category.slug} className="mt-0">
                <Accordion type="single" collapsible className="border rounded-lg">
                  {getItemsByCategory(category.id).map(item => (
                    <AccordionItem key={item.id} value={`item-${item.id}`}>
                      <AccordionTrigger className="py-4 px-6 text-left font-semibold">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="py-4 px-6">
                        <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
}